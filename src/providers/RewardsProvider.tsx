import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppSettings,
  CreateLoyaltyCard,
  LoyaltyCard,
  LoyaltyTransaction,
  RewardsSummary,
  UpdateLoyaltyCard,
} from "../types/models";
import { useApi } from "../hooks/useApi";
import { useAuth } from "./AuthProvider";
import { mockSettings } from "../mocks/data";

type RewardsContextValue = {
  cards: LoyaltyCard[];
  transactions: LoyaltyTransaction[];
  settings: AppSettings;
  summary: RewardsSummary;
  isLoading: boolean;
  error: string | null;
  addCard: (card: CreateLoyaltyCard) => Promise<boolean>;
  updateCard: (id: string, changes: UpdateLoyaltyCard) => Promise<boolean>;
  removeCard: (id: string) => Promise<boolean>;
  updateSettings: (changes: Partial<AppSettings>) => Promise<boolean>;
  clearError: () => void;
};

const RewardsContext = createContext<RewardsContextValue | null>(null);

export function RewardsProvider({ children }: { children: ReactNode }) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [summary, setSummary] = useState<RewardsSummary>({ pointsBalance: 0, pointsToNextReward: 0 });
  const [settings, setSettings] = useState<AppSettings>(mockSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      setIsLoading(false);
      setCards([]);
      setTransactions([]);
      setSummary({ pointsBalance: 0, pointsToNextReward: 0 });
      setSettings(mockSettings);
      setError(null);
      return () => { active = false; };
    }
    setIsLoading(true);
    Promise.all([api.getCards(), api.getTransactions(), api.getSettings(), api.getRewardsSummary()])
      .then(([nextCards, nextTransactions, nextSettings, nextSummary]) => {
        if (!active) return;
        setCards(nextCards);
        setTransactions(nextTransactions);
        setSettings(nextSettings);
        setSummary(nextSummary);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load your rewards.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [api, isAuthenticated]);

  const addCard = useCallback(async (card: CreateLoyaltyCard) => {
    setError(null);
    try {
      const created = await api.createCard(card);
      setCards((current) => [created, ...current]);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to add the card.");
      return false;
    }
  }, [api]);

  const updateCard = useCallback(async (id: string, changes: UpdateLoyaltyCard) => {
    setError(null);
    try {
      const updated = await api.updateCard(id, changes);
      setCards((current) => current.map((card) => card.id === id ? updated : card));
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update the card.");
      return false;
    }
  }, [api]);

  const removeCard = useCallback(async (id: string) => {
    setError(null);
    try {
      await api.deleteCard(id);
      setCards((current) => current.filter((card) => card.id !== id));
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to remove the card.");
      return false;
    }
  }, [api]);

  const updateSettings = useCallback(async (changes: Partial<AppSettings>) => {
    setError(null);
    try {
      setSettings(await api.updateSettings(changes));
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update settings.");
      return false;
    }
  }, [api]);

  const clearError = useCallback(() => setError(null), []);
  const value = useMemo(() => ({
    cards,
    transactions,
    settings,
    summary,
    isLoading,
    error,
    addCard,
    updateCard,
    removeCard,
    updateSettings,
    clearError,
  }), [cards, transactions, settings, summary, isLoading, error, addCard, updateCard, removeCard, updateSettings, clearError]);

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>;
}

export function useRewards(): RewardsContextValue {
  const context = useContext(RewardsContext);
  if (!context) throw new Error("useRewards must be used inside RewardsProvider.");
  return context;
}
