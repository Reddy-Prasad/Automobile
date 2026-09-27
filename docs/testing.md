# Testing AutoDrive (UI developer)

Three tools, three jobs. Do not use Playwright to unit-test `calculateLoan`. Do not use Vitest to prove the CMS publish button works in a browser.

| Tool | Job | Lives in |
|---|---|---|
| **Vitest** | Fast functions, stores, services | `client/`, `cms/`, `admin/` `src/**/*.spec.js` |
| **Vue Test Utils** | Mount one component, emit, props, `aria-*` | same |
| **Playwright** | Click through a real browser | repo `e2e/` |

```bash
# unit (each app)
cd client && npm test
cd ../cms && npm test
cd ../admin && npm test

# or from the repo root after npm install
npm test
npm run test:e2e
```

Playwright starts (or reuses) client **5173**, CMS **5181**, Admin **5182**. Set `VITE_MOCK_INSTANT=true` so the mock does not wait 450ms. That env is already in `playwright.config.js`.

---

## What we test on Day 14

| Flow | Unit | End-to-end |
|---|---|---|
| Vehicle search | `filterInventory`, `VehicleSearch` emit | type `RAV4` on `/vehicles` |
| Vehicle details | `getVehicle` path param, store 404 | `/vehicles/1` and `/vehicles/101` |
| Finance | `calculateLoan`, validation | EMI updates + POST application |
| Test drive | `createTestDrive` POST body | fill form → confirmation |
| CMS publish | `transitionContent('publish')`, workflow rules | Jordan publishes Summer hours |
| Admin create | `createVehicle` POST, `validateVehicle` | Morgan saves a Civic draft |

---

## Accessibility we check (not a full audit)

- **Skip link** → `#main-content` (`<main>` landmark)
- **Keyboard**: Tab to search, Enter to submit, Escape closes a modal
- **Labels**: `label for` + control `id` (Admin condition/body/fuel now included)
- **Focus**: modal focuses the first button when it opens
- **Alt text**: vehicle cards `alt="2026 Toyota RAV4 in Ice Cap"`
- **Semantic HTML**: `main`, `header`, `nav`, `form`, `h1` per page, `aria-live` on EMI and the loading status

`FormField` sets `aria-invalid` and `aria-describedby` on the control it labels.

---

## Viewports to click yourself

| Name | Width | What to look at |
|---|---|---|
| Mobile | 375 | Hamburger, stacked filters, one-column cards |
| Tablet | 768 | Two-column cards, finance still stacked |
| Laptop | 1280 | Full nav, two-column finance |
| Desktop | 1440+ | Same as laptop, more whitespace |

Device toolbar in Chrome. This is not automated on Day 14 except Desktop Chrome in Playwright.

---

## Performance (what a UI developer says)

You are not a backend profiler. In **Performance**, record “open inventory.”

- Long **Network** bar → API / mock delay (`VITE_MOCK_INSTANT` is only for tests)
- Long **Scripting** → Vue work (big lists, missing `key`, too much `watch`)
- Images: cards already use `loading="lazy"`
- Routes: details / finance / account are already lazy-loaded

Do not “optimize” before you have a recording.
