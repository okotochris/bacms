
"use client";

import { useMemo, useState, FormEvent } from "react";
import Navigation from "../component/navigation";
import Header from "../component/header";
import {
  Plus,
  Search,
  CalendarDays,
  Clock,
  BookOpen,
  ClipboardList,
  X,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

type Examination = {
  id: number;
  title: string;
  examType: string;
  session: string;
  term: string;
  className: string;
  subject: string;
  date: string;
  startTime: string;
  duration: number;
  totalMarks: number;
  status: "Upcoming" | "Ongoing" | "Completed";
};

const initialExaminations: Examination[] = [
  {
    id: 1,
    title: "First Term Examination",
    examType: "End of Term",
    session: "2026/2027",
    term: "First Term",
    className: "JSS1",
    subject: "Mathematics",
    date: "2026-11-20",
    startTime: "09:00",
    duration: 120,
    totalMarks: 100,
    status: "Upcoming",
  },
  {
    id: 2,
    title: "First Term Examination",
    examType: "End of Term",
    session: "2026/2027",
    term: "First Term",
    className: "JSS2",
    subject: "English Language",
    date: "2026-11-21",
    startTime: "10:00",
    duration: 120,
    totalMarks: 100,
    status: "Upcoming",
  },
  {
    id: 3,
    title: "First Term Examination",
    examType: "End of Term",
    session: "2026/2027",
    term: "First Term",
    className: "SSS1",
    subject: "Physics",
    date: "2026-11-10",
    startTime: "09:00",
    duration: 120,
    totalMarks: 100,
    status: "Completed",
  },
  {
    id: 4,
    title: "First Term Test",
    examType: "Test",
    session: "2026/2027",
    term: "First Term",
    className: "JSS3",
    subject: "Basic Science",
    date: "2026-11-13",
    startTime: "11:00",
    duration: 60,
    totalMarks: 50,
    status: "Upcoming",
  },
];

const emptyForm = {
  title: "",
  examType: "End of Term",
  session: "2026/2027",
  term: "First Term",
  className: "JSS1",
  subject: "",
  date: "",
  startTime: "09:00",
  duration: "120",
  totalMarks: "100",
};

const classes = ["JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"];

const subjects = [
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Basic Science",
  "Basic Technology",
  "Social Studies",
  "Computer Studies",
  "Agricultural Science",
];

export default function ExaminationsPage() {
  const [active, setActive] = useState("Examinations");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [examinations, setExaminations] =
    useState<Examination[]>(initialExaminations);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingExam, setViewingExam] = useState<Examination | null>(null);
  const [form, setForm] = useState(emptyForm);

  const totalExams = examinations.length;
  const upcomingExams = examinations.filter(
    (exam) => exam.status === "Upcoming"
  ).length;
  const ongoingExams = examinations.filter(
    (exam) => exam.status === "Ongoing"
  ).length;
  const completedExams = examinations.filter(
    (exam) => exam.status === "Completed"
  ).length;

  const filteredExaminations = useMemo(() => {
    return examinations.filter((exam) => {
      const matchesSearch =
        exam.title.toLowerCase().includes(search.toLowerCase()) ||
        exam.subject.toLowerCase().includes(search.toLowerCase());

      const matchesClass =
        classFilter === "All Classes" ||
        exam.className === classFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        exam.status === statusFilter;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [examinations, search, classFilter, statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEditModal = (exam: Examination) => {
    setEditingId(exam.id);
    setForm({
      title: exam.title,
      examType: exam.examType,
      session: exam.session,
      term: exam.term,
      className: exam.className,
      subject: exam.subject,
      date: exam.date,
      startTime: exam.startTime,
      duration: String(exam.duration),
      totalMarks: String(exam.totalMarks),
    });
    setShowModal(true);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const duration = Number(form.duration);
    const totalMarks = Number(form.totalMarks);

    if (!form.title.trim() || !form.subject || !form.date) {
      alert("Please complete all required fields.");
      return;
    }

    if (duration <= 0 || totalMarks <= 0) {
      alert("Duration and total marks must be greater than zero.");
      return;
    }

    const record: Examination = {
      id: editingId ?? Date.now(),
      ...form,
      duration,
      totalMarks,
      status:
        editingId !== null
          ? examinations.find((exam) => exam.id === editingId)?.status ??
            "Upcoming"
          : "Upcoming",
    };

    if (editingId !== null) {
      setExaminations((previous) =>
        previous.map((exam) =>
          exam.id === editingId ? record : exam
        )
      );
    } else {
      setExaminations((previous) => [record, ...previous]);
    }

    setShowModal(false);
    setEditingId(null);
  };

  const deleteExam = (id: number) => {
    if (!window.confirm("Delete this examination?")) return;

    setExaminations((previous) =>
      previous.filter((exam) => exam.id !== id)
    );
  };

  const changeStatus = (
    id: number,
    status: Examination["status"]
  ) => {
    setExaminations((previous) =>
      previous.map((exam) =>
        exam.id === id ? { ...exam, status } : exam
      )
    );
  };

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

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

        <main className="p-4 md:p-8">
          {/* Heading */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Examination Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Create examinations, schedule subjects and manage exam activities.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus size={18} />
              Create Examination
            </button>
          </div>

          {/* Summary cards */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Examinations"
              value={totalExams}
              icon={<ClipboardList size={21} />}
              color="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Upcoming"
              value={upcomingExams}
              icon={<CalendarDays size={21} />}
              color="bg-orange-50 text-orange-600"
            />

            <StatCard
              title="Ongoing"
              value={ongoingExams}
              icon={<Clock size={21} />}
              color="bg-purple-50 text-purple-600"
            />

            <StatCard
              title="Completed"
              value={completedExams}
              icon={<BookOpen size={21} />}
              color="bg-green-50 text-green-600"
            />
          </div>

          {/* Exam schedule */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900">
                Examination Schedule
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View and manage scheduled examinations.
              </p>

              <div className="mt-5 flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search examination or subject..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none"
                >
                  <option>All Classes</option>
                  {classes.map((className) => (
                    <option key={className}>{className}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none"
                >
                  <option>All Status</option>
                  <option>Upcoming</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Examination</th>
                    <th className="px-6 py-4">Class</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Total Marks</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredExaminations.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {exam.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {exam.examType} · {exam.term}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {exam.className}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {exam.subject}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-gray-800">
                          {formatDate(exam.date)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {exam.startTime}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {exam.duration} mins
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-800">
                        {exam.totalMarks}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={exam.status} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewingExam(exam)}
                            title="View examination"
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() => openEditModal(exam)}
                            title="Edit examination"
                            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => deleteExam(exam.id)}
                            title="Delete examination"
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredExaminations.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No examinations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Examination information */}
          <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5">
            <h3 className="font-semibold text-indigo-900">
              Examination Management
            </h3>
            <p className="mt-1 text-sm leading-6 text-indigo-800">
              Create your examination schedule before entering student
              scores. Each examination can be assigned to a class and
              subject, with its own date, duration and maximum marks.
            </p>
          </div>
        </main>
      </div>

      {/* Create/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? "Edit Examination" : "Create Examination"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the examination details below.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                <FormField label="Examination Title">
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g. First Term Examination"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Examination Type">
                  <select
                    value={form.examType}
                    onChange={(e) =>
                      setForm({ ...form, examType: e.target.value })
                    }
                    className="form-input"
                  >
                    <option>End of Term</option>
                    <option>Mid-Term</option>
                    <option>Test</option>
                    <option>Mock Examination</option>
                    <option>Practical Examination</option>
                  </select>
                </FormField>

                <FormField label="Academic Session">
                  <input
                    required
                    value={form.session}
                    onChange={(e) =>
                      setForm({ ...form, session: e.target.value })
                    }
                    placeholder="2026/2027"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Term">
                  <select
                    value={form.term}
                    onChange={(e) =>
                      setForm({ ...form, term: e.target.value })
                    }
                    className="form-input"
                  >
                    <option>First Term</option>
                    <option>Second Term</option>
                    <option>Third Term</option>
                  </select>
                </FormField>

                <FormField label="Class">
                  <select
                    value={form.className}
                    onChange={(e) =>
                      setForm({ ...form, className: e.target.value })
                    }
                    className="form-input"
                  >
                    {classes.map((className) => (
                      <option key={className}>{className}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Subject">
                  <select
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="form-input"
                  >
                    <option value="">Select subject</option>
                    {subjects.map((subject) => (
                      <option key={subject}>{subject}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Examination Date">
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className="form-input"
                  />
                </FormField>

                <FormField label="Start Time">
                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                    className="form-input"
                  />
                </FormField>

                <FormField label="Duration (Minutes)">
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    className="form-input"
                  />
                </FormField>

                <FormField label="Total Marks">
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.totalMarks}
                    onChange={(e) =>
                      setForm({ ...form, totalMarks: e.target.value })
                    }
                    className="form-input"
                  />
                </FormField>
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 p-6 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <Plus size={17} />
                  {editingId ? "Save Changes" : "Create Examination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View examination modal */}
      {viewingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Examination Details
              </h2>
              <button
                onClick={() => setViewingExam(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              {viewingExam.title}
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <Detail label="Examination Type" value={viewingExam.examType} />
              <Detail label="Session" value={viewingExam.session} />
              <Detail label="Term" value={viewingExam.term} />
              <Detail label="Class" value={viewingExam.className} />
              <Detail label="Subject" value={viewingExam.subject} />
              <Detail label="Date" value={formatDate(viewingExam.date)} />
              <Detail label="Start Time" value={viewingExam.startTime} />
              <Detail label="Duration" value={`${viewingExam.duration} minutes`} />
              <Detail label="Total Marks" value={String(viewingExam.totalMarks)} />

              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={viewingExam.status} />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Update Examination Status
              </label>
              <select
                value={viewingExam.status}
                onChange={(e) => {
                  const status = e.target.value as Examination["status"];
                  changeStatus(viewingExam.id, status);
                  setViewingExam({ ...viewingExam, status });
                }}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option>Upcoming</option>
                <option>Ongoing</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
        </div>
      )}
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
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
      </div>
      <h3 className="mt-4 text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }: { status: Examination["status"] }) {
  const styles = {
    Upcoming: "bg-orange-50 text-orange-700",
    Ongoing: "bg-blue-50 text-blue-700",
    Completed: "bg-green-50 text-green-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{value}</span>
    </div>
  );
}
