import { apiRequest } from "./api";

export async function loginUser(username, password) {
  return apiRequest(
    "/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    },
    "Failed to login"
  );
}