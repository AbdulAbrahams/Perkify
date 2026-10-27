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
import { mockCards, mockProfile, mockRewardsSummary, mockSettings, mockTransactions } from "../../mocks/data";
import { validateEmail, validateFullName, validatePassword } from "../../utils/validation";
import type { ApiClient } from "./types";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 180));

export class MockApiClient implements ApiClient {
  private profile: UserProfile = clone(mockProfile);
  private cards = clone(mockCards);
  private settings = clone(mockSettings);
  private transactions = clone(mockTransactions);
  private summary = clone(mockRewardsSummary);
  private session: AuthSession | null = null;

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await wait();
    const validationError = validateEmail(credentials.email) ?? validatePassword(credentials.password);
    if (validationError) throw new Error(validationError);
    const email = credentials.email.trim().toLowerCase();
    const user = email === mockProfile.email
      ? clone(mockProfile)
      : { ...clone(mockProfile), id: `user-${email}`, email, fullName: this.nameFromEmail(email) };
    this.profile = user;
    this.session = { accessToken: `mock-token-${Date.now()}`, user };
    return clone(this.session);
  }

  async register(credentials: RegisterCredentials): Promise<AuthSession> {
    await wait();
    const validationError = validateFullName(credentials.fullName)
      ?? validateEmail(credentials.email)
      ?? validatePassword(credentials.password);
    if (validationError) throw new Error(validationError);
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: credentials.fullName.trim(),
      email: credentials.email.trim().toLowerCase(),
      avatarUrl: null,
      createdAt: new Date().toISOString(),
    };
    this.profile = user;
    this.session = { accessToken: `mock-token-${Date.now()}`, user };
    return clone(this.session);
  }

  async requestPasswordReset(email: string): Promise<void> {
    await wait();
    const validationError = validateEmail(email);
    if (validationError) throw new Error(validationError);
  }

  async logout(): Promise<void> {
    await wait();
    this.session = null;
  }

  async getProfile(): Promise<UserProfile> {
    await wait();
    this.requireSession();
    return clone(this.profile);
  }

  async updateProfile(changes: UpdateProfile): Promise<UserProfile> {
    await wait();
    this.requireSession();
    const validationError = validateFullName(changes.fullName) ?? validateEmail(changes.email);
    if (validationError) throw new Error(validationError);
    this.profile = { ...this.profile, ...changes };
    if (this.session) this.session.user = this.profile;
    return clone(this.profile);
  }

  async getCards(): Promise<LoyaltyCard[]> {
    await wait();
    this.requireSession();
    return clone(this.cards);
  }

  async createCard(card: CreateLoyaltyCard): Promise<LoyaltyCard> {
    await wait();
    this.requireSession();
    if (!card.name.trim()) throw new Error("Card name is required.");
    const created: LoyaltyCard = { ...card, id: `card-${Date.now()}`, points: "0 pts" };
    this.cards = [created, ...this.cards];
    return clone(created);
  }

  async updateCard(id: string, changes: UpdateLoyaltyCard): Promise<LoyaltyCard> {
    await wait();
    this.requireSession();
    if (changes.name !== undefined && !changes.name.trim()) {
      throw new Error("Card name is required.");
    }
    const index = this.cards.findIndex((card) => card.id === id);
    if (index < 0) throw new Error("That loyalty card could not be found.");
    const updated = { ...this.cards[index], ...changes };
    this.cards = this.cards.map((card) => card.id === id ? updated : card);
    return clone(updated);
  }

  async deleteCard(id: string): Promise<void> {
    await wait();
    this.requireSession();
    if (!this.cards.some((card) => card.id === id)) {
      throw new Error("That loyalty card could not be found.");
    }
    this.cards = this.cards.filter((card) => card.id !== id);
  }

  async getTransactions(): Promise<LoyaltyTransaction[]> {
    await wait();
    this.requireSession();
    return clone(this.transactions);
  }

  async getRewardsSummary(): Promise<RewardsSummary> {
    await wait();
    this.requireSession();
    return clone(this.summary);
  }

  async getSettings(): Promise<AppSettings> {
    await wait();
    this.requireSession();
    return clone(this.settings);
  }

  async updateSettings(changes: Partial<AppSettings>): Promise<AppSettings> {
    await wait();
    this.requireSession();
    this.settings = { ...this.settings, ...changes };
    return clone(this.settings);
  }

  private requireSession(): void {
    if (!this.session) throw new Error("Please log in to continue.");
  }

  private nameFromEmail(email: string): string {
    const username = email.split("@")[0] ?? "";
    return username
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "Perkify member";
  }
}
