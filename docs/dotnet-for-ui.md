# .NET API knowledge for UI developers

You are a Vue developer. You do **not** write C#, SQL, or Entity Framework. You do need to speak the same language as the API team, read Chrome’s Network tab, and keep AutoDrive’s layers so the mock can become a real API without rewriting screens.

This day does **not** add a database or a .NET project.

---

## The only picture that matters

```
Vue screen
    ↓
service  (vehicleService.listVehicles)
    ↓
request() in http.js
    ↓
HTTP  (GET /api/vehicles?condition=new)
    ↓
.NET API  (controller — not your job)
    ↓
Database  (SQL Server — not your job)
    ↓
.NET API  (maps rows → objects)
    ↓
JSON
    ↓
Vue  (cards, tables, forms)
```

Your job starts at the **service** and ends at **JSON on the screen**. The C# team owns the middle. If a vehicle is missing, you first ask: “Did HTTP return it?” not “Is the JOIN wrong?”

Today AutoDrive short-circuits the middle: `http.js` calls `handleMockRequest` instead of `fetch`. The Vue layers stay identical.

---

## REST — verbs a UI developer uses

REST is a convention: a URL names a **resource**, the method names the **action**.

| Method | Meaning | AutoDrive example |
|---|---|---|
| **GET** | Read. Safe. Do not change data. | `GET /vehicles` — lot list. `GET /vehicles/1` — one RAV4. |
| **POST** | Create. Body is the new record. | `POST /test-drives` — Alex books Saturday 10am. |
| **PUT** | Replace the **whole** record. | `PUT /finance-applications/2` — send every field again. |
| **PATCH** | Change **some** fields. | `PATCH /vehicles/1` `{ "saved": true }` — heart only. |
| **DELETE** | Remove. | `DELETE /test-drives/4` — cancel that booking. |

PUT vs PATCH (say this in interviews): PUT is “here is the car again.” PATCH is “only the price changed.”

Idempotent (useful word): calling GET or PUT twice should not create a second RAV4. Calling POST twice can create two test-drive rows — that is why Confirm buttons disable after success.

---

## Anatomy of one HTTP call

Example: shopper filters Honda on inventory.

### Request URL

```
https://localhost:5001/api/vehicles?make=Honda&condition=new
│       │              │   │        │
│       host           │   path     query string
│                      API prefix the .NET team chose
```

Today the mock path is `/vehicles`. Later it is often `/api/vehicles`. That prefix belongs in `VITE_API_BASE_URL`, not in every `.vue` file.

### Path parameters

A value **inside** the path. Required to name one row.

```
GET /vehicles/1
              ↑ path parameter  id = 1
```

In Vue Router this is `:id`. In .NET it is `{id}`. Same idea: “which vehicle?”

### Query parameters

Optional filters **after** `?`. Do not change which resource type you are talking to.

```
GET /vehicles?make=Honda&maxPrice=40000
```

`vehicleService.listVehicles({ make: 'Honda' })` already builds this with `URLSearchParams`.

### Headers

Metadata. Not the car. Common ones you will see:

| Header | Why it exists |
|---|---|
| `Content-Type: application/json` | Body is JSON, not a form post. `http.js` sets this. |
| `Authorization: Bearer <token>` | Who is calling. `http.js` adds it from `sessionStorage`. |
| `Accept: application/json` | “Please reply in JSON.” |

You do **not** put the price in a header. Price is body or query.

### Request body

JSON for POST / PUT / PATCH. GET and DELETE usually have **no** body.

```json
{
  "customerName": "Alex Rivera",
  "vehicleId": 1,
  "day": "2026-10-03",
  "time": "10:00 AM"
}
```

`http.js` does `JSON.stringify` so services pass a plain object as `body`.

### Response body

JSON the API sends back. GET list → array. POST create → the new row (often with a server-made `id`). DELETE → often empty (**204**).

```json
{
  "id": 1,
  "year": 2026,
  "make": "Toyota",
  "model": "RAV4",
  "price": 36990
}
```

Vue never reads SQL rows. It reads this object.

---

## Status codes you must recognize

`fetch` does **not** throw on 404. `http.js` turns `!response.ok` into `ApiError`. That is why the composable’s `catch` can show Retry.

| Code | Name | What you tell the user | AutoDrive example |
|---|---|---|---|
| **200** | OK | Show the data. | `GET /vehicles` returns the lot. |
| **201** | Created | Show the new row / confirmation. | `POST /test-drives` — booking exists now. |
| **204** | No Content | Success, nothing to parse. | `DELETE /test-drives/4`. |
| **400** | Bad Request | Fix the payload / types. | Year sent as `"twenty"`. |
| **401** | Unauthorized | Not signed in (or token dead). Send to login. | `GET /auth/me` with no Bearer. |
| **403** | Forbidden | Signed in, **not allowed**. | Customer hits Admin. Service manager `POST /vehicles`. |
| **404** | Not Found | That id is gone. | `/vehicles/101`. |
| **409** | Conflict | State clash. | Delete a **published** vehicle; register an email that exists. |
| **422** | Unprocessable | Validation failed. Show field errors. | POST test drive with empty name. |
| **500** | Server Error | Not the user’s form. Retry. Log it. | **Simulate API error**; real SQL outage later. |

