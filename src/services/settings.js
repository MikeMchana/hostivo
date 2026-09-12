import { apiRequest } from "./api";

export async function getSettings() {
  return apiRequest(
    "/settings/",
    {},
    "Failed to fetch settings"
  );
}

export async function updateSettings(settingsData) {
  return apiRequest(
    "/settings/",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settingsData),
    },
    "Failed to save settings"
  );
}