
"use client";

import { useMemo, useState, type FormEvent } from "react";


import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Pencil,
  X,
  Upload,
  Download,
} from "lucide-react";
import Header from "../component/header";
import Navigation from "../component/navigation";

type ResultStatus = "Draft" | "Published";

type StudentResult = {
  id: number;
  studentName: string;
  admissionNo: string;
  className: string;
  subject: string;
  session: string;
  term: string;
  caScore: number | null;
  examScore: number | null;
  status: ResultStatus;
};

const initialResults: StudentResult[] = [
  {
    id: 1,
    studentName: "John Adebayo",
    admissionNo: "STU001",
    className: "JSS 1",
    subject: "Mathematics",
    session: "2025/2026",
    term: "First Term",
    caScore: 32,
    examScore: 55,
    status: "Published",
  },
  {
    id: 2,
    studentName: "Grace Okafor",
    admissionNo: "STU002",
    className: "JSS 1",
    subject: "Mathematics",
    session: "2025/2026",
    term: "First Term",
    caScore: 35,
    examScore: 48,
    status: "Draft",
  },
  {
    id: 3,
    studentName: "David Eze",
    admissionNo: "STU003",
    className: "JSS 1",
    subject: "Mathematics",
    session: "2025/2026",
    term: "First Term",
    caScore: null,
    examScore: null,
    status: "Draft",
  },
  {
    id: 4,
    studentName: "Mary Johnson",
    admissionNo: "STU004",
    className: "JSS 2",
    subject: "English Language",
    session: "2025/2026",
    term: "First Term",
    caScore: 28,
    examScore: 50,
    status: "Published",
  },
  {
    id: 5,
    studentName: "Samuel James",
    admissionNo: "STU005",
    className: "JSS 2",
    subject: "English Language",
    session: "2025/2026",
    term: "First Term",
    caScore: null,
    examScore: null,
    status: "Draft",
  },
  {
    id: 6,
    studentName: "Peter Williams",
    admissionNo: "STU006",
    className: "SSS 1",
    subject: "Physics",
    session: "2025/2026",
    term: "First Term",
    caScore: 30,
    examScore: 45,
    status: "Draft",
  },
];

const classes = [
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1",
  "SSS 2",
  "SSS 3",
];

const subjects = [
  "Mathematics",
  "English Language",
  "Basic Science",
  "Computer Studies",
  "Physics",
  "Chemistry",
  "Biology",
];

const sessions = ["2025/2026", "2026/2027"];

const terms = ["First Term", "Second Term", "Third Term"];

function getTotal(ca: number | null, exam: number | null) {
  if (ca === null || exam === null) return null;
  return ca + exam;
}

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

