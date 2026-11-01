export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
};

export type AuthSession = {
  accessToken: string;
  user: UserProfile;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  fullName: string;
};

export type LoyaltyCardCategory = "grocery" | "petrol" | "retail" | "rewards";

export type LoyaltyCard = {
  id: string;
  name: string;
  category?: LoyaltyCardCategory;
  color: string;
  points: string;
  number: string | null;
};

export type CreateLoyaltyCard = Omit<LoyaltyCard, "id" | "points" | "category"> & {
  category: LoyaltyCardCategory;
};
export type UpdateLoyaltyCard = Partial<CreateLoyaltyCard>;

export type LoyaltyTransaction = {
  id: string;
  cardId: string;
  merchant: string;
  description: string;
  pointsDelta: number;
  occurredAt: string;
};

export type RewardsSummary = {
  pointsBalance: number;
  pointsToNextReward: number;
};

export type AppSettings = {
  notificationsEnabled: boolean;
  biometricLoginEnabled: boolean;
  hideBalances: boolean;
};

export type UpdateProfile = Pick<UserProfile, "fullName" | "email">;
