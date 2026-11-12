
"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  MoreHorizontal,
  Eye,
  Pencil,
  X,
  Filter,
} from "lucide-react";
import Navigation from "../component/navigation";
import Header from "../component/header";



type Student = {
  id: number;
  name: string;
  admissionNo: string;
  className: string;
  gender: string;
  email: string;
  status: "Active" | "Inactive";
};

const initialStudents: Student[] = [
  {
    id: 1,
    name: "John Adebayo",
    admissionNo: "STU001",
    className: "JSS 1",
    gender: "Male",
    email: "john@example.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Grace Okafor",
    admissionNo: "STU002",
    className: "SSS 2",
    gender: "Female",
    email: "grace@example.com",
    status: "Active",
  },
  {
    id: 3,
    name: "David Eze",
    admissionNo: "STU003",
    className: "JSS 3",
    gender: "Male",
    email: "david@example.com",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Mary Johnson",
    admissionNo: "STU004",
    className: "SSS 1",
    gender: "Female",
    email: "mary@example.com",
    status: "Active",
  },
  {
    id: 5,
    name: "Samuel James",
    admissionNo: "STU005",
    className: "JSS 2",
    gender: "Male",
    email: "samuel@example.com",
    status: "Active",
  },
];

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("Students");

  const [form, setForm] = useState({
    name: "",
    admissionNo: "",
    className: "JSS 1",
    gender: "Male",
    email: "",
  });

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  const inactiveCount = students.filter(
    (student) => student.status === "Inactive"
  ).length;

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(search.toLowerCase());

    const matchesClass =
      classFilter === "All" || student.className === classFilter;

    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const addStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newStudent: Student = {
      id: Date.now(),
      ...form,
      status: "Active",
    };

    setStudents((prev) => [newStudent, ...prev]);

    setForm({
      name: "",
      admissionNo: "",
      className: "JSS 1",
      gender: "Male",
      email: "",
    });

    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
       <Navigation
          active={active}
          setActive={setActive}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      <div className="min-h-screen lg:ml-[260px]">
       

        <Header
          active={active}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="mx-auto max-w-[1600px] space-y-7 p-5 sm:p-8">
           {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Students
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage student records, admissions and class assignments.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-medium transition"
          >
            <Plus size={18} />
            Add Student
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

          <StatCard
            title="Total Students"
            value={students.length}
            icon={<Users size={22} />}
            color="bg-indigo-100 text-indigo-600"
          />

          <StatCard
            title="Active Students"
            value={activeCount}
            icon={<UserCheck size={22} />}
            color="bg-green-100 text-green-600"
          />

          <StatCard
            title="Inactive Students"
            value={inactiveCount}
            icon={<UserX size={22} />}
            color="bg-orange-100 text-orange-600"
          />

        </div>

        {/* Student table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">

          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row gap-3 justify-between">

              {/* Search */}
              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or admission number..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <Filter size={17} />
                  <span className="text-sm">Filter:</span>
                </div>

                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white"
                >
                  <option value="All">All Classes</option>
                  <option value="JSS 1">JSS 1</option>
                  <option value="JSS 2">JSS 2</option>
                  <option value="JSS 3">JSS 3</option>
                  <option value="SSS 1">SSS 1</option>
                  <option value="SSS 2">SSS 2</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[850px]">

              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Admission No.</th>
                  <th className="px-6 py-4 font-semibold">Class</th>
                  <th className="px-6 py-4 font-semibold">Gender</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                          {student.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.admissionNo}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.className}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.gender}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${student.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                          }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-gray-400">
                        <button
                          title="View student"
                          className="hover:text-indigo-600"
                          onClick={() =>
                            alert(`Viewing ${student.name}`)
                          }
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          title="Edit student"
                          className="hover:text-indigo-600"
                          onClick={() =>
                            alert(`Editing ${student.name}`)
                          }
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          title="More options"
                          className="hover:text-gray-700"
                        >
                          <MoreHorizontal size={19} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

          <div className="p-5 border-t border-gray-100 text-sm text-gray-500">
            Showing {filteredStudents.length} of {students.length} students
          </div>

        </div>

        {/* Add Student Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">

              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Add New Student
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the student&apos;s information.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={addStudent} className="p-6 space-y-4">

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Admission Number
                  </label>
                  <input
                    required
                    value={form.admissionNo}
                    onChange={(e) =>
                      setForm({ ...form, admissionNo: e.target.value })
                    }
                    placeholder="e.g. STU006"
                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Class
                    </label>
                    <select
                      value={form.className}
                      onChange={(e) =>
                        setForm({ ...form, className: e.target.value })
                      }
                      className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none"
                    >
                      <option>JSS 1</option>
                      <option>JSS 2</option>
                      <option>JSS 3</option>
                      <option>SSS 1</option>
                      <option>SSS 2</option>
                      <option>SSS 3</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                      className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none"
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="student@example.com"
                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
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
                    Save Student
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        </div>
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
