import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  X,
} from "lucide-react";

import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  markMenuItemUnavailable,
  markMenuItemAvailable,
  deleteMenuItem,
} from "../../services/menu";

const statusStyles = {
  Available: "bg-green-100 text-green-700",
  Unavailable: "bg-red-100 text-red-700",
};

function formatMenuId(id) {
  return `MENU-${String(id).padStart(3, "0")}`;
}

function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [creatingMenuItem, setCreatingMenuItem] =
    useState(false);
  const [formError, setFormError] = useState("");

  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] =
    useState(null);
  const [updatingMenuItem, setUpdatingMenuItem] =
    useState(false);
  const [editFormError, setEditFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image_url: "",
    price: "",
    is_available: true,
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    description: "",
    image_url: "",
    price: "",
  });

  async function loadMenuItems() {
    try {
      setLoading(true);
      setError("");

      const data = await getMenuItems();

      const formattedItems = data.map((item) => ({
        id: item.id,
        displayId: formatMenuId(item.id),
        name: item.name,
        category: item.category,
        description: item.description || "",
        image_url: item.image_url || "",
        price: Number(item.price),
        is_available: item.is_available,
        status: item.is_available
          ? "Available"
          : "Unavailable",
      }));

      setMenuItems(formattedItems);
    } catch (err) {
      setError("Unable to load menu items.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenuItems();
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        menuItems.map((item) => item.category)
      ),
    ];
  }, [menuItems]);

  const totalItems = menuItems.length;

  const availableItems = menuItems.filter(
    (item) => item.is_available
  ).length;

  const unavailableItems = menuItems.filter(
    (item) => !item.is_available
  ).length;

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "All Categories" ||
        item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    menuItems,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  function openAddMenuModal() {
    setFormError("");

    setFormData({
      name: "",
      category: "",
      description: "",
      image_url: "",
      price: "",
      is_available: true,
    });

    setIsAddMenuOpen(true);
  }

  function closeAddMenuModal() {
    if (creatingMenuItem) {
      return;
    }

    setIsAddMenuOpen(false);
    setFormError("");
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleCreateMenuItem(event) {
    event.preventDefault();

    setFormError("");

    const name = formData.name.trim();
    const category = formData.category.trim();
    const description =
      formData.description.trim();
    const image_url =
      formData.image_url.trim();
    const price = Number(formData.price);

    if (!name || !category) {
      setFormError(
        "Name and category are required."
      );
      return;
    }

    if (!formData.price || price <= 0) {
      setFormError(
        "Please enter a valid price greater than zero."
      );
      return;
    }

    try {
      setCreatingMenuItem(true);

      await createMenuItem({
        name,
        category,
        description: description || null,
        image_url: image_url || null,
        price,
        is_available: formData.is_available,
      });

      setIsAddMenuOpen(false);

      setFormData({
        name: "",
        category: "",
        description: "",
        image_url: "",
        price: "",
        is_available: true,
      });

      await loadMenuItems();
    } catch (err) {
      setFormError(
        err.message ||
          "Unable to create menu item."
      );
    } finally {
      setCreatingMenuItem(false);
    }
  }

  function openEditMenuModal(item) {
    setEditingMenuItem(item);

    setEditFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      image_url: item.image_url,
      price: item.price,
    });

    setEditFormError("");
    setOpenMenuId(null);
    setIsEditMenuOpen(true);
  }

  function closeEditMenuModal() {
    if (updatingMenuItem) {
      return;
    }

    setIsEditMenuOpen(false);
    setEditingMenuItem(null);
    setEditFormError("");
  }

  function handleEditFormChange(event) {
    const { name, value } = event.target;

    setEditFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleUpdateMenuItem(event) {
    event.preventDefault();

    setEditFormError("");

    const name = editFormData.name.trim();
    const category =
      editFormData.category.trim();
    const description =
      editFormData.description.trim();
    const image_url =
      editFormData.image_url.trim();
    const price = Number(editFormData.price);

    if (!name || !category) {
      setEditFormError(
        "Name and category are required."
      );
      return;
    }

    if (!editFormData.price || price <= 0) {
      setEditFormError(
        "Please enter a valid price greater than zero."
      );
      return;
    }

    try {
      setUpdatingMenuItem(true);

      await updateMenuItem(
        editingMenuItem.id,
        {
          name,
          category,
          description: description || null,
          image_url: image_url || null,
          price,
        }
      );

      setIsEditMenuOpen(false);
      setEditingMenuItem(null);

      await loadMenuItems();
    } catch (err) {
      setEditFormError(
        err.message ||
          "Unable to update menu item."
      );
    } finally {
      setUpdatingMenuItem(false);
    }
  }

  async function handleMenuAction(action, item) {
    setOpenMenuId(null);
    setError("");

    if (action === "edit") {
      openEditMenuModal(item);
      return;
    }

    try {
      setActionLoading(true);

      if (action === "unavailable") {
        await markMenuItemUnavailable(item.id);
      }

      if (action === "available") {
        await markMenuItemAvailable(item.id);
      }

      if (action === "delete") {
        const confirmed = window.confirm(
          `Are you sure you want to delete ${item.name}?`
        );

        if (!confirmed) {
          return;
        }

        await deleteMenuItem(item.id);
      }

      await loadMenuItems();
    } catch (err) {
      setError(
        err.message ||
          "Unable to complete menu action."
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
            Restaurant Management
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#102A43]">
            Menu
          </h1>

          <p className="text-slate-500 mt-2">
            Manage restaurant menu items, prices and
            availability.
          </p>
        </div>

        <button
          onClick={openAddMenuModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C89B3C] text-white font-semibold hover:bg-[#b88a2f] transition"
        >
          <Plus size={19} />
          Add Menu Item
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Items
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {totalItems}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                All menu items
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
                {availableItems}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Currently available
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
                Unavailable
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {unavailableItems}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Temporarily unavailable
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Categories
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {categories.length}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Menu categories
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-[#C89B3C]/10 text-[#C89B3C] flex items-center justify-center">
              <UtensilsCrossed size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 md:p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#102A43]">
                All Menu Items
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                View and manage restaurant menu items.
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
                  placeholder="Search menu..."
                  className="w-full sm:w-60 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 outline-none focus:border-[#C89B3C] bg-white"
              >
                <option>All Categories</option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
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
                <option>Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-slate-500">
              Loading menu items...
            </p>
          </div>
        ) : filteredMenuItems.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <UtensilsCrossed size={24} />
            </div>

            <h3 className="font-semibold text-[#102A43]">
              No menu items found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Item
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Description
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Price
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredMenuItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition"
                  >
                    {/* Item */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-11 h-11 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-[#102A43]/5 text-[#102A43] flex items-center justify-center">
                            <UtensilsCrossed size={19} />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-[#102A43]">
                            {item.name}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {item.displayId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <span className="inline-flex px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                        {item.category}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-5 max-w-xs">
                      <p className="text-sm text-slate-500 truncate">
                        {item.description || "—"}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">
                      <span className="font-semibold text-[#102A43]">
                        KSh {item.price.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
                          statusStyles[item.status]
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === item.id
                                ? null
                                : item.id
                            )
                          }
                          disabled={actionLoading}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#102A43] hover:bg-slate-100 transition disabled:opacity-50"
                          aria-label={`Actions for ${item.name}`}
                        >
                          <MoreVertical size={19} />
                        </button>

                        {openMenuId === item.id && (
                          <div className="absolute right-0 top-10 z-20 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1">
                            <button
                              onClick={() =>
                                handleMenuAction(
                                  "edit",
                                  item
                                )
                              }
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Pencil size={16} />
                              Edit Menu Item
                            </button>

                            {item.is_available ? (
                              <button
                                onClick={() =>
                                  handleMenuAction(
                                    "unavailable",
                                    item
                                  )
                                }
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <PowerOff size={16} />
                                Mark Unavailable
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleMenuAction(
                                    "available",
                                    item
                                  )
                                }
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Power size={16} />
                                Mark Available
                              </button>
                            )}

                            <button
                              onClick={() =>
                                handleMenuAction(
                                  "delete",
                                  item
                                )
                              }
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete Menu Item
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
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {filteredMenuItems.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {totalItems}
            </span>{" "}
            menu items
          </p>
        </div>
      </section>

      {/* Add Menu Item Modal */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden my-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">
                  Add Menu Item
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Add a new item to the restaurant menu.
                </p>
              </div>

              <button
                onClick={closeAddMenuModal}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreateMenuItem}
              className="p-6 space-y-5"
            >
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Grilled Chicken"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>

                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="e.g. Main Course"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price
                  </label>

                  <input
                    name="price"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="e.g. 1200"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Image URL
                </label>

                <input
                  name="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={handleFormChange}
                  placeholder="https://example.com/menu-image.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                />

                <p className="text-xs text-slate-400 mt-2">
                  Use a direct image URL for the menu item.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Describe the menu item..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>

                <select
                  name="is_available"
                  value={String(formData.is_available)}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      is_available:
                        event.target.value === "true",
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#C89B3C] bg-white"
                >
                  <option value="true">
                    Available
                  </option>

                  <option value="false">
                    Unavailable
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAddMenuModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingMenuItem}
                  className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#0c2237] disabled:opacity-50"
                >
                  {creatingMenuItem
                    ? "Adding..."
                    : "Add Menu Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Menu Item Modal */}
      {isEditMenuOpen && editingMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden my-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">
                  Edit Menu Item
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update the menu item's information.
                </p>
              </div>

              <button
                onClick={closeEditMenuModal}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateMenuItem}
              className="p-6 space-y-5"
            >
              {editFormError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {editFormError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>

                <input
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>

                  <input
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price
                  </label>

                  <input
                    name="price"
                    type="number"
                    min="1"
                    step="0.01"
                    value={editFormData.price}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Image URL
                </label>

                <input
                  name="image_url"
                  type="url"
                  value={editFormData.image_url}
                  onChange={handleEditFormChange}
                  placeholder="https://example.com/menu-image.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                />

                <p className="text-xs text-slate-400 mt-2">
                  Use a direct image URL for the menu item.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditMenuModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updatingMenuItem}
                  className="px-5 py-2.5 rounded-xl bg-[#102A43] text-white text-sm font-semibold hover:bg-[#0c2237] disabled:opacity-50"
                >
                  {updatingMenuItem
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global action loading indicator */}
      {actionLoading && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#102A43] text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          Processing...
        </div>
      )}
    </div>
  );
}

export default Menu;