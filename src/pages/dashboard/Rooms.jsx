import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  BedDouble,
  Users,
  MoreVertical,
  X,
} from "lucide-react";

import {
  getRooms,
  createRoom,
  updateRoom,
  markRoomAvailable,
  markRoomMaintenance,
  restoreRoom,
  markRoomInactive,
  reactivateRoom,
  deleteRoom,
} from "../../services/rooms";

const statusStyles = {
  Available: "bg-green-100 text-green-700",
  Occupied: "bg-blue-100 text-blue-700",
  Cleaning: "bg-yellow-100 text-yellow-700",
  Maintenance: "bg-red-100 text-red-700",
  Inactive: "bg-slate-200 text-slate-700",
};

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [formError, setFormError] = useState("");

  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [updatingRoom, setUpdatingRoom] = useState(false);
  const [editFormError, setEditFormError] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    room_number: "",
    room_type: "",
    floor: "",
    capacity: "",
    price_per_night: "",
    status: "available",
  });

  const [editFormData, setEditFormData] = useState({
    room_number: "",
    room_type: "",
    floor: "",
    capacity: "",
    price_per_night: "",
  });

  async function loadRooms() {
    try {
      setLoading(true);
      setError("");

      const data = await getRooms();

      const formattedRooms = data.map((room) => ({
        id: room.id,
        number: room.room_number,
        type: room.room_type,
        floor: `${room.floor}${
          room.floor === 1
            ? "st"
            : room.floor === 2
            ? "nd"
            : room.floor === 3
            ? "rd"
            : "th"
        } Floor`,
        capacity: room.capacity,
        price: Number(room.price_per_night),
        status:
          room.status.charAt(0).toUpperCase() +
          room.status.slice(1),
      }));

      setRooms(formattedRooms);
    } catch (err) {
      setError("Unable to load rooms.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "Available"
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "Occupied"
  ).length;

  const maintenanceRooms = rooms.filter(
    (room) => room.status === "Maintenance"
  ).length;

  const inactiveRooms = rooms.filter(
    (room) => room.status === "Inactive"
  ).length;

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        room.type
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All Statuses" ||
        room.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rooms, searchTerm, statusFilter]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleEditInputChange(event) {
    const { name, value } = event.target;

    setEditFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openAddRoomModal() {
    setFormError("");

    setFormData({
      room_number: "",
      room_type: "",
      floor: "",
      capacity: "",
      price_per_night: "",
      status: "available",
    });

    setIsAddRoomOpen(true);
  }

  function closeAddRoomModal() {
    if (creatingRoom) {
      return;
    }

    setIsAddRoomOpen(false);
    setFormError("");
  }

  function openEditRoomModal(room) {
    setOpenMenuId(null);
    setEditFormError("");
    setEditingRoom(room);

    const floorNumber = parseInt(
      room.floor.replace(/\D/g, ""),
      10
    );

    setEditFormData({
      room_number: room.number,
      room_type: room.type,
      floor: floorNumber.toString(),
      capacity: room.capacity.toString(),
      price_per_night: room.price.toString(),
    });

    setIsEditRoomOpen(true);
  }

  function closeEditRoomModal() {
    if (updatingRoom) {
      return;
    }

    setIsEditRoomOpen(false);
    setEditingRoom(null);
    setEditFormError("");
  }

  async function handleCreateRoom(event) {
    event.preventDefault();

    setFormError("");

    if (
      !formData.room_number.trim() ||
      !formData.room_type.trim() ||
      !formData.floor ||
      !formData.capacity ||
      !formData.price_per_night
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const floor = Number(formData.floor);
    const capacity = Number(formData.capacity);
    const pricePerNight = Number(
      formData.price_per_night
    );

    if (!Number.isInteger(floor) || floor < 1) {
      setFormError(
        "Floor must be a valid positive number."
      );
      return;
    }

    if (
      !Number.isInteger(capacity) ||
      capacity < 1
    ) {
      setFormError(
        "Capacity must be a valid positive number."
      );
      return;
    }

    if (
      !Number.isFinite(pricePerNight) ||
      pricePerNight <= 0
    ) {
      setFormError(
        "Price per night must be greater than 0."
      );
      return;
    }

    try {
      setCreatingRoom(true);

      await createRoom({
        room_number: formData.room_number.trim(),
        room_type: formData.room_type.trim(),
        floor,
        capacity,
        price_per_night: pricePerNight,
        status: formData.status,
      });

      setIsAddRoomOpen(false);

      await loadRooms();
    } catch (err) {
      setFormError(
        err.message || "Unable to create room."
      );
    } finally {
      setCreatingRoom(false);
    }
  }

  async function handleUpdateRoom(event) {
    event.preventDefault();

    setEditFormError("");

    if (!editingRoom) {
      return;
    }

    if (
      !editFormData.room_number.trim() ||
      !editFormData.room_type.trim() ||
      !editFormData.floor ||
      !editFormData.capacity ||
      !editFormData.price_per_night
    ) {
      setEditFormError(
        "Please fill in all required fields."
      );
      return;
    }

    const floor = Number(editFormData.floor);
    const capacity = Number(editFormData.capacity);
    const pricePerNight = Number(
      editFormData.price_per_night
    );

    if (!Number.isInteger(floor) || floor < 1) {
      setEditFormError(
        "Floor must be a valid positive number."
      );
      return;
    }

    if (
      !Number.isInteger(capacity) ||
      capacity < 1
    ) {
      setEditFormError(
        "Capacity must be a valid positive number."
      );
      return;
    }

    if (
      !Number.isFinite(pricePerNight) ||
      pricePerNight <= 0
    ) {
      setEditFormError(
        "Price per night must be greater than 0."
      );
      return;
    }

    try {
      setUpdatingRoom(true);

      await updateRoom(editingRoom.id, {
        room_number:
          editFormData.room_number.trim(),
        room_type:
          editFormData.room_type.trim(),
        floor,
        capacity,
        price_per_night: pricePerNight,
      });

      setIsEditRoomOpen(false);
      setEditingRoom(null);

      await loadRooms();
    } catch (err) {
      setEditFormError(
        err.message || "Unable to update room."
      );
    } finally {
      setUpdatingRoom(false);
    }
  }

  async function handleRoomAction(action, room) {
    setOpenMenuId(null);
    setError("");

    if (action === "edit") {
      openEditRoomModal(room);
      return;
    }

    try {
      setActionLoading(true);

      if (action === "maintenance") {
        await markRoomMaintenance(room.id);
      }

      if (action === "available") {
        await markRoomAvailable(room.id);
      }

      if (action === "restore") {
        await restoreRoom(room.id);
      }

      if (action === "inactive") {
        const confirmed = window.confirm(
          `Are you sure you want to mark Room ${room.number} as inactive?`
        );

        if (!confirmed) {
          return;
        }

        await markRoomInactive(room.id);
      }

      if (action === "reactivate") {
        const confirmed = window.confirm(
          `Are you sure you want to reactivate Room ${room.number}?`
        );

        if (!confirmed) {
          return;
        }

        await reactivateRoom(room.id);
      }

      if (action === "delete") {
        const confirmed = window.confirm(
          `Are you sure you want to delete Room ${room.number}?`
        );

        if (!confirmed) {
          return;
        }

        await deleteRoom(room.id);
      }

      await loadRooms();
    } catch (err) {
      setError(
        err.message ||
          "Unable to complete room action."
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#C89B3C] font-semibold mb-2">
            Hotel Management
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#102A43]">
            Rooms
          </h1>

          <p className="text-slate-500 mt-2">
            Manage rooms, availability and room status.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddRoomModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C89B3C] text-white font-semibold hover:bg-[#b88a2f] transition"
        >
          <Plus size={19} />
          Add Room
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Rooms
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {totalRooms}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BedDouble size={21} />
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
                {availableRooms}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <BedDouble size={21} />
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
                {occupiedRooms}
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
                Maintenance
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {maintenanceRooms}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <BedDouble size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Inactive
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {inactiveRooms}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <BedDouble size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Room Management */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 md:p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#102A43]">
                All Rooms
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                View and manage your hotel rooms.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full sm:w-60 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 outline-none focus:border-[#C89B3C] bg-white"
              >
                <option>All Statuses</option>
                <option>Available</option>
                <option>Occupied</option>
                <option>Cleaning</option>
                <option>Maintenance</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="px-6 py-12 text-center text-slate-500">
            Loading rooms...
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="px-6 py-12 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          filteredRooms.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-500">
              No rooms found.
            </div>
          )}

        {/* Room Table */}
        {!loading &&
          !error &&
          filteredRooms.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Room
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Type
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Floor
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Capacity
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Price / Night
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRooms.map((room) => (
                    <tr
                      key={room.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#102A43]/5 text-[#102A43] flex items-center justify-center">
                            <BedDouble size={19} />
                          </div>

                          <span className="font-semibold text-[#102A43]">
                            Room {room.number}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600">
                          {room.type}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-600">
                          {room.floor}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users size={16} />
                          {room.capacity} guests
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-semibold text-[#102A43]">
                          KSh{" "}
                          {room.price.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
                            statusStyles[room.status]
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="relative flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === room.id
                                  ? null
                                  : room.id
                              )
                            }
                            disabled={actionLoading}
                            className="p-2 rounded-lg text-slate-400 hover:text-[#102A43] hover:bg-slate-100 transition disabled:opacity-50"
                            aria-label={`Actions for room ${room.number}`}
                          >
                            <MoreVertical size={19} />
                          </button>

                          {openMenuId === room.id && (
                            <div className="absolute right-0 top-12 z-20 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleRoomAction(
                                    "edit",
                                    room
                                  )
                                }
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                              >
                                Edit Room
                              </button>

                              {room.status === "Available" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRoomAction(
                                        "maintenance",
                                        room
                                      )
                                    }
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                                  >
                                    Mark Maintenance
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRoomAction(
                                        "inactive",
                                        room
                                      )
                                    }
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                                  >
                                    Mark Inactive
                                  </button>
                                </>
                              )}

                              {room.status === "Cleaning" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRoomAction(
                                      "available",
                                      room
                                    )
                                  }
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                                >
                                  Mark Available
                                </button>
                              )}

                              {room.status === "Maintenance" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRoomAction(
                                      "restore",
                                      room
                                    )
                                  }
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                                >
                                  Restore Room
                                </button>
                              )}

                              {room.status === "Inactive" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRoomAction(
                                      "reactivate",
                                      room
                                    )
                                  }
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                                >
                                  Reactivate Room
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  handleRoomAction(
                                    "delete",
                                    room
                                  )
                                }
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                              >
                                Delete Room
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        {/* Footer */}
        {!loading && !error && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {filteredRooms.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {rooms.length}
              </span>{" "}
              rooms
            </p>

            <div className="flex items-center gap-2">
              <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition">
                Previous
              </button>

              <button className="px-3 py-2 rounded-lg bg-[#102A43] text-white text-sm">
                1
              </button>

              <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition">
                2
              </button>

              <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition">
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Add Room Modal */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeAddRoomModal}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">
                  Add Room
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Add a new room to your hotel.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddRoomModal}
                disabled={creatingRoom}
                className="p-2 rounded-lg text-slate-400 hover:text-[#102A43] hover:bg-slate-100 transition disabled:opacity-50"
                aria-label="Close add room modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateRoom}>
              <div className="p-6 space-y-5">
                {formError && (
                  <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                    {formError}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="room_number"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Room Number
                    </label>

                    <input
                      id="room_number"
                      name="room_number"
                      type="text"
                      value={formData.room_number}
                      onChange={handleInputChange}
                      placeholder="e.g. 103"
                      disabled={creatingRoom}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="room_type"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Room Type
                    </label>

                    <input
                      id="room_type"
                      name="room_type"
                      type="text"
                      value={formData.room_type}
                      onChange={handleInputChange}
                      placeholder="e.g. Deluxe"
                      disabled={creatingRoom}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="floor"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Floor
                    </label>

                    <input
                      id="floor"
                      name="floor"
                      type="number"
                      min="1"
                      value={formData.floor}
                      onChange={handleInputChange}
                      placeholder="e.g. 1"
                      disabled={creatingRoom}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="capacity"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Capacity
                    </label>

                    <input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="e.g. 2"
                      disabled={creatingRoom}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price_per_night"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Price Per Night
                    </label>

                    <input
                      id="price_per_night"
                      name="price_per_night"
                      type="number"
                      min="1"
                      step="0.01"
                      value={formData.price_per_night}
                      onChange={handleInputChange}
                      placeholder="e.g. 8500"
                      disabled={creatingRoom}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Status
                    </label>

                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={creatingRoom}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 outline-none focus:border-[#C89B3C] bg-white disabled:bg-slate-50"
                    >
                      <option value="available">
                        Available
                      </option>
                      <option value="occupied">
                        Occupied
                      </option>
                      <option value="cleaning">
                        Cleaning
                      </option>
                      <option value="maintenance">
                        Maintenance
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={closeAddRoomModal}
                  disabled={creatingRoom}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingRoom}
                  className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#0b2034] transition disabled:opacity-60"
                >
                  {creatingRoom
                    ? "Adding Room..."
                    : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {isEditRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeEditRoomModal}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">
                  Edit Room
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update the details for Room{" "}
                  {editingRoom?.number}.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditRoomModal}
                disabled={updatingRoom}
                className="p-2 rounded-lg text-slate-400 hover:text-[#102A43] hover:bg-slate-100 transition disabled:opacity-50"
                aria-label="Close edit room modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateRoom}>
              <div className="p-6 space-y-5">
                {editFormError && (
                  <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                    {editFormError}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="edit_room_number"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Room Number
                    </label>

                    <input
                      id="edit_room_number"
                      name="room_number"
                      type="text"
                      value={editFormData.room_number}
                      onChange={handleEditInputChange}
                      disabled={updatingRoom}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit_room_type"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Room Type
                    </label>

                    <input
                      id="edit_room_type"
                      name="room_type"
                      type="text"
                      value={editFormData.room_type}
                      onChange={handleEditInputChange}
                      disabled={updatingRoom}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit_floor"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Floor
                    </label>

                    <input
                      id="edit_floor"
                      name="floor"
                      type="number"
                      min="1"
                      value={editFormData.floor}
                      onChange={handleEditInputChange}
                      disabled={updatingRoom}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit_capacity"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Capacity
                    </label>

                    <input
                      id="edit_capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      value={editFormData.capacity}
                      onChange={handleEditInputChange}
                      disabled={updatingRoom}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit_price_per_night"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Price Per Night
                    </label>

                    <input
                      id="edit_price_per_night"
                      name="price_per_night"
                      type="number"
                      min="1"
                      step="0.01"
                      value={
                        editFormData.price_per_night
                      }
                      onChange={handleEditInputChange}
                      disabled={updatingRoom}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 disabled:bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={closeEditRoomModal}
                  disabled={updatingRoom}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingRoom}
                  className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#0b2034] transition disabled:opacity-60"
                >
                  {updatingRoom
                    ? "Saving Changes..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;