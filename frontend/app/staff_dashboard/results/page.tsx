"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Upload,
  Save,
  Send,
  X,
} from "lucide-react";
import Header from "../component/header";
import Navigation from "../component/navigation";

/* ----------------------------- Types & constants ----------------------------- */

type Subject = {
  _id: string;
  subjectName: string;
};

type Student = {
  _id: string;
  fullname: string;
  studentId: string;
};

/** One subject's scores inside a student's result document. */
type SubjectScore = {
  subjectName: string;
  firstTest: number;
  secondText: number; // keeps your existing field name
  ca: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
};

/** One document per student, per class, per session, per term. */
type StudentResult = {
  _id: string;
  studentName: string;
  studentId: string;
  className: string;
  subject: SubjectScore[];
  session: string;
  term: string;
  average: string;
  Treport: string;
  score_obtainable: string;
  score_obtain: string;
  No_subj: string;
  present: number;
  absent: number;
  position?: number;
  status: "Draft" | "Published";
};

type ScoreKey = "firstTest" | "secondText" | "ca" | "exam";
type ScoreInputs = Record<ScoreKey, string>;

type Notice = { type: "success" | "error"; text: string } | null;

const API = process.env.NEXT_PUBLIC_URL ?? "";

const sessions = ["2025/2026", "2026/2027"];
const terms = ["First Term", "Second Term", "Third Term"];
const classes = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];

// Change the maximums to match your school's policy. They should add up to 100.
const SCORE_FIELDS: { key: ScoreKey; label: string; max: number }[] = [
  { key: "firstTest", label: "1st Test", max: 10 },
  { key: "secondText", label: "2nd Test", max: 10 },
  { key: "ca", label: "CA", max: 20 },
  { key: "exam", label: "Exam", max: 60 },
];

/* --------------------------------- Helpers ---------------------------------- */

// Example grading scale. Adjust to your school's approved policy.
function getGrade(total: number | null) {
  if (total === null) return "-";
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}

function getRemark(total: number | null) {
  if (total === null) return "Pending";
  if (total >= 70) return "Excellent";
  if (total >= 60) return "Very Good";
  if (total >= 50) return "Good";
  if (total >= 45) return "Fair";
  if (total >= 40) return "Pass";
  return "Fail";
}

function isValidScore(value: string, max: number) {
  if (value === "") return false;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= max;
}

function isOutOfRange(value: string, max: number) {
  return value !== "" && Number(value) > max;
}

const emptyInputs = (): ScoreInputs => ({
  firstTest: "",
  secondText: "",
  ca: "",
  exam: "",
});

function inputsFromEntry(e?: SubjectScore): ScoreInputs {
  if (!e) return emptyInputs();
  return {
    firstTest: String(e.firstTest),
    secondText: String(e.secondText),
    ca: String(e.ca),
    exam: String(e.exam),
  };
}

function inputsValid(i: ScoreInputs) {
  return SCORE_FIELDS.every((f) => isValidScore(i[f.key], f.max));
}

function inputsTotal(i: ScoreInputs) {
  if (!inputsValid(i)) return null;
  return SCORE_FIELDS.reduce((sum, f) => sum + Number(i[f.key]), 0);
}

function sameInputs(a: ScoreInputs, b: ScoreInputs) {
  return SCORE_FIELDS.every((f) => a[f.key] === b[f.key]);
}

function scoresFromInputs(i: ScoreInputs) {
  return {
    firstTest: Number(i.firstTest),
    secondText: Number(i.secondText),
    ca: Number(i.ca),
    exam: Number(i.exam),
  };
}

function entryTotal(e: SubjectScore) {
  return e.firstTest + e.secondText + e.ca + e.exam;
}

/** Totals, grades, remarks and the overall average for one student. */
function summarize(subjects: SubjectScore[]) {
  const list = subjects.map((s) => {
    const total = entryTotal(s);
    return { ...s, total, grade: getGrade(total), remark: getRemark(total) };
  });
  const noSubj = list.length;
  const obtained = list.reduce((sum, s) => sum + s.total, 0);
  const obtainable = noSubj * 100;
  const average = noSubj ? obtained / noSubj : 0;
  return { subjects: list, noSubj, obtained, obtainable, average };
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function findDoc(
  results: StudentResult[],
  studentId: string,
  className: string,
  session: string,
  term: string
) {
  return results.find(
    (r) =>
      r.studentId === studentId &&
      r.className === className &&
      r.session === session &&
      r.term === term
  );
}

async function sendJson(url: string, method: string, body: unknown) {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }
}

