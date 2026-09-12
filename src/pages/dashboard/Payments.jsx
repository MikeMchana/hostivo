import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  X,
  Smartphone,
  Banknote,
  Building2,
  Wallet,
  User,
  ClipboardList,
  ShoppingBag,
} from "lucide-react";

import {
  getPayments,
  createPayment,
  completePayment,
  cancelPayment,
  deletePayment,
} from "../../services/payments";

import { getCustomers } from "../../services/customers";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenu, setOpenMenu] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    payment_id: "",
    customer_id: "",
    reservation_id: "",
    order_id: "",
    amount: "",
    payment_method: "M-Pesa",
    transaction_reference: "",
    status: "pending",
  });

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [paymentsData, customersData] = await Promise.all([
        getPayments(),
        getCustomers(),
      ]);

      setPayments(paymentsData);
      setCustomers(customersData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const customerMap = useMemo(() => {
    return customers.reduce((map, customer) => {
      map[customer.id] = customer;
      return map;
    }, {});
  }, [customers]);

  const getCustomerName = (customerId) => {
    if (!customerId) {
      return "—";
    }

    return (
      customerMap[customerId]?.full_name ||
      `Customer #${customerId}`
    );
  };

  const getPaymentReference = (payment) => {
    if (payment.reservation_id) {
      return `Reservation #${payment.reservation_id}`;
    }

    if (payment.order_id) {
      return `Order #${payment.order_id}`;
    }

    if (payment.customer_id) {
      return `Customer #${payment.customer_id}`;
    }

    return "—";
  };

  const getPaymentType = (payment) => {
    if (payment.reservation_id) {
      return "Room Booking";
    }

    if (payment.order_id) {
      return "Restaurant Order";
    }

    if (payment.customer_id) {
      return "Customer Payment";
    }

    return "Payment";
  };

  const filteredPayments = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return payments.filter((payment) => {
      const customerName = getCustomerName(
        payment.customer_id
      ).toLowerCase();

      const reference = getPaymentReference(payment).toLowerCase();

      const matchesSearch =
        payment.payment_id
          .toLowerCase()
          .includes(search) ||
        customerName.includes(search) ||
        reference.includes(search) ||
        (payment.transaction_reference || "")
          .toLowerCase()
          .includes(search);

      const matchesMethod =
        methodFilter === "All" ||
        payment.payment_method === methodFilter;

      const matchesStatus =
        statusFilter === "All" ||
        payment.status === statusFilter.toLowerCase();

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [
    payments,
    customers,
    searchTerm,
    methodFilter,
    statusFilter,
  ]);

  const totalPayments = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const todayPayments = payments
    .filter((payment) => {
      if (!payment.payment_date) {
        return false;
      }

      const paymentDate = new Date(payment.payment_date);

      const today = new Date();

      return (
        paymentDate.getFullYear() === today.getFullYear() &&
        paymentDate.getMonth() === today.getMonth() &&
        paymentDate.getDate() === today.getDate()
      );
    })
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const pendingPayments = payments
    .filter((payment) => payment.status === "pending")
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const completedPayments = payments
    .filter((payment) => payment.status === "completed")
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  function formatAmount(amount) {
    return `KSh ${Number(amount || 0).toLocaleString()}`;
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function formatStatus(status) {
    if (status === "completed") {
      return "Completed";
    }

    if (status === "pending") {
      return "Pending";
    }

    if (status === "cancelled") {
      return "Cancelled";
    }

    return status || "Unknown";
  }

  function getStatusStyle(status) {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700";

      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "completed":
        return <CheckCircle size={14} />;

      case "pending":
        return <Clock size={14} />;

      case "cancelled":
        return <XCircle size={14} />;

      default:
        return null;
    }
  }

  function getMethodIcon(method) {
    switch (method) {
      case "M-Pesa":
        return <Smartphone size={16} />;

      case "Card":
        return <CreditCard size={16} />;

      case "Bank Transfer":
        return <Building2 size={16} />;

      case "Cash":
        return <Banknote size={16} />;

      default:
        return <Wallet size={16} />;
    }
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openAddModal() {
    setFormData({
      payment_id: "",
      customer_id: "",
      reservation_id: "",
      order_id: "",
      amount: "",
      payment_method: "M-Pesa",
      transaction_reference: "",
      status: "pending",
    });

    setError("");
    setShowAddModal(true);
  }

  function closeAddModal() {
    if (actionLoading) {
      return;
    }

    setShowAddModal(false);
  }

  async function handleCreatePayment(event) {
    event.preventDefault();

    const customerId =
      formData.customer_id.trim() === ""
        ? null
        : Number(formData.customer_id);

    const reservationId =
      formData.reservation_id.trim() === ""
        ? null
        : Number(formData.reservation_id);

    const orderId =
      formData.order_id.trim() === ""
        ? null
        : Number(formData.order_id);

    if (
      customerId === null &&
      reservationId === null &&
      orderId === null
    ) {
      setError(
        "Payment must be linked to a customer, reservation, or order."
      );

      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await createPayment({
        payment_id: formData.payment_id.trim(),
        customer_id: customerId,
        reservation_id: reservationId,
        order_id: orderId,
        amount: Number(formData.amount),
        payment_method: formData.payment_method,
        transaction_reference:
          formData.transaction_reference.trim() || null,
        status: formData.status,
      });

      setShowAddModal(false);

      await loadData();
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCompletePayment(payment) {
    try {
      setActionLoading(true);
      setError("");
      setOpenMenu(null);

      await completePayment(payment.id);

      await loadData();
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancelPayment(payment) {
    try {
      setActionLoading(true);
      setError("");
      setOpenMenu(null);

      await cancelPayment(payment.id);

      await loadData();
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  function openDeleteModal(payment) {
    setSelectedPayment(payment);
    setOpenMenu(null);
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    if (actionLoading) {
      return;
    }

    setShowDeleteModal(false);
    setSelectedPayment(null);
  }

  async function handleDeletePayment() {
    if (!selectedPayment) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await deletePayment(selectedPayment.id);

      setShowDeleteModal(false);
      setSelectedPayment(null);

      await loadData();
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#102A43" }}
          >
            Payments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track and manage hotel and restaurant payments.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: "#102A43" }}
        >
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Payments
              </p>

              <h2
                className="mt-2 text-2xl font-bold"
                style={{ color: "#102A43" }}
              >
                {formatAmount(totalPayments)}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <CreditCard size={22} />
            </div>
          </div>
        </div>

        {/* Today */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Today's Payments
              </p>

              <h2
                className="mt-2 text-2xl font-bold"
                style={{ color: "#102A43" }}
              >
                {formatAmount(todayPayments)}
              </h2>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pending Payments
              </p>

              <h2
                className="mt-2 text-2xl font-bold"
                style={{ color: "#102A43" }}
              >
                {formatAmount(pendingPayments)}
              </h2>
            </div>

            <div className="rounded-lg bg-yellow-50 p-3 text-yellow-600">
              <Clock size={22} />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Completed Payments
              </p>

              <h2
                className="mt-2 text-2xl font-bold"
                style={{ color: "#102A43" }}
              >
                {formatAmount(completedPayments)}
              </h2>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by payment ID, customer, reference or transaction..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(event) =>
              setMethodFilter(event.target.value)
            }
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
          >
            <option value="All">All Methods</option>
            <option value="M-Pesa">M-Pesa</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">
              Bank Transfer
            </option>
            <option value="Cash">Cash</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Payments */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-gray-500">
            Loading payments...
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Payment ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Reference
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Method
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Date & Time
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <span
                            className="font-semibold"
                            style={{ color: "#102A43" }}
                          >
                            {payment.payment_id}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#102A43] text-white">
                              <User size={16} />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {getCustomerName(
                                  payment.customer_id
                                )}
                              </p>

                              <p className="text-xs text-gray-400">
                                {getPaymentType(payment)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {getPaymentReference(payment)}
                          </span>

                          {payment.transaction_reference && (
                            <p className="mt-1 text-xs text-gray-400">
                              TX:{" "}
                              {payment.transaction_reference}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gray-800">
                            {formatAmount(payment.amount)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-gray-400">
                              {getMethodIcon(
                                payment.payment_method
                              )}
                            </span>

                            {payment.payment_method}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {formatDate(payment.payment_date)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                              payment.status
                            )}`}
                          >
                            {getStatusIcon(payment.status)}
                            {formatStatus(payment.status)}
                          </span>
                        </td>

                        <td className="relative px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === payment.id
                                  ? null
                                  : payment.id
                              )
                            }
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenu === payment.id && (
                            <div className="absolute right-6 top-14 z-20 w-48 rounded-lg border border-gray-100 bg-white py-1 text-left shadow-lg">
                              {payment.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleCompletePayment(
                                        payment
                                      )
                                    }
                                    disabled={actionLoading}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-green-700 hover:bg-green-50 disabled:opacity-50"
                                  >
                                    <CheckCircle size={16} />
                                    Complete Payment
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleCancelPayment(
                                        payment
                                      )
                                    }
                                    disabled={actionLoading}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 disabled:opacity-50"
                                  >
                                    <XCircle size={16} />
                                    Cancel Payment
                                  </button>
                                </>
                              )}

                              {payment.status === "completed" && (
                                <div className="px-4 py-2 text-xs text-gray-400">
                                  Payment completed
                                </div>
                              )}

                              {payment.status === "cancelled" && (
                                <div className="px-4 py-2 text-xs text-gray-400">
                                  Payment cancelled
                                </div>
                              )}

                              <button
                                onClick={() =>
                                  openDeleteModal(payment)
                                }
                                disabled={actionLoading}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                <Trash2 size={16} />
                                Delete Payment
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        No payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <div key={payment.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: "#102A43" }}
                        >
                          {payment.payment_id}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {getCustomerName(
                            payment.customer_id
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === payment.id
                              ? null
                              : payment.id
                          )
                        }
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">
                          Type
                        </span>

                        <span className="text-right text-sm text-gray-700">
                          {getPaymentType(payment)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">
                          Reference
                        </span>

                        <span className="text-right text-sm font-medium text-gray-700">
                          {getPaymentReference(payment)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">
                          Amount
                        </span>

                        <span className="text-sm font-semibold text-gray-800">
                          {formatAmount(payment.amount)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">
                          Method
                        </span>

                        <span className="flex items-center gap-2 text-sm text-gray-700">
                          {getMethodIcon(
                            payment.payment_method
                          )}
                          {payment.payment_method}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-500">
                          Date
                        </span>

                        <span className="text-right text-sm text-gray-700">
                          {formatDate(payment.payment_date)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Status
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                          {formatStatus(payment.status)}
                        </span>
                      </div>

                      {payment.transaction_reference && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-gray-500">
                            Transaction
                          </span>

                          <span className="max-w-[55%] break-all text-right text-sm text-gray-700">
                            {payment.transaction_reference}
                          </span>
                        </div>
                      )}
                    </div>

                    {openMenu === payment.id && (
                      <div className="mt-4 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        {payment.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleCompletePayment(payment)
                              }
                              disabled={actionLoading}
                              className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-3 text-left text-sm text-green-700 hover:bg-white disabled:opacity-50"
                            >
                              <CheckCircle size={16} />
                              Complete Payment
                            </button>

                            <button
                              onClick={() =>
                                handleCancelPayment(payment)
                              }
                              disabled={actionLoading}
                              className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-3 text-left text-sm text-orange-600 hover:bg-white disabled:opacity-50"
                            >
                              <XCircle size={16} />
                              Cancel Payment
                            </button>
                          </>
                        )}

                        <button
                          onClick={() =>
                            openDeleteModal(payment)
                          }
                          disabled={actionLoading}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          Delete Payment
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-sm text-gray-500">
                  No payments found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {filteredPayments.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {payments.length}
                </span>{" "}
                payments
              </p>
            </div>
          </>
        )}
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{ color: "#102A43" }}
                >
                  Record Payment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create a new payment record
                </p>
              </div>

              <button
                onClick={closeAddModal}
                disabled={actionLoading}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreatePayment}
              className="space-y-5 p-6"
            >
              {/* Payment ID */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Payment ID
                </label>

                <input
                  type="text"
                  name="payment_id"
                  value={formData.payment_id}
                  onChange={handleFormChange}
                  required
                  placeholder="PAY-1009"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                />
              </div>

              {/* Customer */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Customer
                </label>

                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                >
                  <option value="">
                    No customer selected
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.full_name} — #{customer.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Linked Record IDs */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <ClipboardList size={15} />
                    Reservation ID
                  </label>

                  <input
                    type="number"
                    name="reservation_id"
                    value={formData.reservation_id}
                    onChange={handleFormChange}
                    min="1"
                    placeholder="Optional"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <ShoppingBag size={15} />
                    Order ID
                  </label>

                  <input
                    type="number"
                    name="order_id"
                    value={formData.order_id}
                    onChange={handleFormChange}
                    min="1"
                    placeholder="Optional"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400">
                At least one of Customer, Reservation, or Order
                must be provided.
              </p>

              {/* Amount + Method */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Amount
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
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
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  >
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">
                      Bank Transfer
                    </option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              {/* Transaction Reference */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Transaction Reference
                </label>

                <input
                  type="text"
                  name="transaction_reference"
                  value={formData.transaction_reference}
                  onChange={handleFormChange}
                  placeholder="e.g. MPESA transaction code"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Initial Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={actionLoading}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: "#102A43" }}
                >
                  {actionLoading
                    ? "Saving..."
                    : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Trash2 size={22} />
              </div>

              <h2
                className="text-lg font-bold"
                style={{ color: "#102A43" }}
              >
                Delete Payment
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to delete payment{" "}
                <span className="font-semibold text-gray-700">
                  {selectedPayment.payment_id}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={actionLoading}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeletePayment}
                  disabled={actionLoading}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading
                    ? "Deleting..."
                    : "Delete Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;