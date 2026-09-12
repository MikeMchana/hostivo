import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  CalendarDays,
  Users,
  BedDouble,
  MoreVertical,
  Eye,
  CheckCircle,
  LogIn,
  LogOut,
  XCircle,
} from "lucide-react";
import { apiRequest } from "../../services/api";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  async function fetchReservations() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        "/reservations/",
        {},
        "Failed to fetch reservations"
      );

      setReservations(data);
    } catch (err) {
      setError(err.message || "Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  function toggleMenu(reservationId) {
    setOpenMenuId((currentId) =>
      currentId === reservationId ? null : reservationId
    );
  }

  function closeMenu() {
    setOpenMenuId(null);
  }

  async function handleReservationAction(
    reservationId,
    action,
    successMessage
  ) {
    try {
      setActionLoadingId(reservationId);
      setError("");
      closeMenu();

      await apiRequest(
        `/reservations/${reservationId}/${action}`,
        {
          method: "PATCH",
        },
        `Failed to ${action.replace("-", " ")} reservation`
      );

      await fetchReservations();

      console.log(successMessage);
    } catch (err) {
      setError(err.message || "Reservation action failed");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleCancelReservation(reservationId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmed) {
      return;
    }

    await handleReservationAction(
      reservationId,
      "cancel",
      "Reservation cancelled successfully"
    );
  }

  const filteredReservations = reservations.filter((reservation) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      String(reservation.id).includes(search) ||
      String(reservation.customer_id).includes(search) ||
      String(reservation.room_id).includes(search) ||
      reservation.customer_name?.toLowerCase().includes(search) ||
      reservation.customer_email?.toLowerCase().includes(search) ||
      reservation.customer_phone?.toLowerCase().includes(search) ||
      reservation.room_number?.toLowerCase().includes(search) ||
      reservation.room_type?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      reservation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalReservations = reservations.length;

  const pendingReservations = reservations.filter(
    (reservation) => reservation.status === "pending"
  ).length;

  const confirmedReservations = reservations.filter(
    (reservation) => reservation.status === "confirmed"
  ).length;

  const checkedInReservations = reservations.filter(
    (reservation) => reservation.status === "checked_in"
  ).length;

  function formatDate(dateString) {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatAmount(amount) {
    return `KSh ${Number(amount || 0).toLocaleString()}`;
  }

  function getStatusClasses(status) {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "checked_in":
        return "bg-green-100 text-green-700";

      case "checked_out":
        return "bg-slate-100 text-slate-600";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  function formatStatus(status) {
    return status
      ?.replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">
            Reservations
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage hotel room reservations and guest stays.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102A43] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#173b5d]">
          <Plus size={18} />
          New Reservation
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Reservations
              </p>

              <p className="mt-2 text-2xl font-bold text-[#102A43]">
                {totalReservations}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-[#102A43]">
                {pendingReservations}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Confirmed
              </p>

              <p className="mt-2 text-2xl font-bold text-[#102A43]">
                {confirmedReservations}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Checked In
              </p>

              <p className="mt-2 text-2xl font-bold text-[#102A43]">
                {checkedInReservations}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <Users size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#102A43] focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#102A43]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reservation
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Guest
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Room
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Stay
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Guests
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading reservations...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <BedDouble
                        size={40}
                        className="text-slate-300"
                      />

                      <p className="mt-3 text-sm font-medium text-slate-600">
                        No reservations found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Try adjusting your search or filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                  >
                    {/* Reservation */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-[#102A43]">
                          #{reservation.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Created{" "}
                          {formatDate(reservation.created_at)}
                        </p>
                      </div>
                    </td>

                    {/* Guest */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-700">
                          {reservation.customer_name ||
                            "Unknown Guest"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {reservation.customer_phone || "-"}
                        </p>

                        {reservation.customer_email && (
                          <p className="text-xs text-slate-400">
                            {reservation.customer_email}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Room */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">
                        Room {reservation.room_number || "-"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {reservation.room_type || "-"}
                      </p>
                    </td>

                    {/* Stay */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {formatDate(reservation.check_in)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        to {formatDate(reservation.check_out)}
                      </p>
                    </td>

                    {/* Guests */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users size={16} />
                        {reservation.guests}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#102A43]">
                        {formatAmount(reservation.total_amount)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          reservation.status
                        )}`}
                      >
                        {formatStatus(reservation.status)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="relative px-5 py-4 text-right">
                      {actionLoadingId === reservation.id ? (
                        <div className="inline-flex items-center justify-center px-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#102A43]" />
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              toggleMenu(reservation.id)
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#102A43]"
                            aria-label={`Actions for reservation ${reservation.id}`}
                            aria-expanded={
                              openMenuId === reservation.id
                            }
                          >
                            <MoreVertical size={19} />
                          </button>

                          {openMenuId === reservation.id && (
                            <div className="absolute right-6 top-14 z-30 w-52 rounded-xl border border-slate-200 bg-white py-2 text-left shadow-lg">
                              {/* View Details */}
                              <button
                                onClick={closeMenu}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                              >
                                <Eye
                                  size={17}
                                  className="text-slate-400"
                                />
                                View Details
                              </button>

                              {/* Confirm */}
                              {reservation.status === "pending" && (
                                <button
                                  onClick={() =>
                                    handleReservationAction(
                                      reservation.id,
                                      "confirm",
                                      "Reservation confirmed successfully"
                                    )
                                  }
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                >
                                  <CheckCircle
                                    size={17}
                                    className="text-blue-500"
                                  />
                                  Confirm Reservation
                                </button>
                              )}

                              {/* Check In */}
                              {(reservation.status ===
                                "confirmed" ||
                                reservation.status ===
                                  "pending") && (
                                <button
                                  onClick={() =>
                                    handleReservationAction(
                                      reservation.id,
                                      "check-in",
                                      "Guest checked in successfully"
                                    )
                                  }
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                >
                                  <LogIn
                                    size={17}
                                    className="text-green-500"
                                  />
                                  Check In
                                </button>
                              )}

                              {/* Check Out */}
                              {reservation.status ===
                                "checked_in" && (
                                <button
                                  onClick={() =>
                                    handleReservationAction(
                                      reservation.id,
                                      "check-out",
                                      "Guest checked out successfully"
                                    )
                                  }
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                >
                                  <LogOut
                                    size={17}
                                    className="text-slate-500"
                                  />
                                  Check Out
                                </button>
                              )}

                              {/* Cancel */}
                              {reservation.status !==
                                "cancelled" &&
                                reservation.status !==
                                  "checked_out" && (
                                  <>
                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                      onClick={() =>
                                        handleCancelReservation(
                                          reservation.id
                                        )
                                      }
                                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                                    >
                                      <XCircle size={17} />
                                      Cancel Reservation
                                    </button>
                                  </>
                                )}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filteredReservations.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {filteredReservations.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {reservations.length}
              </span>{" "}
              reservations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reservations;