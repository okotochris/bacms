
"use client";

import { useState, type FormEvent } from "react";


import {
  Plus,
  Search,
  Users,
  UserCheck,
  UserX,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import Header from "../component/header";
import Navigation from "../component/navigation";

type Teacher = {
  id: number;
  name: string;
  employeeNo: string;
  email: string;
  phone: string;
  department: string;
  assignedClass: string;
  status: "Active" | "Inactive";
};

const initialTeachers: Teacher[] = [
  {
    id: 1,
    name: "James Okoro",
    employeeNo: "TCH001",
    email: "james@example.com",
    phone: "08012345678",
    department: "Sciences",
    assignedClass: "JSS 1",
    status: "Active",
  },
  {
    id: 2,
    name: "Grace Williams",
    employeeNo: "TCH002",
    email: "grace@example.com",
    phone: "08023456789",
    department: "Languages",
    assignedClass: "JSS 2",
    status: "Active",
  },
  {
    id: 3,
    name: "David Eze",
    employeeNo: "TCH003",
    email: "david@example.com",
    phone: "08034567890",
    department: "Sciences",
    assignedClass: "SSS 1",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Mary Johnson",
    employeeNo: "TCH004",
    email: "mary@example.com",
    phone: "08045678901",
    department: "Arts",
    assignedClass: "SSS 2",
    status: "Active",
  },
  {
    id: 5,
    name: "Samuel James",
    employeeNo: "TCH005",
    email: "samuel@example.com",
    phone: "08056789012",
    department: "Commercial",
    assignedClass: "SSS 3",
    status: "Active",
  },
];

const emptyForm = {
  name: "",
  employeeNo: "",
  email: "",
  phone: "",
  department: "Sciences",
  assignedClass: "JSS 1",
  status: "Active" as "Active" | "Inactive",
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState(initialTeachers);

  const [active, setActive] = useState("Teachers");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState(emptyForm);

  const activeCount = teachers.filter(
    (teacher) => teacher.status === "Active"
  ).length;

  const inactiveCount = teachers.filter(
    (teacher) => teacher.status === "Inactive"
  ).length;

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.employeeNo.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      departmentFilter === "All" ||
      teacher.department === departmentFilter;

    const matchesStatus =
      statusFilter === "All" ||
      teacher.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(teacher: Teacher) {
    setEditingId(teacher.id);

    setForm({
      name: teacher.name,
      employeeNo: teacher.employeeNo,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      assignedClass: teacher.assignedClass,
      status: teacher.status,
    });

    setShowModal(true);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (editingId !== null) {
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === editingId
            ? { ...teacher, ...form }
            : teacher
        )
      );
    } else {
      setTeachers((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function deleteTeacher(id: number) {
    if (confirm("Are you sure you want to delete this teacher?")) {
      setTeachers((prev) =>
        prev.filter((teacher) => teacher.id !== id)
      );
    }
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

      {/* Main Content */}
      <div className="lg:ml-64">

        {/* Header */}
        <Header
          active={active}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-4 md:p-8 space-y-6">

          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Teacher Management
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage teachers, departments and class assignments.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-medium"
            >
              <Plus size={18} />
              Add Teacher
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

            <StatCard
              title="Total Teachers"
              value={teachers.length}
              icon={<Users size={22} />}
              color="bg-indigo-100 text-indigo-600"
            />

            <StatCard
              title="Active Teachers"
              value={activeCount}
              icon={<UserCheck size={22} />}
              color="bg-green-100 text-green-600"
            />

            <StatCard
              title="Inactive Teachers"
              value={inactiveCount}
              icon={<UserX size={22} />}
              color="bg-orange-100 text-orange-600"
            />

          </div>

          {/* Teachers Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">

            {/* Search and Filters */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row gap-3 justify-between">

                <div className="relative w-full lg:max-w-sm">
                  <Search
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search teacher name, ID or email..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap gap-3">

                  <select
                    value={departmentFilter}
                    onChange={(e) =>
                      setDepartmentFilter(e.target.value)
                    }
                    className="border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white outline-none"
                  >
                    <option value="All">All Departments</option>
                    <option value="Sciences">Sciences</option>
                    <option value="Languages">Languages</option>
                    <option value="Arts">Arts</option>
                    <option value="Commercial">Commercial</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white outline-none"
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
              <table className="w-full min-w-[950px] text-left">

                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Teacher</th>
                    <th className="px-6 py-4">Employee ID</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Class</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                            {teacher.name.charAt(0)}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {teacher.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {teacher.email}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {teacher.employeeNo}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {teacher.department}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {teacher.assignedClass}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            teacher.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {teacher.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">

                          <button
                            title="Edit teacher"
                            onClick={() => openEditModal(teacher)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            title="Delete teacher"
                            onClick={() => deleteTeacher(teacher.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                  {filteredTeachers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-gray-500"
                      >
                        No teachers found.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>

            <div className="p-5 border-t border-gray-100 text-sm text-gray-500">
              Showing {filteredTeachers.length} of {teachers.length} teachers
            </div>

          </div>

          {/* Add / Edit Teacher Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

              <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between p-6 border-b">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {editingId !== null ? "Edit Teacher" : "Add New Teacher"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Enter the teacher&apos;s information below.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

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
                      placeholder="Enter teacher's full name"
                      className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Employee ID
                      </label>

                      <input
                        required
                        value={form.employeeNo}
                        onChange={(e) =>
                          setForm({ ...form, employeeNo: e.target.value })
                        }
                        placeholder="e.g. TCH006"
                        className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>

                      <input
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="08012345678"
                        className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                      />
                    </div>

                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="teacher@example.com"
                      className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Department
                      </label>

                      <select
                        value={form.department}
                        onChange={(e) =>
                          setForm({ ...form, department: e.target.value })
                        }
                        className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none"
                      >
                        <option>Sciences</option>
                        <option>Languages</option>
                        <option>Arts</option>
                        <option>Commercial</option>
                        <option>Social Sciences</option>
                        <option>Administration</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Assigned Class
                      </label>

                      <select
                        value={form.assignedClass}
                        onChange={(e) =>
                          setForm({ ...form, assignedClass: e.target.value })
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

                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Employment Status
                    </label>

                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as "Active" | "Inactive",
                        })
                      }
                      className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
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
                      {editingId !== null ? "Update Teacher" : "Save Teacher"}
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
