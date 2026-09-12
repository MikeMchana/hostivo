import { apiRequest } from "./api";

// Get all restaurant table reservations
export async function getTableReservations() {
  return apiRequest(
    "/table-reservations/",
    {
      method: "GET",
    },
    "Failed to load table reservations."
  );
}

// Confirm a table reservation
export async function confirmTableReservation(reservationId) {
  return apiRequest(
    `/table-reservations/${reservationId}/confirm`,
    {
      method: "PATCH",
    },
    "Failed to confirm table reservation."
  );
}

// Cancel a table reservation
export async function cancelTableReservation(reservationId) {
  return apiRequest(
    `/table-reservations/${reservationId}/cancel`,
    {
      method: "PATCH",
    },
    "Failed to cancel table reservation."
  );
}