401 vs 403 (interview favorite): 401 = we do not know you. 403 = we know you and you may not do this.

400 vs 422: some APIs use only 400 for bad input. If the body has `{ "errors": { "email": "required" } }`, show those strings. Do not invent C# exception text.

---

## Chrome DevTools → Network

Mock mode: `handleMockRequest` is in-memory. **No row appears in Network.** Watch the console `[API] GET /vehicles → 200` and the footer log. After `VITE_USE_MOCK=false`, the **same** `request()` is a real HTTP call and **does** appear here.

When the real API is on:

1. Open the client → F12 → **Network**.
2. Check **Fetch/XHR** (hide images and CSS).
3. Click a row (`vehicles`, `test-drives`, `auth/login`).
4. Read, in this order:

| Tab / field | What you check |
|---|---|
| **Name** + **Method** | Right verb and path? `GET /api/vehicles/1` not `GET /api/vehicle` |
| **Status** | 200 vs 401 vs 500 |
| **Headers → Request URL** | Host, `/api` prefix, query string |
| **Headers → Request Headers** | `Authorization` present after login? `Content-Type` on POST? |
| **Payload** | Body you sent. Did Vue omit `vehicleId`? |
| **Response** | JSON the screen should bind. Empty array vs missing field? |
| **Timing** | Slow = API or network, not a CSS bug |

Reproduce a bug **once** with Network open, then talk to the API team with: method, URL, status, request JSON, response JSON. That is a UI developer’s ticket. You do not need a SQL screenshot.

---

## Database — only what you need so JSON makes sense

You will not create tables. You will hear these words on a call.

| Word | Meaning | AutoDrive |
|---|---|---|
| **Database** | The whole filing cabinet | AutoDrive’s SQL Server |
| **Table** | One spreadsheet | `Vehicles`, `Customers`, `TestDrives` |
| **Row** | One record | One RAV4, one Alex Rivera |
| **Column** | One field | `Price`, `Email`, `Day` |
| **Primary key** | Unique id for that row | `Vehicles.Id = 1` |
| **Foreign key** | Id that **points at** another table | `TestDrives.VehicleId → Vehicles.Id` |

**One-to-many:** one customer, many test drives. Alex (customer `1`) has six bookings. The bookings table stores `CustomerId`.

**Many-to-many:** a vehicle can have many features; a feature (AWD) sits on many vehicles. That needs a **join table** (`VehicleFeatures`) with two foreign keys. Vue just receives `features: ["AWD", "Hybrid"]`. You do not build the join.

**JOIN (concept only):** SQL glues tables so one query can return “test drive + vehicle title + store name.” .NET runs the JOIN. Vue gets one JSON object. If `vehicleTitle` is missing, the JOIN or the DTO mapping is the API team’s bug — unless you never sent `vehicleId`.

```
Customers 1 ──< TestDrives >── 1 Vehicles
                (many bookings)     (one car per booking)
```

A **DTO** (data transfer object) is the JSON shape, not the table. The table may have `PasswordHash`. The DTO must not. If you see a hash in Network → Response, that is an API leak, not a Vue bug.

---

## How the mock becomes a .NET API without changing the UI

Layers we already have:

```
VehiclesView  →  useVehicles / vehicleStore  →  vehicleService  →  request()  →  mock or fetch
```

| Layer | Change when .NET ships? |
|---|---|
| `.vue` screens | **No.** They already show `status` / data / Retry. |
| Pinia stores | **No.** They already call services. |
| `vehicleService.js` | **Only if** paths differ (`/cars` vs `/vehicles`). |
| `http.js` | **The switch.** Mock vs `fetch(baseUrl + path)`. |
| `.env` | `VITE_USE_MOCK=false` and `VITE_API_BASE_URL=https://localhost:5001/api` |

```js
// http.js — already written this way
if (useMock) {
  response = handleMockRequest(path, init)
} else {
  response = await fetch(`${baseUrl}${path}`, init)
}
```

What you agree with the .NET team **before** they write C#:

1. Paths and verbs (`GET /api/vehicles`, `POST /api/test-drives`).
2. JSON field names (`vehicleId` vs `VehicleId` — pick one; JS usually camelCase).
3. Status codes (201 on create, 409 on duplicate email).
4. Auth header (`Bearer`) or cookie.
5. Error body shape (`{ "message": "...", "errors": { "email": "..." } }`).

If those match today’s services, you flip `.env` and restart Vite. You do not rewrite the homepage.

CORS: the browser blocks `localhost:5173` calling `localhost:5001` unless .NET allows that origin. That is a **server** header (`Access-Control-Allow-Origin`). If Network shows the call as failed with no 200 and Console says CORS, you do not “fix it in Vue.” You send the API team the origin you need.

---

## What you are not responsible for

- Writing controllers, Entity Framework, or migrations
- Choosing SQL Server vs PostgreSQL
- Hashing passwords
- Designing many-to-many tables

You **are** responsible for: correct method and URL from the service, sending the body the contract asked for, handling 401/403/404/422/500 in the UI, and pasting a Network screenshot that shows the truth.
