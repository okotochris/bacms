const express = require("express");
const mongoose = require("mongoose");

const Student = require('../database/student')
const Subject = require("../database/subject");
const Result = require("../database/result");
const {HttpError, validateContext, parseScores, buildEntry, summarize} = require("../utilities/grading");

const router = express.Router();

// TODO: protect these routes so only logged-in teachers/admins can use them,
// e.g. router.use(requireAuth);

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ------------------------------- Shared helpers ------------------------------ */

async function assertSubjectExists(subjectName) {
  if (typeof subjectName !== "string" || !subjectName.trim()) {
    throw new HttpError(400, "Choose a subject.");
  }
  const exists = await Subject.exists({ subjectName });
  if (!exists) throw new HttpError(400, `Subject "${subjectName}" does not exist.`);
}

/**
 * Saves one subject for one student. Replaces the subject if it was already
 * entered, otherwise adds it (creating the student's result document if needed).
 */
async function saveSubjectScore({ session, term, className, student, subjectName, scores }) {
  const key = { studentId: student.studentId, className, session, term };
  const entry = buildEntry(subjectName, scores);

  const existing = await Result.findOne(key).select("status").lean();
  if (existing?.status === "Published") {
    throw new HttpError(409, `${student.fullname}'s results are already published.`);
  }

  // 1) Subject already recorded: replace it
  const replaced = await Result.updateOne(
    { ...key, status: "Draft", "subject.subjectName": subjectName },
    { $set: { "subject.$": entry } }
  );
  if (replaced.matchedCount) return "updated";

  // 2) Add the subject, creating the document if this is the student's first
  try {
    await Result.updateOne(
      { ...key, status: "Draft", "subject.subjectName": { $ne: subjectName } },
      {
        $push: { subject: entry },
        $setOnInsert: { studentName: student.fullname },
      },
      { upsert: true }
    );
  } catch (err) {
    if (err.code === 11000) {
      throw new HttpError(409, "This result was just changed. Refresh and try again.");
    }
    throw err;
  }

  return "created";
}

/* ------------------------------------ Read ----------------------------------- */

// GET /api/result_cal_data
// Optional filters: ?session=2025/2026&term=First Term&className=JSS 1
router.get(
  "/result_cal_data",
  asyncHandler(async (req, res) => {
    const filter = {};
    for (const field of ["session", "term", "className"]) {
      if (typeof req.query[field] === "string" && req.query[field]) {
        filter[field] = req.query[field];
      }
    }

    const [subject, studentResult] = await Promise.all([
      Subject.find().sort({ subjectName: 1 }).lean(),
      Result.find(filter).lean(),
    ]);

    res.json({ subject, studentResult });
  })
);

// GET /api/student/:className   (skip this one if you already have it)
// Adjust `className` to whatever your Student schema calls the class field.
router.get(
  "/student/:className",
  asyncHandler(async (req, res) => {
    const student = await Student.find({ className: req.params.className })
      .select("fullname studentId")
      .sort({ fullname: 1 })
      .lean();

    res.json({ student });
  })
);

/* --------------------------- Save one student's subject ----------------------- */

// POST /api/result/subject
// { session, term, className, studentId, subjectName, firstTest, secondText, ca, exam }
router.post(
  "/result/subject",
  asyncHandler(async (req, res) => {
    const { session, term, className, studentId, subjectName } = req.body;

    validateContext({ session, term, className });
    if (typeof studentId !== "string" || !studentId) {
      throw new HttpError(400, "Choose a student.");
    }
    const scores = parseScores(req.body);
    await assertSubjectExists(subjectName);

    // Use the name stored in the database, not the one the browser sent
    const student = await Student.findOne({ studentId, className })
      .select("fullname studentId")
      .lean();
    if (!student) throw new HttpError(404, "Student not found in this class.");

    const outcome = await saveSubjectScore({
      session,
      term,
      className,
      student,
      subjectName,
      scores,
    });

    res
      .status(outcome === "created" ? 201 : 200)
      .json({ message: "Result saved.", outcome });
  })
);

/* ------------------------ Save one subject for many students ------------------ */

