import { apiRequest } from "./api";

export async function getTables() {
  return apiRequest(
    "/restaurant-tables/",
    {},
    "Failed to fetch restaurant tables"
  );
}

export async function createTable(tableData) {
  return apiRequest(
    "/restaurant-tables/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tableData),
    },
    "Failed to create restaurant table"
  );
}

export async function getTable(tableId) {
  return apiRequest(
    `/restaurant-tables/${tableId}`,
    {},
    "Failed to fetch restaurant table"
  );
}

export async function reserveTable(tableId) {
  return apiRequest(
    `/restaurant-tables/${tableId}/reserve`,
    {
      method: "PATCH",
    },
    "Failed to reserve table"
  );
}

export async function occupyTable(tableId) {
  return apiRequest(
    `/restaurant-tables/${tableId}/occupy`,
    {
      method: "PATCH",
    },
    "Failed to occupy table"
  );
}

export async function releaseTable(tableId) {
  return apiRequest(
    `/restaurant-tables/${tableId}/release`,
    {
      method: "PATCH",
    },
    "Failed to release table"
  );
}

export async function deleteTable(tableId) {
  return apiRequest(
    `/restaurant-tables/${tableId}`,
    {
      method: "DELETE",
    },
    "Failed to delete restaurant table"
  );
}