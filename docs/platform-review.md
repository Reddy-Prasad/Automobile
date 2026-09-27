# Day 15 — Platform review

Three Vue apps, one classroom contract. They do **not** share Pinia or `localStorage`. A .NET API would be the shared source of truth. Until then, JSON snapshots are the classroom bridge.

```
CMS 5181  --cms-published.json-->  Client 5173
Admin 5182 --admin-published.json--> Client 5173
Client 5173 --client-desk.json-->  Admin 5182
```

---

## The four business flows

### FLOW 1 — Admin vehicle → Client lot

Admin form → `vehicleService` → mock POST → draft. Publish → `admin-published.json` → client `applyPublishedInventory()` → `vehicleService.listVehicles()` → inventory card.

### FLOW 2 — CMS homepage → Client offers heading

Casey save draft → Riley approve → Jordan publish (or Jordan alone, because Admin has `*`). Snapshot → `publishedStore` → `OffersSection` reads `homepage.headline`. Banners, nav, footer use the same file.

### FLOW 3 — Client test drive → Admin board

`POST /test-drives` in the **client** mock. Day 15 writes `admin/public/client-desk.json`. Admin `applyClientDesk()` on boot merges into `db.testdrives`. Refresh Admin (or open a new tab) to see it. This is **not** a shared database.

### FLOW 4 — Client finance → Admin board

Same desk file, `finance` array. Shopper-quote applications get `vehicleTitle: "Shopper quote"` so the Admin column is not blank.

---

## Review notes (what we did **not** rewrite)

| Finding | Decision |
|---|---|
| `FormField` / `Modal` / `http.js` copied in three apps | Leave it. Three origins, three bundles. A shared package is a later repo, not a Day 15 rewrite. |
| `VehicleDetailsView` and `FinanceView` are large | They compose smaller pieces. Splitting for sport would add files without fixing a bug. |
| Search state stays local | Correct. Not Pinia. |
| Hash links still get `aria-current="page"` | Known limitation. |
| Extra cars reuse photos | Known limitation. |
| Inventory query string is read once | Known limitation. |
| No ESLint | Later. |
| Mock tokens / plain passwords | Classroom only. |
| CMS `/about` page is in the snapshot but has no client route | Later / .NET. |
| Locations still read `dealer.js` | Later / .NET. |

## Meaningful fixes on Day 15

- Client → Admin desk snapshot (the platform hole)
- `requested` on the test-drive status list
- Vehicle title on the Admin test-drive board
- Finance POST always sends `vehicleTitle`
- Retry on Admin board errors

## Performance (leave as-is)

Details / finance / account routes are already lazy. Vehicle images already `loading="lazy"`. Do not add a bundler plugin for a classroom lot of 24 cars.

---

## How to demo the platform

1. `cd client && npm run dev` → 5173  
2. `cd cms && npm run dev` → 5181  
3. `cd admin && npm run dev` → 5182  
4. Restart after changing a Vite `vite.config.js` (the desk plugin lives there).
5. After a publish or a booking, **refresh** the receiving app. In-memory mocks do not live-update across ports.
