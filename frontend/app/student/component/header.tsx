import { Bell, Menu } from 'lucide-react'
import React from 'react'
type Student = {
  profileImage:string,
  firstName:string
   setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function Header({firstName, profileImage, setMenuOpen}:Student) {
  return (
    <div>
         {/* Topbar */}
              <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-5 sm:px-8 sticky top-0 z-30">
      
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMenuOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
                  >
                    <Menu size={22} />
                  </button>
      
                  <div>
                    <h2 className="font-semibold text-lg text-slate-900">Dashboard</h2>
                    <p className="text-xs text-slate-400 hidden sm:block">
                      Welcome to your student portal
                    </p>
                  </div>
                </div>
      
                <div className="flex items-center gap-4">
                  <button className="relative p-2.5 rounded-xl bg-slate-50 text-slate-500">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                  </button>
      
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Student"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </header>
    </div>
  )
}

export default Header