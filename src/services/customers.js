import { apiRequest } from "./api";

export async function getCustomers() {
  return apiRequest(
    "/customers/",
    {},
    "Failed to fetch customers"
  );
}

export async function getCustomer(customerId) {
  return apiRequest(
    `/customers/${customerId}`,
    {},
    "Failed to fetch customer"
  );
}

export async function createCustomer(customerData) {
  return apiRequest(
    "/customers/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    },
    "Failed to create customer"
  );
}

export async function activateCustomer(customerId) {
  return apiRequest(
    `/customers/${customerId}/activate`,
    {
      method: "PATCH",
    },
    "Failed to activate customer"
  );
}

export async function deactivateCustomer(customerId) {
  return apiRequest(
    `/customers/${customerId}/deactivate`,
    {
      method: "PATCH",
    },
    "Failed to deactivate customer"
  );
}

export async function deleteCustomer(customerId) {
  return apiRequest(
    `/customers/${customerId}`,
    {
      method: "DELETE",
    },
    "Failed to delete customer"
  );
}