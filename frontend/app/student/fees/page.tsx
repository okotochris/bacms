"use client";

import { useEffect, useMemo, useState } from "react";
import {Wallet, GraduationCap, UserCheck,UserPlus, CheckCircle2, AlertCircle, ShieldCheck, History,} from "lucide-react";
import Navigation from "../component/navigation";
import Header from "../component/header";

/* -------------------------------------------------------------------------- */
/*  CONFIG – update these values                                              */
/* -------------------------------------------------------------------------- */
const FEE_CONFIG = {
  old: { label: "Returning Student", total: 50000 }, // ₦ (placeholder)
  new: { label: "New Student", total: 75000 }, // ₦ (placeholder, new students pay more)
};

const MIN_PAYMENT = 1000; // ₦ smallest amount a student can pay at once
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

/* -------------------------------------------------------------------------- */

type StudentType = "old" | "new";

type Student = {
  fullname?: string;
  studentName?: string;
  studentId?: string;
  className?: string;
  email?: string;
  image?: {
    profileImage?: string;
  };
};

type Payment = {
  reference: string;
  amount: number;
  date: string; // ISO string
  status?: string;
  studentType?: StudentType;
};

const naira = (value: number) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`;

/* -------------------------------------------------------------------------- */
/*  Paystack inline loader (no npm package needed)                            */
/* -------------------------------------------------------------------------- */

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();

    const existing = document.getElementById("paystack-inline-js");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Script failed"))
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "paystack-inline-js";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Paystack"));
    document.body.appendChild(script);
  });
}

type PayButtonProps = {
  email: string;
  amount: number; // in naira
  disabled: boolean;
  metadata: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
};

function PayButton({
  email,
  amount,
  disabled,
  metadata,
  onSuccess,
  onClose,
}: PayButtonProps) {
  const [opening, setOpening] = useState(false);

  // Preload so the popup opens instantly on click
  useEffect(() => {
    loadPaystackScript().catch(() => {});
  }, []);

  const handlePay = async () => {
    try {
      setOpening(true);
      await loadPaystackScript();

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: Math.round(amount * 100), // kobo
        currency: "NGN",
        ref: `FEE-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
        metadata,
        // must be a normal (non-async) function
        callback: (response: { reference: string }) => {
          onSuccess(response.reference);
        },
        onClose: () => onClose(),
      });

      handler.openIframe();
    } catch (error) {
      console.error(error);
      alert(
        "Unable to open Paystack. Check your internet connection and try again."
      );
    } finally {
      setOpening(false);
    }
  };

  return (
    <button
      type="button"
      disabled={disabled || opening}
      onClick={handlePay}
      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-3.5 transition"
    >
      {disabled
        ? "Enter a valid amount"
        : opening
        ? "Opening Paystack..."
        : `Pay ${naira(amount)} with Paystack`}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Fees() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("Fees");

  const [studentType, setStudentType] = useState<StudentType | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [backendPaid, setBackendPaid] = useState<number | null>(null);

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const stored = localStorage.getItem("student");
        if (stored) {
          const parsed: Student = JSON.parse(stored);
          setStudent(parsed);
          if (parsed.email) setEmailInput(parsed.email);
        }

        // Optional: load previous payments so the balance is accurate.
        // Expected response:
        // { amountPaid?: number, studentType?: "old" | "new",
        //   payments?: [{ reference, amount, date, status }] }
        const token = localStorage.getItem("token"); // adjust to your key
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/student/fees`,
          {
            signal: controller.signal,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.payments)) {
            setPayments(
              data.payments.map((p: anyPayment) => ({
                reference: String(p.reference || p._id || ""),
                amount: Number(p.amount || 0),
                date: p.date || p.createdAt || p.paidAt || "",
                status: p.status || "success",
                studentType: p.studentType,
              }))
            );
          }
          if (data.amountPaid !== undefined) {
            setBackendPaid(Number(data.amountPaid));
          }
          if (data.studentType === "old" || data.studentType === "new") {
            setStudentType(data.studentType);
          }
        }
      } catch (error) {
       
          console.error("Unable to load fee information");
        
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  const fullname = student?.fullname || student?.studentName || "Student";
  const firstName = fullname.trim().split(/\s+/)[0] || "Student";

  const navigateTo = (page: string) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  const sortedPayments = useMemo(
    () =>
      [...payments].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [payments]
  );

  const amountPaid =
    backendPaid !== null
      ? backendPaid
      : payments
          .filter((p) => (p.status || "success") === "success")
          .reduce((sum, p) => sum + p.amount, 0);

  const formatDate = (value: string) => {
    const d = new Date(value);
    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const totalFee = studentType ? FEE_CONFIG[studentType].total : 0;
  const balance = Math.max(totalFee - amountPaid, 0);
  const amount = Number(amountInput.replace(/,/g, "")) || 0;

  const amountError = useMemo(() => {
    if (!studentType || !amountInput) return "";
    if (amount < MIN_PAYMENT)
      return `Minimum payment is ${naira(MIN_PAYMENT)}.`;
    if (amount > balance)
      return `Amount is more than your outstanding balance of ${naira(balance)}.`;
    return "";
  }, [amount, amountInput, balance, studentType]);

  const emailValid = /^\S+@\S+\.\S+$/.test(emailInput);
  const canPay =
    !!studentType && amount >= MIN_PAYMENT && amount <= balance && emailValid;

  const handleSuccess = async (reference: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/student/fees/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            reference,
            amount,
            studentType,
            studentId: student?.studentId,
          }),
        }
      );

      if (!res.ok) throw new Error("Verification failed");

      setBackendPaid((prev) => (prev !== null ? prev + amount : prev));
      setPayments((prev) => [
        {
          reference,
          amount,
          date: new Date().toISOString(),
          status: "success",
          studentType: studentType || undefined,
        },
        ...prev,
      ]);
      setAmountInput("");
      setStatus({
        type: "success",
        message: `Payment of ${naira(amount)} received. Reference: ${reference}`,
      });
    } catch {
      setStatus({
        type: "error",
        message: `Payment went through but we could not confirm it yet. Keep this reference: ${reference}`,
      });
    }
  };

  const handleClose = () => {
    setStatus({
      type: "error",
      message: "Payment window closed. No money was charged.",
    });
  };

  if (loading) {
    return (
      <div className="light min-h-screen flex items-center justify-center bg-slate-50 [color-scheme:light]">
        <div className="text-center">
          <div className="w-9 h-9 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading fee details...</p>
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
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <Navigation
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        firstName={firstName}
        fullname={fullname}
        
      />

      <main className="lg:ml-64 min-h-screen">
        <Header
          firstName={firstName}
          profileImage={student.image?.profileImage || ""}
          setMenuOpen={setMenuOpen}
        />

        <div className="max-w-7xl mx-auto p-5 sm:p-8 space-y-7">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">School Fees</h1>
            <p className="text-sm text-slate-500 mt-1">
              Choose your student type, then pay all at once or in parts.
            </p>
          </div>

          {/* Step 1: student type */}
          <section className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-7">
            <h2 className="font-bold text-slate-900">
              Are you a new or returning student?
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              New students pay a higher fee because it includes registration and
              uniform.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {(["old", "new"] as StudentType[]).map((type) => {
                const selected = studentType === type;
                const Icon = type === "old" ? UserCheck : UserPlus;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setStudentType(type);
                      setAmountInput("");
                      setStatus(null);
                    }}
                    className={`text-left rounded-2xl border-2 p-5 transition ${
                      selected
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-slate-200 bg-white hover:border-indigo-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          selected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon size={21} />
                      </div>
                      {selected && (
                        <CheckCircle2 size={21} className="text-indigo-600" />
                      )}
                    </div>
                    <p className="font-bold text-slate-900 mt-4">
                      {FEE_CONFIG[type].label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {naira(FEE_CONFIG[type].total)}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {studentType && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">
              {/* Summary + payment history */}
              <section className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50 p-5 sm:p-6 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Total fee</p>
                    <p className="text-lg font-bold text-slate-800 mt-1">
                      {naira(totalFee)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Paid</p>
                    <p className="text-lg font-bold text-emerald-600 mt-1">
                      {naira(amountPaid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Balance</p>
                    <p className="text-lg font-bold text-orange-600 mt-1">
                      {naira(balance)}
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-7 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <History size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Payment History</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {sortedPayments.length > 0
                        ? `${sortedPayments.length} payment${
                            sortedPayments.length > 1 ? "s" : ""
                          } made`
                        : "Your payments will appear here"}
                    </p>
                  </div>
                </div>

                {sortedPayments.length === 0 ? (
                  <div className="py-14 text-center">
                    <History size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-600">
                      No payments yet
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Make your first payment to see it listed here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[480px]">
                      <thead className="bg-slate-50">
                        <tr className="text-xs text-slate-500">
                          <th className="px-6 py-4 font-semibold">Date</th>
                          <th className="px-6 py-4 font-semibold">Reference</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                          <th className="px-6 py-4 font-semibold text-right">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPayments.map((payment, index) => {
                          const ok =
                            (payment.status || "success").toLowerCase() ===
                            "success";
                          return (
                            <tr
                              key={`${payment.reference}-${index}`}
                              className="border-t border-slate-100"
                            >
                              <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                                {formatDate(payment.date)}
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-500 break-all">
                                {payment.reference}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                    ok
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {payment.status || "success"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-800 text-right whitespace-nowrap">
                                {naira(payment.amount)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Payment */}
              <section className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 sm:p-7 h-fit">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Wallet size={21} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Make a Payment</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Pay any amount up to your balance
                    </p>
                  </div>
                </div>

                {balance === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2
                      size={38}
                      className="mx-auto text-emerald-500 mb-3"
                    />
                    <p className="font-bold text-slate-800">Fees fully paid</p>
                    <p className="text-xs text-slate-400 mt-1">
                      You have no outstanding balance.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Paystack sends your receipt here.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600">
                        Amount to pay (₦)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={amountInput}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/[^\d]/g, "");
                          setAmountInput(
                            digits ? Number(digits).toLocaleString("en-NG") : ""
                          );
                          setStatus(null);
                        }}
                        placeholder="0"
                        className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100"
                      />

                      <div className="flex flex-wrap gap-2 mt-3">
                        {[
                          { label: "Full balance", value: balance },
                          { label: "Half", value: Math.ceil(balance / 2) },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() =>
                              setAmountInput(
                                preset.value.toLocaleString("en-NG")
                              )
                            }
                            className="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition"
                          >
                            {preset.label} · {naira(preset.value)}
                          </button>
                        ))}
                      </div>

                      {amountError && (
                        <p className="text-xs text-red-500 mt-2">
                          {amountError}
                        </p>
                      )}
                    </div>

                    <PayButton
                      email={emailInput}
                      amount={amount}
                      disabled={!canPay}
                      metadata={{
                        studentId: student.studentId,
                        studentName: fullname,
                        className: student.className,
                        studentType,
                      }}
                      onSuccess={handleSuccess}
                      onClose={handleClose}
                    />

                    {!PAYSTACK_PUBLIC_KEY && (
                      <p className="text-xs text-red-500">
                        Add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to your .env.local
                        file.
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                      <ShieldCheck size={14} />
                      Secured by Paystack
                    </div>
                  </div>
                )}

                {status && (
                  <div
                    className={`mt-5 flex items-start gap-2 rounded-xl p-4 text-xs ${
                      status.type === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    )}
                    <span className="break-all">{status.message}</span>
                  </div>
                )}
              </section>
            </div>
          )}

          <footer className="text-center text-xs text-slate-400 pt-3 pb-5">
            Your academic progress matters.
            <p className="mt-1">Powered by MySchoolResult</p>
          </footer>
        </div>
      </main>
    </div>
  );
}