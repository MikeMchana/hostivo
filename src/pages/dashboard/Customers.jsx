import { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  MoreVertical,
  X,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";

import {
  getCustomers,
  createCustomer,
  activateCustomer,
  deactivateCustomer,
  deleteCustomer,
} from "../../services/customers";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [openMenu, setOpenMenu] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
  });

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomers();

      setCustomers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.full_name.toLowerCase().includes(search) ||
        customer.phone.toLowerCase().includes(search) ||
        (customer.email || "").toLowerCase().includes(search) ||
        (customer.address || "").toLowerCase().includes(search) ||
        String(customer.id).includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        customer.status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "active"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "inactive"
  ).length;

  function getInitials(name) {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function formatStatus(status) {
    if (status === "active") {
      return "Active";
    }

    if (status === "inactive") {
      return "Inactive";
    }

    return status || "Unknown";
  }

  function getStatusClasses(status) {
    if (status === "active") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-600";
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
      full_name: "",
      phone: "",
      email: "",
      address: "",
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

  async function handleCreateCustomer(event) {
    event.preventDefault();

    try {
      setActionLoading(true);
      setError("");

      await createCustomer({
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        status: "active",
      });

      setShowAddModal(false);

      await loadCustomers();
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleToggleStatus(customer) {
    try {
      setActionLoading(true);
      setError("");
      setOpenMenu(null);

      if (customer.status === "active") {
        await deactivateCustomer(customer.id);
      } else {
        await activateCustomer(customer.id);
      }

      await loadCustomers();
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  function openDeleteModal(customer) {
    setSelectedCustomer(customer);
    setOpenMenu(null);
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    if (actionLoading) {
      return;
    }

    setShowDeleteModal(false);
    setSelectedCustomer(null);
  }

  async function handleDeleteCustomer() {
    if (!selectedCustomer) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await deleteCustomer(selectedCustomer.id);

      setShowDeleteModal(false);
      setSelectedCustomer(null);

      await loadCustomers();
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
          <h1 className="text-2xl font-bold text-[#102A43]">
            Customers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage hotel guests and customer information
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#102A43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163A5C]"
        >
          <UserPlus size={18} />
          Add Customer
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
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Customers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {totalCustomers}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Customers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {activeCustomers}
              </h2>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <UserCheck size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Inactive Customers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {inactiveCustomers}
              </h2>
            </div>

            <div className="rounded-lg bg-gray-100 p-3 text-gray-600">
              <UserX size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table Card */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Filters */}
        <div className="border-b border-gray-100 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search customers..."
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

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">
                Status:
              </span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="px-5 py-16 text-center text-sm text-gray-500">
            Loading customers...
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Address
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
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#102A43] text-sm font-bold text-white">
                              {getInitials(customer.full_name)}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">
                                {customer.full_name}
                              </p>

                              <p className="text-xs text-gray-400">
                                Customer #{customer.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700">
                          {customer.phone}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {customer.email || "—"}
                        </td>

                        <td className="max-w-xs px-5 py-4 text-sm text-gray-600">
                          <span className="block truncate">
                            {customer.address || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              customer.status
                            )}`}
                          >
                            {formatStatus(customer.status)}
                          </span>
                        </td>

                        <td className="relative px-5 py-4">
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === customer.id
                                  ? null
                                  : customer.id
                              )
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#102A43]"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenu === customer.id && (
                            <div className="absolute right-5 top-12 z-20 w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                              <button
                                onClick={() =>
                                  handleToggleStatus(customer)
                                }
                                disabled={actionLoading}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                              >
                                {customer.status === "active" ? (
                                  <PowerOff size={16} />
                                ) : (
                                  <Power size={16} />
                                )}

                                {customer.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>

                              <button
                                onClick={() =>
                                  openDeleteModal(customer)
                                }
                                disabled={actionLoading}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                <Trash2 size={16} />
                                Delete Customer
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-12 text-center text-sm text-gray-500"
                      >
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <div key={customer.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#102A43] text-sm font-bold text-white">
                          {getInitials(customer.full_name)}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {customer.full_name}
                          </p>

                          <p className="text-xs text-gray-400">
                            Customer #{customer.id}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === customer.id
                              ? null
                              : customer.id
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {customer.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm text-gray-700">
                          {customer.email || "—"}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-400">
                          Address
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {customer.address || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Status
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            customer.status
                          )}`}
                        >
                          {formatStatus(customer.status)}
                        </span>
                      </div>
                    </div>

                    {openMenu === customer.id && (
                      <div className="mt-4 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        <button
                          onClick={() =>
                            handleToggleStatus(customer)
                          }
                          disabled={actionLoading}
                          className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-700 hover:bg-white disabled:opacity-50"
                        >
                          {customer.status === "active" ? (
                            <PowerOff size={16} />
                          ) : (
                            <Power size={16} />
                          )}

                          {customer.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                        <button
                          onClick={() =>
                            openDeleteModal(customer)
                          }
                          disabled={actionLoading}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          Delete Customer
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-5 py-12 text-center text-sm text-gray-500">
                  No customers found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {filteredCustomers.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {customers.length}
                </span>{" "}
                customers
              </p>
            </div>
          </>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto">
          <div className="my-auto w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#102A43]">
                  Add Customer
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create a new customer record
                </p>
              </div>

              <button
                onClick={closeAddModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreateCustomer}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter customer name"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  placeholder="+254..."
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="customer@example.com"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Customer address"
                  className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                />
              </div>

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
                  className="rounded-lg bg-[#102A43] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#163A5C] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading
                    ? "Saving..."
                    : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Trash2 size={22} />
              </div>

              <h2 className="text-lg font-bold text-[#102A43]">
                Delete Customer
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-700">
                  {selectedCustomer.full_name}
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
                  onClick={handleDeleteCustomer}
                  disabled={actionLoading}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {actionLoading
                    ? "Deleting..."
                    : "Delete Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;