export default function ResultsPage() {
  const [results, setResults] = useState(initialResults);

  const [active, setActive] = useState("Results");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("JSS 1");
  const [subjectFilter, setSubjectFilter] = useState("Mathematics");
  const [sessionFilter, setSessionFilter] = useState("2025/2026");
  const [termFilter, setTermFilter] = useState("First Term");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] =
    useState<StudentResult | null>(null);

  const [scoreForm, setScoreForm] = useState({
    caScore: "",
    examScore: "",
  });

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesSearch =
        result.studentName.toLowerCase().includes(search.toLowerCase()) ||
        result.admissionNo.toLowerCase().includes(search.toLowerCase());

      return (
        result.className === classFilter &&
        result.subject === subjectFilter &&
        result.session === sessionFilter &&
        result.term === termFilter &&
        (statusFilter === "All" || result.status === statusFilter) &&
        matchesSearch
      );
    });
  }, [
    results,
    search,
    classFilter,
    subjectFilter,
    sessionFilter,
    termFilter,
    statusFilter,
  ]);

  const completedCount = filteredResults.filter(
    (result) =>
      result.caScore !== null && result.examScore !== null
  ).length;

  const pendingCount = filteredResults.length - completedCount;

  const publishedCount = filteredResults.filter(
    (result) => result.status === "Published"
  ).length;

  const averageScore = completedCount
    ? (
        filteredResults.reduce((sum, result) => {
          return sum + (getTotal(result.caScore, result.examScore) ?? 0);
        }, 0) / completedCount
      ).toFixed(1)
    : "0.0";

  function openScoreModal(result: StudentResult) {
    setSelectedResult(result);

    setScoreForm({
      caScore: result.caScore?.toString() ?? "",
      examScore: result.examScore?.toString() ?? "",
    });

    setShowModal(true);
  }

  function saveScores(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedResult) return;

    const ca = Number(scoreForm.caScore);
    const exam = Number(scoreForm.examScore);

    if (
      !Number.isInteger(ca) ||
      !Number.isInteger(exam) ||
      ca < 0 ||
      ca > 40 ||
      exam < 0 ||
      exam > 60
    ) {
      alert("CA must be between 0 and 40, and exam must be between 0 and 60.");
      return;
    }

    setResults((prev) =>
      prev.map((result) =>
        result.id === selectedResult.id
          ? {
              ...result,
              caScore: ca,
              examScore: exam,
              status: "Draft",
            }
          : result
      )
    );

    setShowModal(false);
    setSelectedResult(null);
  }

  function publishResults() {
    const publishable = filteredResults.filter(
      (result) =>
        result.caScore !== null &&
        result.examScore !== null &&
        result.status !== "Published"
    );

    if (publishable.length === 0) {
      alert("There are no completed draft results to publish.");
      return;
    }

    if (
      !confirm(
        `Publish ${publishable.length} completed result(s) for ${classFilter}?`
      )
    ) {
      return;
    }

    const publishIds = new Set(publishable.map((result) => result.id));

    setResults((prev) =>
      prev.map((result) =>
        publishIds.has(result.id)
          ? { ...result, status: "Published" }
          : result
      )
    );
  }

  function exportResults() {
    if (filteredResults.length === 0) {
      alert("There are no results to export.");
      return;
    }

    const rows = [
      [
        "Student Name",
        "Admission Number",
        "Class",
        "Subject",
        "CA Score",
        "Exam Score",
        "Total",
        "Grade",
        "Remark",
        "Status",
      ],
      ...filteredResults.map((result) => {
        const total = getTotal(result.caScore, result.examScore);

        return [
          result.studentName,
          result.admissionNo,
          result.className,
          result.subject,
          result.caScore ?? "",
          result.examScore ?? "",
          total ?? "",
          getGrade(total),
          getRemark(total),
          result.status,
        ];
      }),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${classFilter}-${subjectFilter}-results.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navigation */}
      <Navigation
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:ml-64">

        {/* Header */}
        <Header
          active={active}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-4 md:p-8 space-y-6">

          {/* Page heading */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Result Management
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Enter scores, calculate grades and publish student results.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportResults}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 bg-white hover:bg-gray-50 text-sm"
              >
                <Download size={18} />
                Export Results
              </button>

              <button
                onClick={publishResults}
                disabled={
                  !filteredResults.some(
                    (result) =>
                      result.caScore !== null &&
                      result.examScore !== null &&
                      result.status === "Draft"
                  )
                }
                className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm"
              >
                <Upload size={18} />
                Publish Results
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            <StatCard
              title="Total Students"
              value={filteredResults.length}
              icon={<Users size={22} />}
              color="bg-indigo-100 text-indigo-600"
            />

            <StatCard
              title="Scores Completed"
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
                onChange={setSessionFilter}
                options={sessions}
              />

              <FilterSelect
                label="Term"
                value={termFilter}
                onChange={setTermFilter}
                options={terms}
              />

              <FilterSelect
                label="Class"
                value={classFilter}
                onChange={setClassFilter}
                options={classes}
              />

              <FilterSelect
                label="Subject"
                value={subjectFilter}
                onChange={setSubjectFilter}
                options={subjects}
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
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>

                </div>
              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px] text-left">

                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">CA (40)</th>
                    <th className="px-6 py-4">Exam (60)</th>
                    <th className="px-6 py-4">Total (100)</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Remark</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredResults.map((result) => {
                    const total = getTotal(
                      result.caScore,
                      result.examScore
                    );

                    return (
                      <tr
                        key={result.id}
                        className="hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-4">
                          <p className="font-semibold text-sm text-gray-800">
                            {result.studentName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {result.admissionNo}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {result.caScore ?? "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {result.examScore ?? "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-800">
                            {total ?? "-"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-bold text-indigo-600">
                            {getGrade(total)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {getRemark(total)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              result.status === "Published"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {result.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => openScoreModal(result)}
                            title="Enter or edit scores"
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>
                        </td>

                      </tr>
                    );
                  })}

                  {filteredResults.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-12 text-gray-500"
                      >
                        No results found for the selected criteria.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>
            </div>

            <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-2 text-sm text-gray-500">
              <span>
                Showing {filteredResults.length} student(s)
              </span>

              <span>
                Class Average: {averageScore}%
              </span>
            </div>

          </div>

          {/* Score Entry Modal */}
          {showModal && selectedResult && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

              <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">

                <div className="flex items-center justify-between p-6 border-b border-gray-100">

                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Enter Student Scores
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {selectedResult.studentName} · {selectedResult.admissionNo}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>

                </div>

                <form onSubmit={saveScores} className="p-6 space-y-5">

                  <div className="bg-indigo-50 rounded-xl p-4">
                    <p className="text-sm text-indigo-700 font-medium">
                      {selectedResult.className} · {selectedResult.subject}
                    </p>

                    <p className="text-xs text-indigo-600 mt-1">
                      {selectedResult.session} · {selectedResult.term}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Continuous Assessment (CA)
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="40"
                      step="1"
                      required
                      value={scoreForm.caScore}
                      onChange={(e) =>
                        setScoreForm({
                          ...scoreForm,
                          caScore: e.target.value,
                        })
                      }
                      placeholder="Enter CA score (0 - 40)"
                      className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                    />

                    <p className="text-xs text-gray-400 mt-1">
                      Maximum score: 40
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Examination Score
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="60"
                      step="1"
                      required
                      value={scoreForm.examScore}
                      onChange={(e) =>
                        setScoreForm({
                          ...scoreForm,
                          examScore: e.target.value,
                        })
                      }
                      placeholder="Enter exam score (0 - 60)"
                      className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                    />

                    <p className="text-xs text-gray-400 mt-1">
                      Maximum score: 60
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500">
                      Calculated Total
                    </p>

                    <p className="text-2xl font-bold text-indigo-600 mt-1">
                      {scoreForm.caScore !== "" &&
                      scoreForm.examScore !== ""
                        ? Number(scoreForm.caScore) +
                          Number(scoreForm.examScore)
                        : "-"}{" "}
                      <span className="text-sm text-gray-400">/ 100</span>
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">

                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
                    >
                      Save Scores
                    </button>

                  </div>

                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
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
          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {value}
          </h3>
        </div>

        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>

      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
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
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
