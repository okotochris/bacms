
"use client";

import { useState, FormEvent } from "react";
import Header from "../component/header";
import Navigation from "../component/navigation";  
import {
  School,
  CalendarDays,
  GraduationCap,
  CreditCard,
  User,
  Shield,
  Bell,
  Save,
  Plus,
  Trash2,
  Settings as SettingsIcon,
} from "lucide-react";

type Tab =
  | "school"
  | "academic"
  | "grading"
  | "payment"
  | "account"
  | "notifications";

type Grade = {
  id: number;
  grade: string;
  min: number;
  max: number;
  remark: string;
};

export default function SettingsPage() {
  const [active, setActive] = useState("Settings");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("school");

  const [school, setSchool] = useState({
    name: "My School",
    email: "info@myschool.com",
    phone: "",
    address: "",
    website: "",
    motto: "",
  });

  const [academic, setAcademic] = useState({
    session: "2026/2027",
    term: "First Term",
    startDate: "",
    endDate: "",
    nextTermDate: "",
  });

  const [grades, setGrades] = useState<Grade[]>([
    { id: 1, grade: "A", min: 70, max: 100, remark: "Excellent" },
    { id: 2, grade: "B", min: 60, max: 69, remark: "Very Good" },
    { id: 3, grade: "C", min: 50, max: 59, remark: "Good" },
    { id: 4, grade: "D", min: 45, max: 49, remark: "Fair" },
    { id: 5, grade: "E", min: 40, max: 44, remark: "Pass" },
    { id: 6, grade: "F", min: 0, max: 39, remark: "Fail" },
  ]);

  const [payment, setPayment] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    paymentInstructions: "",
  });

  const [account, setAccount] = useState({
    adminName: "Administrator",
    email: "admin@myschool.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    feePayments: true,
    newAdmissions: true,
    resultUpdates: true,
    lowAttendance: false,
    systemUpdates: true,
  });

  const [savedMessage, setSavedMessage] = useState("");

  const saveSettings = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavedMessage("Settings saved successfully.");

    setTimeout(() => setSavedMessage(""), 3000);
  };

  const updateGrade = (
    id: number,
    field: keyof Grade,
    value: string
  ) => {
    setGrades((previous) =>
      previous.map((grade) =>
        grade.id === id
          ? {
              ...grade,
              [field]:
                field === "min" || field === "max"
                  ? Number(value)
                  : value,
            }
          : grade
      )
    );
  };

  const addGrade = () => {
    setGrades((previous) => [
      ...previous,
      {
        id: Date.now(),
        grade: "",
        min: 0,
        max: 0,
        remark: "",
      },
    ]);
  };

  const removeGrade = (id: number) => {
    setGrades((previous) =>
      previous.filter((grade) => grade.id !== id)
    );
  };

  const menuItems: {
    id: Tab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: "school", label: "School Information", icon: <School size={18} /> },
    { id: "academic", label: "Academic Settings", icon: <CalendarDays size={18} /> },
    { id: "grading", label: "Grading System", icon: <GraduationCap size={18} /> },
    { id: "payment", label: "Payment Settings", icon: <CreditCard size={18} /> },
    { id: "account", label: "Account & Security", icon: <Shield size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  ];

  const changePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (account.newPassword.length < 8) {
      alert("New password must contain at least 8 characters.");
      return;
    }

    if (account.newPassword !== account.confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    alert("Password form validated. Connect this action to your authentication provider.");
    setAccount((previous) => ({
      ...previous,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

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
            <h1 className="text-2xl font-bold text-gray-900">
              System Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your school&apos;s information and system preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4">
            {/* Settings sidebar */}
            <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center gap-2 px-3 py-3">
                <SettingsIcon size={20} className="text-indigo-600" />
                <span className="font-semibold text-gray-900">
                  Settings Menu
                </span>
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
              {savedMessage && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {savedMessage}
                </div>
              )}

              {/* School information */}
              {tab === "school" && (
                <form
                  onSubmit={saveSettings}
                  className="rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <SectionHeading
                    title="School Information"
                    description="Update your school's official information."
                  />

                  <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                    <InputField
                      label="School Name"
                      value={school.name}
                      onChange={(value) =>
                        setSchool({ ...school, name: value })
                      }
                    />

                    <InputField
                      label="School Email"
                      type="email"
                      value={school.email}
                      onChange={(value) =>
                        setSchool({ ...school, email: value })
                      }
                    />

                    <InputField
                      label="Phone Number"
                      value={school.phone}
                      onChange={(value) =>
                        setSchool({ ...school, phone: value })
                      }
                    />

                    <InputField
                      label="Website"
                      value={school.website}
                      onChange={(value) =>
                        setSchool({ ...school, website: value })
                      }
                    />

                    <div className="md:col-span-2">
                      <InputField
                        label="School Address"
                        value={school.address}
                        onChange={(value) =>
                          setSchool({ ...school, address: value })
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <InputField
                        label="School Motto"
                        value={school.motto}
                        onChange={(value) =>
                          setSchool({ ...school, motto: value })
                        }
                      />
                    </div>
                  </div>

                  <SaveButton />
                </form>
              )}

              {/* Academic settings */}
              {tab === "academic" && (
                <form
                  onSubmit={saveSettings}
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
                      options={[
                        "First Term",
                        "Second Term",
                        "Third Term",
                      ]}
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

                  <SaveButton />
                </form>
              )}

              {/* Grading settings */}
              {tab === "grading" && (
                <form
                  onSubmit={saveSettings}
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

                  <SaveButton />
                </form>
              )}

              {/* Payment settings */}
              {tab === "payment" && (
                <form
                  onSubmit={saveSettings}
                  className="rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <SectionHeading
                    title="Payment Settings"
                    description="Set the school's bank account details for fee payments."
                  />

                  <div className="space-y-5 p-6">
                    <InputField
                      label="Bank Name"
                      value={payment.bankName}
                      onChange={(value) =>
                        setPayment({ ...payment, bankName: value })
                      }
                      placeholder="Enter bank name"
                    />

                    <InputField
                      label="Account Name"
                      value={payment.accountName}
                      onChange={(value) =>
                        setPayment({ ...payment, accountName: value })
                      }
                      placeholder="School account name"
                    />

                    <InputField
                      label="Account Number"
                      value={payment.accountNumber}
                      onChange={(value) =>
                        setPayment({ ...payment, accountNumber: value })
                      }
                      placeholder="Enter account number"
                    />

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Payment Instructions
                      </label>
                      <textarea
                        rows={4}
                        value={payment.paymentInstructions}
                        onChange={(e) =>
                          setPayment({
                            ...payment,
                            paymentInstructions: e.target.value,
                          })
                        }
                        placeholder="Enter instructions for parents..."
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <SaveButton />
                </form>
              )}

              {/* Account and security */}
              {tab === "account" && (
                <div className="space-y-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Account profile form validated.");
                    }}
                    className="rounded-xl border border-gray-100 bg-white shadow-sm"
                  >
                    <SectionHeading
                      title="Administrator Profile"
                      description="Manage the administrator's account information."
                    />

                    <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                      <InputField
                        label="Full Name"
                        value={account.adminName}
                        onChange={(value) =>
                          setAccount({ ...account, adminName: value })
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

                    <SaveButton />
                  </form>

                  <form
                    onSubmit={changePassword}
                    className="rounded-xl border border-gray-100 bg-white shadow-sm"
                  >
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
                        className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notifications */}
              {tab === "notifications" && (
                <form
                  onSubmit={saveSettings}
                  className="rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <SectionHeading
                    title="Notification Preferences"
                    description="Choose which system notifications you want to receive."
                  />

                  <div className="divide-y divide-gray-100 p-6">
                    {[
                      {
                        key: "feePayments" as const,
                        title: "Fee Payments",
                        description: "Receive alerts when a student pays school fees.",
                      },
                      {
                        key: "newAdmissions" as const,
                        title: "New Admissions",
                        description: "Receive alerts when a new student is registered.",
                      },
                      {
                        key: "resultUpdates" as const,
                        title: "Result Updates",
                        description: "Receive notifications when results are published.",
                      },
                      {
                        key: "lowAttendance" as const,
                        title: "Low Attendance",
                        description: "Receive alerts about attendance concerns.",
                      },
                      {
                        key: "systemUpdates" as const,
                        title: "System Updates",
                        description: "Receive important system announcements.",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between gap-4 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {item.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={notifications[item.key]}
                          onClick={() =>
                            setNotifications((previous) => ({
                              ...previous,
                              [item.key]: !previous[item.key],
                            }))
                          }
                          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                            notifications[item.key]
                              ? "bg-indigo-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                              notifications[item.key]
                                ? "left-6"
                                : "left-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <SaveButton />
                </form>
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

function SaveButton() {
  return (
    <div className="flex justify-end border-t border-gray-100 p-6">
      <button
        type="submit"
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
      >
        <Save size={17} />
        Save Changes
      </button>
    </div>
  );
}
