import { apiRequest } from "./api";

export async function getMenuItems() {
  return apiRequest(
    "/menu-items/",
    {},
    "Failed to fetch menu items"
  );
}

export async function createMenuItem(menuItemData) {
  return apiRequest(
    "/menu-items/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuItemData),
    },
    "Failed to create menu item"
  );
}

export async function updateMenuItem(menuItemId, menuItemData) {
  return apiRequest(
    `/menu-items/${menuItemId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuItemData),
    },
    "Failed to update menu item"
  );
}

export async function markMenuItemUnavailable(menuItemId) {
  return apiRequest(
    `/menu-items/${menuItemId}/unavailable`,
    {
      method: "PATCH",
    },
    "Failed to mark menu item as unavailable"
  );
}

export async function markMenuItemAvailable(menuItemId) {
  return apiRequest(
    `/menu-items/${menuItemId}/available`,
    {
      method: "PATCH",
    },
    "Failed to mark menu item as available"
  );
}

export async function deleteMenuItem(menuItemId) {
  return apiRequest(
    `/menu-items/${menuItemId}`,
    {
      method: "DELETE",
    },
    "Failed to delete menu item"
  );
}