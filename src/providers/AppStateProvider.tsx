import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LoyaltyCard } from "../types/models";

type AuthMode = "login" | "signup";
const ONBOARDING_COMPLETE_KEY = "perkify:onboarding-complete";

type AppState = {
  onboardingIndex: number;
  setOnboardingIndex: (n: number) => void;
  hasCompletedOnboarding: boolean;
  isOnboardingStateReady: boolean;
  completeOnboarding: () => Promise<boolean>;
  clearLocalAppState: () => Promise<boolean>;
  authMode: AuthMode;
  setAuthMode: (m: AuthMode) => void;
  selectedCard: LoyaltyCard | null;
  setSelectedCard: (c: LoyaltyCard | null) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  fullName: string;
  setFullName: (v: string) => void;
  formError: string;
  setFormError: (v: string) => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isOnboardingStateReady, setIsOnboardingStateReady] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [selectedCard, setSelectedCard] = useState<LoyaltyCard | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY)
      .then((value) => {
        if (active) setHasCompletedOnboarding(value === "true");
      })
      .catch((error: unknown) => {
        console.error("Unable to load onboarding state.", error);
      })
      .finally(() => {
        if (active) setIsOnboardingStateReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
      setHasCompletedOnboarding(true);
      return true;
    } catch (error) {
      console.error("Unable to save onboarding state.", error);
      return false;
    }
  };

  const clearLocalAppState = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
      setOnboardingIndex(0);
      setHasCompletedOnboarding(false);
      setAuthMode("login");
      setSelectedCard(null);
      setEmail("");
      setPassword("");
      setFullName("");
      setFormError("");
      return true;
    } catch (error) {
      console.error("Unable to clear local app state.", error);
      return false;
    }
  };

  return (
    <Ctx.Provider
      value={{
        onboardingIndex, setOnboardingIndex,
        hasCompletedOnboarding, isOnboardingStateReady, completeOnboarding,
        clearLocalAppState,
        authMode, setAuthMode,
        selectedCard, setSelectedCard,
        email, setEmail,
        password, setPassword,
        fullName, setFullName,
        formError, setFormError,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}