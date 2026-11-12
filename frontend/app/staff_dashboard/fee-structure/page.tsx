
"use client";

import { useMemo, useState, FormEvent } from "react";

import {
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  Wallet,
  BookOpen,
  Layers,
  Banknote,
  GraduationCap,
} from "lucide-react";
import Header from "../component/header";
import Navigation from "../component/navigation";

type FeeItem = {
  name: string;
  amount: number;
};

type FeeStructure = {
  id: number;
  className: string;
  session: string;
  term: string;
  items: FeeItem[];
};

const initialStructures: FeeStructure[] = [
  {
    id: 1,
    className: "JSS1",
    session: "2026/2027",
    term: "First Term",
    items: [
      { name: "Tuition Fee", amount: 40000 },
      { name: "Examination Fee", amount: 5000 },
      { name: "Books and Learning Materials", amount: 10000 },
      { name: "Uniform", amount: 15000 },
      { name: "Development Levy", amount: 5000 },
    ],
  },
  {
    id: 2,
    className: "JSS2",
    session: "2026/2027",
    term: "First Term",
    items: [
      { name: "Tuition Fee", amount: 40000 },
      { name: "Examination Fee", amount: 5000 },
      { name: "Books and Learning Materials", amount: 10000 },
      { name: "Uniform", amount: 15000 },
      { name: "Development Levy", amount: 5000 },
    ],
  },
  {
    id: 3,
    className: "SSS1",
    session: "2026/2027",
    term: "First Term",
    items: [
      { name: "Tuition Fee", amount: 50000 },
      { name: "Examination Fee", amount: 7000 },
      { name: "Books and Learning Materials", amount: 12000 },
      { name: "Uniform", amount: 16000 },
      { name: "Development Levy", amount: 5000 },
    ],
  },
  {
    id: 4,
    className: "SSS2",
    session: "2026/2027",
    term: "First Term",
    items: [
      { name: "Tuition Fee", amount: 50000 },
      { name: "Examination Fee", amount: 7000 },
      { name: "Books and Learning Materials", amount: 12000 },
      { name: "Uniform", amount: 16000 },
      { name: "Development Levy", amount: 5000 },
    ],
  },
];

const classes = ["JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"];
const terms = ["First Term", "Second Term", "Third Term"];

const money = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const totalAmount = (items: FeeItem[]) =>
  items.reduce((sum, item) => sum + item.amount, 0);

const emptyForm = {
  className: "JSS1",
  session: "2026/2027",
  term: "First Term",
  items: [
    { name: "Tuition Fee", amount: 0 },
    { name: "Examination Fee", amount: 0 },
    { name: "Books and Learning Materials", amount: 0 },
    { name: "Uniform", amount: 0 },
    { name: "Development Levy", amount: 0 },
  ],
};

