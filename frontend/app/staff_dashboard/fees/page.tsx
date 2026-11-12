
"use client";

import { useMemo, useState, FormEvent } from "react";
import Navigation from "../component/navigation";

import {
  Search,
  Plus,
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X,
  CreditCard,
  Receipt,

} from "lucide-react";
import Header from "../component/header";

type FeeRecord = {
  id: number;
  studentName: string;
  admissionNo: string;
  className: string;
  term: string;
  session: string;
  totalFee: number;
  amountPaid: number;
};

type Payment = {
  id: number;
  studentName: string;
  admissionNo: string;
  amount: number;
  method: string;
  date: string;
};

const initialFees: FeeRecord[] = [
  {
    id: 1,
    studentName: "John Adebayo",
    admissionNo: "STU001",
    className: "JSS1",
    term: "First Term",
    session: "2025/2026",
    totalFee: 85000,
    amountPaid: 85000,
  },
  {
    id: 2,
    studentName: "Mary Johnson",
    admissionNo: "STU002",
    className: "JSS2",
    term: "First Term",
    session: "2025/2026",
    totalFee: 85000,
    amountPaid: 50000,
  },
  {
    id: 3,
    studentName: "David Okafor",
    admissionNo: "STU003",
    className: "SSS1",
    term: "First Term",
    session: "2025/2026",
    totalFee: 100000,
    amountPaid: 100000,
  },
  {
    id: 4,
    studentName: "Sarah Williams",
    admissionNo: "STU004",
    className: "JSS1",
    term: "First Term",
    session: "2025/2026",
    totalFee: 85000,
    amountPaid: 25000,
  },
  {
    id: 5,
    studentName: "Michael Bello",
    admissionNo: "STU005",
    className: "SSS2",
    term: "First Term",
    session: "2025/2026",
    totalFee: 100000,
    amountPaid: 0,
  },
];

const money = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const getStatus = (record: FeeRecord) => {
  if (record.amountPaid >= record.totalFee) return "Paid";
  if (record.amountPaid > 0) return "Part Payment";
  return "Unpaid";
};

