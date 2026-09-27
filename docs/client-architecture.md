# Client application architecture

The public dealership site is one Vue 3 app. Every customer screen follows the same path. The view never talks to `fetch` or the mock router.

```
Component (AccountView.vue)
    ↓
Composable (useAccount.js)
    ↓
Store (accountStore / favoriteStore / compareStore / authStore)
    ↓
Service (testDriveService, financeService, …)
    ↓
request() in http.js
    ↓
Mock API  (or later .NET)
```

| Layer | Owns | Must not own |
|---|---|---|
| **Component** | Layout, slots, buttons, `v-if` | URLs, `fetch`, mock DB |
| **Composable** | Page-only glue: pagination, modal, which store to call | HTTP method names |
| **Store** | Shared lists and status (`loading` / `error`) | Bootstrap markup |
| **Service** | Path + verb (`GET /test-drives`) | Spinners |
| **http.js + mock** | JSON, delay, 401/500 | Which page called |

## Why each hop exists

- **Component → composable** — `/account` has seven sections. The `.vue` file stays readable if page state lives in `useAccount`.
- **Composable → store** — Favorites and compare are also used on cards and `/saved`. Bookings are used on `/requests`. Pinia is the shared memory.
- **Store → service** — The store can swap mock for .NET without the page changing.
- **Service → mock** — One `request()` so later `VITE_USE_MOCK=false` is a single switch.

## What is reusable vs unique

Reusable on `/account`: `DataTable`, `StatusBadge`, `EmptyState`, `LoadingState`, `ErrorState`, `Modal`, `Pagination`.

Unique: the column lists, the confirm copy, and which store action runs after the modal.
