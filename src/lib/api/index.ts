import { API_BASE_URL, USE_MOCK_API } from "./config";
import { HttpApiClient } from "./httpClient";
import { MockApiClient } from "./mockClient";
import type { ApiClient } from "./types";

export type { ApiClient } from "./types";
export { API_BASE_URL, USE_MOCK_API } from "./config";

export const apiClient: ApiClient = USE_MOCK_API
  ? new MockApiClient()
  : new HttpApiClient(API_BASE_URL);
