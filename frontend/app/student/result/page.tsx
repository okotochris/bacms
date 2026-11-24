
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, GraduationCap, TrendingUp, Award, Target, FileText, BarChart3, ChevronDown, Trophy,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import Navigation from "../component/navigation";
import Header from "../component/header";

type Student = {
  fullname?: string;
  studentName?: string;
  studentId?: string;
  className?: string;
  image?: {
    profileImage?: string;
  };
};

type SubjectResult = {
  subject: string;
  score: number;
  grade: string;
  remark?: string;
};

type StudentResult = {
  _id?: string;
  term: string;
  session: string;
  className?: string;
  subjects: SubjectResult[];
  totalScore?: number;
  average?: number;
  position?: string | number;
  overallGrade?: string;
  overallRemark?: string;
};

type InfoCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

function InfoCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: InfoCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">
            {value}
          </h3>
        </div>

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={23} />
        </div>
      </div>

      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}

export default function Results() {
  const [student, setStudent] = useState<Student | null>(null);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("My Results");
  const [selectedTerm, setSelectedTerm] = useState("");

useEffect(() => {
  const controller = new AbortController();

  const loadData = async () => {
    try {
      // Student profile still comes from localStorage (set at login)
      const storedStudent = localStorage.getItem("student");
      if (storedStudent) {
        setStudent(JSON.parse(storedStudent));
      }

      const token = localStorage.getItem("token"); // adjust to your key name

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/student/result`,
        {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          // credentials: "include", // uncomment if you use cookie-based auth
        }
      );

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      // Accept either an array or { results: [...] } / { data: [...] }
      const list = Array.isArray(data)
        ? data
        : data.results || data.data || [];

      if (Array.isArray(list)) {
        setResults(list);
      }
    } catch (error) {
      
        console.error("Unable to load student results");
      
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  loadData();

  return () => controller.abort();
}, []);
  const fullname =
    student?.fullname || student?.studentName || "Student";

  const firstName = fullname.trim().split(/\s+/)[0] || "Student";

  const navigateTo = (page: string) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  // Available terms
  const terms = useMemo(() => {
    return Array.from(
      new Set(results.map((result) => `${result.term} - ${result.session}`))
    );
  }, [results]);

  // Select the latest available term by default
  useEffect(() => {
    if (terms.length > 0 && !terms.includes(selectedTerm)) {
      setSelectedTerm(terms[terms.length - 1]);
    }
  }, [terms, selectedTerm]);

  // Results for the selected term
  const currentResult = useMemo(() => {
    return results.find(
      (result) => `${result.term} - ${result.session}` === selectedTerm
    );
  }, [results, selectedTerm]);

  const subjects = currentResult?.subjects || [];

  // Calculate statistics
  const totalSubjects = subjects.length;

  const calculatedTotal = subjects.reduce(
    (sum, subject) => sum + Number(subject.score || 0),
    0
  );

  const average =
    totalSubjects > 0
      ? calculatedTotal / totalSubjects
      : 0;

  const highestScore =
    totalSubjects > 0
      ? Math.max(...subjects.map((subject) => Number(subject.score || 0)))
      : 0;

  const lowestScore =
    totalSubjects > 0
      ? Math.min(...subjects.map((subject) => Number(subject.score || 0)))
      : 0;

  const passedSubjects = subjects.filter(
    (subject) => Number(subject.score) >= 40
  ).length;

  const performanceData = subjects.map((subject) => ({
    subject: subject.subject,
    score: Number(subject.score || 0),
  }));

  // Calculate average performance across available terms
  const trendData = useMemo(() => {
    return results.map((result) => {
      const subjectCount = result.subjects?.length || 0;

      const total = (result.subjects || []).reduce(
        (sum, subject) => sum + Number(subject.score || 0),
        0
      );

      return {
        term: result.term,
        session: result.session,
        label: `${result.term.replace(" TERM", "")} ${result.session}`,
        average:
          subjectCount > 0
            ? Number((total / subjectCount).toFixed(1))
            : 0,
      };
    });
  }, [results]);

  if (loading) {
    return (
      <div className="light min-h-screen flex items-center justify-center bg-slate-50 [color-scheme:light]">
        <div className="text-center">
          <div className="w-9 h-9 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="light min-h-screen flex items-center justify-center bg-slate-50 [color-scheme:light]">
        <div className="text-center">
          <GraduationCap size={40} className="mx-auto text-indigo-500 mb-3" />
          <h2 className="font-bold text-slate-800">
            Student information not found
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Please log in again to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="light min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-50 dark:text-slate-800 [color-scheme:light]">

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Navigation */}
         <Navigation
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            firstName={firstName}
            fullname={fullname}
            
          />

      <main className="lg:ml-64 min-h-screen">

        {/* Header */}
        <Header
          firstName={firstName}
          profileImage={student.image?.profileImage || ""}
          setMenuOpen={setMenuOpen}
        />

        <div className="max-w-7xl mx-auto p-5 sm:p-8 space-y-7">

          {/* Page Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                My Results
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Track your academic performance and progress.
              </p>
            </div>

            {terms.length > 0 && (
              <div className="relative">
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="appearance-none w-full sm:w-auto min-w-[190px] bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {terms.map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            )}
          </div>

          {/* Empty State */}
          {results.length === 0 || !currentResult ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-10 sm:p-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
                <BookOpen size={30} className="text-indigo-600" />
              </div>

              <h2 className="text-lg font-bold text-slate-800">
                No Results Available
              </h2>

              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                Your academic results have not been published yet.
                Once your school publishes your results, they will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Result Overview */}
              <section className="relative overflow-hidden bg-gradient-to-r from-indigo-700 to-blue-600 rounded-2xl p-6 sm:p-8 text-white">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-indigo-100 text-sm mb-3">
                    <GraduationCap size={18} />
                    Academic Performance
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {currentResult.term}
                  </h2>

                  <p className="text-indigo-100 text-sm mt-1">
                    Academic Session: {currentResult.session}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-8">
                    <div>
                      <p className="text-xs text-indigo-200">
                        Average Score
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        {average.toFixed(1)}%
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs text-indigo-200">
                        Overall Grade
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        {currentResult.overallGrade || "N/A"}
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs text-indigo-200">
                        Position
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        {currentResult.position || "N/A"}
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs text-indigo-200">
                        Subjects
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        {totalSubjects}
                      </h3>
                    </div>
                  </div>
                </div>

                <GraduationCap
                  size={190}
                  className="absolute -right-8 -bottom-12 text-white/10"
                />
              </section>

              {/* Statistics Cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <InfoCard
                  title="Average Score"
                  value={`${average.toFixed(1)}%`}
                  description="Your average across all subjects"
                  icon={TrendingUp}
                  color="bg-blue-50 text-blue-600"
                />

                <InfoCard
                  title="Highest Score"
                  value={`${highestScore}%`}
                  description="Your best subject performance"
                  icon={Trophy}
                  color="bg-emerald-50 text-emerald-600"
                />

                <InfoCard
                  title="Lowest Score"
                  value={`${lowestScore}%`}
                  description="Subject that needs more attention"
                  icon={Target}
                  color="bg-orange-50 text-orange-600"
                />

                <InfoCard
                  title="Subjects Passed"
                  value={`${passedSubjects}/${totalSubjects}`}
                  description="Based on a 40% pass mark"
                  icon={Award}
                  color="bg-purple-50 text-purple-600"
                />

              </section>

              {/* Subject Performance Graph */}
              <section className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-7">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Subject Performance
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Your scores across different subjects
                    </p>
                  </div>

                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
                    {selectedTerm}
                  </span>
                </div>

                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E2E8F0"
                      />

                      <XAxis
                        dataKey="subject"
                        tick={{ fill: "#64748B", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        height={65}
                      />

                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#94A3B8", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        formatter={(value) => [`${value}%`, "Score"]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #E2E8F0",
                          fontSize: "12px",
                        }}
                      />

                      <Bar
                        dataKey="score"
                        fill="#4F46E5"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={48}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Performance Trend */}
              <section className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-7">
                <div className="mb-7">
                  <h2 className="font-bold text-slate-900">
                    Academic Progress
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Your average performance across published terms
                  </p>
                </div>

                {trendData.length > 1 ? (
                  <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E2E8F0"
                        />

                        <XAxis
                          dataKey="label"
                          tick={{ fill: "#64748B", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          domain={[0, 100]}
                          tick={{ fill: "#94A3B8", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          formatter={(value) => [`${value}%`, "Average"]}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #E2E8F0",
                            fontSize: "12px",
                          }}
                        />

                        <Line
                          type="monotone"
                          dataKey="average"
                          stroke="#4F46E5"
                          strokeWidth={3}
                          dot={{
                            r: 5,
                            fill: "#4F46E5",
                            strokeWidth: 2,
                            stroke: "#fff",
                          }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-center">
                    <BarChart3 size={32} className="text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-600">
                      Not enough performance history
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Your progress graph will appear when more term results are available.
                    </p>
                  </div>
                )}
              </section>

              {/* Subject Result Table */}
              <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-7 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <FileText size={21} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Subject Results
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Detailed breakdown of your scores
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-slate-50">
                      <tr className="text-xs text-slate-500">
                        <th className="px-6 py-4 font-semibold">Subject</th>
                        <th className="px-6 py-4 font-semibold">Score</th>
                        <th className="px-6 py-4 font-semibold">Grade</th>
                        <th className="px-6 py-4 font-semibold">Remark</th>
                      </tr>
                    </thead>

                    <tbody>
                      {subjects.map((subject, index) => (
                        <tr
                          key={`${subject.subject}-${index}`}
                          className="border-t border-slate-100 hover:bg-slate-50/70 transition"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                            {subject.subject}
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-800">
                              {subject.score}%
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
                              {subject.grade || "N/A"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-500">
                            {subject.remark || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Overall Summary */}
                <div className="border-t border-slate-100 p-5 sm:p-6 bg-slate-50">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    <div>
                      <p className="text-xs text-slate-400">
                        Total Score
                      </p>
                      <p className="text-lg font-bold text-slate-800 mt-1">
                        {calculatedTotal}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Average
                      </p>
                      <p className="text-lg font-bold text-indigo-600 mt-1">
                        {average.toFixed(1)}%
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Overall Remark
                      </p>
                      <p className="text-sm font-bold text-slate-800 mt-2">
                        {currentResult.overallRemark || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Footer */}
          <footer className="text-center text-xs text-slate-400 pt-3 pb-5">
            Your academic progress matters.
            <p className="mt-1">Powered by MySchoolResult</p>
          </footer>

        </div>
      </main>
    </div>
  );
}
