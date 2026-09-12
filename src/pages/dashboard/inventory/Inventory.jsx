import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  MoreVertical,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import {
  getInventoryItems,
  createInventoryItem,
  addStock,
  removeStock,
  restockItem,
  deleteInventoryItem,
} from "../../../services/inventory";

const statusStyles = {
  "In Stock": "bg-green-50 text-green-700",
  "Low Stock": "bg-amber-50 text-amber-700",
  "Out of Stock": "bg-red-50 text-red-700",
};

function formatStatus(status) {
  if (status === "in_stock") {
    return "In Stock";
  }

  if (status === "low_stock") {
    return "Low Stock";
  }

  if (status === "out_of_stock") {
    return "Out of Stock";
  }

  return status || "Unknown";
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [stockModal, setStockModal] = useState(null);
  const [stockQuantity, setStockQuantity] = useState("");

  const [processingItemId, setProcessingItemId] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    current_stock: "",
    minimum_stock: "",
    unit: "",
    cost_price: "",
    supplier: "",
  });

  async function loadInventory() {
    try {
      setLoading(true);
      setError("");

      const data = await getInventoryItems();

      setInventoryItems(data);
    } catch (err) {
      setError(
        err.message || "Failed to load inventory items"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        inventoryItems
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.sort();
  }, [inventoryItems]);

  const filteredItems = inventoryItems.filter((item) => {
    const search = searchTerm.toLowerCase();

    const displayStatus = formatStatus(item.status);

    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      (item.supplier || "").toLowerCase().includes(search) ||
      String(item.id).includes(search);

    const matchesCategory =
      categoryFilter === "All" ||
      item.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" ||
      displayStatus === statusFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
    );
  });

  const totalItems = inventoryItems.length;

  const lowStockItems = inventoryItems.filter(
    (item) => item.status === "low_stock"
  ).length;

  const outOfStockItems = inventoryItems.filter(
    (item) => item.status === "out_of_stock"
  ).length;

  const inventoryValue = inventoryItems.reduce(
    (total, item) =>
      total +
      Number(item.current_stock || 0) *
        Number(item.cost_price || 0),
    0
  );

  function formatCurrency(amount) {
    return `KSh ${Number(amount || 0).toLocaleString()}`;
  }

  function handleNewItemChange(event) {
    const { name, value } = event.target;

    setNewItem((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetNewItemForm() {
    setNewItem({
      name: "",
      category: "",
      current_stock: "",
      minimum_stock: "",
      unit: "",
      cost_price: "",
      supplier: "",
    });
  }

  async function handleCreateItem(event) {
    event.preventDefault();

    try {
      setProcessingItemId("creating");
      setError("");

      await createInventoryItem({
        name: newItem.name.trim(),
        category: newItem.category.trim(),
        current_stock: Number(newItem.current_stock),
        minimum_stock: Number(newItem.minimum_stock),
        unit: newItem.unit.trim(),
        cost_price: Number(newItem.cost_price),
        supplier: newItem.supplier.trim() || null,
      });

      resetNewItemForm();
      setShowAddModal(false);

      await loadInventory();
    } catch (err) {
      setError(
        err.message || "Failed to create inventory item"
      );
    } finally {
      setProcessingItemId(null);
    }
  }

  function openStockModal(item, action) {
    setActiveMenuId(null);
    setStockQuantity("");

    setStockModal({
      item,
      action,
    });
  }

  function closeStockModal() {
    if (processingItemId) {
      return;
    }

    setStockModal(null);
    setStockQuantity("");
  }

  async function handleStockAction(event) {
    event.preventDefault();

    if (!stockModal) {
      return;
    }

    const quantity = Number(stockQuantity);

    if (!quantity || quantity <= 0) {
      setError("Quantity must be greater than zero");
      return;
    }

    const { item, action } = stockModal;

    try {
      setProcessingItemId(item.id);
      setError("");

      if (action === "add") {
        await addStock(item.id, quantity);
      }

      if (action === "remove") {
        await removeStock(item.id, quantity);
      }

      if (action === "restock") {
        await restockItem(item.id, quantity);
      }

      setStockModal(null);
      setStockQuantity("");

      await loadInventory();
    } catch (err) {
      setError(
        err.message || "Failed to update stock"
      );
    } finally {
      setProcessingItemId(null);
    }
  }

  async function handleDeleteItem(item) {
    setActiveMenuId(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingItemId(item.id);
      setError("");

      await deleteInventoryItem(item.id);

      await loadInventory();
    } catch (err) {
      setError(
        err.message || "Failed to delete inventory item"
      );
    } finally {
      setProcessingItemId(null);
    }
  }

  function getStockActionTitle(action) {
    if (action === "add") {
      return "Add Stock";
    }

    if (action === "remove") {
      return "Remove Stock";
    }

    return "Restock Item";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage stock levels, suppliers and inventory value.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102A43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163b5c]"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 text-red-500 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Items */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Items
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {totalItems}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <Package
                size={21}
                className="text-[#102A43]"
              />
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Low Stock
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {lowStockItems}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <AlertTriangle
                size={21}
                className="text-amber-600"
              />
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Out of Stock
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {outOfStockItems}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <XCircle
                size={21}
                className="text-red-600"
              />
            </div>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Inventory Value
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {formatCurrency(inventoryValue)}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <DollarSign
                size={21}
                className="text-green-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
          {/* Search */}
          <div className="relative w-full xl:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search items, suppliers or categories..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#C89B3C] focus:bg-white"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#C89B3C] focus:bg-white"
            >
              <option value="All">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#C89B3C] focus:bg-white"
            >
              <option value="All">
                All Statuses
              </option>

              <option value="In Stock">
                In Stock
              </option>

              <option value="Low Stock">
                Low Stock
              </option>

              <option value="Out of Stock">
                Out of Stock
              </option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#102A43]" />

            <p className="mt-4 text-sm text-slate-500">
              Loading inventory...
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Item
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Min. Stock
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Cost Price
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Stock Value
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Supplier
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                      const stockValue =
                        Number(item.current_stock || 0) *
                        Number(item.cost_price || 0);

                      const displayStatus =
                        formatStatus(item.status);

                      const isProcessing =
                        processingItemId === item.id;

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-slate-100 transition hover:bg-slate-50/60"
                        >
                          {/* Item */}
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-[#102A43]">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              INV-{String(item.id).padStart(3, "0")}
                            </p>
                          </td>

                          {/* Category */}
                          <td className="px-5 py-4">
                            <p className="text-sm text-slate-600">
                              {item.category}
                            </p>
                          </td>

                          {/* Current Stock */}
                          <td className="px-5 py-4">
                            <p
                              className={`text-sm font-semibold ${
                                item.current_stock === 0
                                  ? "text-red-600"
                                  : item.current_stock <=
                                    item.minimum_stock
                                  ? "text-amber-600"
                                  : "text-[#102A43]"
                              }`}
                            >
                              {formatNumber(
                                item.current_stock
                              )}{" "}
                              {item.unit}
                            </p>
                          </td>

                          {/* Minimum Stock */}
                          <td className="px-5 py-4">
                            <p className="text-sm text-slate-600">
                              {formatNumber(
                                item.minimum_stock
                              )}{" "}
                              {item.unit}
                            </p>
                          </td>

                          {/* Cost Price */}
                          <td className="px-5 py-4">
                            <p className="text-sm text-slate-600">
                              {formatCurrency(
                                item.cost_price
                              )}
                            </p>
                          </td>

                          {/* Stock Value */}
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-[#102A43]">
                              {formatCurrency(stockValue)}
                            </p>
                          </td>

                          {/* Supplier */}
                          <td className="px-5 py-4">
                            <p className="max-w-[180px] text-sm text-slate-600">
                              {item.supplier || "—"}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                statusStyles[
                                  displayStatus
                                ] ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {displayStatus}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="relative px-5 py-4 text-right">
                            {isProcessing ? (
                              <div className="flex justify-end">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#102A43]" />
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveMenuId(
                                      activeMenuId ===
                                        item.id
                                        ? null
                                        : item.id
                                    )
                                  }
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#102A43]"
                                  aria-label={`Actions for ${item.name}`}
                                >
                                  <MoreVertical
                                    size={18}
                                  />
                                </button>

                                {activeMenuId ===
                                  item.id && (
                                  <div className="absolute right-5 top-14 z-30 w-48 rounded-xl border border-slate-200 bg-white p-2 text-left shadow-lg">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openStockModal(
                                          item,
                                          "add"
                                        )
                                      }
                                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                    >
                                      <PlusCircle
                                        size={17}
                                        className="text-green-600"
                                      />
                                      Add Stock
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        openStockModal(
                                          item,
                                          "remove"
                                        )
                                      }
                                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                    >
                                      <MinusCircle
                                        size={17}
                                        className="text-amber-600"
                                      />
                                      Remove Stock
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        openStockModal(
                                          item,
                                          "restock"
                                        )
                                      }
                                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                    >
                                      <RefreshCw
                                        size={17}
                                        className="text-blue-600"
                                      />
                                      Restock
                                    </button>

                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteItem(
                                          item
                                        )
                                      }
                                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                                    >
                                      <Trash2
                                        size={17}
                                      />
                                      Delete Item
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        No inventory items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const stockValue =
                    Number(item.current_stock || 0) *
                    Number(item.cost_price || 0);

                  const displayStatus =
                    formatStatus(item.status);

                  const isProcessing =
                    processingItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="p-5"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-[#102A43]">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            INV-
                            {String(item.id).padStart(
                              3,
                              "0"
                            )}
                          </p>
                        </div>

                        <div className="relative">
                          {isProcessing ? (
                            <div className="flex h-9 w-9 items-center justify-center">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#102A43]" />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenuId(
                                  activeMenuId ===
                                    item.id
                                    ? null
                                    : item.id
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                              aria-label={`Actions for ${item.name}`}
                            >
                              <MoreVertical
                                size={18}
                              />
                            </button>
                          )}

                          {activeMenuId ===
                            item.id &&
                            !isProcessing && (
                              <div className="absolute right-0 top-11 z-30 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openStockModal(
                                      item,
                                      "add"
                                    )
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                >
                                  <PlusCircle
                                    size={17}
                                    className="text-green-600"
                                  />
                                  Add Stock
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    openStockModal(
                                      item,
                                      "remove"
                                    )
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                >
                                  <MinusCircle
                                    size={17}
                                    className="text-amber-600"
                                  />
                                  Remove Stock
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    openStockModal(
                                      item,
                                      "restock"
                                    )
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                >
                                  <RefreshCw
                                    size={17}
                                    className="text-blue-600"
                                  />
                                  Restock
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteItem(
                                      item
                                    )
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                                >
                                  <Trash2
                                    size={17}
                                  />
                                  Delete Item
                                </button>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Category */}
                      <div className="mt-4">
                        <p className="text-xs text-slate-400">
                          Category
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {item.category}
                        </p>
                      </div>

                      {/* Stock Information */}
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-400">
                            Current Stock
                          </p>

                          <p
                            className={`mt-1 text-sm font-semibold ${
                              item.current_stock ===
                              0
                                ? "text-red-600"
                                : item.current_stock <=
                                  item.minimum_stock
                                ? "text-amber-600"
                                : "text-[#102A43]"
                            }`}
                          >
                            {formatNumber(
                              item.current_stock
                            )}{" "}
                            {item.unit}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Minimum Stock
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {formatNumber(
                              item.minimum_stock
                            )}{" "}
                            {item.unit}
                          </p>
                        </div>
                      </div>

                      {/* Financial Information */}
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-400">
                            Cost Price
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {formatCurrency(
                              item.cost_price
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Stock Value
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#102A43]">
                            {formatCurrency(
                              stockValue
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Supplier */}
                      <div className="mt-4">
                        <p className="text-xs text-slate-400">
                          Supplier
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {item.supplier || "—"}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="mt-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[
                              displayStatus
                            ] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {displayStatus}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-12 text-center text-sm text-slate-500">
                  No inventory items found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {filteredItems.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                  {totalItems}
                </span>{" "}
                items
              </p>
            </div>
          </>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#102A43]">
                  Add Inventory Item
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new item to your inventory.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetNewItemForm();
                  setShowAddModal(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close add item modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateItem}
              className="p-6"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Item Name
                  </label>

                  <input
                    required
                    name="name"
                    value={newItem.name}
                    onChange={handleNewItemChange}
                    placeholder="e.g. Tomatoes"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:bg-white"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <input
                    required
                    name="category"
                    value={newItem.category}
                    onChange={handleNewItemChange}
                    placeholder="e.g. Vegetables"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:bg-white"
                  />
                </div>

                {/* Current Stock */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Current Stock
                  </label>

                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    name="current_stock"
                    value={newItem.current_stock}
                    onChange={handleNewItemChange}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:bg-white"
                  />
                </div>

                {/* Minimum Stock */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Minimum Stock
                  </label>

                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    name="minimum_stock"
                    value={newItem.minimum_stock}
                    onChange={handleNewItemChange}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:bg-white"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Unit
                  </label>

                  <input
                    required
                    name="unit"
                    value={newItem.unit}
                    onChange={handleNewItemChange}
                    placeholder="e.g. kg, litres, bottles"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:bg-white"
                  />
                </div>

                {/* Cost Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Cost Price
                  </label>

                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    name="cost_price"
                    value={newItem.cost_price}
                    onChange={handleNewItemChange}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:bg-white"
                  />
                </div>

                {/* Supplier */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Supplier
                  </label>

                  <input
                    name="supplier"
                    value={newItem.supplier}
                    onChange={handleNewItemChange}
                    placeholder="e.g. Fresh Farm Suppliers"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:bg-white"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    resetNewItemForm();
                    setShowAddModal(false);
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={processingItemId === "creating"}
                  className="rounded-xl bg-[#102A43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163b5c] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingItemId === "creating"
                    ? "Adding..."
                    : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Modal */}
      {stockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#102A43]">
                  {getStockActionTitle(
                    stockModal.action
                  )}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {stockModal.item.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeStockModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close stock modal"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleStockAction}
              className="p-6"
            >
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">
                  Current Stock
                </p>

                <p className="mt-1 text-lg font-bold text-[#102A43]">
                  {formatNumber(
                    stockModal.item.current_stock
                  )}{" "}
                  {stockModal.item.unit}
                </p>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Quantity
                </label>

                <input
                  autoFocus
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={stockQuantity}
                  onChange={(e) =>
                    setStockQuantity(e.target.value)
                  }
                  placeholder={`Enter quantity in ${stockModal.item.unit}`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:bg-white"
                />
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeStockModal}
                  disabled={processingItemId !== null}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={processingItemId !== null}
                  className="rounded-xl bg-[#102A43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#163b5c] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingItemId !== null
                    ? "Updating..."
                    : getStockActionTitle(
                        stockModal.action
                      )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;