export default function FeesPage() {
  const [active, setActive] = useState("Fees");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [fees, setFees] = useState<FeeRecord[]>(initialFees);
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      studentName: "John Adebayo",
      admissionNo: "STU001",
      amount: 85000,
      method: "Bank Transfer",
      date: "2026-09-10",
    },
    {
      id: 2,
      studentName: "Mary Johnson",
      admissionNo: "STU002",
      amount: 50000,
      method: "Cash",
      date: "2026-09-12",
    },
    {
      id: 3,
      studentName: "David Okafor",
      admissionNo: "STU003",
      amount: 100000,
      method: "Bank Transfer",
      date: "2026-09-14",
    },
  ]);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  const [newFee, setNewFee] = useState({
    studentName: "",
    admissionNo: "",
    className: "JSS1",
    totalFee: "",
  });

  const totalExpected = fees.reduce(
    (sum, fee) => sum + fee.totalFee,
    0
  );

  const totalCollected = fees.reduce(
    (sum, fee) => sum + fee.amountPaid,
    0
  );

  const totalOutstanding = totalExpected - totalCollected;

  const fullyPaid = fees.filter(
    (fee) => getStatus(fee) === "Paid"
  ).length;

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const matchesSearch =
        fee.studentName.toLowerCase().includes(search.toLowerCase()) ||
        fee.admissionNo.toLowerCase().includes(search.toLowerCase());

      const matchesClass =
        classFilter === "All Classes" ||
        fee.className === classFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        getStatus(fee) === statusFilter;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [fees, search, classFilter, statusFilter]);

  const openPaymentModal = (fee: FeeRecord) => {
    setSelectedFee(fee);
    setPaymentAmount("");
    setPaymentMethod("Bank Transfer");
    setShowPaymentModal(true);
  };

  const handlePayment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFee) return;

    const amount = Number(paymentAmount);
    const balance = selectedFee.totalFee - selectedFee.amountPaid;

    if (!amount || amount <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }

    if (amount > balance) {
      alert(`Payment cannot exceed the outstanding balance of ${money(balance)}.`);
      return;
    }

    setFees((previous) =>
      previous.map((fee) =>
        fee.id === selectedFee.id
          ? { ...fee, amountPaid: fee.amountPaid + amount }
          : fee
      )
    );

    setPayments((previous) => [
      {
        id: Date.now(),
        studentName: selectedFee.studentName,
        admissionNo: selectedFee.admissionNo,
        amount,
        method: paymentMethod,
        date: new Date().toISOString().split("T")[0],
      },
      ...previous,
    ]);

    setShowPaymentModal(false);
    setSelectedFee(null);
  };

  const handleAddFee = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newFee.studentName.trim() || !newFee.admissionNo.trim()) {
      alert("Please enter the student's name and admission number.");
      return;
    }

    const amount = Number(newFee.totalFee);

    if (!amount || amount <= 0) {
      alert("Enter a valid fee amount.");
      return;
    }

    const record: FeeRecord = {
      id: Date.now(),
      studentName: newFee.studentName,
      admissionNo: newFee.admissionNo,
      className: newFee.className,
      term: "First Term",
      session: "2025/2026",
      totalFee: amount,
      amountPaid: 0,
    };

    setFees((previous) => [record, ...previous]);

    setNewFee({
      studentName: "",
      admissionNo: "",
      className: "JSS1",
      totalFee: "",
    });

    setShowFeeModal(false);
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
        <Header
          active={active}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-4 md:p-8">
          {/* Page heading */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                School Fees Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage student fees, record payments and monitor outstanding balances.
              </p>
            </div>

            <button
              onClick={() => setShowFeeModal(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Fee Record
            </button>
          </div>

          {/* Summary cards */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Expected Fees"
              value={money(totalExpected)}
              icon={<Wallet size={21} />}
              color="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Total Collected"
              value={money(totalCollected)}
              icon={<TrendingUp size={21} />}
              color="bg-green-50 text-green-600"
            />

            <StatCard
              title="Outstanding Fees"
              value={money(totalOutstanding)}
              icon={<AlertCircle size={21} />}
              color="bg-orange-50 text-orange-600"
            />

            <StatCard
              title="Fully Paid Students"
              value={`${fullyPaid} / ${fees.length}`}
              icon={<CheckCircle size={21} />}
              color="bg-purple-50 text-purple-600"
            />
          </div>

          {/* Collection progress */}
          <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Fee Collection Progress
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Overall collection for the current records
                </p>
              </div>

              <span className="text-lg font-bold text-indigo-600">
                {totalExpected
                  ? Math.round((totalCollected / totalExpected) * 100)
                  : 0}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{
                  width: `${
                    totalExpected
                      ? (totalCollected / totalExpected) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>Collected: {money(totalCollected)}</span>
              <span>Expected: {money(totalExpected)}</span>
            </div>
          </div>

          {/* Student fee records */}
          <div className="mb-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Student Fee Records
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    View student fee records and payment balances.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search student name or admission number..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                >
                  <option>All Classes</option>
                  <option>JSS1</option>
                  <option>JSS2</option>
                  <option>JSS3</option>
                  <option>SSS1</option>
                  <option>SSS2</option>
                  <option>SSS3</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                >
                  <option>All Status</option>
                  <option>Paid</option>
                  <option>Part Payment</option>
                  <option>Unpaid</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Class</th>
                    <th className="px-6 py-4">Total Fee</th>
                    <th className="px-6 py-4">Amount Paid</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredFees.map((fee) => {
                    const balance = fee.totalFee - fee.amountPaid;
                    const status = getStatus(fee);

                    return (
                      <tr key={fee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {fee.studentName}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {fee.admissionNo}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {fee.className}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {money(fee.totalFee)}
                        </td>

                        <td className="px-6 py-4 text-green-600">
                          {money(fee.amountPaid)}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {money(balance)}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={status} />
                        </td>

                        <td className="px-6 py-4">
                          {balance > 0 ? (
                            <button
                              onClick={() => openPaymentModal(fee)}
                              className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                            >
                              Record Payment
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-green-600">
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredFees.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No fee records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent payments */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Recent Payments
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Latest payments recorded in the system.
                </p>
              </div>

              <Receipt size={22} className="text-gray-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Payment Method</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Receipt</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {payments.slice(0, 5).map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {payment.studentName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {payment.admissionNo}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-semibold text-green-600">
                        {money(payment.amount)}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {payment.method}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {payment.date}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600">
                          <Receipt size={14} />
                          Recorded
                        </span>
                      </td>
                    </tr>
                  ))}

                  {payments.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No payments recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Record payment modal */}
      {showPaymentModal && selectedFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Record Payment
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 rounded-lg bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">
                {selectedFee.studentName}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {selectedFee.admissionNo} · {selectedFee.className}
              </p>

              <div className="mt-4 flex justify-between text-sm">
                <span className="text-gray-500">Outstanding balance</span>
                <span className="font-bold text-orange-600">
                  {money(selectedFee.totalFee - selectedFee.amountPaid)}
                </span>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Payment Amount (₦)
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedFee.totalFee - selectedFee.amountPaid}
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>POS</option>
                  <option>Online Payment</option>
                </select>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700"
              >
                <CreditCard size={18} />
                Save Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add fee record modal */}
      {showFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Add Student Fee Record
              </h2>
              <button
                onClick={() => setShowFeeModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddFee} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Student Name
                </label>
                <input
                  required
                  value={newFee.studentName}
                  onChange={(e) =>
                    setNewFee({ ...newFee, studentName: e.target.value })
                  }
                  placeholder="Enter student name"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Admission Number
                </label>
                <input
                  required
                  value={newFee.admissionNo}
                  onChange={(e) =>
                    setNewFee({ ...newFee, admissionNo: e.target.value })
                  }
                  placeholder="e.g. STU006"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Class
                </label>
                <select
                  value={newFee.className}
                  onChange={(e) =>
                    setNewFee({ ...newFee, className: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option>JSS1</option>
                  <option>JSS2</option>
                  <option>JSS3</option>
                  <option>SSS1</option>
                  <option>SSS2</option>
                  <option>SSS3</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Total Fee (₦)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newFee.totalFee}
                  onChange={(e) =>
                    setNewFee({ ...newFee, totalFee: e.target.value })
                  }
                  placeholder="Enter total fee"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700"
              >
                <Plus size={18} />
                Add Fee Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
      </div>
      <h3 className="mt-4 text-xl font-bold text-gray-900">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-green-50 text-green-700",
    "Part Payment": "bg-orange-50 text-orange-700",
    Unpaid: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
