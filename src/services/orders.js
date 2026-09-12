import { apiRequest } from "./api";

export async function getOrders() {
  return apiRequest(
    "/orders/",
    {},
    "Failed to fetch orders"
  );
}

export async function getOrder(orderId) {
  return apiRequest(
    `/orders/${orderId}`,
    {},
    "Failed to fetch order"
  );
}

export async function createOrder(orderData) {
  return apiRequest(
    "/orders/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    },
    "Failed to create order"
  );
}

export async function markOrderPreparing(orderId) {
  return apiRequest(
    `/orders/${orderId}/preparing`,
    {
      method: "PATCH",
    },
    "Failed to move order to preparing"
  );
}

export async function markOrderReady(orderId) {
  return apiRequest(
    `/orders/${orderId}/ready`,
    {
      method: "PATCH",
    },
    "Failed to mark order as ready"
  );
}

export async function completeOrder(orderId) {
  return apiRequest(
    `/orders/${orderId}/complete`,
    {
      method: "PATCH",
    },
    "Failed to complete order"
  );
}

export async function cancelOrder(orderId) {
  return apiRequest(
    `/orders/${orderId}/cancel`,
    {
      method: "PATCH",
    },
    "Failed to cancel order"
  );
}

export async function deleteOrder(orderId) {
  return apiRequest(
    `/orders/${orderId}`,
    {
      method: "DELETE",
    },
    "Failed to delete order"
  );
}

export async function getOrderItems() {
  return apiRequest(
    "/order-items/",
    {},
    "Failed to fetch order items"
  );
}

export async function createOrderItem(itemData) {
  return apiRequest(
    "/order-items/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    },
    "Failed to add order item"
  );
}

export async function deleteOrderItem(itemId) {
  return apiRequest(
    `/order-items/${itemId}`,
    {
      method: "DELETE",
    },
    "Failed to delete order item"
  );
}