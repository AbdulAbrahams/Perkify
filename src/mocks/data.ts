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
];

export const mockTransactions: LoyaltyTransaction[] = [

];

export const mockSettings: AppSettings = {
  notificationsEnabled: false,
  biometricLoginEnabled: false,
  hideBalances: false,
};

export const mockRewardsSummary: RewardsSummary = {
  pointsBalance: 0,
  pointsToNextReward: 500,
};