// PATCH /api/result/bulk
// { session, term, className, subjectName, entries: [{ studentId, firstTest, secondText, ca, exam }] }
router.patch("/result/bulk", asyncHandler(async (req, res) => {
    const { session, term, className, subjectName, entries } = req.body;

    validateContext({ session, term, className });
    await assertSubjectExists(subjectName);

    if (!Array.isArray(entries) || entries.length === 0 || entries.length > 300) {
      throw new HttpError(400, "Send between 1 and 300 entries.");
    }

    // Validate every entry before writing anything
    const seen = new Set();
    const parsed = entries.map((e) => {
      if (!e || typeof e.studentId !== "string" || !e.studentId) {
        throw new HttpError(400, "Every entry needs a studentId.");
      }
      if (seen.has(e.studentId)) {
        throw new HttpError(400, `Student ${e.studentId} appears more than once.`);
      }
      seen.add(e.studentId);
      return { studentId: e.studentId, scores: parseScores(e, e.studentId) };
    });

    const ids = parsed.map((p) => p.studentId);

    // Students must exist and belong to this class
    const students = await Student.find({ studentId: { $in: ids }, className })
      .select("fullname studentId")
      .lean();
    const studentMap = new Map(students.map((s) => [s.studentId, s]));
    const unknown = ids.filter((id) => !studentMap.has(id));
    if (unknown.length) {
      throw new HttpError(404, `Not found in ${className}: ${unknown.join(", ")}.`);
    }

    // Published results are locked
    const docs = await Result.find({
      studentId: { $in: ids },
      className,
      session,
      term,
    })
      .select("studentId status subject.subjectName")
      .lean();
    const docMap = new Map(docs.map((d) => [d.studentId, d]));

    const locked = docs.filter((d) => d.status === "Published");
    if (locked.length) {
      const names = locked.map((d) => studentMap.get(d.studentId).fullname);
      throw new HttpError(409, `Already published, can't change: ${names.join(", ")}.`);
    }

    const ops = parsed.map(({ studentId, scores }) => {
      const student = studentMap.get(studentId);
      const entry = buildEntry(subjectName, scores);
      const doc = docMap.get(studentId);

      // Subject already recorded: replace it
      if (doc?.subject.some((s) => s.subjectName === subjectName)) {
        return {
          updateOne: {
            filter: { _id: doc._id, status: "Draft", "subject.subjectName": subjectName },
            update: { $set: { "subject.$": entry } },
          },
        };
      }

      // Document exists but this subject is new
      if (doc) {
        return {
          updateOne: {
            filter: {
              _id: doc._id,
              status: "Draft",
              "subject.subjectName": { $ne: subjectName },
            },
            update: { $push: { subject: entry } },
          },
        };
      }

      // First result for this student this term
      return {
        updateOne: {
          filter: { studentId, className, session, term },
          update: {
            $push: { subject: entry },
            $setOnInsert: { studentName: student.fullname, status: "Draft" },
          },
          upsert: true,
        },
      };
    });

    await Result.bulkWrite(ops, { ordered: false });

    res.json({ message: `${subjectName} saved for ${ops.length} student(s).`, saved: ops.length });
  })
);

/* ----------------------------------- Publish ---------------------------------- */

function toDays(value) {
  const n = Number(value ?? 0);
  if (!Number.isInteger(n) || n < 0 || n > 366) {
    throw new HttpError(400, "Days present and absent must be whole numbers from 0 to 366.");
  }
  return n;
}

// PATCH /api/result/publish
// { session, term, className, results: [{ id, present, absent, Treport }] }
// Totals, averages and positions are recalculated here from the saved scores,
// so any numbers the browser sends for those are ignored.
router.patch(
  "/result/publish",
  asyncHandler(async (req, res) => {
    const { session, term, className, results } = req.body;

    validateContext({ session, term, className });
    if (!Array.isArray(results) || results.length === 0) {
      throw new HttpError(400, "There are no results to publish.");
    }

    // Per-student extras entered on the review screen
    const extras = new Map();
    for (const r of results) {
      if (!r || !mongoose.isValidObjectId(r.id)) {
        throw new HttpError(400, "Invalid result id.");
      }
      extras.set(String(r.id), {
        present: toDays(r.present),
        absent: toDays(r.absent),
        Treport: String(r.Treport ?? "").trim().slice(0, 300),
      });
    }

    const docs = await Result.find({
      _id: { $in: [...extras.keys()] },
      className,
      session,
      term,
      status: "Draft",
    });

    if (docs.length === 0) {
      throw new HttpError(409, "No draft results found. They may already be published.");
    }

    const empty = docs.filter((d) => d.subject.length === 0);
    if (empty.length) {
      throw new HttpError(
        400,
        `No subjects entered for: ${empty.map((d) => d.studentName).join(", ")}.`
      );
    }

    const summaries = docs.map((doc) => {
      const s = summarize(doc.subject);
      return { doc, ...s, avg2: Number(s.average.toFixed(2)) };
    });

    // Rank against this batch plus anyone in the class already published
    const alreadyPublished = await Result.find({
      className,
      session,
      term,
      status: "Published",
    })
      .select("average")
      .lean();

    const allAverages = [
      ...summaries.map((s) => s.avg2),
      ...alreadyPublished.map((p) => Number(p.average)),
    ];

    const now = new Date();

    const ops = summaries.map((s) => {
      const extra = extras.get(String(s.doc._id));
      return {
        updateOne: {
          filter: { _id: s.doc._id, status: "Draft" }, // guards against double publishing
          update: {
            $set: {
              subject: s.subjects,
              No_subj: String(s.noSubj),
              score_obtain: String(s.obtained),
              score_obtainable: String(s.obtainable),
              average: s.avg2.toFixed(2),
              position: 1 + allAverages.filter((a) => a > s.avg2).length,
              present: extra.present,
              absent: extra.absent,
              Treport: extra.Treport,
              status: "Published",
              publishedAt: now,
            },
          },
        },
      };
    });

    const outcome = await Result.bulkWrite(ops, { ordered: false });

    res.json({
      message: `${outcome.modifiedCount} result(s) published.`,
      published: outcome.modifiedCount,
    });
  })
);

/* ------------------------------- Error handling ------------------------------- */

router.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err?.code === 11000) {
    return res
      .status(409)
      .json({ message: "This result was just changed. Refresh and try again." });
  }
  console.error(err);
  res.status(500).json({ message: "Server error. Please try again." });
});

module.exports = router;
