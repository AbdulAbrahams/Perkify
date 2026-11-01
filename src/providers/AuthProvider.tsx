import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
  UserProfile,
} from "../types/models";
import { useApi } from "../hooks/useApi";
import {
  clearBiometricSession,
  isBiometricLoginConfigured,
  readBiometricSession,
  saveBiometricSession,
} from "../lib/biometrics";

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
  clearLocalSession: () => Promise<void>;
  enableBiometricLogin: () => Promise<void>;
  disableBiometricLogin: () => Promise<void>;
  biometricLogin: () => Promise<boolean>;
  hasBiometricLogin: boolean;
  biometricSetupChecked: boolean;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const api = useApi();
  const [session, setSession] = useState<AuthSession | null>(null);
  const sessionRef = useRef<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasBiometricLogin, setHasBiometricLogin] = useState(false);
  const [biometricSetupChecked, setBiometricSetupChecked] = useState(false);

  useEffect(() => {
    let active = true;
    isBiometricLoginConfigured()
      .then((configured) => {
        if (active) {
          setHasBiometricLogin(configured);
          setBiometricSetupChecked(true);
        }
      })
      .catch((cause: unknown) => {
        console.error("Unable to check biometric login setup.", cause);
        if (active) setBiometricSetupChecked(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const nextSession = await api.login(credentials);
      sessionRef.current = nextSession;
      setSession(nextSession);
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
      const nextSession = await api.register(credentials);
      sessionRef.current = nextSession;
      setSession(nextSession);
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
      await clearBiometricSession();
      setHasBiometricLogin(false);
      sessionRef.current = null;
      setSession(null);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to log out.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const clearLocalSession = useCallback(async () => {
    await clearBiometricSession();
    api.clearSession();
    sessionRef.current = null;
    setSession(null);
    setHasBiometricLogin(false);
    setError(null);
  }, [api]);

  const enableBiometricLogin = useCallback(async () => {
    const activeSession = sessionRef.current;
    if (!activeSession) throw new Error("Sign in before enabling biometric login.");
    await saveBiometricSession(activeSession);
    setHasBiometricLogin(true);
  }, []);

  const disableBiometricLogin = useCallback(async () => {
    await clearBiometricSession();
    setHasBiometricLogin(false);
  }, []);

  const biometricLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const savedSession = await readBiometricSession();
      if (!savedSession) throw new Error("No saved biometric login was found. Sign in with your password.");
      api.restoreSession(savedSession);
      await api.getProfile();
      sessionRef.current = savedSession;
      setSession(savedSession);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in with biometrics.");
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
    clearLocalSession,
    enableBiometricLogin,
    disableBiometricLogin,
    biometricLogin,
    hasBiometricLogin,
    biometricSetupChecked,
    clearError,
  }), [session, isLoading, error, login, register, requestPasswordReset, logout, clearLocalSession, enableBiometricLogin, disableBiometricLogin, biometricLogin, hasBiometricLogin, biometricSetupChecked, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
