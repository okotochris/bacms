
"use client";

import { useEffect, useState } from "react";
import Navigation from "./component/navigation";
import Header from "./component/header";
import { ArrowUpRight, CalendarDays, ChartNoAxesCombined, ChevronDown, CreditCard, FileText, MoreHorizontal, Plus, Receipt, Users, Wallet } from "lucide-react";



const activities = [
  { title: "New student registered", description: "John Samuel - JSS 1A", time: "10 minutes ago", color: "bg-blue-500" },
  { title: "Fee payment received", description: "₦85,000 from David Johnson", time: "35 minutes ago", color: "bg-emerald-500" },
  { title: "Results published", description: "First Term - JSS 3", time: "2 hours ago", color: "bg-purple-500" },
  { title: "New examination created", description: "First Term Examination", time: "Yesterday", color: "bg-orange-500" },
];

type Payment = {
  id: string;
  name: string;
  amount: string;
  status: string;
  createdAt: string;
  studentClass: string;
  outstandingFees:number;
};
type Student = {
  id: string;
  name: string;
  class: string;
  outstandingFees: number;
};


export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [student, setStudent] = useState<Student[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    async function getDashboardDetails(){
        try{
            setLoading(true)
            const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/dashboard`)
            if(!result.ok){
                setMessage('somthing went wrong try again')
                return
            }
            const {students, payments, results, message} = await result.json()
            setStudent(students)
            setPayments(payments)
            setResults(results)
            setMessage(message)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }
    getDashboardDetails()
  }, [])

  //CALCULATE TOTAL REVENUE AND OUTSTANDING FEES
  const totalRevenue = payments.reduce((acc, payment) => acc + parseFloat(payment.amount.replace(/[^0-9.-]+/g,"")), 0);
  const outstandingFees = student.reduce((acc, student) => acc + Number(student.outstandingFees || 0), 0);
  const stats = [
  {
    title: "Total Students",
    value: student.length,
    change: "+12.5%",
    positive: true,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Total Revenue",
    value: `₦${totalRevenue.toLocaleString()}`,
    change: "+8.2%",
    positive: true,
    icon: Wallet,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Outstanding Fees",
    value: `₦${outstandingFees.toLocaleString()}`,
    change: "-4.3%",
    positive: true,
    icon: CreditCard,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Results Published",
    value: results.length,
    change: "+5.4%",
    positive: true,
    icon: FileText,
    color: "bg-purple-50 text-purple-600",
  },
];
  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <Navigation
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="min-h -screen lg:ml-[260px]">
        <Header
          active={active}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Your dashboard content goes here */}

        <div className="mx-auto max-w-[1600px] space-y-7 p-5 sm:p-8">
          {/* Welcome */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Good afternoon, Admin 👋
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Here is what is happening with your school today.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                <CalendarDays size={16} />
                Nov 12, 2026
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                <Plus size={16} />
                Add New Student
              </button>
            </div>
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <div className={`rounded-xl p-2.5 ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <h3 className="text-[27px] font-bold tracking-tight text-slate-900">{stat.value}</h3>
                    <span className="mb-1 flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                      <ArrowUpRight size={13} />
                      {stat.change}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">Compared to last term</p>
                </div>
              );
            })}
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Revenue Overview</h3>
                  <p className="mt-1 text-xs text-slate-400">School fee collections throughout the year</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">
                  This year <ChevronDown size={14} />
                </button>
              </div>

              <div className="mt-7 flex items-end gap-3">
                <h3 className="text-3xl font-bold text-slate-900">{totalRevenue.toLocaleString()}</h3>
                <span className="mb-1 text-xs font-semibold text-emerald-600">+8.2%</span>
              </div>

              <div className="mt-8 flex h-48 items-end justify-between gap-2 border-b border-slate-100 pb-0">
                {[
                  ["Jan", 42], ["Feb", 60], ["Mar", 48], ["Apr", 75],
                  ["May", 57], ["Jun", 88], ["Jul", 67], ["Aug", 78],
                  ["Sep", 53], ["Oct", 95], ["Nov", 82], ["Dec", 45],
                ].map(([month, height]) => (
                  <div key={month} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <div
                      className="w-full max-w-[34px] rounded-t-md bg-indigo-100 transition hover:bg-indigo-500"
                      style={{ height: `${height}%` }}
                    />
                    <span className="pb-2 text-[10px] text-slate-400">{month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee breakdown */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">Fee Collection Status</h3>
              <p className="mt-1 text-xs text-slate-400">Current academic session</p>

              <div className="relative mx-auto mt-8 flex h-48 w-48 items-center justify-center">
                <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                  <circle cx="100" cy="100" r="75" fill="none" stroke="#f1f5f9" strokeWidth="18" />
                  <circle
                    cx="100" cy="100" r="75" fill="none" stroke="#4f46e5"
                    strokeWidth="18" strokeDasharray="471" strokeDashoffset="118"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold text-slate-900">75%</p>
                  <p className="text-[11px] text-slate-400">Collected</p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> Paid
                  </span>
                  <span className="font-bold text-slate-800">75%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Outstanding
                  </span>
                  <span className="font-bold text-slate-800">25%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
              <p className="mt-1 text-xs text-slate-400">Frequently used school management tools</p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { title: "Enter Results", desc: "Record student scores", icon: FileText, color: "bg-purple-50 text-purple-600", url: "/staff_dashboard/results" },
                { title: "Record Payment", desc: "Add school fee payment", icon: CreditCard, color: "bg-emerald-50 text-emerald-600", url: "/staff_dashboard/record_payment" },
                { title: "Generate Report", desc: "Print student report cards", icon: ChartNoAxesCombined, color: "bg-blue-50 text-blue-600", url: "/staff_dashboard/generate_report" },
                { title: "Fee Structure", desc: "Manage school fees", icon: Receipt, color: "bg-orange-50 text-orange-600", url: "/staff_dashboard/fee-structure" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button 
                    onClick={() => window.location.href = action.url}
                    key={action.title} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                    <div className={`rounded-xl p-3 ${action.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{action.title}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{action.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Bottom content */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {/* Payments table */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Fee Payments</h3>
                  <p className="mt-1 text-xs text-slate-400">Latest transactions from students</p>
                </div>
                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">View all</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Student", "Class", "Amount", "Date", "Status"].map((heading) => (
                        <th key={heading} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-t border-slate-50 hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <p className="text-xs font-semibold text-slate-800">{payment.name}</p>
                          <p className="mt-1 text-[10px] text-slate-400">{payment.id}</p>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">{payment.studentClass}</td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-800">{payment.amount}</td>
                        <td className="px-5 py-4 text-xs text-slate-500">{payment.createdAt}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            payment.status === "Paid"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-orange-50 text-orange-600"
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activities */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Activities</h3>
                  <p className="mt-1 text-xs text-slate-400">Latest school updates</p>
                </div>
                <MoreHorizontal size={19} className="text-slate-400" />
              </div>
              <div className="mt-6 space-y-6">
                {activities.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${activity.color}`} />
                      {index !== activities.length - 1 && <span className="mt-2 h-10 w-px bg-slate-100" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{activity.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{activity.description}</p>
                      <p className="mt-1.5 text-[10px] text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">
                View all activities
              </button>
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-[11px] text-slate-400 sm:flex-row">
            <p>© 2026 EduManage. All rights reserved.</p>
            <p>School Management System · Academic Session 2026/2027</p>
          </footer>
        </div>
     
      </main>
    </div>
  );
}
