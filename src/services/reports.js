import { apiRequest } from "./api";

export async function getDashboardReport(period = "month") {
  return apiRequest(
    `/reports/dashboard?period=${encodeURIComponent(
      period
    )}`,
    {},
    "Failed to fetch reports"
  );
}

export async function getOrderReport() {
  return apiRequest(
    "/reports/orders",
    {},
    "Failed to fetch order report"
  );
}

export async function getReservationReport() {
  return apiRequest(
    "/reports/reservations",
    {},
    "Failed to fetch reservation report"
  );
}

export async function getExpenseReport() {
  return apiRequest(
    "/reports/expenses",
    {},
    "Failed to fetch expense report"
  );
}

export async function getPaymentReport() {
  return apiRequest(
    "/reports/payments",
    {},
    "Failed to fetch payment report"
  );
}