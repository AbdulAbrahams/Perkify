import type {
  AppSettings,
  AuthSession,
  CreateLoyaltyCard,
  LoginCredentials,
  LoyaltyCard,
  LoyaltyTransaction,
  RegisterCredentials,
  RewardsSummary,
  UpdateLoyaltyCard,
  UpdateProfile,
  UserProfile,
} from "../../types/models";

export interface ApiClient {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  restoreSession(session: AuthSession): void;
  register(credentials: RegisterCredentials): Promise<AuthSession>;
  requestPasswordReset(email: string): Promise<void>;
  logout(): Promise<void>;
  clearSession(): void;
  getProfile(): Promise<UserProfile>;
  updateProfile(profile: UpdateProfile): Promise<UserProfile>;
  getCards(): Promise<LoyaltyCard[]>;
  createCard(card: CreateLoyaltyCard): Promise<LoyaltyCard>;
  updateCard(id: string, changes: UpdateLoyaltyCard): Promise<LoyaltyCard>;
  deleteCard(id: string): Promise<void>;
  getTransactions(): Promise<LoyaltyTransaction[]>;
  getRewardsSummary(): Promise<RewardsSummary>;
  getSettings(): Promise<AppSettings>;
  updateSettings(changes: Partial<AppSettings>): Promise<AppSettings>;
}
