import { BookOpen, CalendarDays, ClipboardList, GraduationCap, LayoutDashboard, LogOut, Megaphone, UserRound, Wallet, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

type NavigationProps = {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  firstName: string;
  fullname: string;
};


function Navigation({
  menuOpen,
  setMenuOpen,
  firstName,
  fullname
}: NavigationProps) {
  const router = useRouter()
const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, url:'/student', active: true },
    { name: "My Profile", icon: UserRound, url:'/student/profile' },
    { name: "My Results", icon: BookOpen, url:'/student/result' },
    // { name: "Assignments", icon: ClipboardList },
    // { name: "Timetable", icon: CalendarDays },
    // { name: "Announcements", icon: Megaphone },
    { name: "School Fees", icon: Wallet, url:'/student/fees' },
  ];

  return (
    <div>
          {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ${
        menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>

        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <GraduationCap size={23} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900">MySchoolResult</h1>
            <p className="text-xs text-slate-400">Student Portal</p>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="ml-auto lg:hidden text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Menu
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`${item.url}`)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  item.active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                <item.icon size={19} />
                {item.name}
                {item.active && (
                  <span className="ml-auto w-2 h-2 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-5 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{fullname}</p>
              <p className="text-xs text-slate-400">Student</p>
            </div>
          </div>

          <button
            onClick={() => {
              sessionStorage.removeItem("student");
              window.location.href = "/student/login";
            }}
            className="mt-5 w-full flex items-center gap-3 px-3 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </div>
  )
}

export default Navigation