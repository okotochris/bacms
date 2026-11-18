'use client'

import { Bell, ChevronDown, Menu, Search } from "lucide-react"


export default function Header({ active, setSidebarOpen }: { active: string; setSidebarOpen: (open: boolean) => void }) {
 
  return (
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-100 bg-white/90 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{active}</h2>
              <p className="hidden text-xs text-slate-400 sm:block">
                School Administration / {active}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Search anything..."
                className="w-36 bg-transparent text-xs outline-none placeholder:text-slate-400"
              />
              <span className="rounded bg-white px-1.5 py-0.5 text-[10px] text-slate-400">⌘ K</span>
            </div>
            <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </button>
            <button className="hidden items-center gap-2 text-xs font-medium sm:flex">
              2026/2027 Session
              <ChevronDown size={15} />
            </button>
          </div>
        </header>
    )
}