export default function FeeStructurePage() {
  const [active, setActive] = useState("Fee Structure");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [structures, setStructures] =
    useState<FeeStructure[]>(initialStructures);

  const [search, setSearch] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All Sessions");
  const [termFilter, setTermFilter] = useState("All Terms");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const sessions = useMemo(
    () => [...new Set(structures.map((item) => item.session))],
    [structures]
  );

  const filteredStructures = useMemo(() => {
    return structures.filter((structure) => {
      const matchesSearch = structure.className
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesSession =
        sessionFilter === "All Sessions" ||
        structure.session === sessionFilter;

      const matchesTerm =
        termFilter === "All Terms" ||
        structure.term === termFilter;

      return matchesSearch && matchesSession && matchesTerm;
    });
  }, [structures, search, sessionFilter, termFilter]);

  const totalStructures = structures.length;

  const totalConfigured = structures.reduce(
    (sum, structure) => sum + totalAmount(structure.items),
    0
  );

  const averageFee = totalStructures
    ? totalConfigured / totalStructures
    : 0;

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      items: emptyForm.items.map((item) => ({ ...item })),
    });
    setShowModal(true);
  };

  const openEditModal = (structure: FeeStructure) => {
    setEditingId(structure.id);
    setForm({
      className: structure.className,
      session: structure.session,
      term: structure.term,
      items: structure.items.map((item) => ({ ...item })),
    });
    setShowModal(true);
  };

  const updateItem = (
    index: number,
    field: "name" | "amount",
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === "amount" ? Number(value) : value,
            }
          : item
      ),
    }));
  };

  const addItem = () => {
    setForm((previous) => ({
      ...previous,
      items: [...previous.items, { name: "", amount: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validItems = form.items.filter(
      (item) => item.name.trim() !== ""
    );

    if (validItems.length === 0) {
      alert("Please add at least one fee item.");
      return;
    }

    if (validItems.some((item) => item.amount < 0)) {
      alert("Fee amounts cannot be negative.");
      return;
    }

    const duplicate = structures.some(
      (structure) =>
        structure.id !== editingId &&
        structure.className === form.className &&
        structure.session === form.session &&
        structure.term === form.term
    );

    if (duplicate) {
      alert(
        "A fee structure already exists for this class, session and term."
      );
      return;
    }

    const record: FeeStructure = {
      id: editingId ?? Date.now(),
      className: form.className,
      session: form.session.trim(),
      term: form.term,
      items: validItems,
    };

    if (editingId !== null) {
      setStructures((previous) =>
        previous.map((item) =>
          item.id === editingId ? record : item
        )
      );
    } else {
      setStructures((previous) => [record, ...previous]);
    }

    setShowModal(false);
    setEditingId(null);
  };

  const deleteStructure = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fee structure?"
    );

    if (!confirmed) return;

    setStructures((previous) =>
      previous.filter((item) => item.id !== id)
    );
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
          {/* Heading */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Fee Structure
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Configure school fees for each class, session and term.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus size={18} />
              Create Fee Structure
            </button>
          </div>

          {/* Summary cards */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Fee Structures"
              value={String(totalStructures)}
              description="Configured class and term records"
              icon={<Layers size={22} />}
              color="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Total Configured Fees"
              value={money(totalConfigured)}
              description="Combined value of all structures"
              icon={<Wallet size={22} />}
              color="bg-green-50 text-green-600"
            />

            <StatCard
              title="Average Fee Structure"
              value={money(averageFee)}
              description="Average amount per structure"
              icon={<Banknote size={22} />}
              color="bg-purple-50 text-purple-600"
            />
          </div>

          {/* Fee structures table */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900">
                Configured School Fees
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage the fee breakdown for each class.
              </p>

              <div className="mt-5 flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search class..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={sessionFilter}
                  onChange={(e) => setSessionFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                >
                  <option>All Sessions</option>
                  {sessions.map((session) => (
                    <option key={session}>{session}</option>
                  ))}
                </select>

                <select
                  value={termFilter}
                  onChange={(e) => setTermFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                >
                  <option>All Terms</option>
                  {terms.map((term) => (
                    <option key={term}>{term}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Class</th>
                    <th className="px-6 py-4">Academic Session</th>
                    <th className="px-6 py-4">Term</th>
                    <th className="px-6 py-4">Fee Items</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredStructures.map((structure) => (
                    <tr
                      key={structure.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                            <GraduationCap size={19} />
                          </div>
                          <span className="font-semibold text-gray-900">
                            {structure.className}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {structure.session}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {structure.term}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {structure.items.length} items
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {money(totalAmount(structure.items))}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(structure)}
                            title="Edit fee structure"
                            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => deleteStructure(structure.id)}
                            title="Delete fee structure"
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredStructures.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No fee structures found. Create a new one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Information */}
          <div className="mt-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <BookOpen
              size={22}
              className="shrink-0 text-blue-600"
            />
            <div>
              <h3 className="font-semibold text-blue-900">
                About Fee Structures
              </h3>
              <p className="mt-1 text-sm leading-6 text-blue-800">
                Each fee structure defines the charges students in a
                particular class should pay for a selected term and
                academic session. Once connected to your student fee
                records, these structures can be used to calculate
                each student&apos;s expected fees.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Create / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? "Edit Fee Structure" : "Create Fee Structure"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the class details and individual fee items.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 p-6">
                {/* Class, session and term */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Class
                    </label>
                    <select
                      value={form.className}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          className: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
                    >
                      {classes.map((className) => (
                        <option key={className}>{className}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Academic Session
                    </label>
                    <input
                      required
                      value={form.session}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          session: e.target.value,
                        })
                      }
                      placeholder="2026/2027"
                      className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Term
                    </label>
                    <select
                      value={form.term}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          term: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
                    >
                      {terms.map((term) => (
                        <option key={term}>{term}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fee items */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Fee Breakdown
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Add the individual charges students must pay.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addItem}
                      className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                    >
                      <Plus size={15} />
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2"
                      >
                        <input
                          required
                          value={item.name}
                          onChange={(e) =>
                            updateItem(index, "name", e.target.value)
                          }
                          placeholder="Fee item name"
                          className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
                        />

                        <div className="relative w-36 sm:w-44">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                            ₦
                          </span>
                          <input
                            type="number"
                            min="0"
                            required
                            value={item.amount}
                            onChange={(e) =>
                              updateItem(index, "amount", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 py-3 pl-7 pr-3 text-sm outline-none focus:border-indigo-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={form.items.length === 1}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Remove fee item"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between rounded-lg bg-indigo-50 p-4">
                  <span className="text-sm font-semibold text-indigo-900">
                    Total School Fee
                  </span>
                  <span className="text-xl font-bold text-indigo-700">
                    {money(totalAmount(form.items))}
                  </span>
                </div>
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 p-6 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <Plus size={17} />
                  {editingId ? "Save Changes" : "Create Structure"}
                </button>
              </div>
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
  description,
  icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
      </div>

      <h3 className="mt-4 text-xl font-bold text-gray-900">
        {value}
      </h3>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}
