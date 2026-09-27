# Debugging like a UI professional

Day 14 is not a new feature. It is a habit: **do not guess**. Walk this list in order. Stop when the evidence names the layer.

```
1. Reproduce
2. Expected vs actual
3. Console
4. Network
5. Request
6. Response
7. Status code
8. Vue state
9. Component
10. CSS
11. Fix root cause
12. Retest
```

---

## The 12 steps (say them in an interview)

### 1. Reproduce

Do the same clicks, the same URL, the same role. If you cannot make it fail twice, you cannot prove a fix. Write: “Signed in as Alex → `/test-drive` → Submit with empty phone.”

### 2. Expected vs actual

One sentence each.

- Expected: inventory shows the 2026 RAV4 after search `RAV4`.
- Actual: the grid is blank, or it still shows the F-150.

If you cannot write this, you do not have a bug yet — you have a feeling.

### 3. Console

F12 → **Console**. Red errors first.

| You see | Meaning |
|---|---|
| `[API] GET /vehicles → 200` | `request()` ran. The mock (or later .NET) answered. |
| `TypeError: Cannot read properties of undefined` | Vue expected a field the JSON did not have. |
| CORS / Failed to fetch | Network / server. Not a CSS bug. |

Today the mock **does not** appear in Network. The console line and the footer API log are your Network.

### 4. Network

F12 → **Network** → **Fetch/XHR**. After `VITE_USE_MOCK=false` this is the source of truth.

No row → the click never called `request()`. Vue / event bug.  
A row → go to steps 5–7. Do not open Elements yet.

### 5. Request

Click the row → **Headers** + **Payload**.

- URL: `/api/vehicles/1` or `/api/vehicles?make=Honda`?
- Method: GET vs POST vs PATCH?
- Headers: `Authorization: Bearer …` after login? `Content-Type: application/json` on POST?
- Body: did Vue send `vehicleId` or `undefined`?

### 6. Response

**Response** tab. This is what Vue binds.

- `[]` vs missing field vs `{ Price: 36990 }` (capital P).
- A 200 with `[]` is not an API outage. The UI should show Empty, not Error.

### 7. Status code

| Code | Your next move |
|---|---|
| 200 / 201 | UI mapping or Vue state. The server did its job. |
| 400 / 422 | Payload / validation. Fix the form or the contract. |
| 401 | Token missing or dead. Login, then check the header. |
| 403 | Signed in, wrong permission. Not a 404. |
| 404 | Wrong path or id (`/vehicles/undefined`). |
| 409 | State clash (publish twice, duplicate email). |
| 500 | Retry. Not a CSS rewrite. |

`fetch` does **not** throw on 404. `http.js` throws `ApiError` when `!response.ok`. If status stays `loading`, the promise never settled — that is why the spinner never stops.

### 8. Vue state

Pinia / composable / `ref`. Vue DevTools → Pinia → `vehicles`.

- `listStatus` still `loading`? Request never finished.
- `items` has 24 cars and the grid is empty? Component / filter, not the API.
- Heart on the card does not match details? Two sources of truth — that is why favorites live in `favoriteStore`.

### 9. Component

Props, emits, `v-if`. Vue DevTools → the view.

- `v-if="vehicle.Price"` is always false if JSON is `price`.
- A modal with `open: false` will never show. Check the parent’s boolean.
- A computed filter that reads a stale `ref` instead of `filters.make` “does nothing.”

### 10. CSS

**Elements** → select the node → computed styles. Last, not first.

- Mobile: hamburger covers the search? Breakpoint, not API.
- `d-none d-md-flex` hides carousel arrows on a phone — that is intentional.
- `pointer-events: none` or `z-index` can make a modal look “broken.”

### 11. Fix the root cause

One layer. If Network is 422, do not restyle the button. If Pinia never updates, do not add another `watch` on the view.

### 12. Retest

Same steps as reproduce. Then one nearby path (inventory after details, account after test drive). A fix that breaks another page is not done.

---

## Chrome DevTools — which panel

| Panel | Use it for |
|---|---|
| **Console** | JS exceptions, `[API]` lines, CORS text |
| **Network** | Method, URL, status, payload, response, timing |
| **Elements** | DOM, labels, `alt`, computed CSS, `:hover` / `:focus` |
| **Application** | `sessionStorage` token, `localStorage` favorites, cookies later |
| **Performance** | Record a slow click. Long **Scripting** = Vue. Long **Network** = API. |

Responsive: DevTools device toolbar. Check **375** (phone), **768** (tablet), **1280** (laptop), **1440+** (desktop). Look at the header hamburger, inventory filters wrapping, finance two-column stack, CMS/Admin sidebar.

---

## Ten realistic AutoDrive bugs

Walk each one with the 12 steps. These are the stories interviewers want.

### 1. API returns 200 but the UI is empty

`GET /vehicles` → 200 → `[]` or Vue reads `vehicle.Price`. Console is clean. Network is green. Pinia `items` is `[]` **or** items are full and the computed filter wiped them. Empty state vs “I bound the wrong field.”

### 2. API returns 400

POST test drive with `day: ""`. Console `[API] POST /test-drives → 400`. Payload is the proof. Fix the form. Do not add a spinner.

### 3. API returns 401

`GET /account` after a refresh. Token in `sessionStorage` (Application tab) but header missing — `http.js` bug. Token gone — login again. Token present and 401 — API rejected it.

### 4. Wrong request payload

Finance POST without `loanAmount` because “Use these numbers” was never clicked. Network → Payload. Vue validation should have stopped it; if it did not, `validateFinanceApplication` is the root cause.

### 5. Wrong route parameter

Details URL `/vehicles/undefined`. Path param came from `vehicle.id` before the store loaded. Network `GET /vehicles/undefined` → 404. Fix the router `props: true` / wait for id. Not a database bug.

### 6. Pinia state not updating

Heart on the card, details page still empty heart. Two components, two local `ref`s. The fix is `favoriteStore`, not another emit.

### 7. Computed filter not working

Search box updates `filters.search` but the computed still reads a one-time `route.query.search`. Inventory looks “stuck.” Vue DevTools shows the ref change; the computed source is wrong.

### 8. Mobile layout broken

375px: filters stack, hamburger works, cards are one column. If the search form overflows, that is CSS (`col-12` missing). Network is irrelevant.

### 9. Modal not opening

Account cancel test drive. `open` stays false because the parent never set `pendingDelete`. Elements will not show a dialog. Vue state first. Escape and focus are a11y — they matter after it opens.

### 10. Loading spinner never stops

`listStatus` stuck on `loading`. The request threw and the `catch` never set `error`, or the promise was never awaited. ResourceState only hides the spinner when status leaves `loading`.

---

## What you send the API team

One ticket: **method, URL, status, request JSON, response JSON**. Screenshot of Network is enough. You do not attach a SQL plan.
