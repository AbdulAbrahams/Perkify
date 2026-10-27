import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UpdateProfile, UserProfile } from "../types/models";
import { useApi } from "../hooks/useApi";
import { useAuth } from "./AuthProvider";

type ProfileContextValue = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (changes: UpdateProfile) => Promise<boolean>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      setIsLoading(false);
      setProfile(null);
      setError(null);
      return () => { active = false; };
    }
    setIsLoading(true);
    api.getProfile()
      .then((nextProfile) => {
        if (active) setProfile(nextProfile);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load your profile.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [api, isAuthenticated]);

  const updateProfile = useCallback(async (changes: UpdateProfile) => {
    setIsLoading(true);
    setError(null);
    try {
      setProfile(await api.updateProfile(changes));
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update your profile.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const value = useMemo(() => ({ profile, isLoading, error, updateProfile }), [
    profile,
    isLoading,
    error,
    updateProfile,
  ]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider.");
  return context;
}
