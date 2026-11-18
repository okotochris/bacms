
"use client";

import {
  BookOpen,
  CalendarDays,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MoreHorizontal,
  Receipt,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Staff = {
  fullname:string,
}
type NavigationProps = {
  active: string;
  setActive: (value: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
};

export default function Navigation({active, setActive, sidebarOpen, setSidebarOpen,}: NavigationProps) {
   const [user, setUser] = useState<Staff | null>(null);
    const router = useRouter();
    useEffect(()=>{
     async function getUser(){
       const savedUser = sessionStorage.getItem('user');
      if(!savedUser){
        router.push('/login')
        return;
      }
      const user = JSON.parse(savedUser);
      setUser(user)
     }
     getUser()
    }, []) 
  const navGroups = [
    {
      label: "MAIN MENU",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, link: "/staff_dashboard" },
        { name: "Students", icon: Users, link: "/staff_dashboard/students" },
        { name: "Classes & Subjects", icon: BookOpen, link: "/staff_dashboard/classes" },
        { name: "Teachers", icon: GraduationCap, link: "/staff_dashboard/teachers" },
      ],
    },
    {
      label: "ACADEMIC",
      items: [
        { name: "Result Management", icon: FileText, link: "/staff_dashboard/results" },
        { name: "Examinations", icon: CalendarDays, link: "/staff_dashboard/examinations" },
      ],
    },
    {
      label: "FINANCE",
      items: [
        { name: "School Fees", icon: Wallet, link: "/staff_dashboard/fees" },
        { name: "Payments", icon: CreditCard, link: "/staff_dashboard/payments" },
        { name: "Fee Structure", icon: Receipt, link: "/staff_dashboard/fee-structure" },
      ],
    },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
          <Link 
            href='/'
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <img src="/bacms_logo.png" alt="Logo" className="h-6 w-6" />
          </Link>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {user?.fullname.split(' ')[0] || 'User'}
            </h1>
            <p className="text-[11px] text-slate-400">
              welcome to School portal
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-7">
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.5px] text-slate-400">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const selected = active === item.name;

                  return (
                    <Link
                      key={item.name}
                      
                      href={item.link}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${
                        selected
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon size={18} />
                      {item.name}

                      {selected && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 p-4">
          <Link
            href="/staff_dashboard/settings"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-50"
          >
            <Settings size={18} />
            Settings
          </Link>

          <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              AD
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">
                Admin User
              </p>
              <p className="text-[11px] text-slate-400">
                Administrator
              </p>
            </div>

            <MoreHorizontal size={18} className="text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
