"use client";

import { useState, useEffect, FormEvent } from "react";
import Header from "../component/header";
import Navigation from "../component/navigation";
import {
  CalendarDays,
  GraduationCap,
  Shield,
  Save,
  Plus,
  Trash2,
  Settings as SettingsIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ----------------------------- Types & constants ----------------------------- */

type Tab = "academic" | "grading" | "account";

type Grade = {
  id: number; // front-end only, used as the React key
  grade: string;
  min: number;
  max: number;
  remark: string;
};

type Academic = {
  session: string;
  term: string;
  startDate: string;
  endDate: string;
  nextTermDate: string;
};

type Account = {
  _id: string;
  fullname: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type Passwords = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type Notice = { type: "success" | "error"; text: string } | null;

const API = process.env.NEXT_PUBLIC_URL ?? "";

// Empty (but defined) values keep every input controlled from the first render
const EMPTY_ACADEMIC: Academic = {
  session: "",
  term: "First Term",
  startDate: "",
  endDate: "",
  nextTermDate: "",
};

const EMPTY_ACCOUNT: Account = { _id: "", fullname: "", email: "", currentPassword:'', newPassword:'', confirmPassword:'' };

const EMPTY_PASSWORDS: Passwords = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

/* --------------------------------- Helpers ---------------------------------- */

async function post<T = { message?: string }>(url: string, body: unknown) {
  const res = await fetch(`${API}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data: { message?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* no JSON body */
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data as T;
}

/** Grades must cover 0-100 with no gaps and no overlaps (whole-number scores). */
function checkGrades(list: Grade[]): string | null {
  if (list.length === 0) return "Add at least one grade.";

  const sorted = [...list].sort((a, b) => a.min - b.min);

  if (sorted[0].min !== 0) return "The lowest grade must start at 0.";
  if (sorted[sorted.length - 1].max !== 100) {
    return "The highest grade must end at 100.";
  }

  for (let i = 0; i < sorted.length; i++) {
    const g = sorted[i];
    const name = g.grade || "A grade";

    if (g.min > g.max) return `${name}: the minimum is higher than the maximum.`;

    if (i > 0) {
      const prev = sorted[i - 1];
      if (g.min <= prev.max) {
        return `${prev.grade || "A grade"} and ${name} overlap.`;
      }
      if (g.min > prev.max + 1) {
        return `There is a gap between ${prev.max} and ${g.min}.`;
      }
    }
  }
  return null;
}

/* ---------------------------------- Page ------------------------------------ */

export default function SettingsPage() {
  const router = useRouter();

  const [active, setActive] = useState("Academic");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("academic");

  const [academic, setAcademic] = useState<Academic>(EMPTY_ACADEMIC);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [account, setAccount] = useState<Account>(EMPTY_ACCOUNT);
  const [passwords, setPasswords] = useState<Passwords>(EMPTY_PASSWORDS);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(""); // which form is saving
  const [notice, setNotice] = useState<Notice>(null);

  /* ------------------------------ Load details -------------------------------- */

  useEffect(() => {
    const saved = sessionStorage.getItem("user");
    if (!saved) {
      router.push("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(saved);
    } catch {
      router.push("/login");
      return;
    }

    if (user.role !== "admin") {
      router.push("/staff_dashboard");
      return;
    }

    setAccount({
      _id: user._id ?? user.id ?? "",
      fullname: user.fullname ?? "",
      email: user.email ?? "",
     currentPassword: user.currentPassword ?? "",
     newPassword: user.newPassword ?? "",
     confirmPassword: user.newPassword ?? "",
    });

    async function load() {
      try {
        const res = await fetch(`${API}/api/all_details`);
        if (!res.ok) throw new Error("Failed to load");

        const data = await res.json();
        setGrades(
          (data.grades ?? []).map((g: Omit<Grade, "id">, i: number) => ({
            ...g,
            id: i + 1,
          }))
        );
        setAcademic({ ...EMPTY_ACADEMIC, ...(data.accademic ?? {}) });
      } catch (err) {
        console.error(err);
        setLoadError("Could not load settings. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  // Auto-hide notices
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  /* -------------------------------- Saving ------------------------------------ */

  /** Runs one save, shows the result, and tracks which form is busy. */
  async function run(name: string, task: () => Promise<string>) {
    setSaving(name);
    try {
      setNotice({ type: "success", text: await task() });
    } catch (err) {
      setNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Could not save.",
      });
    } finally {
      setSaving("");
    }
  }

  const saveAcademic = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    run("academic", async () => {
      const { message } = await post("/api/academic", {
        userId: account._id,
        ...academic,
      });
      return message ?? "Academic settings saved.";
    });
  };

  const saveGrades = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const problem = checkGrades(grades);
    if (problem) {
      setNotice({ type: "error", text: problem });
      return;
    }

    run("grading", async () => {
      const { message } = await post("/api/grades", {
        userId: account._id,
        grades: grades.map(({ grade, min, max, remark }) => ({
          grade,
          min,
          max,
          remark,
        })),
      });
      return message ?? "Grading system saved.";
    });
  };

  const saveProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    run("profile", async () => {
      const { user } = await post<{ user: Account }>("/api/account/profile", {
        userId: account._id,
        fullname: account.fullname,
        email: account.email,
         newPassword: account.newPassword,
        confirmPassword: account.confirmPassword,
        currentPassword: account.currentPassword,
      });

      setAccount((prev) => ({
        ...prev,
        fullname: user.fullname,
        email: user.email,
        newPassword: '',
        confirmPassword: '',
        currentPassword: '',
      }));

      // Keep the logged-in user in sync for the rest of the app
      const saved = sessionStorage.getItem("user");
      if (saved) {
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            ...JSON.parse(saved),
            fullname: user.fullname,
            email: user.email,
          })
        );
      }
      return "Profile updated.";
    });
  };

  const changePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwords.newPassword.length < 8) {
      setNotice({
        type: "error",
        text: "New password must contain at least 8 characters.",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setNotice({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    run("password", async () => {
      await post("/api/account/password", {
        userId: account._id,
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords(EMPTY_PASSWORDS);
      return "Password updated.";
    });
  };

  /* ------------------------------ Grade editing ------------------------------- */

  const updateGrade = (id: number, field: keyof Grade, value: string) => {
    setGrades((previous) =>
      previous.map((grade) =>
        grade.id === id
          ? {
              ...grade,
              [field]:
                field === "min" || field === "max" ? Number(value) : value,
            }
          : grade
      )
    );
  };

  const addGrade = () => {
    setGrades((previous) => [
      ...previous,
      { id: Date.now(), grade: "", min: 0, max: 0, remark: "" },
    ]);
  };

  const removeGrade = (id: number) => {
    setGrades((previous) => previous.filter((grade) => grade.id !== id));
  };

  const menuItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "academic", label: "Academic Settings", icon: <CalendarDays size={18} /> },
    { id: "grading", label: "Grading System", icon: <GraduationCap size={18} /> },
    { id: "account", label: "Account & Security", icon: <Shield size={18} /> },
  ];

  /* --------------------------------- Render ----------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:ml-64">
        <Header active={active} setSidebarOpen={setSidebarOpen} />

        <main className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your school&apos;s information and system preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
            {/* Settings sidebar */}
            <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center gap-2 px-3 py-3">
                <SettingsIcon size={20} className="text-indigo-600" />
                <span className="font-semibold text-gray-900">Settings Menu</span>
              </div>

              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                      tab === item.id
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Settings content */}
            <div className="lg:col-span-3">
              {notice && (
                <div
                  role="status"
                  className={`mb-5 rounded-lg border p-3 text-sm ${
                    notice.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {notice.text}
                </div>
              )}

              {loading && (
                <div className="rounded-xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
                  Loading settings...
                </div>
              )}

              {!loading && loadError && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-10 text-center text-sm text-red-600 shadow-sm">
                  {loadError}
                </div>
              )}

              {/* Academic settings */}
              {!loading && !loadError && tab === "academic" && (
                <form
                  onSubmit={saveAcademic}
                  className="rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <SectionHeading
                    title="Academic Settings"
                    description="Configure the current academic session and term."
                  />

                  <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                    <InputField
                      label="Academic Session"
                      value={academic.session}
                      onChange={(value) =>
                        setAcademic({ ...academic, session: value })
                      }
                      placeholder="2026/2027"
                    />

                    <SelectField
                      label="Current Term"
                      value={academic.term}
                      options={["First Term", "Second Term", "Third Term"]}
                      onChange={(value) =>
                        setAcademic({ ...academic, term: value })
                      }
                    />

                    <InputField
                      label="Term Start Date"
                      type="date"
                      value={academic.startDate}
                      onChange={(value) =>
                        setAcademic({ ...academic, startDate: value })
                      }
                    />

                    <InputField
                      label="Term End Date"
                      type="date"
                      value={academic.endDate}
                      onChange={(value) =>
                        setAcademic({ ...academic, endDate: value })
                      }
                    />

                    <InputField
                      label="Next Term Resumption Date"
                      type="date"
                      value={academic.nextTermDate}
                      onChange={(value) =>
                        setAcademic({ ...academic, nextTermDate: value })
                      }
                    />
                  </div>

                  <SaveButton saving={saving === "academic"} />
                </form>
              )}

              {/* Grading settings */}
              {!loading && !loadError && tab === "grading" && (
                <form
                  onSubmit={saveGrades}
                  className="rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <SectionHeading
                    title="Grading System"
                    description="Customize the grading boundaries used for student results."
                  />

                  <div className="p-6">
                    <div className="mb-4 flex justify-end">
                      <button
                        type="button"
                        onClick={addGrade}
                        className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
                      >
                        <Plus size={16} />
                        Add Grade
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                          <tr>
                            <th className="px-3 py-3">Grade</th>
                            <th className="px-3 py-3">Minimum Score</th>
                            <th className="px-3 py-3">Maximum Score</th>
                            <th className="px-3 py-3">Remark</th>
                            <th className="px-3 py-3">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {grades.map((grade) => (
                            <tr key={grade.id}>
                              <td className="px-3 py-3">
                                <input
                                  required
                                  value={grade.grade}
                                  onChange={(e) =>
                                    updateGrade(grade.id, "grade", e.target.value)
                                  }
                                  className="w-16 rounded-lg border border-gray-200 px-3 py-2"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  required
                                  value={grade.min}
                                  onChange={(e) =>
                                    updateGrade(grade.id, "min", e.target.value)
                                  }
                                  className="w-24 rounded-lg border border-gray-200 px-3 py-2"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  required
                                  value={grade.max}
                                  onChange={(e) =>
                                    updateGrade(grade.id, "max", e.target.value)
                                  }
                                  className="w-24 rounded-lg border border-gray-200 px-3 py-2"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <input
                                  required
                                  value={grade.remark}
                                  onChange={(e) =>
                                    updateGrade(grade.id, "remark", e.target.value)
                                  }
                                  className="w-32 rounded-lg border border-gray-200 px-3 py-2"
                                />
                              </td>
                              <td className="px-3 py-3">
                                <button
                                  type="button"
                                  onClick={() => removeGrade(grade.id)}
                                  aria-label="Remove grade"
                                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="mt-4 text-xs text-gray-500">
                      Ensure grade ranges do not overlap and cover the scores
                      from 0 to 100.
                    </p>
                  </div>

                  <SaveButton saving={saving === "grading"} />
                </form>
              )}

              {/* Account and security */}
              {!loading && !loadError && tab === "account" && (
                <div className="space-y-6">
                  <form
                    onSubmit={saveProfile}
                    className="rounded-xl border border-gray-100 bg-white shadow-sm"
                  >
                    <SectionHeading
                      title="Administrator Profile"
                      description="Manage the administrator's account information."
                    />

                    <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                      <InputField
                        label="Full Name"
                        value={account.fullname}
                        onChange={(value) =>
                          setAccount({ ...account, fullname: value })
                        }
                      />
                      <InputField
                        label="Email Address"
                        type="email"
                        value={account.email}
                        onChange={(value) =>
                          setAccount({ ...account, email: value })
                        }
                      />
                    </div>

                    <SectionHeading
                      title="Change Password"
                      description="Update your administrator login password."
                    />

                    <div className="space-y-5 p-6">
                      <InputField
                        label="Current Password"
                        type="password"
                        value={account.currentPassword}
                        onChange={(value) =>
                          setAccount({ ...account, currentPassword: value })
                        }
                      />
                      <InputField
                        label="New Password"
                        type="password"
                        value={account.newPassword}
                        onChange={(value) =>
                          setAccount({ ...account, newPassword: value })
                        }
                      />
                      <InputField
                        label="Confirm New Password"
                        type="password"
                        value={account.confirmPassword}
                        onChange={(value) =>
                          setAccount({ ...account, confirmPassword: value })
                        }
                      />
                    </div>

                    <div className="border-t border-gray-100 p-6">
                      <button
                        type="submit"
                        disabled={saving === "password"}
                        className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        {saving === "password" ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* Reusable components */

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-gray-100 p-6">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function SaveButton({ saving }: { saving: boolean }) {
  return (
    <div className="flex justify-end border-t border-gray-100 p-6">
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        <Save size={17} />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
