
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  UserRound,
  IdCard,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  BookOpen,
} from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [showStudentId, setShowStudentId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !studentId.trim()) {
      setError("Please enter your full name and student ID.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          studentId: studentId.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid student details.");
      }

      router.push("/student/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* School Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200 mb-4">
            <GraduationCap size={35} />
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            School<span className="text-blue-600">Portal</span>
          </h1>

          <p className="text-slate-500 mt-2">
            Student Learning Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-7 sm:p-9">

          <div className="mb-7">
            <div className="flex items-center gap-2 text-blue-600 mb-3">
              <BookOpen size={20} />
              <span className="text-sm font-semibold">
                STUDENT ACCESS
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              Student Login
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Enter your registered full name and student ID to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Student ID
              </label>

              <div className="relative">
                <IdCard
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showStudentId ? "text" : "password"}
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter your student ID"
                  autoComplete="off"
                  required
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowStudentId(!showStudentId)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showStudentId ? "Hide student ID" : "Show student ID"}
                >
                  {showStudentId ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-blue-200"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login to Student Portal
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          {/* Help */}
          <div className="mt-7 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Having trouble logging in?
            </p>

            <p className="text-sm text-blue-600 font-medium mt-1">
              Please contact your school administrator.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-7">
          © {new Date().getFullYear()} SchoolPortal. All rights reserved.
        </p>

      </div>
    </main>
  );
}
