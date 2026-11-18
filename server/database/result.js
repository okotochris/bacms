const mongoose = require("mongoose");

const subjectScoreSchema = new mongoose.Schema(
  {
    subjectName: { type: String, required: true, trim: true },
    firstTest: { type: Number, required: true, min: 0 },
    secondText: { type: Number, required: true, min: 0 }, // keeps your existing spelling
    ca: { type: Number, required: true, min: 0 },
    exam: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true },
    grade: { type: String, required: true },
    remark: { type: String, required: true },
  },
  { _id: false }
);

// One document per student, per class, per session, per term.
const resultSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    className: { type: String, required: true },
    session: { type: String, required: true },
    term: { type: String, required: true },

    subject: { type: [subjectScoreSchema], default: [] },

    // Filled in when the results are published
    No_subj: { type: String, default: "0" },
    score_obtain: { type: String, default: "0" },
    score_obtainable: { type: String, default: "0" },
    average: { type: String, default: "0" },
    position: { type: Number },
    present: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    Treport: { type: String, default: "" },

    status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// A student can only ever have ONE result document per class/session/term.
// Create this index before going live. If you already have duplicate
// documents, merge or delete them first or the index will fail to build.
resultSchema.index(
  { studentId: 1, className: 1, session: 1, term: 1 },
  { unique: true }
);

module.exports =
  mongoose.models.Result || mongoose.model("Result", resultSchema);