/** Loads the students of one class from your /api/student/:class route. */
function useClassStudents(className: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API}/api/student/${encodeURIComponent(className)}`
        );
        if (!res.ok) throw new Error("Failed");
        const { student } = await res.json();
        if (!cancelled) setStudents(student ?? []);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setStudents([]);
          setError("Could not load the students for this class.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [className]);

  return { students, loading, error };
}

/* ---------------------------------- Page ------------------------------------ */

type Row = {
  student: Student;
  doc?: StudentResult;
  entry?: SubjectScore;
  locked: boolean;
  status: "Pending" | "Draft" | "Published";
};

export default function ResultsPage() {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  // Unsaved table inputs, keyed by studentId (for the current filters)
  const [edits, setEdits] = useState<Record<string, ScoreInputs>>({});

  const [active, setActive] = useState("Results");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("JSS 1");
  const [subjectFilter, setSubjectFilter] = useState("Mathematics");
  const [sessionFilter, setSessionFilter] = useState("2025/2026");
  const [termFilter, setTermFilter] = useState("First Term");
  const [statusFilter, setStatusFilter] = useState("All");

  const {
    students,
    loading: studentsLoading,
    error: studentsError,
  } = useClassStudents(classFilter);

  /* ----------------------------- Load on page open ---------------------------- */

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setLoadError("");

    try {
      const res = await fetch(`${API}/api/result_subject`);
      if (!res.ok) throw new Error("Failed to load data");

      const { subject, studentResult } = await res.json();
      const loadedSubjects: Subject[] = subject ?? [];
      setSubjects(loadedSubjects);
      setResults(
        (studentResult ?? []).map((r: StudentResult) => ({
          ...r,
          subject: r.subject ?? [],
        }))
      );

      // Make sure the selected subject exists in the loaded list
      setSubjectFilter((current) =>
        loadedSubjects.length > 0 &&
        !loadedSubjects.some((s) => s.subjectName === current)
          ? loadedSubjects[0].subjectName
          : current
      );
    } catch (err) {
      console.error(err);
      setLoadError("Could not load results. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-hide notices
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  /* ------------------------------ Derived data -------------------------------- */

  // One row per student in the class, with their score for the chosen subject
  const rows: Row[] = useMemo(
    () =>
      students.map((student) => {
        const doc = findDoc(
          results,
          student.studentId,
          classFilter,
          sessionFilter,
          termFilter
        );
        const entry = doc?.subject.find((s) => s.subjectName === subjectFilter);
        const locked = doc?.status === "Published";
        const status: Row["status"] = locked
          ? "Published"
          : entry
          ? "Draft"
          : "Pending";
        return { student, doc, entry, locked, status };
      }),
    [students, results, classFilter, sessionFilter, termFilter, subjectFilter]
  );

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        (statusFilter === "All" || r.status === statusFilter) &&
        (r.student.fullname.toLowerCase().includes(q) ||
          r.student.studentId.toLowerCase().includes(q))
    );
  }, [rows, search, statusFilter]);

  function getInputs(r: Row): ScoreInputs {
    return edits[r.student.studentId] ?? inputsFromEntry(r.entry);
  }

  // Rows whose inputs differ from what is saved
  const changedRows = rows.filter((r) => {
    if (r.locked) return false;
    const e = edits[r.student.studentId];
    return !!e && !sameInputs(e, inputsFromEntry(r.entry));
  });

  const hasInvalidChanges = changedRows.some(
    (r) => !inputsValid(edits[r.student.studentId])
  );

  const completedRows = rows.filter((r) => r.entry);
  const completedCount = completedRows.length;
  const pendingCount = rows.length - completedCount;
  const publishedCount = rows.filter((r) => r.locked).length;

  const averageScore = completedCount
    ? (
        completedRows.reduce((sum, r) => sum + entryTotal(r.entry!), 0) /
        completedCount
      ).toFixed(1)
    : "0.0";

  // Drafts in this class/session/term that have at least one subject
  const classDocs = results.filter(
    (r) =>
      r.className === classFilter &&
      r.session === sessionFilter &&
      r.term === termFilter
  );
  const draftDocs = classDocs.filter(
    (r) => r.status === "Draft" && r.subject.length > 0
  );
  const studentsWithoutResults = students.filter((s) => {
    const d = classDocs.find((r) => r.studentId === s.studentId);
    return !d || d.subject.length === 0;
  });

  /* Warn before leaving with unsaved scores */
  useEffect(() => {
    if (changedRows.length === 0) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [changedRows.length]);

  /* -------------------------------- Actions ----------------------------------- */

  /** Changing a filter with unsaved scores asks first, then clears the inputs. */
  function guarded(setter: (value: string) => void) {
    return (value: string) => {
      if (
        changedRows.length > 0 &&
        !confirm("You have unsaved scores. Discard them?")
      ) {
        return;
      }
      setEdits({});
      setter(value);
    };
  }

  function handleScoreChange(r: Row, field: ScoreKey, rawValue: string) {
    const value = rawValue.replace(/\D/g, "").slice(0, 3); // digits only
    const id = r.student.studentId;

    setEdits((prev) => {
      const current = prev[id] ?? inputsFromEntry(r.entry);
      return { ...prev, [id]: { ...current, [field]: value } };
    });
  }

  async function saveScores() {
    if (changedRows.length === 0) return;

    if (hasInvalidChanges) {
      setNotice({
        type: "error",
        text: "Fix the highlighted scores first. Every score is required and must be within its maximum.",
      });
      return;
    }

    setSaving(true);

    try {
      await sendJson("/api/result/bulk", "PATCH", {
        session: sessionFilter,
        term: termFilter,
        className: classFilter,
        subjectName: subjectFilter,
        entries: changedRows.map((r) => ({
          studentId: r.student.studentId,
          studentName: r.student.fullname,
          ...scoresFromInputs(edits[r.student.studentId]),
        })),
      });

      setEdits({});
      await loadData(true);
      setNotice({
        type: "success",
        text: `${subjectFilter} scores saved for ${changedRows.length} student(s).`,
      });
    } catch (err) {
      console.error(err);
      setNotice({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Could not save scores. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  function openPublish() {
    if (changedRows.length > 0) {
      setNotice({
        type: "error",
        text: "You have unsaved scores. Save them before publishing.",
      });
      return;
    }
    setPublishOpen(true);
  }

  /* --------------------------------- Render ----------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:ml-64">
        <Header active={active} setSidebarOpen={setSidebarOpen} />

        <main className="p-4 md:p-8 space-y-6">
          {/* Notice */}
          {notice && (
            <div
              role="status"
              className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                notice.type === "success"
                  ? "bg-green-50 border-green-100 text-green-700"
                  : "bg-red-50 border-red-100 text-red-700"
              }`}
            >
              <span>{notice.text}</span>
              <button
                onClick={() => setNotice(null)}
                aria-label="Dismiss"
                className="shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Page heading */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Result Management
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter scores one subject for the whole class, or one student at
                a time.<br/> Publish when every subject is done.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-4 py-3 border border-indigo-200 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 text-sm"
              >
                <Upload size={18} />
                Upload Result
              </button>
              <button
                onClick={openPublish}
                disabled={draftDocs.length === 0 || changedRows.length > 0}
                className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm"
              >
                <Send size={18} />
                Publish Results
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard
              title="Students in Class"
              value={rows.length}
              icon={<Users size={22} />}
              color="bg-indigo-100 text-indigo-600"
            />
            <StatCard
              title={`${subjectFilter} Scores Entered`}
              value={completedCount}
              icon={<CheckCircle size={22} />}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              title="Scores Pending"
              value={pendingCount}
              icon={<Clock size={22} />}
              color="bg-orange-100 text-orange-600"
            />
            <StatCard
              title="Published Results"
              value={publishedCount}
              icon={<FileText size={22} />}
              color="bg-purple-100 text-purple-600"
            />
          </div>

          {/* Filters */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">
                Select Result Criteria
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Select the academic session, term, class and subject.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <FilterSelect
                label="Academic Session"
                value={sessionFilter}
                onChange={guarded(setSessionFilter)}
                options={sessions}
              />
              <FilterSelect
                label="Term"
                value={termFilter}
                onChange={guarded(setTermFilter)}
                options={terms}
              />
              <FilterSelect
                label="Class"
                value={classFilter}
                onChange={guarded(setClassFilter)}
                options={classes}
              />
              <FilterSelect
                label="Subject"
                value={subjectFilter}
                onChange={guarded(setSubjectFilter)}
                options={subjects.map((s) => s.subjectName)}
              />
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Student Results
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {classFilter} · {subjectFilter} · {termFilter}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search student..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none bg-white"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              {changedRows.length > 0 && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  You have {changedRows.length} unsaved change(s). Click{" "}
                  <strong>Save Scores</strong> to keep them.
                </p>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    {SCORE_FIELDS.map((f) => (
                      <th key={f.key} className="px-4 py-4">
                        {f.label} ({f.max})
                      </th>
                    ))}
                    <th className="px-4 py-4">Total (100)</th>
                    <th className="px-4 py-4">Grade</th>
                    <th className="px-4 py-4">Remark</th>
                    <th className="px-4 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {(loading || studentsLoading) && (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-12 text-gray-500"
                      >
                        Loading results...
                      </td>
                    </tr>
                  )}

                  {!loading && !studentsLoading && (loadError || studentsError) && (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-red-600">
                        {loadError || studentsError}
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !studentsLoading &&
                    !loadError &&
                    !studentsError &&
                    filteredRows.map((r) => {
                      const id = r.student.studentId;
                      const inputs = getInputs(r);
                      const isChanged = changedRows.some(
                        (c) => c.student.studentId === id
                      );

                      const total = r.locked
                        ? r.entry
                          ? entryTotal(r.entry)
                          : null
                        : inputsTotal(inputs);

                      return (
                        <tr
                          key={id}
                          className={`transition ${
                            isChanged ? "bg-amber-50/50" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-sm text-gray-800">
                              {r.student.fullname}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{id}</p>
                          </td>

                          {SCORE_FIELDS.map((f) => (
                            <td key={f.key} className="px-4 py-4">
                              {r.locked ? (
                                <span className="text-sm text-gray-600">
                                  {r.entry?.[f.key] ?? "-"}
                                </span>
                              ) : (
                                <ScoreInput
                                  value={inputs[f.key]}
                                  max={f.max}
                                  invalid={
                                    isOutOfRange(inputs[f.key], f.max) ||
                                    (isChanged &&
                                      !isValidScore(inputs[f.key], f.max))
                                  }
                                  onChange={(v) =>
                                    handleScoreChange(r, f.key, v)
                                  }
                                />
                              )}
                            </td>
                          ))}

                          <td className="px-4 py-4">
                            <span className="font-semibold text-gray-800">
                              {total ?? "-"}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span className="font-bold text-indigo-600">
                              {getGrade(total)}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {getRemark(total)}
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={r.status} />
                          </td>
                        </tr>
                      );
                    })}

                  {!loading &&
                    !studentsLoading &&
                    !loadError &&
                    !studentsError &&
                    filteredRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          className="text-center py-12 text-gray-500"
                        >
                          {rows.length === 0
                            ? "There are no students in this class yet."
                            : "No students match your search."}
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>

            <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-2 text-sm text-gray-500">
              <span>Showing {filteredRows.length} student(s)</span>
              <span>
                {subjectFilter} class average: {averageScore}%
              </span>
            </div>
          </div>
            <button
                onClick={saveScores}
                disabled={
                  changedRows.length === 0 || hasInvalidChanges || saving
                }
                className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm"
              >
                <Save size={18} />
                {saving
                  ? "Saving..."
                  : `Save Scores${
                      changedRows.length ? ` (${changedRows.length})` : ""
                    }`}
              </button>
        </main>
        
      </div>

      {addOpen && (
        <AddResultModal
          subjects={subjects.map((s) => s.subjectName)}
          results={results}
          defaults={{
            session: sessionFilter,
            term: termFilter,
            className: classFilter,
            subject: subjectFilter,
          }}
          onClose={() => setAddOpen(false)}
          onSaved={() => loadData(true)}
        />
      )}

      {publishOpen && (
        <PublishModal
          docs={draftDocs}
          missing={studentsWithoutResults}
          className={classFilter}
          session={sessionFilter}
          term={termFilter}
          onClose={() => setPublishOpen(false)}
          onPublished={async (count) => {
            setPublishOpen(false);
            await loadData(true);
            setNotice({
              type: "success",
              text: `${count} result(s) published for ${classFilter}.`,
            });
          }}
        />
      )}
    </div>
  );
}

/* ----------------------- Add result (class > student > subject) ----------------------- */

function AddResultModal({
  subjects,
  results,
  defaults,
  onClose,
  onSaved,
}: {
  subjects: string[];
  results: StudentResult[];
  defaults: { session: string; term: string; className: string; subject: string };
  onClose: () => void;
  onSaved: () => void;
}) {
  const [session, setSession] = useState(defaults.session);
  const [term, setTerm] = useState(defaults.term);
  const [className, setClassName] = useState(defaults.className);
  const [studentId, setStudentId] = useState("");
  const [subjectName, setSubjectName] = useState(defaults.subject);
  const [inputs, setInputs] = useState<ScoreInputs>(emptyInputs());
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { students, loading, error: studentsError } =
    useClassStudents(className);

  const student = students.find((s) => s.studentId === studentId);
  const doc = student
    ? findDoc(results, student.studentId, className, session, term)
    : undefined;
  const locked = doc?.status === "Published";

  const filteredStudents = students.filter(
    (s) =>
      s.fullname.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  const total = inputsTotal(inputs);
  const ready = !!student && !!subjectName && !locked && total !== null;

  function loadInputs(sId: string, subj: string) {
    const d = findDoc(results, sId, className, session, term);
    setInputs(inputsFromEntry(d?.subject.find((s) => s.subjectName === subj)));
  }

  function resetSelection() {
    setStudentId("");
    setInputs(emptyInputs());
    setSuccess("");
    setError("");
  }

  function selectStudent(id: string) {
    setStudentId(id);
    setSuccess("");
    setError("");
    loadInputs(id, subjectName);
  }

  function selectSubject(name: string) {
    setSubjectName(name);
    setSuccess("");
    setError("");
    if (studentId) loadInputs(studentId, name);
  }

  async function save() {
    if (!ready || !student) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await sendJson("/api/result/subject", "POST", {
        session,
        term,
        className,
        studentId: student.studentId,
        studentName: student.fullname,
        subjectName,
        ...scoresFromInputs(inputs),
      });

      setSuccess(
        `${subjectName} saved for ${student.fullname}. Pick the next subject.`
      );
      setSubjectName("");
      setInputs(emptyInputs());
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title="Upload Result"
      subtitle="Choose a class, then a student, then a subject. Scores are saved as drafts."
      onClose={onClose}
      busy={saving}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FilterSelect
          label="Academic Session"
          value={session}
          onChange={(v) => {
            setSession(v);
            resetSelection();
          }}
          options={sessions}
        />
        <FilterSelect
          label="Term"
          value={term}
          onChange={(v) => {
            setTerm(v);
            resetSelection();
          }}
          options={terms}
        />
        <FilterSelect
          label="Class"
          value={className}
          onChange={(v) => {
            setClassName(v);
            resetSelection();
          }}
          options={classes}
        />
      </div>

      {/* Student list */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student
        </label>
        <div className="relative mb-2">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div className="max-h-52 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-100">
          {loading && (
            <p className="p-4 text-sm text-gray-500">Loading students...</p>
          )}
          {!loading && studentsError && (
            <p className="p-4 text-sm text-red-600">{studentsError}</p>
          )}
          {!loading && !studentsError && filteredStudents.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              {students.length === 0
                ? "There are no students in this class yet."
                : "No students match your search."}
            </p>
          )}
          {!loading &&
            filteredStudents.map((s) => {
              const d = findDoc(results, s.studentId, className, session, term);
              const selected = s.studentId === studentId;
              return (
                <button
                  key={s.studentId}
                  type="button"
                  onClick={() => selectStudent(s.studentId)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm ${
                    selected ? "bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span>
                    <span className="font-medium text-gray-800">
                      {s.fullname}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {s.studentId}
                    </span>
                  </span>
                  <span className="text-xs text-gray-500 shrink-0">
                    {d?.status === "Published"
                      ? "Published"
                      : `${d?.subject.length ?? 0} subject(s) done`}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Subject + scores */}
      {student && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Entering results for{" "}
            <strong className="text-gray-800">{student.fullname}</strong>
          </p>

          {locked && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              This student's results are already published and can't be
              changed.
            </p>
          )}

          {doc && doc.subject.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {doc.subject.map((s) => (
                <button
                  key={s.subjectName}
                  type="button"
                  onClick={() => selectSubject(s.subjectName)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    s.subjectName === subjectName
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                  }`}
                >
                  {s.subjectName} · {entryTotal(s)}
                </button>
              ))}
            </div>
          )}

          <FilterSelect
            label="Subject"
            value={subjectName}
            onChange={selectSubject}
            options={subjects}
            placeholder="Select a subject"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SCORE_FIELDS.map((f) => (
              <NumberField
                key={f.key}
                label={`${f.label} (0-${f.max})`}
                value={inputs[f.key]}
                max={f.max}
                disabled={locked}
                onChange={(v) => setInputs((prev) => ({ ...prev, [f.key]: v }))}
              />
            ))}
          </div>

          <div className="flex items-center gap-6 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-sm">
            <span className="text-gray-500">
              Total <strong className="text-gray-800">{total ?? "-"}</strong>
            </span>
            <span className="text-gray-500">
              Grade{" "}
              <strong className="text-indigo-600">{getGrade(total)}</strong>
            </span>
            <span className="text-gray-500">
              Remark{" "}
              <strong className="text-gray-800">{getRemark(total)}</strong>
            </span>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm"
        >
          Done
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!ready || saving}
          className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save result"}
        </button>
      </div>
    </Modal>
  );
}

