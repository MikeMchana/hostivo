import { apiRequest } from "./api";

export async function getPayments() {
  return apiRequest(
    "/payments/",
    {},
    "Failed to fetch payments"
  );
}

export async function getPayment(paymentId) {
  return apiRequest(
    `/payments/${paymentId}`,
    {},
    "Failed to fetch payment"
  );
}

export async function createPayment(paymentData) {
  return apiRequest(
    "/payments/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    },
    "Failed to create payment"
  );
}

export async function completePayment(paymentId) {
  return apiRequest(
    `/payments/${paymentId}/complete`,
    {
      method: "PATCH",
    },
    "Failed to complete payment"
  );
}

export async function cancelPayment(paymentId) {
  return apiRequest(
    `/payments/${paymentId}/cancel`,
    {
      method: "PATCH",
    },
    "Failed to cancel payment"
  );
}

export async function deletePayment(paymentId) {
  return apiRequest(
    `/payments/${paymentId}`,
    {
      method: "DELETE",
    },
    "Failed to delete payment"
  );
}