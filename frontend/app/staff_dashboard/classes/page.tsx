
"use client";

import { useEffect, useState, type FormEvent } from "react";

import {Plus, Search, BookOpen, Layers, Users, X, Pencil, Trash2} from "lucide-react";
import Header from "../component/header";
import Navigation from "../component/navigation";

type Subject = {
  _id: number;
  subjectName: string;
  code: string;
  classes: string[];
  teacher: string;
};



const availableClasses = [
  "SS 3", "SS 2", "SS 1",
  "JSS 3", "JSS 2", "JSS 1",
  'BASIC 6', 'BASIC 5', 'BASIC 4', 'BASIC 3', 'BASIC 2', 'BASIC 1',
  'NURSERY 3', 'NURSERY 2', 'NURSERY 1', 'PRE NURSERY'
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [active, setActive] = useState("Subjects");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    subjectName: "",
    code: "",
    teacher: "",
    classes: [] as string[],
  });

  useEffect(()=>{
    async function getSubject(){
      try{
        setLoading(true)
        const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/subject`)
        if(!result.ok){
          setMessage('somthing went wrong')
          return
        }
        const {subject} = await result.json()
        setSubjects(subject)
      }catch(err){
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
    getSubject()
  }, [])

 
  const filteredSubjects = subjects?.filter((subject) =>
    subject.subjectName.toLowerCase().includes(search.toLowerCase()) ||
    subject.code.toLowerCase().includes(search.toLowerCase())
  );
   const totalAssignments = subjects.reduce(
    (total, subject) => total + subject.classes.length,
    0
  );


  function toggleClass(className: string) {
    setForm((prev) => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter((item) => item !== className)
        : [...prev.classes, className],
    }));
  }

  async function addSubject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try{
       const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/subject`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
       })
       if(!result.ok){
        setMessage('something went wrong try agian')
        return
       }
       const {subject} = await result.json()
      setSubjects((prev) => [
      ...prev,
      subject
    ]);

    setForm({
      subjectName: "",
      code: "",
      teacher: "",
      classes: [],
    });
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
    setShowModal(false);
  }

  async function deleteSubject(_id: number) {
    if (confirm("Are you sure you want to delete this subject?")) {
      try{
        setLoading(true)
        const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/subject/${_id}`, {
          method:"Delete"
        })
        if(!result.ok){
          setMessage("Somthing went wrong try again")
          return
        }
         setSubjects((prev) => prev.filter((item) => item._id !== _id));
      }catch(err){
        console.log(err)
        setMessage('server error')
      }finally{
        setLoading(false)
      }
     
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:ml-64">
        <Header
          active={active}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-4 md:p-8 space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Subject Management
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage school subjects and assign them to classes.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Subject
            </button>
          </div>

          {/* Statistics */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <StatCard
              title="Total Subjects"
              value={subjects ? subjects.length : 0}
              icon={<BookOpen size={22} />}
              color="bg-indigo-100 text-indigo-600"
            />

            <StatCard
              title="Class Assignments"
              value={totalAssignments}
              icon={<Layers size={22} />}
              color="bg-green-100 text-green-600"
            />

            <StatCard
              title="Assigned Teachers"
              value={new Set(subjects?.map((s) => s.teacher).filter(Boolean)).size || 0}
              icon={<Users size={22} />}
              color="bg-orange-100 text-orange-600"
            />
          </div>

          {/* Subjects table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="relative max-w-md">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search subjects or subject code..."
                  className="w-full pl-10 pr-4 py-3  text-gray-800 bg-gray-50 border rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Subject Code</th>
                    <th className="px-6 py-4">Assigned Classes</th>
                    <th className="px-6 py-4">Subject Teacher</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredSubjects?.map((subject) => (
                    <tr key={subject._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <BookOpen size={19} />
                          </div>
                          <span className="font-semibold text-gray-800">
                            {subject.subjectName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {subject.code}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {subject.classes.map((className) => (
                            <span
                              key={className}
                              className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs"
                            >
                              {className}
                            </span>
                          ))}
                          {subject.classes.length === 0 && (
                            <span className="text-xs text-gray-400">
                              No class assigned
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {subject.teacher || "Not assigned"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            title="Delete subject"
                            onClick={() => deleteSubject(subject._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredSubjects.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-500">
                        No subjects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-5 border-t text-sm text-gray-500">
              Showing {filteredSubjects.length} subjects
            </div>
          </div>

          {/* Add Subject Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      Add New Subject
                    </h3>
                    <p className="text-sm text-gray-500">
                      Enter subject details and select classes.
                    </p>
                  </div>
                  <button onClick={() => setShowModal(false)}>
                    <X />
                  </button>
                </div>

                <form onSubmit={addSubject} className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium  text-black">Subject Name</label>
                    <input
                      required
                      value={form.subjectName}
                      onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                      placeholder="e.g. Mathematics"
                      className="w-full  mt-2 p-3 border text-black rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-black">Subject Code</label>
                    <input
                      required
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="e.g. MTH101"
                      className="w-full mt-2 p-3 border  text-black rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-black">Subject Teacher</label>
                    <input
                      value={form.teacher}
                      onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                      placeholder="Enter teacher's name"
                      className="w-full mt-2 p-3 border  text-black rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-black">
                      Assign to Classes
                    </label>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {availableClasses.map((className) => (
                        <label
                          key={className}
                          className="flex  text-black items-center gap-2 p-3 border rounded-xl text-sm cursor-pointer hover:bg-indigo-50"
                        >
                          <input
                            type="checkbox"
                            checked={form.classes.includes(className)}
                            onChange={() => toggleClass(className)}
                            className="accent-indigo-600"
                          />
                          {className}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-3 border rounded-xl text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 bg-indigo-600 text-white rounded-xl"
                    >
                      Save Subject
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
          <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
}
