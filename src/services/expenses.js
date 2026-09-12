import { apiRequest } from "./api";

export async function getExpenses() {
  return apiRequest(
    "/expenses/",
    {},
    "Failed to fetch expenses"
  );
}

export async function getExpense(expenseId) {
  return apiRequest(
    `/expenses/${expenseId}`,
    {},
    "Failed to fetch expense"
  );
}

export async function createExpense(expenseData) {
  return apiRequest(
    "/expenses/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    },
    "Failed to create expense"
  );
}

export async function approveExpense(expenseId) {
  return apiRequest(
    `/expenses/${expenseId}/approve`,
    {
      method: "PATCH",
    },
    "Failed to approve expense"
  );
}

export async function payExpense(expenseId) {
  return apiRequest(
    `/expenses/${expenseId}/pay`,
    {
      method: "PATCH",
    },
    "Failed to pay expense"
  );
}

export async function cancelExpense(expenseId) {
  return apiRequest(
    `/expenses/${expenseId}/cancel`,
    {
      method: "PATCH",
    },
    "Failed to cancel expense"
  );
}

export async function deleteExpense(expenseId) {
  return apiRequest(
    `/expenses/${expenseId}`,
    {
      method: "DELETE",
    },
    "Failed to delete expense"
  );
}