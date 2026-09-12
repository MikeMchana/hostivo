const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function handleResponse(response, fallbackMessage) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || fallbackMessage
    );
  }

  return response.json();
}

function getAuthHeaders() {
  const token = localStorage.getItem("hostivo_token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function apiRequest(
  endpoint,
  options = {},
  fallbackMessage = "Request failed"
) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  return handleResponse(
    response,
    fallbackMessage
  );
}

export async function testOrdersRequest() {
  return apiRequest(
    "/orders/",
    {},
    "Failed to fetch orders"
  );
}