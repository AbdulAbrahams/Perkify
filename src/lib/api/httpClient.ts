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
import type { ApiClient } from "./types";

export class HttpApiClient implements ApiClient {
  private accessToken: string | null = null;

  constructor(private readonly baseUrl: string) {}

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const session = await this.request<AuthSession>("/auth/login", { method: "POST", body: credentials });
    this.accessToken = session.accessToken;
    return session;
  }

  restoreSession(session: AuthSession): void {
    this.accessToken = session.accessToken;
  }

  async register(credentials: RegisterCredentials): Promise<AuthSession> {
    const session = await this.request<AuthSession>("/auth/register", { method: "POST", body: credentials });
    this.accessToken = session.accessToken;
    return session;
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.request<void>("/auth/password-reset", { method: "POST", body: { email } });
  }

  async logout(): Promise<void> {
    await this.request<void>("/auth/logout", { method: "POST" });
    this.accessToken = null;
  }

  clearSession(): void {
    this.accessToken = null;
  }

  getProfile(): Promise<UserProfile> {
    return this.request("/profile");
  }

  updateProfile(profile: UpdateProfile): Promise<UserProfile> {
    return this.request("/profile", { method: "PATCH", body: profile });
  }

  getCards(): Promise<LoyaltyCard[]> {
    return this.request("/cards");
  }

  createCard(card: CreateLoyaltyCard): Promise<LoyaltyCard> {
    return this.request("/cards", { method: "POST", body: card });
  }

  updateCard(id: string, changes: UpdateLoyaltyCard): Promise<LoyaltyCard> {
    return this.request(`/cards/${encodeURIComponent(id)}`, { method: "PATCH", body: changes });
  }

  async deleteCard(id: string): Promise<void> {
    await this.request<void>(`/cards/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  getTransactions(): Promise<LoyaltyTransaction[]> {
    return this.request("/transactions");
  }

  getRewardsSummary(): Promise<RewardsSummary> {
    return this.request("/rewards/summary");
  }

  getSettings(): Promise<AppSettings> {
    return this.request("/settings");
  }

  updateSettings(changes: Partial<AppSettings>): Promise<AppSettings> {
    return this.request("/settings", { method: "PATCH", body: changes });
  }

  private async request<T>(
    path: string,
    options: { method?: string; body?: unknown } = {},
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
      },
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed (${response.status}).`);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }
}
