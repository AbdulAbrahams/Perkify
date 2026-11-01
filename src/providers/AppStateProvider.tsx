import { createContext, useContext, useState, type ReactNode } from "react";
import type { LoyaltyCard } from "../types/models";

type AuthMode = "login" | "signup";

type AppState = {
  onboardingIndex: number;
  setOnboardingIndex: (n: number) => void;
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
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [selectedCard, setSelectedCard] = useState<LoyaltyCard | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [formError, setFormError] = useState("");

  return (
    <Ctx.Provider
      value={{
        onboardingIndex, setOnboardingIndex,
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