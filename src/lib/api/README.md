# API integration

The app currently runs against `MockApiClient`, an in-memory implementation of
the typed `ApiClient` contract. Authentication accepts any valid email and a
password with at least 8 characters; mock card, profile, settings, and transaction changes stay
in memory for the current app session.

To use a backend, set `expo.extra.apiBaseUrl` in the root `app.json` to the API
origin, then restart Expo. An empty URL keeps mock mode enabled. `HttpApiClient`
uses the same `ApiClient` interface, adds the access token as a bearer token,
and expects JSON responses matching `src/types/models.ts`.

The HTTP client currently expects these routes:

| Method | Route | Request/response |
| --- | --- | --- |
| POST | `/auth/login` | `LoginCredentials` → `AuthSession` |
| POST | `/auth/register` | `RegisterCredentials` → `AuthSession` |
| POST | `/auth/password-reset` | `{ email }` → Empty response |
| POST | `/auth/logout` | Empty response |
| GET, PATCH | `/profile` | `UserProfile`; PATCH accepts `UpdateProfile` |
| GET, POST | `/cards` | `LoyaltyCard[]`; POST accepts `CreateLoyaltyCard` |
| PATCH, DELETE | `/cards/:id` | `UpdateLoyaltyCard`; DELETE returns empty response |
| GET | `/transactions` | `LoyaltyTransaction[]` |
| GET | `/rewards/summary` | `RewardsSummary` |
| GET, PATCH | `/settings` | `AppSettings`; PATCH accepts a partial settings object |

If the production API uses different paths or response envelopes, adapt
`HttpApiClient` while leaving the providers and screens unchanged.
