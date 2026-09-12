import { apiRequest } from "./api";

export async function getInventoryItems() {
  return apiRequest(
    "/inventory/",
    {},
    "Failed to fetch inventory items"
  );
}

export async function getInventoryItem(itemId) {
  return apiRequest(
    `/inventory/${itemId}`,
    {},
    "Failed to fetch inventory item"
  );
}

export async function createInventoryItem(itemData) {
  return apiRequest(
    "/inventory/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    },
    "Failed to create inventory item"
  );
}

export async function addStock(itemId, quantity) {
  return apiRequest(
    `/inventory/${itemId}/add-stock?quantity=${encodeURIComponent(
      quantity
    )}`,
    {
      method: "PATCH",
    },
    "Failed to add stock"
  );
}

export async function removeStock(itemId, quantity) {
  return apiRequest(
    `/inventory/${itemId}/remove-stock?quantity=${encodeURIComponent(
      quantity
    )}`,
    {
      method: "PATCH",
    },
    "Failed to remove stock"
  );
}

export async function restockItem(itemId, quantity) {
  return apiRequest(
    `/inventory/${itemId}/restock?quantity=${encodeURIComponent(
      quantity
    )}`,
    {
      method: "PATCH",
    },
    "Failed to restock item"
  );
}

export async function deleteInventoryItem(itemId) {
  return apiRequest(
    `/inventory/${itemId}`,
    {
      method: "DELETE",
    },
    "Failed to delete inventory item"
  );
}