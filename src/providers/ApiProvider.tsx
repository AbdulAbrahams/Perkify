import { useMemo, type ReactNode } from "react";
import { apiClient } from "../lib/api";
import { ApiContext } from "../hooks/useApi";

export function ApiProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => apiClient, []);
  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
}
