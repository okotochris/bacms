
"use client";

import { useEffect, useState, type FormEvent } from "react";
import {Plus, Search, Users, UserCheck, UserX, Pencil, Trash2, Eye, } from "lucide-react";
import Header from "../component/header";
import Navigation from "../component/navigation";

type Teacher = {
  _id: number;
  fullname: string;
  employeeNo: string;
  email: string;
  phone: string;
  department: string;
  assignedClass: string;
  role:string,
  password:string,
  status: "Active" | "Inactive";
};



const emptyForm = {
  fullname: "",
  employeeNo: "",
  email: "",
  phone: "",
  department: "Sciences",
  assignedClass: "JSS 1",
  role:'',
  password:'',
  status: "Active" as "Active" | "Inactive",
};

const studentClasses = [
  "SSS 3",
  "SSS 2",
  "SSS 1",
  "JSS 3",
  "JSS 2",
  "JSS 1",
  "BASIC 6",
  "BASIC 5",
  "BASIC 4",
  "BASIC 3",
  "BASIC 2",
  "BASIC 1",
  "NURSERY 3",
  "NURSERY 2",
  "NURSERY 1",
  "PRE NURSERY"
 
]
export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [active, setActive] = useState("Teachers");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(()=>{
    async function getTeacher(){
      try{
        const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/teacher`)
        const {message, teacher} = await result.json()
        if(!result.ok){
          setMessage(message)
          return
        }
        setTeachers(teacher)
      }catch(err){
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
    getTeacher()
  }, [])

  const activeCount = teachers?.filter(
    (teacher) => teacher.status === "Active"
  ).length || 0;

  const inactiveCount = teachers?.filter(
    (teacher) => teacher.status === "Inactive"
  ).length || 0;

  const filteredTeachers = teachers?.filter((teacher) => {
    const matchesSearch =
      teacher.fullname.toLowerCase().includes(search.toLowerCase()) ||
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
    setForm(emptyForm);
    setShowModal(true);
  }



  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try{
       const result = await fetch(`${'http://keen-perception-production-6ce06ecf.up.railway.app'}/api/teacher`, {
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(form)
       })
       if(!result.ok){
        setMessage("unable to create teacher try agian later")
        return
       }
       const {teacher} = await result.json()
      setTeachers((prev) => [
        ...prev,
       teacher
      ]);

    setShowModal(false);
    setForm(emptyForm);
    }catch(err){
      setMessage('server error')
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  async function deleteTeacher(_id: number) {
    try{
      if (confirm("Are you sure you want to delete this teacher?")) {
      const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/teacher/${_id}`, {
        method:"Delete"
       })
       if(!result.ok){
        setMessage('unable to delete try later')
        return
       }
      setTeachers((prev) =>
        prev.filter((teacher) => teacher._id !== _id)
      );
    }
    }catch(err){
      setMessage('sever error')
      console.log(err)
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
              value={teachers ? teachers.length : 0}
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

                  {filteredTeachers?.map((teacher) => (
                    <tr
                      key={teacher._id}
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                            {teacher.fullname.charAt(0)}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {teacher.fullname}
                            </p>

                            <p className="text-xs text-gray-500">
                              {teacher.email}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {teacher.employeeNo}.{teacher.role}
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
                            title="Delete teacher"
                            onClick={() => deleteTeacher(teacher._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                  {filteredTeachers?.length === 0 && (
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
              Showing {filteredTeachers?.length} of {teachers?.length} teachers
            </div>

          </div>

          {/* Add / Edit Teacher Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

              <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>

                    <input
                      required
                      value={form.fullname}
                      onChange={(e) =>
                        setForm({ ...form, fullname: e.target.value })
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
                        {studentClasses.map((studentClass) => (
                          <option key={studentClass} value={studentClass}>
                            {studentClass}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                      <label className="text-sm font-medium text-gray-700">
                        Role
                      </label>

                      <select
                        value={form.assignedClass}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                        className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none"
                      >
                        <option value="">Select Role </option>
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="staff">Staff</option>
                       
                      </select>
                    </div>
                     <div>
                      <label className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="flex items-center justify-center mt-2 p-3 border  border-gray-200 rounded-xl ">
                        <input type={isPasswordVisible ? "text" : "password"} 
                        onChange={(e)=>setForm({...form, password:e.target.value})}
                         className="w-full  borderoutline-none outline-0"
                      />
                      <Eye onClick={()=>isPasswordVisible ? setIsPasswordVisible(false): setIsPasswordVisible(true)}/>
                      </div>
                    </div>

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
                      {loading ? "Saving..... " : "Save Teacher"}
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
