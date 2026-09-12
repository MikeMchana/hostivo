import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Users,
  UtensilsCrossed,
  MoreVertical,
  CheckCircle2,
  Clock3,
  CircleDot,
  Trash2,
  X,
  LogIn,
  LogOut,
  CalendarDays,
  Check,
  Ban,
  Phone,
  Mail,
} from "lucide-react";

import {
  getTables,
  createTable,
  reserveTable,
  occupyTable,
  releaseTable,
  deleteTable,
} from "../../services/tables";

import {
  getTableReservations,
  confirmTableReservation,
  cancelTableReservation,
} from "../../services/tableReservations";

const statusStyles = {
  Available: "bg-green-100 text-green-700",
  Occupied: "bg-blue-100 text-blue-700",
  Reserved: "bg-yellow-100 text-yellow-700",
};

const reservationStatusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function Tables() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sectionFilter, setSectionFilter] = useState("All Sections");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReservations, setIsLoadingReservations] =
    useState(true);

  const [error, setError] = useState("");
  const [reservationError, setReservationError] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [tableNumber, setTableNumber] = useState("");
  const [section, setSection] = useState("Main Dining");
  const [capacity, setCapacity] = useState("");
  const [tableStatus, setTableStatus] = useState("available");

  const [isSaving, setIsSaving] = useState(false);

  const [openActionId, setOpenActionId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [reservationActionId, setReservationActionId] =
    useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTables();
    loadReservations();
  }, []);

  async function loadTables() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getTables();

      setTables(data);
    } catch (err) {
      setError(
        err.message || "Failed to load restaurant tables"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadReservations() {
    try {
      setIsLoadingReservations(true);
      setReservationError("");

      const data = await getTableReservations();

      setReservations(data);
    } catch (err) {
      setReservationError(
        err.message || "Failed to load table reservations"
      );
    } finally {
      setIsLoadingReservations(false);
    }
  }

  const formattedTables = useMemo(() => {
    return tables.map((table) => ({
      ...table,
      displayNumber: `Table ${table.table_number}`,
      displayId: `TABLE-${String(table.id).padStart(2, "0")}`,
      displayStatus:
        table.status.charAt(0).toUpperCase() +
        table.status.slice(1),
    }));
  }, [tables]);

  const sections = useMemo(() => {
    const uniqueSections = [
      ...new Set(tables.map((table) => table.section)),
    ];

    return uniqueSections.sort();
  }, [tables]);

  const filteredTables = useMemo(() => {
    return formattedTables.filter((table) => {
      const matchesSearch =
        table.displayNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        table.table_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        table.section
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesSection =
        sectionFilter === "All Sections" ||
        table.section === sectionFilter;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        table.displayStatus === statusFilter;

      return (
        matchesSearch &&
        matchesSection &&
        matchesStatus
      );
    });
  }, [
    formattedTables,
    searchTerm,
    sectionFilter,
    statusFilter,
  ]);

  const totalTables = tables.length;

  const availableTables = tables.filter(
    (table) => table.status === "available"
  ).length;

  const occupiedTables = tables.filter(
    (table) => table.status === "occupied"
  ).length;

  const reservedTables = tables.filter(
    (table) => table.status === "reserved"
  ).length;

  const pendingReservations = reservations.filter(
    (reservation) => reservation.status === "pending"
  ).length;

  function resetAddForm() {
    setTableNumber("");
    setSection("Main Dining");
    setCapacity("");
    setTableStatus("available");
  }

  function closeAddModal() {
    if (isSaving) {
      return;
    }

    setIsAddModalOpen(false);
    resetAddForm();
  }

  async function handleCreateTable(event) {
    event.preventDefault();

    if (!tableNumber.trim()) {
      setError("Table number is required.");
      return;
    }

    if (!capacity || Number(capacity) <= 0) {
      setError("Capacity must be greater than 0.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const newTable = await createTable({
        table_number: tableNumber.trim(),
        section,
        capacity: Number(capacity),
        status: tableStatus,
      });

      setTables((currentTables) => [
        ...currentTables,
        newTable,
      ]);

      setIsAddModalOpen(false);
      resetAddForm();
    } catch (err) {
      setError(err.message || "Failed to create table");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReserve(tableId) {
    try {
      setActionLoadingId(tableId);
      setError("");
      setOpenActionId(null);

      const updatedTable = await reserveTable(tableId);

      setTables((currentTables) =>
        currentTables.map((table) =>
          table.id === tableId ? updatedTable : table
        )
      );
    } catch (err) {
      setError(err.message || "Failed to reserve table");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleOccupy(tableId) {
    try {
      setActionLoadingId(tableId);
      setError("");
      setOpenActionId(null);

      const updatedTable = await occupyTable(tableId);

      setTables((currentTables) =>
        currentTables.map((table) =>
          table.id === tableId ? updatedTable : table
        )
      );
    } catch (err) {
      setError(err.message || "Failed to occupy table");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleRelease(tableId) {
    try {
      setActionLoadingId(tableId);
      setError("");
      setOpenActionId(null);

      const updatedTable = await releaseTable(tableId);

      setTables((currentTables) =>
        currentTables.map((table) =>
          table.id === tableId ? updatedTable : table
        )
      );
    } catch (err) {
      setError(err.message || "Failed to release table");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDeleteTable() {
    if (!deleteTarget) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      await deleteTable(deleteTarget.id);

      setTables((currentTables) =>
        currentTables.filter(
          (table) => table.id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Failed to delete table");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleConfirmReservation(reservationId) {
    try {
      setReservationActionId(reservationId);
      setReservationError("");

      const updatedReservation =
        await confirmTableReservation(reservationId);

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === reservationId
            ? updatedReservation
            : reservation
        )
      );
    } catch (err) {
      setReservationError(
        err.message || "Failed to confirm reservation"
      );
    } finally {
      setReservationActionId(null);
    }
  }

  async function handleCancelReservation(reservationId) {
    try {
      setReservationActionId(reservationId);
      setReservationError("");

      const updatedReservation =
        await cancelTableReservation(reservationId);

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === reservationId
            ? updatedReservation
            : reservation
        )
      );
    } catch (err) {
      setReservationError(
        err.message || "Failed to cancel reservation"
      );
    } finally {
      setReservationActionId(null);
    }
  }

  function formatReservationDate(dateString) {
    if (!dateString) {
      return "—";
    }

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatReservationTime(timeString) {
    if (!timeString) {
      return "—";
    }

    const [hours, minutes] = timeString
      .split(":")
      .map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      return timeString;
    }

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-KE", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#C89B3C] font-semibold mb-2">
            Restaurant Management
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#102A43]">
            Tables
          </h1>

          <p className="text-slate-500 mt-2">
            Manage restaurant tables, seating and reservations.
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C89B3C] text-white font-semibold hover:bg-[#b88a2f] transition"
        >
          <Plus size={19} />
          Add Table
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Tables
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {totalTables}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Restaurant tables
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UtensilsCrossed size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Available
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {availableTables}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Ready for guests
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Occupied
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {occupiedTables}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Currently in use
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Reserved
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {reservedTables}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Tables in use
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <Clock3 size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Pending Bookings
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {pendingReservations}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Awaiting confirmation
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <CalendarDays size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 md:p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#102A43]">
                All Tables
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                View and manage restaurant seating.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search tables..."
                  className="w-full sm:w-60 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                />
              </div>

              {/* Section Filter */}
              <select
                value={sectionFilter}
                onChange={(event) =>
                  setSectionFilter(event.target.value)
                }
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 outline-none focus:border-[#C89B3C] bg-white"
              >
                <option>All Sections</option>

                {sections.map((sectionName) => (
                  <option
                    key={sectionName}
                    value={sectionName}
                  >
                    {sectionName}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 outline-none focus:border-[#C89B3C] bg-white"
              >
                <option>All Statuses</option>
                <option>Available</option>
                <option>Occupied</option>
                <option>Reserved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="px-6 py-16 text-center">
            <div className="inline-flex items-center gap-3 text-slate-500">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-[#C89B3C] rounded-full animate-spin" />
              Loading tables...
            </div>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <UtensilsCrossed size={24} />
            </div>

            <h3 className="mt-4 font-semibold text-[#102A43]">
              No tables found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Table
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Section
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Capacity
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Current Guest
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Order
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTables.map((table) => (
                    <tr
                      key={table.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[#102A43]/5 text-[#102A43] flex items-center justify-center">
                            <CircleDot size={19} />
                          </div>

                          <div>
                            <p className="font-semibold text-[#102A43]">
                              {table.displayNumber}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              {table.displayId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600">
                          {table.section}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users size={16} />
                          {table.capacity} guests
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-400">
                          —
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-400">
                          —
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
                            statusStyles[table.displayStatus]
                          }`}
                        >
                          {table.displayStatus}
                        </span>
                      </td>

                      <td className="px-6 py-5 relative">
                        {actionLoadingId === table.id ? (
                          <div className="p-2">
                            <div className="w-5 h-5 border-2 border-slate-300 border-t-[#C89B3C] rounded-full animate-spin" />
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                setOpenActionId(
                                  openActionId === table.id
                                    ? null
                                    : table.id
                                )
                              }
                              className="p-2 rounded-lg text-slate-400 hover:text-[#102A43] hover:bg-slate-100 transition"
                              aria-label={`Actions for ${table.displayNumber}`}
                            >
                              <MoreVertical size={19} />
                            </button>

                            {openActionId === table.id && (
                              <div className="absolute right-6 top-14 z-20 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                {table.status === "available" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleReserve(table.id)
                                      }
                                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                                    >
                                      <Clock3 size={16} />
                                      Reserve Table
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleOccupy(table.id)
                                      }
                                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                                    >
                                      <LogIn size={16} />
                                      Occupy Table
                                    </button>
                                  </>
                                )}

                                {table.status === "reserved" && (
                                  <button
                                    onClick={() =>
                                      handleOccupy(table.id)
                                    }
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                                  >
                                    <LogIn size={16} />
                                    Occupy Table
                                  </button>
                                )}

                                {table.status === "occupied" && (
                                  <button
                                    onClick={() =>
                                      handleRelease(table.id)
                                    }
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
                                  >
                                    <LogOut size={16} />
                                    Release Table
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    setOpenActionId(null);
                                    setDeleteTarget(table);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
                                >
                                  <Trash2 size={16} />
                                  Delete Table
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {filteredTables.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                  {totalTables}
                </span>{" "}
                tables
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-400 cursor-not-allowed"
                >
                  Previous
                </button>

                <button className="px-3 py-2 rounded-lg bg-[#102A43] text-white text-sm">
                  1
                </button>

                <button
                  disabled
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-400 cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ====================================================== */}
      {/* TABLE RESERVATIONS */}
      {/* ====================================================== */}

      <section className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#102A43]">
                Table Reservations
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Reservations submitted from the public website.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-50 text-yellow-700 text-sm font-medium">
              <Clock3 size={16} />
              {pendingReservations} pending
            </div>
          </div>
        </div>

        {reservationError && (
          <div className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {reservationError}
          </div>
        )}

        {isLoadingReservations ? (
          <div className="px-6 py-16 text-center">
            <div className="inline-flex items-center gap-3 text-slate-500">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-[#C89B3C] rounded-full animate-spin" />
              Loading reservations...
            </div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <CalendarDays size={24} />
            </div>

            <h3 className="mt-4 font-semibold text-[#102A43]">
              No table reservations yet
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Public restaurant reservations will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Guest
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Contact
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date & Time
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Guests
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Table
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-slate-50/70 transition"
                  >
                    {/* Guest */}
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-[#102A43]">
                          {reservation.customer_name ||
                            "Unknown Guest"}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Reservation #
                          {String(reservation.id).padStart(
                            4,
                            "0"
                          )}
                        </p>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        {reservation.customer_phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone size={14} />
                            {reservation.customer_phone}
                          </div>
                        )}

                        {reservation.customer_email && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Mail size={13} />
                            {reservation.customer_email}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {formatReservationDate(
                            reservation.reservation_date
                          )}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {formatReservationTime(
                            reservation.reservation_time
                          )}
                        </p>
                      </div>
                    </td>

                    {/* Guests */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users size={16} />
                        {reservation.guests}
                      </div>
                    </td>

                    {/* Table */}
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {reservation.table_number
                            ? `Table ${reservation.table_number}`
                            : "—"}
                        </p>

                        {reservation.table_section && (
                          <p className="text-xs text-slate-400 mt-1">
                            {reservation.table_section}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                          reservationStatusStyles[
                            reservation.status
                          ] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      {reservationActionId ===
                      reservation.id ? (
                        <div className="w-5 h-5 border-2 border-slate-300 border-t-[#C89B3C] rounded-full animate-spin" />
                      ) : (
                        <div className="flex items-center gap-2">
                          {reservation.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleConfirmReservation(
                                    reservation.id
                                  )
                                }
                                title="Confirm reservation"
                                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                              >
                                <Check size={17} />
                              </button>

                              <button
                                onClick={() =>
                                  handleCancelReservation(
                                    reservation.id
                                  )
                                }
                                title="Cancel reservation"
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                              >
                                <Ban size={17} />
                              </button>
                            </>
                          )}

                          {reservation.status ===
                            "confirmed" && (
                            <button
                              onClick={() =>
                                handleCancelReservation(
                                  reservation.id
                                )
                              }
                              title="Cancel reservation"
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            >
                              <Ban size={17} />
                            </button>
                          )}

                          {reservation.status ===
                            "cancelled" && (
                            <span className="text-xs text-slate-400">
                              No actions
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add Table Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden my-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">
                  Add Table
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Add a new restaurant table.
                </p>
              </div>

              <button
                onClick={closeAddModal}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                aria-label="Close add table modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTable}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Table Number
                  </label>

                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(event) =>
                      setTableNumber(event.target.value)
                    }
                    placeholder="e.g. 1"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Section
                  </label>

                  <select
                    value={section}
                    onChange={(event) =>
                      setSection(event.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 outline-none focus:border-[#C89B3C] bg-white"
                  >
                    <option>Main Dining</option>
                    <option>Terrace</option>
                    <option>Private Dining</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Capacity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(event) =>
                      setCapacity(event.target.value)
                    }
                    placeholder="e.g. 4"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Initial Status
                  </label>

                  <select
                    value={tableStatus}
                    onChange={(event) =>
                      setTableStatus(event.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 outline-none focus:border-[#C89B3C] bg-white"
                  >
                    <option value="available">
                      Available
                    </option>
                    <option value="reserved">
                      Reserved
                    </option>
                    <option value="occupied">
                      Occupied
                    </option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C89B3C] text-white text-sm font-semibold hover:bg-[#b88a2f] transition disabled:opacity-60"
                >
                  {isSaving && (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}

                  {isSaving ? "Adding..." : "Add Table"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 size={22} />
              </div>

              <h2 className="text-xl font-bold text-[#102A43] mt-5">
                Delete Table?
              </h2>

              <p className="text-sm text-slate-500 mt-2 leading-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  Table {deleteTarget.table_number}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteTable}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
              >
                {isDeleting && (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}

                {isDeleting ? "Deleting..." : "Delete Table"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tables;