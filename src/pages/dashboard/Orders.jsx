import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  ShoppingBag,
  Clock3,
  ChefHat,
  CheckCircle2,
  MoreVertical,
  X,
  LogIn,
  CircleCheck,
  Ban,
  Trash2,
  User,
  UtensilsCrossed,
} from "lucide-react";

import {
  getOrders,
  createOrder,
  markOrderPreparing,
  markOrderReady,
  completeOrder,
  cancelOrder,
  deleteOrder,
  getOrderItems,
  createOrderItem,
} from "../../services/orders";

import { getMenuItems } from "../../services/menu";
import { getTables } from "../../services/tables";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  Preparing: "bg-blue-50 text-blue-700",
  Ready: "bg-purple-50 text-purple-700",
  Completed: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    "All Statuses"
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [openActionId, setOpenActionId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [selectedTableId, setSelectedTableId] =
    useState("");

  const [selectedMenuItemId, setSelectedMenuItemId] =
    useState("");

  const [itemQuantity, setItemQuantity] = useState(1);

  const [cartItems, setCartItems] = useState([]);

  const [isCreating, setIsCreating] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadOrdersData();
  }, []);

  async function loadOrdersData() {
    try {
      setIsLoading(true);
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
        err.message || "Failed to load orders"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const menuMap = useMemo(() => {
    return Object.fromEntries(
      menuItems.map((item) => [item.id, item])
    );
  }, [menuItems]);

  const tableMap = useMemo(() => {
    return Object.fromEntries(
      tables.map((table) => [table.id, table])
    );
  }, [tables]);

  const orderItemsMap = useMemo(() => {
    const map = {};

    orderItems.forEach((item) => {
      if (!map[item.order_id]) {
        map[item.order_id] = [];
      }

      map[item.order_id].push(item);
    });

    return map;
  }, [orderItems]);

  function getStatusLabel(status) {
    const labels = {
      pending: "Pending",
      preparing: "Preparing",
      ready: "Ready",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return labels[status] || status;
  }

  function getOrderNumber(orderId) {
    return `#ORD-${String(5000 + orderId)}`;
  }

  function getOrderItemsText(orderId) {
    const items = orderItemsMap[orderId] || [];

    if (items.length === 0) {
      return "No items";
    }

    return items
      .map((item) => {
        const menuItem = menuMap[item.menu_item_id];

        return `${menuItem?.name || `Item #${item.menu_item_id}`} × ${item.quantity}`;
      })
      .join(", ");
  }

  function getSource(order) {
    if (order.table_id) {
      const table = tableMap[order.table_id];

      if (table) {
        return `Table ${table.table_number}`;
      }

      return `Table #${order.table_id}`;
    }

    return "No table";
  }

  function getOrderTime(createdAt) {
    if (!createdAt) {
      return "—";
    }

    return new Date(createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const formattedOrders = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      displayId: getOrderNumber(order.id),
      displayStatus: getStatusLabel(order.status),
      itemsText: getOrderItemsText(order.id),
      source: getSource(order),
      time: getOrderTime(order.created_at),
    }));
  }, [
    orders,
    orderItemsMap,
    menuMap,
    tableMap,
  ]);

  const filteredOrders = useMemo(() => {
    return formattedOrders.filter((order) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        order.displayId.toLowerCase().includes(search) ||
        order.source.toLowerCase().includes(search) ||
        order.itemsText.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All Statuses" ||
        order.displayStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    formattedOrders,
    searchTerm,
    statusFilter,
  ]);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "preparing"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  const availableTables = tables.filter(
    (table) => table.status === "available"
  );

  const availableMenuItems = menuItems.filter(
    (item) => item.is_available
  );

  function resetCreateForm() {
    setSelectedTableId("");
    setSelectedMenuItemId("");
    setItemQuantity(1);
    setCartItems([]);
  }

  function closeCreateModal() {
    if (isCreating) {
      return;
    }

    setIsCreateModalOpen(false);
    resetCreateForm();
  }

  function addItemToCart() {
    if (!selectedMenuItemId) {
      setError("Please select a menu item.");
      return;
    }

    const menuItem = menuItems.find(
      (item) =>
        item.id === Number(selectedMenuItemId)
    );

    if (!menuItem) {
      setError("Selected menu item was not found.");
      return;
    }

    const quantity = Number(itemQuantity);

    if (!quantity || quantity <= 0) {
      setError(
        "Quantity must be greater than zero."
      );
      return;
    }

    setError("");

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.menu_item_id === menuItem.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.menu_item_id === menuItem.id
            ? {
                ...item,
                quantity:
                  item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          menu_item_id: menuItem.id,
          name: menuItem.name,
          price: Number(menuItem.price),
          quantity,
        },
      ];
    });

    setSelectedMenuItemId("");
    setItemQuantity(1);
  }

  function removeCartItem(menuItemId) {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.menu_item_id !== menuItemId
      )
    );
  }

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  async function handleCreateOrder(event) {
    event.preventDefault();

    if (cartItems.length === 0) {
      setError(
        "Add at least one menu item to the order."
      );
      return;
    }

    try {
      setIsCreating(true);
      setError("");

      const newOrder = await createOrder({
        customer_id: null,
        table_id: selectedTableId
          ? Number(selectedTableId)
          : null,
        total_amount: 0,
      });

      const createdItems = [];

      for (const item of cartItems) {
        const createdItem =
          await createOrderItem({
            order_id: newOrder.id,
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            unit_price: item.price,
            subtotal:
              item.price * item.quantity,
          });

        createdItems.push(createdItem);
      }

      setOrders((currentOrders) => [
        ...currentOrders,
        {
          ...newOrder,
          total_amount: cartTotal,
        },
      ]);

      setOrderItems((currentItems) => [
        ...currentItems,
        ...createdItems,
      ]);

      setIsCreateModalOpen(false);
      resetCreateForm();

      await loadOrdersData();
    } catch (err) {
      setError(
        err.message || "Failed to create order"
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleOrderAction(
    orderId,
    action
  ) {
    try {
      setActionLoadingId(orderId);
      setOpenActionId(null);
      setError("");

      let updatedOrder;

      if (action === "preparing") {
        updatedOrder =
          await markOrderPreparing(orderId);
      }

      if (action === "ready") {
        updatedOrder =
          await markOrderReady(orderId);
      }

      if (action === "complete") {
        updatedOrder =
          await completeOrder(orderId);
      }

      if (action === "cancel") {
        updatedOrder =
          await cancelOrder(orderId);
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? updatedOrder
            : order
        )
      );

      if (
        action === "complete" ||
        action === "cancel"
      ) {
        await loadOrdersData();
      }
    } catch (err) {
      setError(
        err.message || "Failed to update order"
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDeleteOrder() {
    if (!deleteTarget) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      await deleteOrder(deleteTarget.id);

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) =>
            order.id !== deleteTarget.id
        )
      );

      setOrderItems((currentItems) =>
        currentItems.filter(
          (item) =>
            item.order_id !== deleteTarget.id
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      setError(
        err.message || "Failed to delete order"
      );
    } finally {
      setIsDeleting(false);
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
            Orders
          </h1>

          <p className="text-slate-500 mt-2">
            Manage restaurant orders and track
            their progress.
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C89B3C] text-white font-semibold hover:bg-[#b88a2f] transition"
        >
          <Plus size={19} />
          New Order
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
                Total Orders
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {totalOrders}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                All orders
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Pending
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {pendingOrders}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Awaiting preparation
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock3 size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Preparing
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {preparingOrders}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                In the kitchen
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ChefHat size={21} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="text-2xl font-bold text-[#102A43] mt-2">
                {completedOrders}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Successfully completed
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 md:p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#102A43]">
                All Orders
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                View and manage restaurant orders.
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
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search orders..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 outline-none focus:border-[#C89B3C] bg-white"
              >
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Preparing</option>
                <option>Ready</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="px-6 py-16 text-center">
            <div className="inline-flex items-center gap-3 text-slate-500">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-[#C89B3C] rounded-full animate-spin" />
              Loading orders...
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>

            <h3 className="mt-4 font-semibold text-[#102A43]">
              No orders found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Order
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Customer / Table
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Items
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Time
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Total
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#102A43]/5 text-[#102A43] flex items-center justify-center">
                            <ShoppingBag size={18} />
                          </div>

                          <div>
                            <p className="font-semibold text-[#102A43]">
                              {order.displayId}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              Order #{order.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {order.customer_id
                              ? `Customer #${order.customer_id}`
                              : "Walk-in Customer"}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {order.source}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 max-w-[300px]">
                        <p className="text-sm text-slate-600 truncate">
                          {order.itemsText}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm text-slate-500">
                          {order.time}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-semibold text-[#102A43]">
                          KSh{" "}
                          {Number(
                            order.total_amount || 0
                          ).toLocaleString()}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
                            statusStyles[
                              order.displayStatus
                            ]
                          }`}
                        >
                          {order.displayStatus}
                        </span>
                      </td>

                      <td className="px-6 py-5 relative">
                        {actionLoadingId === order.id ? (
                          <div className="p-2">
                            <div className="w-5 h-5 border-2 border-slate-300 border-t-[#C89B3C] rounded-full animate-spin" />
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                setOpenActionId(
                                  openActionId ===
                                    order.id
                                    ? null
                                    : order.id
                                )
                              }
                              className="p-2 rounded-lg text-slate-400 hover:text-[#102A43] hover:bg-slate-100 transition"
                              aria-label={`Actions for ${order.displayId}`}
                            >
                              <MoreVertical size={19} />
                            </button>

                            {openActionId === order.id && (
                              <OrderActions
                                order={order}
                                onAction={
                                  handleOrderAction
                                }
                                onDelete={() => {
                                  setOpenActionId(
                                    null
                                  );
                                  setDeleteTarget(
                                    order
                                  );
                                }}
                              />
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#102A43]/5 text-[#102A43] flex items-center justify-center">
                        <ShoppingBag size={18} />
                      </div>

                      <div>
                        <p className="font-semibold text-[#102A43]">
                          {order.displayId}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {order.time}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
                        statusStyles[
                          order.displayStatus
                        ]
                      }`}
                    >
                      {order.displayStatus}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User size={16} />
                      {order.customer_id
                        ? `Customer #${order.customer_id}`
                        : "Walk-in Customer"}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <UtensilsCrossed size={16} />
                      {order.source}
                    </div>

                    <p className="text-sm text-slate-600">
                      {order.itemsText}
                    </p>

                    <p className="font-semibold text-[#102A43]">
                      KSh{" "}
                      {Number(
                        order.total_amount || 0
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    {actionLoadingId === order.id ? (
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-[#C89B3C] rounded-full animate-spin" />
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenActionId(
                              openActionId ===
                                order.id
                                ? null
                                : order.id
                            )
                          }
                          className="p-2 rounded-lg text-slate-400 hover:text-[#102A43] hover:bg-slate-100 transition"
                        >
                          <MoreVertical
                            size={19}
                          />
                        </button>

                        {openActionId === order.id && (
                          <OrderActions
                            order={order}
                            onAction={
                              handleOrderAction
                            }
                            onDelete={() => {
                              setOpenActionId(
                                null
                              );
                              setDeleteTarget(
                                order
                              );
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {filteredOrders.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                  {totalOrders}
                </span>{" "}
                orders
              </p>

              <div className="hidden sm:flex items-center gap-2">
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

      {/* Create Order Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden my-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">
                  New Order
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Create a new restaurant order.
                </p>
              </div>

              <button
                onClick={closeCreateModal}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Restaurant Table
                  </label>

                  <select
                    value={selectedTableId}
                    onChange={(event) =>
                      setSelectedTableId(
                        event.target.value
                      )
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 outline-none focus:border-[#C89B3C] bg-white"
                  >
                    <option value="">
                      Walk-in / No Table
                    </option>

                    {availableTables.map(
                      (table) => (
                        <option
                          key={table.id}
                          value={table.id}
                        >
                          Table{" "}
                          {table.table_number}{" "}
                          — {table.capacity} seats
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Menu Item
                  </label>

                  <div className="flex gap-2">
                    <select
                      value={selectedMenuItemId}
                      onChange={(event) =>
                        setSelectedMenuItemId(
                          event.target.value
                        )
                      }
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 outline-none focus:border-[#C89B3C] bg-white"
                    >
                      <option value="">
                        Select menu item
                      </option>

                      {availableMenuItems.map(
                        (item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name} — KSh{" "}
                            {Number(
                              item.price
                            ).toLocaleString()}
                          </option>
                        )
                      )}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={itemQuantity}
                      onChange={(event) =>
                        setItemQuantity(
                          event.target.value
                        )
                      }
                      className="w-20 px-3 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#C89B3C]"
                    />

                    <button
                      type="button"
                      onClick={addItemToCart}
                      className="px-4 rounded-xl bg-[#102A43] text-white hover:bg-[#173b5d] transition"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {cartItems.length > 0 && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                      <p className="text-sm font-semibold text-[#102A43]">
                        Order Items
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {cartItems.map(
                        (item) => (
                          <div
                            key={
                              item.menu_item_id
                            }
                            className="px-4 py-3 flex items-center justify-between gap-4"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                {item.name}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                {item.quantity} ×
                                KSh{" "}
                                {Number(
                                  item.price
                                ).toLocaleString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-[#102A43]">
                                KSh{" "}
                                {Number(
                                  item.price *
                                    item.quantity
                                ).toLocaleString()}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  removeCartItem(
                                    item.menu_item_id
                                  )
                                }
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="px-4 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-600">
                        Estimated Total
                      </span>

                      <span className="text-lg font-bold text-[#102A43]">
                        KSh{" "}
                        {cartTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isCreating}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isCreating ||
                    cartItems.length === 0
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C89B3C] text-white text-sm font-semibold hover:bg-[#b88a2f] transition disabled:opacity-60"
                >
                  {isCreating && (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}

                  {isCreating
                    ? "Creating..."
                    : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 size={22} />
              </div>

              <h2 className="text-xl font-bold text-[#102A43] mt-5">
                Delete Order?
              </h2>

              <p className="text-sm text-slate-500 mt-2 leading-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  {deleteTarget.displayId}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteOrder}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
              >
                {isDeleting && (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}

                {isDeleting
                  ? "Deleting..."
                  : "Delete Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderActions({
  order,
  onAction,
  onDelete,
}) {
  return (
    <div className="absolute right-6 top-14 z-30 w-52 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
      {order.status === "pending" && (
        <button
          onClick={() =>
            onAction(order.id, "preparing")
          }
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
        >
          <ChefHat size={16} />
          Start Preparing
        </button>
      )}

      {order.status === "preparing" && (
        <button
          onClick={() =>
            onAction(order.id, "ready")
          }
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
        >
          <CircleCheck size={16} />
          Mark Ready
        </button>
      )}

      {order.status === "ready" && (
        <button
          onClick={() =>
            onAction(order.id, "complete")
          }
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50"
        >
          <LogIn size={16} />
          Complete Order
        </button>
      )}

      {!["completed", "cancelled"].includes(
        order.status
      ) && (
        <button
          onClick={() =>
            onAction(order.id, "cancel")
          }
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
        >
          <Ban size={16} />
          Cancel Order
        </button>
      )}

      <button
        onClick={onDelete}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
      >
        <Trash2 size={16} />
        Delete Order
      </button>
    </div>
  );
}

export default Orders;