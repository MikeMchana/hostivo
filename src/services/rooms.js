import { apiRequest } from "./api";

export async function getRooms() {
  return apiRequest(
    "/rooms/",
    {},
    "Failed to fetch rooms"
  );
}

export async function createRoom(roomData) {
  return apiRequest(
    "/rooms/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    },
    "Failed to create room"
  );
}

export async function updateRoom(roomId, roomData) {
  return apiRequest(
    `/rooms/${roomId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    },
    "Failed to update room"
  );
}

export async function markRoomAvailable(roomId) {
  return apiRequest(
    `/rooms/${roomId}/available`,
    {
      method: "PATCH",
    },
    "Failed to mark room as available"
  );
}

export async function markRoomMaintenance(roomId) {
  return apiRequest(
    `/rooms/${roomId}/maintenance`,
    {
      method: "PATCH",
    },
    "Failed to mark room as maintenance"
  );
}

export async function restoreRoom(roomId) {
  return apiRequest(
    `/rooms/${roomId}/restore`,
    {
      method: "PATCH",
    },
    "Failed to restore room"
  );
}

export async function markRoomInactive(roomId) {
  return apiRequest(
    `/rooms/${roomId}/inactive`,
    {
      method: "PATCH",
    },
    "Failed to mark room as inactive"
  );
}

export async function reactivateRoom(roomId) {
  return apiRequest(
    `/rooms/${roomId}/reactivate`,
    {
      method: "PATCH",
    },
    "Failed to reactivate room"
  );
}

export async function deleteRoom(roomId) {
  return apiRequest(
    `/rooms/${roomId}`,
    {
      method: "DELETE",
    },
    "Failed to delete room"
  );
}