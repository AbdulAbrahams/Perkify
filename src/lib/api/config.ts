import Constants from "expo-constants";

const configuredApiUrl = Constants.expoConfig?.extra?.apiBaseUrl;
export const API_BASE_URL = typeof configuredApiUrl === "string"
  ? configuredApiUrl.replace(/\/$/, "")
  : "";
export const USE_MOCK_API = API_BASE_URL.length === 0;