/* ---------------------------- Publish review modal ---------------------------- */

type Extras = { present: string; absent: string; remark: string };

function PublishModal({
  docs,
  missing,
  className,
  session,
  term,
  onClose,
  onPublished,
}: {
  docs: StudentResult[];
  missing: Student[];
  className: string;
  session: string;
  term: string;
  onClose: () => void;
  onPublished: (count: number) => void;
}) {
  const [extras, setExtras] = useState<Record<string, Extras>>(() =>
    Object.fromEntries(
      docs.map((d) => [
        d._id,
        {
          present: d.present ? String(d.present) : "",
          absent: d.absent ? String(d.absent) : "",
          remark: d.Treport ?? "",
        },
      ])
    )
  );
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  // Calculations for every student
  const list = useMemo(() => {
    const base = docs.map((doc) => ({ doc, ...summarize(doc.subject) }));
    const maxSubjects = Math.max(0, ...base.map((b) => b.noSubj));

    // Position by average; students with equal averages share a position
    const sorted = [...base].sort((a, b) => b.average - a.average);
    return base.map((b) => ({
      ...b,
      position: sorted.findIndex((s) => s.average === b.average) + 1,
      fewerSubjects: b.noSubj < maxSubjects,
    }));
  }, [docs]);

  const warnings = list.filter((l) => l.fewerSubjects).length;

  function setExtra(id: string, field: keyof Extras, value: string) {
    setExtras((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]:
          field === "remark" ? value : value.replace(/\D/g, "").slice(0, 3),
      },
    }));
  }

  async function publish() {
    if (
      warnings > 0 &&
      !confirm(
        `${warnings} student(s) have fewer subjects than their classmates. Publish anyway?`
      )
    ) {
      return;
    }

    setPublishing(true);
    setError("");

    try {
      await sendJson("/api/result/publish", "PATCH", {
        session,
        term,
        className,
        results: list.map((l) => ({
          id: l.doc._id,
          studentId: l.doc.studentId,
          subject: l.subjects,
          No_subj: String(l.noSubj),
          score_obtain: String(l.obtained),
          score_obtainable: String(l.obtainable),
          average: l.average.toFixed(2),
          position: l.position,
          present: Number(extras[l.doc._id].present || 0),
          absent: Number(extras[l.doc._id].absent || 0),
          Treport: extras[l.doc._id].remark.trim(),
        })),
      });
      onPublished(list.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <Modal
      title={`Publish ${className} results`}
      subtitle={`${session} · ${term}. Totals, averages and positions are calculated below. Publishing locks these results.`}
      onClose={onClose}
      busy={publishing}
      wide
    >
      {warnings > 0 && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          {warnings} student(s) are highlighted because they have fewer subjects
          than their classmates. Check that nothing is missing.
        </p>
      )}

      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Subjects</th>
              <th className="px-4 py-3">Obtained</th>
              <th className="px-4 py-3">Obtainable</th>
              <th className="px-4 py-3">Average</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Present</th>
              <th className="px-4 py-3">Absent</th>
              <th className="px-4 py-3">Class teacher's remark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map((l) => {
              const e = extras[l.doc._id];
              return (
                <tr
                  key={l.doc._id}
                  className={l.fewerSubjects ? "bg-amber-50/60" : ""}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800">
                      {l.doc.studentName}
                    </p>
                    <p className="text-xs text-gray-500">{l.doc.studentId}</p>
                  </td>
                  <td className="px-4 py-3">{l.noSubj}</td>
                  <td className="px-4 py-3">{l.obtained}</td>
                  <td className="px-4 py-3">{l.obtainable}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">
                    {l.average.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3">{ordinal(l.position)}</td>
                  <td className="px-4 py-3">
                    <MiniInput
                      value={e.present}
                      onChange={(v) => setExtra(l.doc._id, "present", v)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <MiniInput
                      value={e.absent}
                      onChange={(v) => setExtra(l.doc._id, "absent", v)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={e.remark}
                      onChange={(ev) =>
                        setExtra(l.doc._id, "remark", ev.target.value)
                      }
                      placeholder="e.g. A diligent student"
                      className="w-56 p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {missing.length > 0 && (
        <p className="text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <strong>{missing.length} student(s) have no results yet</strong> and
          will be skipped: {missing.map((s) => s.fullname).join(", ")}.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={publishing}
          className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={publish}
          disabled={publishing || list.length === 0}
          className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm"
        >
          <Send size={18} />
          {publishing ? "Publishing..." : `Publish ${list.length} result(s)`}
        </button>
      </div>
    </Modal>
  );
}

/* ------------------------------ Small components ----------------------------- */

function Modal({
  title,
  subtitle,
  onClose,
  busy,
  wide,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  busy?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, busy]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={() => !busy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-full ${
          wide ? "sm:max-w-5xl" : "sm:max-w-2xl"
        } max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl`}
      >
        <div className="sticky top-0 z-10 bg-white flex items-start justify-between gap-4 p-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6">{children}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Row["status"] }) {
  const styles = {
    Published: "bg-green-100 text-green-700",
    Draft: "bg-orange-100 text-orange-700",
    Pending: "bg-gray-100 text-gray-600",
  }[status];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

function NumberField({
  label,
  value,
  max,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  max: number;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const invalid = isOutOfRange(value, max);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 3))}
        placeholder={`0-${max}`}
        aria-invalid={invalid}
        className={`w-full p-3 border rounded-xl text-sm outline-none disabled:bg-gray-100 ${
          invalid
            ? "border-red-400 bg-red-50"
            : "border-gray-200 focus:border-indigo-500"
        }`}
      />
      {invalid && <p className="text-xs text-red-600 mt-1">Maximum is {max}.</p>}
    </div>
  );
}

function MiniInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0"
      className="w-16 p-2 text-sm text-center border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
    />
  );
}

function ScoreInput({
  value,
  max,
  invalid,
  onChange,
}: {
  value: string;
  max: number;
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`0-${max}`}
      aria-invalid={invalid}
      className={`w-20 p-2 text-sm text-center border rounded-lg outline-none ${
        invalid
          ? "border-red-400 bg-red-50 focus:border-red-500"
          : "border-gray-200 focus:border-indigo-500"
      }`}
    />
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-xl bg-white text-sm outline-none focus:border-indigo-500"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
