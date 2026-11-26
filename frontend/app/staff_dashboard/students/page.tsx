
"use client";

import { useEffect, useState } from "react";
import {Search, Plus, Users, UserCheck, UserX, Eye, Filter, Trash, Edit,} from "lucide-react";
import Navigation from "../component/navigation";
import Header from "../component/header";
import { useRouter } from "next/navigation";




type Student = {
  _id: string;
  fullname: string;
  admissionNo: string;
  className: string;
  gender: string;
  email: string;
  image:{
    prfileImage:string
  }
  studentId: string;
  profileImage: File | null
  address:string,
  guardianName:string,
  guardianContact:string,
  guardianRelationshipStatus:string,
  dob:string
  status: "Active" | "Inactive";
};


export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("Students");
  const [loading, setLoading] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')
  const [showEdit, setShowEdit] = useState(false)
  const [studentInfo, setStudentInfo] = useState<Student>()
  const [message, setMessage] = useState('')
  const [showBox, setShowBox] = useState(false)
    const [form, setForm] = useState<{
      fullname: string;
      admissionNo: string;
      className: string;
      gender: string;
      email: string;
      studentId: string;
      guardianName:string;
      guardianContact:string;
      guardianRelationshipStatus:string;
      address:string;
      dob:string;
      profileImage: File | null;
    }>({
    fullname: "",
    admissionNo: "",
    className: "JSS 1",
    gender: "Male",
    email: "",
    studentId: "",
    guardianName:'',
    guardianContact:'',
    guardianRelationshipStatus:'',
    address:'',
    dob:"",
    profileImage: null
  });

  const router = useRouter()
  useEffect(()=>{
    
    generateFourDigit()
    async function getStudent(){
      try{ 
        const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/student`)
        const {message, data} = await result.json()
        if(!result){
          setMessage(message)
          return
        }
        setStudents(data)
        setShowBox(true)
      }catch(err){
        setMessage("server error")
        setShowBox(true)
        console.log(err)
      }finally{
        setLoading(false)
         generateRandomValue()
      }
    }

    getStudent()
  }, [])

async function handleDelete(_id:string){
  try{
    setLoading(true)
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/student/${_id}`, {method:'delete'})
    if(!result.ok){
      setMessage('somehting went wrong try again')
      return
    }
    setStudents(()=>students.filter(item=>item._id !== _id))
  }catch(err){
    console.log(err)
    setMessage('something went wrong try again')
  }finally{
    setLoading(false)
  }
}

function generateFourDigit(){
  let count = Number(localStorage.getItem('count') ||0)
  count++
  localStorage.setItem("count", String(count))
  const digit = 'STU' + '-' + String(count).padStart(10, '0')
  setForm({...form, admissionNo:digit})
}

function generateRandomValue() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const letterCode = Array.from({ length: 3 }, () => {
      return letters[Math.floor(Math.random() * letters.length)];
    }).join('');

    const fourValue = Math.floor(1000 + Math.random() * 9000);
    setForm((prev) => ({ ...prev, studentId: `BAC${fourValue}${letterCode}` }));

  }

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  const inactiveCount = students.filter(
    (student) => student.status === "Inactive"
  ).length;

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(search.toLowerCase());

    const matchesClass =
      classFilter === "All" || student.className === classFilter;

    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const addStudent = async(e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData();

      formData.append("fullname", form.fullname);
      formData.append("admissionNo", form.admissionNo);
      formData.append("className", form.className);
      formData.append("gender", form.gender);
      formData.append("email", form.email);
      formData.append("studentId", form.studentId);
      formData.append('guardianName', form.guardianName)
      formData.append('guardianContact', form.guardianContact)
       formData.append('dob', form.dob)
      formData.append('guardianguardianRelationshipStatus', form.guardianRelationshipStatus)
       formData.append('address', form.address)
      if (form.profileImage) {
        formData.append("profileImage", form.profileImage);
      }
   try{
    setLoading(true)
     e.preventDefault();
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/student`, {
      method:"POST",
      body:formData
    })
    const {message, student} = await result.json()
    if(!result.ok){
      setShowBox(true)
      setMessage(message)
      return
    }

    setStudents((prev) => [student, ...prev]);

    setForm({
      fullname: "",
      admissionNo: "",
      className: "JSS 1",
      gender: "Male",
      email: "",
      profileImage:null,
      studentId: "",
      guardianName:'',
      guardianContact:'',
      guardianRelationshipStatus:'',
      address:'',
      dob:''
    });

    setShowModal(false);
   }catch(err){
    setMessage('server error')
    console.log(err)
    setShowBox(true)
   }finally{
    setLoading(false)
     generateRandomValue()
     generateFourDigit()
   }
  };

const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!studentInfo) return;

  const formData = new FormData();

  formData.append("fullname", studentInfo.fullname);
  formData.append("admissionNo", studentInfo.admissionNo);
  formData.append("className", studentInfo.className);
  formData.append("gender", studentInfo.gender);
  formData.append("email", studentInfo.email);
  formData.append("studentId", studentInfo.studentId);
  formData.append("guardianName", studentInfo.guardianName);
  formData.append("guardianContact", studentInfo.guardianContact);
  formData.append("dob", studentInfo.dob);
  formData.append(
    "guardianRelationshipStatus",
    studentInfo.guardianRelationshipStatus
  );
  formData.append("address", studentInfo.address);

  if (studentInfo.profileImage) {
    formData.append("profileImage", studentInfo.profileImage);
  }

  try {
    setLoading(true);

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/student`,
      {
        method: "PATCH",
        body: formData,
        credentials: "include",
      }
    );

    const { message, student } = await result.json();

    if (!result.ok) {
      setShowBox(true);
      setMessage(message);
      return;
    }

    // Replace the edited student instead of adding a duplicate.
    setStudents((prev) =>
      prev.map((item) =>
        item.studentId === student.studentId ? student : item
      )
    );

    setShowEdit(false);

  } catch (err) {
    console.log(err);
    setMessage("Server error");
    setShowBox(true);

  } finally {
    setLoading(false);
    generateRandomValue();
    generateFourDigit();
  }
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
                  className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
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
                  className="border  text-gray-800 border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white"
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
                {filteredStudents && filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                          {student.fullname.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {student.fullname}
                          </p>
                          <p className="text-xs text-gray-500">
                            {student.studentId}
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
                            router.push(`students/${student._id}`)
                          }
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          title="Edit student"
                          className="hover:text-indigo-600"
                          onClick={() =>{
                            setShowEdit(true)
                            setStudentInfo(student)
                          }}
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          title="More options"
                          className="hover:text-gray-700"
                        >
                          <Trash className="text-red-400 hover:text-red-800" size={19} 
                            onClick={()=>handleDelete(student._id)}
                            />
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
          
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">

            <div className="bg-white text-gray-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[95dvh] flex flex-col overflow-hidden">

              {/* Header */}
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Register New Student
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Fill in the student&apos;s information below
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Form Content */}
              <form onSubmit={addStudent} className="flex flex-col min-h-0 flex-1">

                <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">

                  {/* Student Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-indigo-600 mb-3">
                      Student Information
                    </h3>

                    <div className="space-y-4">

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
                          placeholder="Enter full name"
                          className="w-full mt-2 p-3 border  text-gray-800  border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Admission Number
                        </label>
                        <input
                          required
                          value={form.admissionNo}
                          readOnly
                          placeholder="e.g. STU006"
                          className="w-full mt-2 p-3 border  text-gray-800 border-gray-200 rounded-xl bg-gray-50 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Class
                          </label>
                          <select
                            value={form.className}
                            onChange={(e) =>
                              setForm({ ...form, className: e.target.value })
                            }
                            className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                          >
                            {[
                              'SS 3', 'SS 2', 'SS 1',
                              'JSS 3', 'JSS 2', 'JSS 1',
                              'BASIC 6', 'BASIC 5', 'BASIC 4',
                              'BASIC 3', 'BASIC 2', 'BASIC 1',
                              'NURSERY 3', 'NURSERY 2',
                              'NURSERY 1', 'PRE NURSERY'
                            ].map((item, i) => (
                              <option key={i} value={item}>{item}</option>
                            ))}
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
                            className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>

                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            value={form.dob}
                            onChange={(e)=>setForm({...form, dob:e.target.value})}
                            className="w-full mt-2 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none"
                          />
                          
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Student ID
                          </label>
                          <input
                            type="text"
                            value={form.studentId}
                            readOnly
                            className="w-full mt-2 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none"
                          />
                          
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-indigo-600 mb-3">
                      Guardian Information
                    </h3>

                    <div className="space-y-4">

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Guardian Name
                        </label>
                        <input
                          type="text"
                          value={form.guardianName}
                          placeholder="Enter guardian's full name"
                          onChange={(e) =>
                            setForm({ ...form, guardianName: e.target.value })
                          }
                          className="w-full  text-gray-800 mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Relationship
                          </label>
                          <select
                            value={form.guardianRelationshipStatus}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                guardianRelationshipStatus: e.target.value
                              })
                            }
                            className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                          >
                            <option value="Parent">Parent</option>
                            <option value="Relation">Relation</option>
                            <option value="Guardian">Guardian</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={form.guardianContact}
                            placeholder="Phone number"
                            onChange={(e) =>
                              setForm({ ...form, guardianContact: e.target.value })
                            }
                            className="w-full mt-2 p-3  text-gray-800 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                          />
                        </div>

                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <input
                          type="text"
                          value={form.address}
                          onChange={(e) =>
                            setForm({ ...form, address: e.target.value })
                          }
                          placeholder="Enter home address"
                          className="w-full mt-2 p-3 border  text-gray-800 border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-indigo-600 mb-3">
                      Student Profile Photo
                    </h3>

                    <div className="flex items-center gap-4">

                      {profileUrl ? (
                        <img
                          src={profileUrl}
                          alt="Student profile"
                          className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                          👤
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;

                            setForm({ ...form, profileImage: file });

                            if (file) {
                              setProfileUrl(URL.createObjectURL(file));
                            }
                          }}
                          className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 file:font-medium"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                          Upload a clear student photograph (JPG or PNG).
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Sticky Footer */}
                <div className="px-5 sm:px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium transition"
                  >
                    {loading ? "Adding..." : "Add Student"}
                  </button>

                </div>

              </form>

            </div>
          </div>

        )}
        {showEdit && studentInfo &&(
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">

            <div className="bg-white text-gray-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[95dvh] flex flex-col overflow-hidden">

              {/* Header */}
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Edit Student Information
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Correct student&apos;s information below
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Form Content */}
              <form onSubmit={handleEdit} className="flex flex-col min-h-0 flex-1">

                <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">

                  {/* Student Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-indigo-600 mb-3">
                      Student Information
                    </h3>

                    <div className="space-y-4">

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          required
                          value={studentInfo.fullname}
                          onChange={(e) =>
                            setStudentInfo({ ...studentInfo, fullname: e.target.value })
                          }
                          placeholder="Enter full name"
                          className="w-full mt-2 p-3 border  text-gray-800  border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Admission Number
                        </label>
                        <input
                          required
                          value={studentInfo.admissionNo}
                          readOnly
                          placeholder="e.g. STU006"
                          className="w-full mt-2 p-3 border  text-gray-800 border-gray-200 rounded-xl bg-gray-50 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Class
                          </label>
                          <select
                            value={studentInfo.className}
                            onChange={(e) =>
                              setStudentInfo({ ...studentInfo, className: e.target.value })
                            }
                            className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                          >
                            {[
                              'SS 3', 'SS 2', 'SS 1',
                              'JSS 3', 'JSS 2', 'JSS 1',
                              'BASIC 6', 'BASIC 5', 'BASIC 4',
                              'BASIC 3', 'BASIC 2', 'BASIC 1',
                              'NURSERY 3', 'NURSERY 2',
                              'NURSERY 1', 'PRE NURSERY'
                            ].map((item, i) => (
                              <option key={i} value={item}>{item}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Gender
                          </label>
                          <select
                            value={studentInfo.gender}
                            onChange={(e) =>
                              setStudentInfo({ ...studentInfo, gender: e.target.value })
                            }
                            className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>

                      </div>

                       <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            value={studentInfo.dob}
                            onChange={(e)=>setForm({...studentInfo, dob:e.target.value})}
                            className="w-full mt-2 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none"
                          />
                          
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Student ID
                          </label>
                          <input
                            type="text"
                            value={studentInfo.studentId}
                            readOnly
                            className="w-full mt-2 p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none"
                          />
                          
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-indigo-600 mb-3">
                      Guardian Information
                    </h3>

                    <div className="space-y-4">

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Guardian Name
                        </label>
                        <input
                          type="text"
                          value={studentInfo.guardianName}
                          placeholder="Enter guardian's full name"
                          onChange={(e) =>
                            setStudentInfo({ ...studentInfo, guardianName: e.target.value })
                          }
                          className="w-full  text-gray-800 mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Relationship
                          </label>
                          <select
                            value={studentInfo.guardianRelationshipStatus}
                            onChange={(e) =>
                              setStudentInfo({
                                ...studentInfo,
                                guardianRelationshipStatus: e.target.value
                              })
                            }
                            className="w-full mt-2 p-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                          >
                            <option value="Parent">Parent</option>
                            <option value="Relation">Relation</option>
                            <option value="Guardian">Guardian</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={studentInfo.guardianContact}
                            placeholder="Phone number"
                            onChange={(e) =>
                              setStudentInfo({ ...studentInfo, guardianContact: e.target.value })
                            }
                            className="w-full mt-2 p-3  text-gray-800 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                          />
                        </div>

                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <input
                          type="text"
                          value={studentInfo.address}
                          onChange={(e) =>
                            setStudentInfo({ ...studentInfo, address: e.target.value })
                          }
                          placeholder="Enter home address"
                          className="w-full mt-2 p-3 border  text-gray-800 border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-indigo-600 mb-3">
                      Student Profile Photo
                    </h3>

                    <div className="flex items-center gap-4">

                      {profileUrl ? (
                        <img
                          src={profileUrl ? profileUrl : studentInfo?.image?.prfileImage}
                          alt="Student profile"
                          className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                          👤
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;

                            setStudentInfo({ ...studentInfo, profileImage: file });

                            if (file) {
                              setProfileUrl(URL.createObjectURL(file));
                            }
                          }}
                          className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 file:font-medium"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                          Upload a clear student photograph (JPG or PNG).
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Sticky Footer */}
                <div className="px-5 sm:px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">

                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium transition"
                  >
                    {loading ? "Saving..." : "Save Change"}
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
