import { apiRequest } from "./api";

export async function getEmployees() {
  return apiRequest(
    "/employees/",
    {},
    "Failed to fetch employees"
  );
}

export async function getEmployee(employeeId) {
  return apiRequest(
    `/employees/${employeeId}`,
    {},
    "Failed to fetch employee"
  );
}

export async function createEmployee(employeeData) {
  return apiRequest(
    "/employees/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    },
    "Failed to create employee"
  );
}

export async function activateEmployee(employeeId) {
  return apiRequest(
    `/employees/${employeeId}/activate`,
    {
      method: "PATCH",
    },
    "Failed to activate employee"
  );
}

export async function placeEmployeeOnLeave(employeeId) {
  return apiRequest(
    `/employees/${employeeId}/leave`,
    {
      method: "PATCH",
    },
    "Failed to place employee on leave"
  );
}

export async function deactivateEmployee(employeeId) {
  return apiRequest(
    `/employees/${employeeId}/deactivate`,
    {
      method: "PATCH",
    },
    "Failed to deactivate employee"
  );
}

export async function deleteEmployee(employeeId) {
  return apiRequest(
    `/employees/${employeeId}`,
    {
      method: "DELETE",
    },
    "Failed to delete employee"
  );
}