import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Wallet,
  Clock,
  CheckCircle,
  Layers,
  MoreVertical,
  X,
  AlertCircle,
  Loader2,
  Ban,
  CreditCard,
} from "lucide-react";

import {
  getExpenses,
  createExpense,
  approveExpense,
  payExpense,
  cancelExpense,
  deleteExpense,
} from "../../services/expenses";

function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenu, setOpenMenu] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [formData, setFormData] = useState({
    expense_id: "",
    description: "",
    category: "",
    amount: "",
    expense_date: new Date().toISOString().split("T")[0],
    paid_by: "",
    payment_method: "",
    status: "pending",
  });

  async function loadExpenses() {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses();

      setExpenses(data);
    } catch (err) {
      setError(err.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        expenses
          .map((expense) => expense.category)
          .filter(Boolean)
      ),
    ];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        expense.description?.toLowerCase().includes(search) ||
        expense.expense_id?.toLowerCase().includes(search) ||
        expense.category?.toLowerCase().includes(search) ||
        expense.paid_by?.toLowerCase().includes(search) ||
        expense.payment_method?.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "All" ||
        expense.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        expense.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    expenses,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  const paidExpenses = expenses
    .filter((expense) => expense.status === "paid")
    .reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    );

  const pendingExpenses = expenses
    .filter((expense) => expense.status === "pending")
    .reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    );

  const totalCategories = new Set(
    expenses.map((expense) => expense.category)
  ).size;

  const formatCurrency = (amount) => {
    return `KSh ${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replace("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "approved":
        return "bg-blue-100 text-blue-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      expense_id: "",
      description: "",
      category: "",
      amount: "",
      expense_date: new Date()
        .toISOString()
        .split("T")[0],
      paid_by: "",
      payment_method: "",
      status: "pending",
    });
  };

  const handleAddExpense = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const createdExpense = await createExpense({
        expense_id: formData.expense_id.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        amount: Number(formData.amount),
        expense_date: formData.expense_date,
        paid_by: formData.paid_by.trim(),
        payment_method: formData.payment_method,
        status: "pending",
      });

      setExpenses((current) => [
        ...current,
        createdExpense,
      ]);

      resetForm();
      setShowAddModal(false);
    } catch (err) {
      setError(
        err.message || "Failed to create expense"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (expense) => {
    try {
      setActionLoading(expense.id);
      setError("");
      setOpenMenu(null);

      const updatedExpense = await approveExpense(
        expense.id
      );

      setExpenses((current) =>
        current.map((item) =>
          item.id === updatedExpense.id
            ? updatedExpense
            : item
        )
      );
    } catch (err) {
      setError(
        err.message || "Failed to approve expense"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handlePay = async (expense) => {
    try {
      setActionLoading(expense.id);
      setError("");
      setOpenMenu(null);

      const updatedExpense = await payExpense(
        expense.id
      );

      setExpenses((current) =>
        current.map((item) =>
          item.id === updatedExpense.id
            ? updatedExpense
            : item
        )
      );
    } catch (err) {
      setError(
        err.message || "Failed to pay expense"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (expense) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel "${expense.description}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(expense.id);
      setError("");
      setOpenMenu(null);

      const updatedExpense = await cancelExpense(
        expense.id
      );

      setExpenses((current) =>
        current.map((item) =>
          item.id === updatedExpense.id
            ? updatedExpense
            : item
        )
      );
    } catch (err) {
      setError(
        err.message || "Failed to cancel expense"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (expense) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${expense.description}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(expense.id);
      setError("");
      setOpenMenu(null);

      await deleteExpense(expense.id);

      setExpenses((current) =>
        current.filter(
          (item) => item.id !== expense.id
        )
      );
    } catch (err) {
      setError(
        err.message || "Failed to delete expense"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const renderActions = (expense) => {
    if (actionLoading === expense.id) {
      return (
        <div className="flex items-center justify-center px-4 py-3">
          <Loader2
            size={17}
            className="animate-spin text-[#102A43]"
          />
        </div>
      );
    }

    return (
      <div className="py-1">
        {expense.status === "pending" && (
          <button
            onClick={() => handleApprove(expense)}
            className="block w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50"
          >
            Approve Expense
          </button>
        )}

        {expense.status === "approved" && (
          <button
            onClick={() => handlePay(expense)}
            className="block w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50"
          >
            Mark as Paid
          </button>
        )}

        {expense.status !== "paid" &&
          expense.status !== "cancelled" && (
            <button
              onClick={() => handleCancel(expense)}
              className="block w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50"
            >
              Cancel Expense
            </button>
          )}

        <button
          onClick={() => handleDelete(expense)}
          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        >
          Delete Expense
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">
            Expenses
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track and manage hotel business expenses
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#102A43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163A5C]"
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">
            <p className="font-medium">
              Something went wrong
            </p>

            <p className="mt-1">{error}</p>
          </div>

          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Expenses
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {formatCurrency(totalExpenses)}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Wallet size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Paid Expenses
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {formatCurrency(paidExpenses)}
              </h2>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Expenses
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {formatCurrency(pendingExpenses)}
              </h2>
            </div>

            <div className="rounded-lg bg-yellow-50 p-3 text-[#C89B3C]">
              <Clock size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Expense Categories
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {totalCategories}
              </h2>
            </div>

            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
              <Layers size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Filters */}
        <div className="border-b border-gray-100 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-[#C89B3C] focus:bg-white focus:ring-1 focus:ring-[#C89B3C]"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category === "All"
                      ? "All Categories"
                      : category}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
              >
                <option value="All">
                  All Statuses
                </option>
                <option value="pending">
                  Pending
                </option>
                <option value="approved">
                  Approved
                </option>
                <option value="paid">
                  Paid
                </option>
                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2
                size={20}
                className="animate-spin"
              />
              Loading expenses...
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Expense
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Paid By
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Payment Method
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {expense.description}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {expense.expense_id}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                            {expense.category}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                          {formatCurrency(expense.amount)}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(
                            expense.expense_date
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700">
                          {expense.paid_by}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {expense.payment_method}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              expense.status
                            )}`}
                          >
                            {formatStatus(
                              expense.status
                            )}
                          </span>
                        </td>

                        <td className="relative px-5 py-4">
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === expense.id
                                  ? null
                                  : expense.id
                              )
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#102A43]"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenu === expense.id && (
                            <div className="absolute right-5 top-12 z-20 w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                              {renderActions(expense)}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-5 py-12 text-center text-sm text-gray-500"
                      >
                        No expenses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {expense.description}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {expense.expense_id}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === expense.id
                              ? null
                              : expense.id
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">
                          Category
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {expense.category}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {formatCurrency(
                            expense.amount
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Date
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {formatDate(
                            expense.expense_date
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Paid By
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {expense.paid_by}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Payment Method
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {expense.payment_method}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Status
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            expense.status
                          )}`}
                        >
                          {formatStatus(
                            expense.status
                          )}
                        </span>
                      </div>
                    </div>

                    {openMenu === expense.id && (
                      <div className="mt-4 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        {renderActions(expense)}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-5 py-12 text-center text-sm text-gray-500">
                  No expenses found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {filteredExpenses.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {expenses.length}
                </span>{" "}
                expenses
              </p>
            </div>
          </>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#102A43]">
                  Add Expense
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Record a new business expense
                </p>
              </div>

              <button
                onClick={() => {
                  if (!submitting) {
                    setShowAddModal(false);
                    resetForm();
                  }
                }}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleAddExpense}
              className="p-6"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Expense ID
                  </label>

                  <input
                    type="text"
                    name="expense_id"
                    value={formData.expense_id}
                    onChange={handleFormChange}
                    placeholder="EXP-001"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Amount
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    placeholder="0"
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Electricity Bill"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="Utilities"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Expense Date
                  </label>

                  <input
                    type="date"
                    name="expense_date"
                    value={formData.expense_date}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Paid By
                  </label>

                  <input
                    type="text"
                    name="paid_by"
                    value={formData.paid_by}
                    onChange={handleFormChange}
                    placeholder="James Mwangi"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>

                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  >
                    <option value="">
                      Select method
                    </option>
                    <option value="M-Pesa">
                      M-Pesa
                    </option>
                    <option value="Cash">
                      Cash
                    </option>
                    <option value="Bank Transfer">
                      Bank Transfer
                    </option>
                    <option value="Card">
                      Card
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!submitting) {
                      setShowAddModal(false);
                      resetForm();
                    }
                  }}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#102A43] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#163A5C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {submitting
                    ? "Creating..."
                    : "Create Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenses;