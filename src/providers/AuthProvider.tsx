import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
  UserProfile,
} from "../types/models";
import { useApi } from "../hooks/useApi";

type AuthContextValue = {
  session: AuthSession | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const api = useApi();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      setSession(await api.login(credentials));
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to log in.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      setSession(await api.register(credentials));
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create your account.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.logout();
      setSession(null);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to log out.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.requestPasswordReset(email);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to request a password reset.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const clearError = useCallback(() => setError(null), []);
  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session),
    isLoading,
    error,
    login,
    register,
    requestPasswordReset,
    logout,
    clearError,
  }), [session, isLoading, error, login, register, requestPasswordReset, logout, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
