# API handling and request state (one file to learn)

Read this when you want the whole Day 5 picture in one place.

**Two ideas, do not mix them:**

| Name | What it is | File |
|---|---|---|
| **API handling** | How we call GET / POST / PUT / PATCH / DELETE | `client/src/api/http.js` — **the one switch** |
| **Request state** | INITIAL → LOADING → SUCCESS / EMPTY / ERROR + Retry | `client/src/composables/useAsyncResource.js` |

This is **not** Pinia. Pinia is shared app state (later). Today “state” means “what is this API call doing?”

---

## The one file the real API goes into

A Vue view must **never** write `fetch(...)`.

Every service already calls one function:

```js
request('/vehicles')
request('/vehicles/1', { method: 'PATCH', body: { saved: true } })
```

That function lives in **`client/src/api/http.js`**. Mock or real .NET is decided **only there**:

```js
if (useMock) {
  await wait(randomDelay())
  response = handleMockRequest(path, init)   // fake REST (today)
} else {
  response = await fetch(`${baseUrl}${path}`, init)  // real .NET (later)
}
```

`useMock` comes from `client/.env`:

```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=https://localhost:5001/api
```

| Today | Later, when .NET exists |
|---|---|
| `VITE_USE_MOCK=true` | `VITE_USE_MOCK=false` |
| In-memory router | `fetch(https://localhost:5001/api/vehicles)` |
| Footer log + Console | Same log **plus** Chrome **Network** tab |

**What you do not change:** views, composables, services.

The component does not care if the backend is mock or .NET. It only sees `status`, `vehicles`, and `retry()`.

---

## Layers (who talks to whom)

```
VehiclesView.vue
    calls  load() / retry()
        ↓
useVehicles.js                  request STATE lives here
    calls  listVehicles()
        ↓
vehicleService.js               path + HTTP method
    calls  request('/vehicles')
        ↓
http.js                         THE ONE FILE  (mock OR fetch)
        ↓
mock/router.js   or   .NET GET /api/vehicles
```

| Layer | Knows | Must not know |
|---|---|---|
| View | `status`, data, Retry button | URLs, mock, `fetch` |
| Composable | `async/await`, `try/catch`, status | Mock vs .NET |
| Service | `/vehicles`, GET vs POST | Spinners |
| `http.js` | JSON, headers, `Response`, errors | Which screen called it |

---

## Words you must know

### `fetch`

Browser function. You give it a URL. It returns a **Promise** of a **Response**.

```js
const response = await fetch('https://localhost:5001/api/vehicles')
```

It does **not** throw on 404 or 500. You must check `response.ok`.

### Promise

An object for a value that will exist later. `request()` returns a Promise.

### `async` / `await`

Syntax on top of Promises. `await` can only be used inside an `async` function.

```js
async function load() {
  const list = await listVehicles()
}
```

### `Response`

What `fetch` (or the mock) gives you: `status` (200, 404, 500), `ok`, and a body.

### JSON

The body is text. Turn it into objects:

```js
const data = await response.json()
```

When we **send** data (POST / PUT / PATCH) we do the opposite:

```js
body: JSON.stringify({ name: 'Alex', phone: '214…' })
```

`http.js` does both of these so services stay short.

### `try` / `catch`

If `await request()` throws (`ApiError`), catch it and set `status = 'error'`. Without this, the spinner never stops.

### Error handling

`http.js` throws `ApiError` when `!response.ok`.

| Status | Meaning in AutoDrive |
|---|---|
| 200 | Success, body is JSON |
| 204 | DELETE succeeded, no body |
| 404 | `/vehicles/101` — id does not exist |
| 500 | **Simulate API error**, or `X-Mock-Fail: 1` |

---

## Request state (the six screens)

Owned by `useAsyncResource.js`. Drawn by `ResourceState.vue`.

| Status | Meaning | What the user sees |
|---|---|---|
| `initial` | No request yet | “Ready to load.” |
| `loading` | Request in flight | Spinner + delay (~450–900 ms on mock) |
| `success` | We have data | Cards / details |
| `empty` | API worked, list is `[]` | `/requests` before you POST |
| `error` | API failed | Message + **Retry** |
| retry | Not a status — call `load()` again | Same as a new request |

Empty and success both mean **the API worked**. Do not treat empty as an error.

```js
status.value = 'loading'
try {
  const result = await loader()
  status.value = (result is empty) ? 'empty' : 'success'
} catch {
  status.value = 'error'
}
```

---

## HTTP methods in this project

| Method | Service | Screen |
|---|---|---|
| GET | `listVehicles`, `getVehicle` | Home, Inventory, Details |
| POST | `createCustomer`, `createTestDrive`, `createApplication` | Details forms |
| PATCH | `patchVehicle`, confirm test drive | Heart; **Confirm** on `/requests` |
| PUT | replace finance application | **Switch to 48 months** |
| DELETE | cancel drive / withdraw finance | **Cancel** / **Withdraw** |

PUT = send the **whole** object again. PATCH = send **only** the fields that changed.

---

## How a real .NET API plugs in later

1. .NET team exposes the **same paths**:
   - `GET /api/vehicles`
   - `GET /api/vehicles/{id}`
   - `POST /api/customers`
   - `POST /api/test-drives`
   - `PATCH /api/test-drives/{id}`
   - `DELETE /api/test-drives/{id}`
   - finance routes the same way
2. You change **only** `.env` (or only the `if (useMock)` block in `http.js`).
3. Restart Vite (`VITE_*` is read at startup).
4. Views stay the same.

If .NET uses different names (`/api/cars` instead of `/vehicles`), you change **services**, not views.

---

## How to inspect a request

1. Run the client: `cd client` then `npm run dev` → http://localhost:5180
2. **Console:** `[API] GET /vehicles → 200 (612ms)`
3. **Footer bar:** last four calls (method, path, status, time)
4. Inventory → **Simulate API error** → 500 → Retry
5. `/vehicles/101` → 404
6. Mock does **not** appear in the Network tab (no real HTTP). After `VITE_USE_MOCK=false`, the same `request()` shows in **Network**.

---

## Mini flow (inventory)

1. `VehiclesView` calls `load()`.
2. Composable sets **loading**.
3. `vehicleService.listVehicles()` → `request('/vehicles')`.
4. `http.js` waits, then mock or `fetch`.
5. JSON parsed. Bad status → `ApiError`.
6. Composable sets **success**, **empty**, or **error**.
7. View renders. Filters still run in the browser on the loaded list.

That is the whole pattern. New screens copy it. They do not copy `fetch` into the `.vue` file.
