
"use client";

import { useEffect, useState } from "react";
import {
  UserRound,
  Phone,
  MapPin,
  GraduationCap,
  IdCard,
  Users,
  Mail,
  CalendarDays,
} from "lucide-react";
import Navigation from "../component/navigation";
import Header from "../component/header";

type Student = {
  fullname?: string;
  studentName?: string;
  studentId?: string;
  admissionNo?: string;
  className?: string;
  gender?: string;
  address?: string;
  guardianName?: string;
  guardianContact?: string;
  guardianRelationshipStatus?: string;
  email?: string;
  dateOfBirth?: string;
  image?: {
    profileImage?: string;
  };
  schoolName?: string;
  schoolLogo?: string;
};

type InfoItemProps = {
  label: string;
  value?: string;
  icon: React.ElementType;
};

function InfoItem({ label, value, icon: Icon }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 py-4 border-b border-slate-100 last:border-0">
      <div className="w-10 h-10 rounded-xl bg-slate-50 text-indigo-600 flex items-center justify-center shrink-0">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-slate-800 break-words">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default function Profile() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("My Profile");

  useEffect(() => {
    try {
      const storedStudent = localStorage.getItem("student");

      if (storedStudent) {
        setStudent(JSON.parse(storedStudent));
      }
    } catch (error) {
      console.error("Unable to load student information", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fullname =
    student?.fullname || student?.studentName || "Student";

  const firstName = fullname.trim().split(/\s+/)[0] || "Student";

  const navigateTo = (page: string) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="light min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 [color-scheme:light]">
        <div className="text-center">
          <div className="w-9 h-9 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="light min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 [color-scheme:light]">
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
          <UserRound size={35} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">
            Student information not available.
          </p>
        </div>
      </div>
    );
  }

  const profileImage = student.image?.profileImage;

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

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">

        {/* Header */}
        <Header
          firstName={firstName}
          profileImage={profileImage || ""}
          setMenuOpen={setMenuOpen}
        />

        <div className="max-w-7xl mx-auto p-5 sm:p-8 space-y-6">

          {/* Page Heading */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View your personal and academic information.
            </p>
          </div>

          {/* Profile Overview */}
          <div className="bg-white dark:bg-white text-slate-800 border border-slate-100 rounded-2xl overflow-hidden">

            <div className="h-28 bg-gradient-to-r from-indigo-700 to-blue-500" />

            <div className="px-5 sm:px-8 pb-7">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">

                <div className="w-28 h-28 rounded-2xl border-4 border-white bg-indigo-50 overflow-hidden flex items-center justify-center shadow-sm shrink-0">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={fullname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserRound size={45} className="text-indigo-400" />
                  )}
                </div>

                <div className="pb-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    {fullname}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {student.className || "Class not assigned"}
                  </p>
                </div>

                <div className="sm:ml-auto sm:pb-2">
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Student Account
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Academic Information */}
          <section className="bg-white dark:bg-white text-slate-800 border border-slate-100 rounded-2xl p-5 sm:p-7">

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <GraduationCap size={21} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Academic Information
                </h3>
                <p className="text-xs text-slate-400">
                  Your school registration details
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8">
              <InfoItem label="Student ID" value={student.studentId} icon={IdCard} />
              <InfoItem label="Admission Number" value={student.admissionNo} icon={IdCard} />
              <InfoItem label="Current Class" value={student.className} icon={GraduationCap} />
              <InfoItem label="Gender" value={student.gender} icon={UserRound} />
            </div>
          </section>

          {/* Personal Information */}
          <section className="bg-white dark:bg-white text-slate-800 border border-slate-100 rounded-2xl p-5 sm:p-7">

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <UserRound size={21} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Personal Information
                </h3>
                <p className="text-xs text-slate-400">
                  Your personal details
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8">
              <InfoItem label="Full Name" value={fullname} icon={UserRound} />
              <InfoItem label="Email Address" value={student.email} icon={Mail} />
              <InfoItem label="Gender" value={student.gender} icon={Users} />
              <InfoItem label="Date of Birth" value={student.dateOfBirth} icon={CalendarDays} />
              <InfoItem label="Home Address" value={student.address} icon={MapPin} />
            </div>
          </section>

          {/* Guardian Information */}
          <section className="bg-white dark:bg-white text-slate-800 border border-slate-100 rounded-2xl p-5 sm:p-7">

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users size={21} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Guardian Information
                </h3>
                <p className="text-xs text-slate-400">
                  Parent or guardian contact details
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8">
              <InfoItem label="Guardian Name" value={student.guardianName} icon={UserRound} />
              <InfoItem label="Relationship" value={student.guardianRelationshipStatus} icon={Users} />
              <InfoItem label="Phone Number" value={student.guardianContact} icon={Phone} />
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-xs text-slate-400 pb-5">
            Your profile information is managed by your school.
            <p className="mt-1">Powered by MySchoolResult</p>
          </div>

        </div>
      </main>
    </div>
  );
}
