/**
 * Grading rules. Keep SCORE_FIELDS and the grade scale in sync with the
 * frontend (page.tsx) so what the teacher sees matches what is stored.
 */

const SCORE_FIELDS = [
  { key: "firstTest", label: "1st Test", max: 10 },
  { key: "secondText", label: "2nd Test", max: 10 },
  { key: "ca", label: "CA", max: 20 },
  { key: "exam", label: "Exam", max: 60 },
];

const CLASSES = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];
const TERMS = ["First Term", "Second Term", "Third Term"];
const SESSION_FORMAT = /^\d{4}\/\d{4}$/;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function getGrade(total) {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}

function getRemark(total) {
  if (total >= 70) return "Excellent";
  if (total >= 60) return "Very Good";
  if (total >= 50) return "Good";
  if (total >= 45) return "Fair";
  if (total >= 40) return "Pass";
  return "Fail";
}

/** Checks session, term and class. Throws a 400 if any is wrong. */
function validateContext({ session, term, className }) {
  if (typeof session !== "string" || !SESSION_FORMAT.test(session)) {
    throw new HttpError(400, "Session must look like 2025/2026.");
  }
  if (!TERMS.includes(term)) {
    throw new HttpError(400, "Choose a valid term.");
  }
  if (!CLASSES.includes(className)) {
    throw new HttpError(400, "Choose a valid class.");
  }
}

/** Reads the four scores from `source` and checks each is a whole number in range. */
function parseScores(source, who = "") {
  const prefix = who ? `${who}: ` : "";
  const scores = {};

  for (const f of SCORE_FIELDS) {
    const value = source?.[f.key];
    if (!Number.isInteger(value) || value < 0 || value > f.max) {
      throw new HttpError(
        400,
        `${prefix}${f.label} must be a whole number from 0 to ${f.max}.`
      );
    }
    scores[f.key] = value;
  }

  return scores;
}

/** Builds the subject entry stored in a student's result, with total, grade and remark. */
function buildEntry(subjectName, scores) {
  const total = SCORE_FIELDS.reduce((sum, f) => sum + scores[f.key], 0);
  return {
    subjectName,
    ...scores,
    total,
    grade: getGrade(total),
    remark: getRemark(total),
  };
}

/** Recomputes everything for a student from their saved scores. */
function summarize(subjects) {
  const list = subjects.map((s) =>
    buildEntry(s.subjectName, {
      firstTest: s.firstTest,
      secondText: s.secondText,
      ca: s.ca,
      exam: s.exam,
    })
  );

  const noSubj = list.length;
  const obtained = list.reduce((sum, s) => sum + s.total, 0);
  const obtainable = noSubj * 100;
  const average = noSubj ? obtained / noSubj : 0;

  return { subjects: list, noSubj, obtained, obtainable, average };
}

module.exports = {
  SCORE_FIELDS,
  CLASSES,
  TERMS,
  HttpError,
  getGrade,
  getRemark,
  validateContext,
  parseScores,
  buildEntry,
  summarize,
};
