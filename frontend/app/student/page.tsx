
"use client";

import { useEffect, useState } from "react";
import {

  BookOpen,
  ClipboardList,
  CalendarDays,

  UserRound,

  GraduationCap,
  Clock,
  ChevronRight,
  FileText,
  Wallet,
  Megaphone,
  School
} from "lucide-react";
import Navigation from "./component/navigation";
import Header from "./component/header";


type Student = {
  fullname?: string;
  studentName?: string;
  studentId?: string;
  admissionNo?: string;
  className?: string;
  gender?: string;
  image:{
    profileImage:string
  }
  schoolName?: string;
  schoolLogo?: string;
};

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");

    if (storedStudent) {
      try {
        setStudent(JSON.parse(storedStudent));
      } catch (error) {
        console.error("Invalid student session", error);
      }
    }
  }, []);

  const fullname = student?.fullname || student?.studentName || "Student";
  const firstName = fullname.split(" ")[0];


  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <GraduationCap size={40} className="mx-auto text-indigo-600 mb-3" />
          <p className="text-gray-500">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

   <Navigation
    menuOpen={menuOpen}
    setMenuOpen={setMenuOpen}
    firstName={firstName}
    fullname={fullname}
  />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">

      <Header 
        firstName={firstName}
        profileImage= {student.image.profileImage}
        setMenuOpen={setMenuOpen}
      />

        <div className="p-5 sm:p-8 max-w-7xl mx-auto">

          {/* Welcome Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 to-blue-600 p-6 sm:p-8 text-white mb-8">
            <div className="relative z-10 max-w-xl">
              <p className="text-indigo-100 text-sm mb-2">
                Welcome back,
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3">
                Hello, {firstName}! 👋
              </h1>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Stay focused, keep learning and track your academic progress.
                Your journey to excellence starts here.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-4 py-2 rounded-lg bg-white/15 text-sm">
                  {student.className || "Class not set"}
                </span>
                <span className="px-4 py-2 rounded-lg bg-white/15 text-sm">
                  ID: {student.studentId || "N/A"}
                </span>
              </div>
            </div>

            <GraduationCap
              size={180}
              className="absolute -right-5 -bottom-10 text-white/10"
            />
          </section>

          {/* Student Information */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

            {[
              {
                title: "Student Name",
                value: fullname,
                icon: UserRound,
                color: "bg-blue-50 text-blue-600"
              },
              {
                title: "Admission Number",
                value: student.admissionNo || "N/A",
                icon: FileText,
                color: "bg-purple-50 text-purple-600"
              },
              {
                title: "Current Class",
                value: student.className || "N/A",
                icon: School,
                color: "bg-emerald-50 text-emerald-600"
              }
            ].map((item) => (
              <div key={item.title} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 mb-1">{item.title}</p>
                  <p className="font-semibold text-slate-800 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Quick Access */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-lg text-slate-900">Quick Access</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Access your academic activities
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

              {[
                { title: "My Results", desc: "View your academic results", icon: BookOpen, color: "text-blue-600 bg-blue-50" },
                { title: "Assignments", desc: "Check pending tasks", icon: ClipboardList, color: "text-purple-600 bg-purple-50" },
                { title: "Timetable", desc: "View class schedule", icon: CalendarDays, color: "text-emerald-600 bg-emerald-50" },
                { title: "Announcements", desc: "Latest school updates", icon: Megaphone, color: "text-orange-600 bg-orange-50" },
                { title: "School Fees", desc: "Check fee information", icon: Wallet, color: "text-pink-600 bg-pink-50" },
                { title: "My Profile", desc: "Manage your details", icon: UserRound, color: "text-indigo-600 bg-indigo-50" },
              ].map((item) => (
                <button
                  key={item.title}
                  className="bg-white border border-slate-100 rounded-2xl p-5 text-left hover:shadow-md hover:border-indigo-100 transition group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                    <item.icon size={23} />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="flex justify-end mt-3 text-slate-300 group-hover:text-indigo-600">
                    <ChevronRight size={18} />
                  </div>
                </button>
              ))}

            </div>
          </section>

          {/* Bottom Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Academic Reminder</h3>
                  <p className="text-xs text-slate-400">Stay organized</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Remember to check your assignments, keep up with your timetable
                and regularly monitor your academic results.
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Keep Learning!</h3>
                  <p className="text-xs text-slate-400">A message for you</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Success comes from consistency. Stay curious, work hard and
                make every learning opportunity count.
              </p>
            </div>

          </section>

          <footer className="text-center text-xs text-slate-400 mt-10 pb-5">
            Powered by MySchoolResult
          </footer>

        </div>
      </main>
    </div>
  );
}
