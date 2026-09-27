# Authentication and authorization (mock)

This is **not** production security. AutoDrive pretends to log people in so you can learn the Vue pieces. A real .NET API would own passwords, cookies or JWTs, and HTTPS.

## Authentication vs authorization

| Word | Question | AutoDrive example |
|---|---|---|
| **Authentication** | Who are you? | `POST /auth/login` returns a token + user |
| **Authorization** | What may you do? | `CUSTOMER` cannot open `/admin` |

You can be authenticated and still get **403 Forbidden**. That is not a failed login.

## Three apps, one mock user list

| App | Route | Roles that may enter |
|---|---|---|
| Client | `/account` | any signed-in user |
| CMS | `/cms` | `CMS_EDITOR`, `CMS_REVIEWER`, `ADMIN` |
| Admin | `/admin` | `ADMIN`, `INVENTORY_MANAGER`, `SERVICE_MANAGER` |

These are **areas inside the client app** so Day 9 stays on auth. Later days can split them into `cms/` and `admin/` Vite apps that call the same `/auth/*` contract.

## Token vs session

| Idea | What it is here |
|---|---|
| **Token** | A string `mock.<userId>.<timestamp>` stored with `Authorization: Bearer …` |
| **Session** | That token plus the user, kept in `sessionStorage` for this tab |

Close the tab → `sessionStorage` is gone. Refresh → Vue sends the token to `GET /auth/me`. The mock token includes the user id (like a JWT payload, **without** a signature) so seed users stay signed in. A user you just registered exists only in memory — a full reload drops them. That is a mock limitation, not how .NET would work.

This token is **not** a signed JWT. Anyone can edit `sessionStorage`. That is why this is a classroom mock.

## Roles vs permissions

- **Role** — a job title on the user (`CMS_EDITOR`).
- **Permission** — a verb the UI checks (`cms.draft`, `cms.publish`).
- Admin has `*`, so every `can(permission)` is true.

The route guard checks **roles**. The CMS/Admin cards check **permissions**. Both are authorization.

## What a real .NET API would change

| Today (mock) | Later (.NET) |
|---|---|
| Passwords stored as plain text in `db.users` | Hash + salt (ASP.NET Identity or similar). Never send the hash to Vue. |
| Token is `mock.4.1727…` | Signed JWT or an HTTP-only cookie |
| `sessionStorage` | Cookie is safer against XSS; JWT in memory is a common SPA choice |
| `GET /auth/me` looks up `db.sessions` | Validate signature / cookie, load user from SQL |
| Route guard is the only lock | API must check the same roles. A forged URL to `/admin` is only a Vue page. `DELETE /vehicles/1` must still 403 on the server. |
| `VITE_USE_MOCK=true` | `false` + `VITE_API_BASE_URL`. Views and `authStore` stay the same. The switch is still `http.js`. |

**Never trust the Vue guard alone.** It is UX. The API is security.

## Request path

```
LoginView
  → useLoginForm / authStore.login()
    → authService.login()
      → request('POST /auth/login')   // http.js attaches Bearer if one exists
        → mock router or later .NET
```
