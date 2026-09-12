const API_URL = "http://127.0.0.1:8000";

async function handleResponse(response, fallbackMessage) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || fallbackMessage
    );
  }

  return response.json();
}

export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  return handleResponse(
    response,
    "Failed to login"
  );
}