import { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Users,
  UserCheck,
  CalendarDays,
  Building2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Trash2,
} from "lucide-react";

import {
  getEmployees,
  createEmployee,
  activateEmployee,
  placeEmployeeOnLeave,
  deactivateEmployee,
  deleteEmployee,
} from "../../services/employees";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    role: "",
    department: "",
    phone: "",
    email: "",
    date_joined: "",
    status: "active",
  });

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getEmployees();

      setEmployees(data);
    } catch (error) {
      setError(error.message || "Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const departments = useMemo(() => {
    const uniqueDepartments = [
      ...new Set(
        employees
          .map((employee) => employee.department)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueDepartments];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        employee.full_name?.toLowerCase().includes(search) ||
        employee.employee_id?.toLowerCase().includes(search) ||
        employee.role?.toLowerCase().includes(search) ||
        employee.department?.toLowerCase().includes(search) ||
        employee.phone?.toLowerCase().includes(search) ||
        employee.email?.toLowerCase().includes(search);

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        employee.status === statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    employees,
    searchTerm,
    departmentFilter,
    statusFilter,
  ]);

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "active"
  ).length;

  const employeesOnLeave = employees.filter(
    (employee) => employee.status === "on_leave"
  ).length;

  const totalDepartments = new Set(
    employees.map((employee) => employee.department)
  ).size;

  const getStatusLabel = (status) => {
    if (status === "on_leave") {
      return "On Leave";
    }

    if (status === "active") {
      return "Active";
    }

    if (status === "inactive") {
      return "Inactive";
    }

    return status;
  };

  const getStatusClasses = (status) => {
    if (status === "active") {
      return "bg-green-100 text-green-700";
    }

    if (status === "on_leave") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) {
      return "?";
    }

    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const resetForm = () => {
    setFormData({
      employee_id: "",
      full_name: "",
      role: "",
      department: "",
      phone: "",
      email: "",
      date_joined: "",
      status: "active",
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateEmployee = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const employee = await createEmployee({
        employee_id: formData.employee_id.trim(),
        full_name: formData.full_name.trim(),
        role: formData.role.trim(),
        department: formData.department.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        date_joined: formData.date_joined,
        status: "active",
      });

      setEmployees((current) => [...current, employee]);

      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      setError(error.message || "Failed to create employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivate = async (employee) => {
    try {
      setError("");

      const updatedEmployee = await activateEmployee(
        employee.id
      );

      setEmployees((current) =>
        current.map((item) =>
          item.id === updatedEmployee.id
            ? updatedEmployee
            : item
        )
      );

      setOpenMenu(null);
    } catch (error) {
      setError(error.message || "Failed to activate employee");
    }
  };

  const handleLeave = async (employee) => {
    try {
      setError("");

      const updatedEmployee =
        await placeEmployeeOnLeave(employee.id);

      setEmployees((current) =>
        current.map((item) =>
          item.id === updatedEmployee.id
            ? updatedEmployee
            : item
        )
      );

      setOpenMenu(null);
    } catch (error) {
      setError(
        error.message ||
          "Failed to place employee on leave"
      );
    }
  };

  const handleDeactivate = async (employee) => {
    try {
      setError("");

      const updatedEmployee =
        await deactivateEmployee(employee.id);

      setEmployees((current) =>
        current.map((item) =>
          item.id === updatedEmployee.id
            ? updatedEmployee
            : item
        )
      );

      setOpenMenu(null);
    } catch (error) {
      setError(
        error.message || "Failed to deactivate employee"
      );
    }
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.full_name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteEmployee(employee.id);

      setEmployees((current) =>
        current.filter((item) => item.id !== employee.id)
      );

      setOpenMenu(null);
    } catch (error) {
      setError(
        error.message || "Failed to delete employee"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">
            Employees
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage hotel staff and employee information
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#102A43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163A5C]"
        >
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Employees
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {totalEmployees}
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
                Active Employees
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {activeEmployees}
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
                On Leave
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {employeesOnLeave}
              </h2>
            </div>

            <div className="rounded-lg bg-yellow-50 p-3 text-[#C89B3C]">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Departments
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {totalDepartments}
              </h2>
            </div>

            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
              <Building2 size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Employees Table Card */}
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
                placeholder="Search employees..."
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
                value={departmentFilter}
                onChange={(event) =>
                  setDepartmentFilter(event.target.value)
                }
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
              >
                {departments.map((department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department === "All"
                      ? "All Departments"
                      : department}
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
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center px-5 py-16">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2
                size={20}
                className="animate-spin"
              />
              Loading employees...
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
                      Employee
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Department
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date Joined
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
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr
                        key={employee.id}
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#102A43] text-sm font-bold text-white">
                              {getInitials(
                                employee.full_name
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">
                                {employee.full_name}
                              </p>

                              <p className="text-xs text-gray-400">
                                {employee.employee_id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-gray-700">
                          {employee.role}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                            {employee.department}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-700">
                            {employee.phone}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {employee.email || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(
                            employee.date_joined
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              employee.status
                            )}`}
                          >
                            {getStatusLabel(
                              employee.status
                            )}
                          </span>
                        </td>

                        <td className="relative px-5 py-4">
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === employee.id
                                  ? null
                                  : employee.id
                              )
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#102A43]"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenu === employee.id && (
                            <div className="absolute right-5 top-12 z-20 w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                              {employee.status ===
                                "active" && (
                                <button
                                  onClick={() =>
                                    handleLeave(employee)
                                  }
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  Put on Leave
                                </button>
                              )}

                              {employee.status ===
                                "on_leave" && (
                                <button
                                  onClick={() =>
                                    handleActivate(
                                      employee
                                    )
                                  }
                                  className="block w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50"
                                >
                                  Return to Active
                                </button>
                              )}

                              {employee.status !==
                                "inactive" && (
                                <button
                                  onClick={() =>
                                    handleDeactivate(
                                      employee
                                    )
                                  }
                                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                  Deactivate
                                </button>
                              )}

                              {employee.status ===
                                "inactive" && (
                                <button
                                  onClick={() =>
                                    handleActivate(
                                      employee
                                    )
                                  }
                                  className="block w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50"
                                >
                                  Activate
                                </button>
                              )}

                              <button
                                onClick={() =>
                                  handleDelete(employee)
                                }
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                              >
                                <Trash2 size={15} />
                                Delete Employee
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-12 text-center text-sm text-gray-500"
                      >
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#102A43] text-sm font-bold text-white">
                          {getInitials(
                            employee.full_name
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {employee.full_name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {employee.employee_id}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === employee.id
                              ? null
                              : employee.id
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <p className="text-xs text-gray-400">
                          Role
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {employee.role}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Department
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {employee.department}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {employee.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm text-gray-700">
                          {employee.email || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Date Joined
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          {formatDate(
                            employee.date_joined
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Status
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            employee.status
                          )}`}
                        >
                          {getStatusLabel(
                            employee.status
                          )}
                        </span>
                      </div>
                    </div>

                    {openMenu === employee.id && (
                      <div className="mt-4 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        {employee.status ===
                          "active" && (
                          <button
                            onClick={() =>
                              handleLeave(employee)
                            }
                            className="block w-full border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-700 hover:bg-white"
                          >
                            Put on Leave
                          </button>
                        )}

                        {employee.status ===
                          "on_leave" && (
                          <button
                            onClick={() =>
                              handleActivate(
                                employee
                              )
                            }
                            className="block w-full border-b border-gray-100 px-4 py-3 text-left text-sm text-green-700 hover:bg-white"
                          >
                            Return to Active
                          </button>
                        )}

                        {employee.status !==
                          "inactive" && (
                          <button
                            onClick={() =>
                              handleDeactivate(
                                employee
                              )
                            }
                            className="block w-full border-b border-gray-100 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            Deactivate
                          </button>
                        )}

                        {employee.status ===
                          "inactive" && (
                          <button
                            onClick={() =>
                              handleActivate(
                                employee
                              )
                            }
                            className="block w-full border-b border-gray-100 px-4 py-3 text-left text-sm text-green-700 hover:bg-white"
                          >
                            Activate
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleDelete(employee)
                          }
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                          Delete Employee
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-5 py-12 text-center text-sm text-gray-500">
                  No employees found.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {filteredEmployees.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {employees.length}
                </span>{" "}
                employees
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="rounded-lg border border-gray-200 p-2 text-gray-400 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>

                <button className="rounded-lg bg-[#102A43] px-3 py-2 text-sm font-semibold text-white">
                  1
                </button>

                <button
                  disabled
                  className="rounded-lg border border-gray-200 p-2 text-gray-400 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">
                  Add Employee
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new member of staff
                </p>
              </div>

              <button
                onClick={() => {
                  if (!isSubmitting) {
                    setIsAddModalOpen(false);
                    resetForm();
                  }
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreateEmployee}
              className="p-6"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>

                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleFormChange}
                    placeholder="EMP-009"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleFormChange}
                    placeholder="John Doe"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Role
                  </label>

                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    placeholder="Receptionist"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    placeholder="Front Office"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
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
                    placeholder="+254 712 345 678"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
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
                    placeholder="employee@hostivo.com"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Date Joined
                  </label>

                  <input
                    type="date"
                    name="date_joined"
                    value={formData.date_joined}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!isSubmitting) {
                      setIsAddModalOpen(false);
                      resetForm();
                    }
                  }}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#102A43] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#163A5C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {isSubmitting
                    ? "Creating..."
                    : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;