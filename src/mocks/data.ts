import type {
  AppSettings,
  LoyaltyCard,
  LoyaltyTransaction,
  RewardsSummary,
  UserProfile,
} from "../types/models";

export const mockProfile: UserProfile = {
  id: "user-john-doe",
  fullName: "John Doe",
  email: "john.doe@email.com",
  avatarUrl: null,
  createdAt: "2025-01-15T09:00:00.000Z",
};

export const mockCards: LoyaltyCard[] = [
  { id: "checkers", name: "Checkers", color: "#20A9B5", points: "1,240 pts", number: "123456789" },
  { id: "woolworths", name: "Woolworths", color: "#111111", points: "860 pts", number: "123456789"  },
  { id: "picknpay", name: "Pick n Pay", color: "#FFFFFF", points: "540 pts", number: "123456789"  },
  { id: "bp", name: "BP", color: "#19C90A", points: "2,150 pts", number: "123456789"  },
  { id: "engen", name: "Engen", color: "#F47A12", points: "320 pts", number: "123456789"  },
  { id: "shell", name: "Shell", color: "#FFD522", points: "710 pts", number: "123456789"  },
  { id: "count", name: "COUNT rewards", color: "#FFFFFF", points: "435 pts", number: "123456789"  },
  { id: "shoprite", name: "Shoprite", color: "#E93145", points: "290 pts", number: "123456789"  },
];

export const mockTransactions: LoyaltyTransaction[] = [
  {
    id: "transaction-checkers-1",
    cardId: "checkers",
    merchant: "Checkers",
    description: "Points earned",
    pointsDelta: 120,
    occurredAt: "2026-10-26T08:42:00.000Z",
  },
  {
    id: "transaction-bp-1",
    cardId: "bp",
    merchant: "BP Rewards",
    description: "Points earned",
    pointsDelta: 85,
    occurredAt: "2026-10-25T14:15:00.000Z",
  },
  {
    id: "transaction-woolworths-1",
    cardId: "woolworths",
    merchant: "Woolworths",
    description: "Reward redeemed",
    pointsDelta: -200,
    occurredAt: "2026-10-20T10:30:00.000Z",
  },
];

export const mockSettings: AppSettings = {
  notificationsEnabled: true,
  biometricLoginEnabled: false,
  hideBalances: false,
};

export const mockRewardsSummary: RewardsSummary = {
  pointsBalance: 5240,
  pointsToNextReward: 760,
};
