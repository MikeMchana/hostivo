import { useEffect, useState } from "react";
import {
  Search,
  ChefHat,
  Clock3,
  CheckCircle2,
  Flame,
  MoreVertical,
} from "lucide-react";

import {
  getOrders,
  getOrderItems,
  markOrderPreparing,
  markOrderReady,
} from "../../services/orders";

import { getMenuItems } from "../../services/menu";
import { getTables } from "../../services/tables";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  Preparing: "bg-blue-50 text-blue-700",
  Ready: "bg-green-50 text-green-700",
};

function formatStatus(status) {
  if (!status) {
    return "";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatOrderTime(createdAt) {
  if (!createdAt) {
    return "—";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingOrderId, setProcessingOrderId] = useState(null);

  async function loadKitchenData() {
    try {
      setLoading(true);
      setError("");

      const [
        ordersData,
        orderItemsData,
        menuItemsData,
        tablesData,
      ] = await Promise.all([
        getOrders(),
        getOrderItems(),
        getMenuItems(),
        getTables(),
      ]);

      setOrders(ordersData);
      setOrderItems(orderItemsData);
      setMenuItems(menuItemsData);
      setTables(tablesData);
    } catch (err) {
      setError(
        err.message || "Failed to load kitchen orders"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKitchenData();
  }, []);

  function getMenuItemName(menuItemId) {
    const menuItem = menuItems.find(
      (item) => item.id === menuItemId
    );

    return menuItem?.name || `Menu Item #${menuItemId}`;
  }

  function getTableName(tableId) {
    if (!tableId) {
      return "Walk-in Customer";
    }

    const table = tables.find(
      (item) => item.id === tableId
    );

    return table
      ? `Table ${table.table_number}`
      : `Table #${tableId}`;
  }

  function getItemsForOrder(orderId) {
    return orderItems
      .filter((item) => item.order_id === orderId)
      .map((item) => ({
        id: item.id,
        name: getMenuItemName(item.menu_item_id),
        quantity: item.quantity,
      }));
  }

  const kitchenOrders = orders
    .filter((order) =>
      ["pending", "preparing", "ready"].includes(order.status)
    )
    .map((order) => ({
      ...order,
      displayId: `#ORD-${String(order.id).padStart(4, "0")}`,
      customer: order.customer_id
        ? `Customer #${order.customer_id}`
        : "Walk-in Customer",
      source: getTableName(order.table_id),
      items: getItemsForOrder(order.id),
      time: formatOrderTime(order.created_at),
      displayStatus: formatStatus(order.status),
    }));

  const filteredOrders = kitchenOrders.filter((order) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      order.displayId.toLowerCase().includes(search) ||
      order.customer.toLowerCase().includes(search) ||
      order.source.toLowerCase().includes(search) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(search)
      );

    const matchesStatus =
      statusFilter === "All" ||
      order.displayStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingOrders = kitchenOrders.filter(
    (order) => order.status === "pending"
  ).length;

  const preparingOrders = kitchenOrders.filter(
    (order) => order.status === "preparing"
  ).length;

  const readyOrders = kitchenOrders.filter(
    (order) => order.status === "ready"
  ).length;

  async function handleStartPreparing(orderId) {
    try {
      setProcessingOrderId(orderId);
      setError("");

      await markOrderPreparing(orderId);

      await loadKitchenData();
    } catch (err) {
      setError(
        err.message ||
          "Failed to move order to preparing"
      );
    } finally {
      setProcessingOrderId(null);
    }
  }

  async function handleMarkReady(orderId) {
    try {
      setProcessingOrderId(orderId);
      setError("");

      await markOrderReady(orderId);

      await loadKitchenData();
    } catch (err) {
      setError(
        err.message ||
          "Failed to mark order as ready"
      );
    } finally {
      setProcessingOrderId(null);
    }
  }

  function renderAction(order) {
    const isProcessing =
      processingOrderId === order.id;

    if (order.status === "pending") {
      return (
        <button
          type="button"
          onClick={() =>
            handleStartPreparing(order.id)
          }
          disabled={isProcessing}
          className="rounded-lg bg-[#102A43] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#163B5C] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing
            ? "Starting..."
            : "Start Preparing"}
        </button>
      );
    }

    if (order.status === "preparing") {
      return (
        <button
          type="button"
          onClick={() =>
            handleMarkReady(order.id)
          }
          disabled={isProcessing}
          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing
            ? "Updating..."
            : "Mark Ready"}
        </button>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
        <CheckCircle2 size={14} />
        Ready
      </span>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">
          Kitchen
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor restaurant orders and manage kitchen
          preparation.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Kitchen Orders
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {kitchenOrders.length}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <ChefHat
                size={21}
                className="text-[#102A43]"
              />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {pendingOrders}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <Clock3
                size={21}
                className="text-amber-600"
              />
            </div>
          </div>
        </div>

        {/* Preparing */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Preparing
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {preparingOrders}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Flame
                size={21}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Ready */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Ready
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {readyOrders}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <CheckCircle2
                size={21}
                className="text-green-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Kitchen Orders */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search orders, customers or items..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#C89B3C] focus:bg-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#C89B3C] focus:bg-white"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
          </select>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#102A43]" />

            <p className="mt-4 text-sm text-slate-500">
              Loading kitchen orders...
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Order
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer / Location
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Items
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Time
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
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50/60"
                      >
                        {/* Order */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-[#102A43]">
                            {order.displayId}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {order.customer}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {order.source}
                          </p>
                        </td>

                        {/* Items */}
                        <td className="px-5 py-4">
                          {order.items.length > 0 ? (
                            <div className="space-y-1">
                              {order.items.map(
                                (item) => (
                                  <p
                                    key={item.id}
                                    className="text-sm text-slate-600"
                                  >
                                    <span className="font-semibold text-[#102A43]">
                                      {item.quantity}×
                                    </span>{" "}
                                    {item.name}
                                  </p>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              No items
                            </span>
                          )}
                        </td>

                        {/* Time */}
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-600">
                            {order.time}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              statusStyles[
                                order.displayStatus
                              ]
                            }`}
                          >
                            {order.displayStatus}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {renderAction(order)}

                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#102A43]"
                              aria-label={`More options for ${order.displayId}`}
                            >
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        No kitchen orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[#102A43]">
                          {order.displayId}
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {order.customer}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {order.source}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                        aria-label={`More options for ${order.displayId}`}
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    {/* Items */}
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Order Items
                      </p>

                      <div className="mt-2 space-y-2">
                        {order.items.length > 0 ? (
                          order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between"
                            >
                              <p className="text-sm text-slate-600">
                                {item.name}
                              </p>

                              <span className="text-sm font-semibold text-[#102A43]">
                                ×{item.quantity}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">
                            No items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock3 size={15} />
                          {order.time}
                        </div>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[
                              order.displayStatus
                            ]
                          }`}
                        >
                          {order.displayStatus}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        {renderAction(order)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-12 text-center text-sm text-slate-500">
                  No kitchen orders found.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {filteredOrders.length}
                </span>{" "}
                active kitchen orders
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Kitchen;