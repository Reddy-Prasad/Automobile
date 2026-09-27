# AutoDrive — Task Tracker

One place to see what is done, what is next, and what is still open.
Updated at the end of every day, before the `docs:` commit.

**Status key:** ✅ Done · 🔄 In progress · ⬜ To do · ⏸️ Moved to a later day

---

## Overview

| Day | Topic | Status | Git tag |
|---|---|---|---|
| 1 | Project foundation | ✅ Done | included in `day-02` |
| 2 | Client homepage | ✅ Done | `day-02` |
| 3 | Client vehicle inventory | ✅ Done | — |
| 4 | Vehicle details | ✅ Done | — |
| 5 | Mock API and service layer | ✅ Done | — |
| 6 | Pinia and state management | ✅ Done | — |
| 7 | Finance calculator and application | ✅ Done | — |
| 8 | Customer business flows | ✅ Done | — |
| 9 | Authentication and authorization | ✅ Done | — |
| 10 | Customer account | ✅ Done | — |
| 11 | CMS application | ✅ Done | — |
| 12 | Admin application | ✅ Done | — |
| 13 | Real backend knowledge (UI) | ✅ Done | — |
| 14 | Professional frontend engineering | ✅ Done | — |

---

## Day 1 — Project foundation

**Goal:** understand the tools and set up a clean Vue 3 app.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Create the `client` app with Vite + Vue 3 (no generator demo code) | ✅ | `client/` |
| 2 | Install and wire up Bootstrap 5, Bootstrap Icons, Vue Router, Pinia | ✅ | `client/src/main.js` |
| 3 | `@` alias for `src/` and a fixed dev port (5180) | ✅ | `client/vite.config.js` |
| 4 | Layout with header, footer and sticky footer | ✅ | `client/src/layouts/MainLayout.vue` |
| 5 | Home route and lazy-loaded 404 page | ✅ | `client/src/router/index.js` |
| 6 | Learn: Vue 3, Vite, SFC, `<script setup>`, Composition API, ES modules, Bootstrap grid and breakpoints | ✅ | [Q&A Day 1](interview-qa.md#day-1--project-foundation) |
| 7 | Create the `cms` app | ✅ | Done on Day 11 — `cms/` on port 5181 |
| 8 | Create the `admin` app | ✅ | Done on Day 12 — `admin/` on port 5182 |

---

## Day 2 — Client homepage

**Goal:** a realistic, responsive dealership homepage built from reusable components and mock data.

### Sections

| # | Section | Status | Component |
|---|---|---|---|
| 1 | Header with top info bar and sticky navbar | ✅ | `layout/AppHeader.vue` |
| 2 | Hero carousel (3 promotions) | ✅ | `home/HeroCarousel.vue` |
| 3 | Vehicle search with live result count | ✅ | `home/VehicleSearch.vue` |
| 4 | Featured, new, used and search-result showcases | ✅ | `home/VehicleShowcase.vue` (used 4×) |
| 5 | Shop by body style | ✅ | `home/BodyStylesSection.vue` |
| 6 | Offers | ✅ | `home/OffersSection.vue` |
| 7 | Finance section with payment calculator | ✅ | `home/FinanceSection.vue` |
| 8 | Service section | ✅ | `home/ServiceSection.vue` |
| 9 | Trade-in teaser (full form is `/trade-in`) | ✅ | `home/TradeInSection.vue` |
| 10 | Locations (3 Texas stores) | ✅ | `home/LocationsSection.vue` |
| 11 | Call to action | ✅ | `home/CtaSection.vue` |
| 12 | Footer with shop, locations and contact columns | ✅ | `layout/AppFooter.vue` |

### Supporting work

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Mock data: 12 vehicles, 3 offers, dealer info, 3 locations, navigation | ✅ | `client/src/data/` |
| 2 | Formatters (currency, mileage, date) and vehicle helpers | ✅ | `client/src/utils/` |
| 3 | Reusable `VehicleCard` and `SectionHeading` | ✅ | `client/src/components/` |
| 4 | Smooth scrolling to `#section` links below the sticky navbar | ✅ | `router/index.js`, `assets/main.css` |
| 5 | Fix: every hash link looked "active" (removed `linkExactActiveClass`) | ✅ | `router/index.js` |
| 6 | Fix: body-style tiles now fill in the search form (`defineExpose`) | ✅ | `VehicleSearch.vue`, `HomeView.vue` |
| 7 | Responsive checks at phone (390px) and laptop (1366px) widths | ✅ | — |
| 8 | README, interview Q&A and this tracker | ✅ | `README.md`, `docs/` |
| 9 | Real vehicle photos (Wikimedia Commons, 960px) with lazy loading; colours updated to match | ✅ | `client/public/images/vehicles/`, `data/vehicles.js`, `VehicleCard.vue` |
| 10 | Photo credits page at `/credits`, linked from the footer | ✅ | `views/CreditsView.vue`, `data/imageCredits.js` |

---

## Day 3 — Vehicle inventory

**Goal:** a `/vehicles` listing page that filters, sorts and paginates local mock data, and teaches JavaScript array methods through that feature.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | `/vehicles` route (lazy-loaded) | ✅ | `router/index.js`, `views/VehiclesView.vue` |
| 2 | Expand mock inventory to 24 vehicles; add `transmission` and `availability` | ✅ | `data/vehicles.js` |
| 3 | Reuse `VehicleCard` on the listing | ✅ | `VehiclesView.vue` |
| 4 | Search plus make, fuel, transmission, price, year and condition filters | ✅ | `VehiclesView.vue`, `utils/vehicles.js` |
| 5 | Sort (featured, price, year, mileage) | ✅ | `sortInventory()` |
| 6 | Pagination (6 per page) and "Showing X–Y" | ✅ | `paginate()`, `VehiclesView.vue` |
| 7 | Empty state with a clear-filters action | ✅ | `VehiclesView.vue` |
| 8 | Header Inventory link is `active` on this page; footer + homepage "browse" links | ✅ | `AppHeader.vue`, `AppFooter.vue`, `HomeView.vue` |
| 9 | Seed filters from the query string (`/vehicles?condition=new`) | ✅ | `VehiclesView.vue` |
| 10 | Learn: `map`, `filter`, `find`, `sort`, `some`, `every`, `includes`, destructuring, spread; Vue `ref`, `reactive`, `computed`, `v-model`, `v-for` | ✅ | [Q&A Day 3](interview-qa.md#day-3--vehicle-inventory) |

---

## Day 4 — Vehicle details

**Goal:** a `/vehicles/:id` page that reads the id from the URL and shows one vehicle from mock data.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Dynamic route `/vehicles/:id` with `props: true` | ✅ | `router/index.js` |
| 2 | Details page: gallery, title, price, year, mileage, fuel, transmission, body | ✅ | `views/VehicleDetailsView.vue` |
| 3 | Features and specifications from helpers | ✅ | `utils/vehicles.js` |
| 4 | Dealer and location cards | ✅ | `VehicleDetailsView.vue`, `data/dealer.js` |
| 5 | Favorite, compare, finance, test drive and trade-in actions (props / emits) | ✅ | `VehicleActions.vue` |
| 6 | Vehicle cards navigate to details; favourite click does not | ✅ | `VehicleCard.vue` |
| 7 | Missing id shows an in-page not-found | ✅ | `VehicleDetailsView.vue` |
| 8 | Inventory nav stays active on the details page | ✅ | `AppHeader.vue` |
| 9 | Learn: dynamic routes, params, query, `useRoute`, `useRouter`, `router.push`, route props, emits | ✅ | [Q&A Day 4](interview-qa.md#day-4--vehicle-details) |

---

## Day 5 — Mock API and service layer

**Goal:** a REST-shaped mock API behind services and composables, so views never talk to the mock (or a future .NET API) directly.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | HTTP client with the same `request()` path for mock and real `fetch` | ✅ | `api/http.js` |
| 2 | In-memory mock router: GET, POST, PUT, PATCH, DELETE + delay + forced errors | ✅ | `api/mock/` |
| 3 | Services: vehicles, customers, test drives, finance | ✅ | `services/` |
| 4 | Composables own INITIAL / LOADING / SUCCESS / EMPTY / ERROR / RETRY | ✅ | `composables/` |
| 5 | Inventory, home vehicle blocks and details load through `useVehicles` / `useVehicle` | ✅ | `HomeView`, `VehiclesView`, `VehicleDetailsView` |
| 6 | Test-drive POST + finance POST; `/requests` for PATCH / PUT / DELETE | ✅ | details forms, `RequestsView.vue` |
| 7 | Request log in the footer and `console.info('[API] …')` | ✅ | `ApiLogBar.vue`, `http.js` |
| 8 | Learn: fetch, Promise, async/await, try/catch, JSON, error handling | ✅ | [Q&A Day 5](interview-qa.md#day-5--mock-api-and-service-layer) |
| 9 | One-page map: API handling + request state (real API goes in `http.js` only) | ✅ | [api-handling.md](api-handling.md) |

---

## Day 6 — Pinia and state management

**Goal:** share only the state that many screens need. Views still do not call the mock API.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | `vehicleStore`: load list + one vehicle (async actions) | ✅ | `stores/vehicleStore.js` |
| 2 | `favoriteStore`: add / remove / toggle, persist, header count, `/saved` | ✅ | `stores/favoriteStore.js`, `FavoritesView.vue` |
| 3 | `compareStore`: up to 3 vehicles, `/compare` table | ✅ | `stores/compareStore.js`, `CompareView.vue` |
| 4 | `authStore`: demo sign-in (async) / sign-out | ✅ | `stores/authStore.js`, header |
| 5 | Cards and details share hearts and compare | ✅ | `VehicleCard`, `VehicleDetailsView` |
| 6 | Keep filters, forms, and request panels out of Pinia | ✅ | inventory + details |
| 7 | Learn: state, getters, actions, `storeToRefs`, when not to use Pinia | ✅ | [Q&A Day 6](interview-qa.md#day-6--pinia-and-state-management) |

---

## Day 7 — Finance calculator and application

**Goal:** a `/finance` page where EMI is a `computed` and the application is validated local form state + POST.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Route `/finance` | ✅ | `router/index.js` |
| 2 | Calculator: price, down, loan, APR, tenure, EMI, total interest, total payment | ✅ | `utils/finance.js`, `useLoanCalculator.js` |
| 3 | Application: name, email, phone, employment, income, loan, tenure | ✅ | `FinanceView.vue` |
| 4 | Client validation + error messages before the API | ✅ | `validateFinanceApplication` |
| 5 | Loading / success / API error / retry + Simulate API error | ✅ | `useFinanceApply.js` |
| 6 | Mock `POST /finance-applications` without requiring a vehicle | ✅ | `api/mock/router.js` |
| 7 | Learn: form state, computed, validation, async submit, try/catch | ✅ | [Q&A Day 7](interview-qa.md#day-7--finance-calculator-and-application) |

---

## Day 8 — Customer business flows

**Goal:** test drive, service and trade-in share form pieces, not one giant form.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Shared form engine: validate, loading, success, error, reset, disabled submit | ✅ | `useFormSubmit.js` |
| 2 | Reusable UI: FormField, AppointmentFields, ContactFields, FormActions, FormResult | ✅ | `components/forms/` |
| 3 | `/test-drive` — vehicle, date, time, location, POST | ✅ | `TestDriveView.vue` |
| 4 | `/service` — vehicle, type, date, time, location, POST | ✅ | `ServiceView.vue` |
| 5 | `/trade-in` — vehicle, year, mileage, condition, expected value, POST | ✅ | `TradeInView.vue` |
| 6 | Mock GET/POST/DELETE for service and trade-in; My requests lists them | ✅ | `api/mock/`, `RequestsView` |
| 7 | Learn: what to reuse vs what stays unique | ✅ | [Q&A Day 8](interview-qa.md#day-8--customer-business-flows) |

---

## Day 9 — Authentication and authorization

**Goal:** mock login/register/logout/me, then protect `/account`, `/cms` and `/admin` by role. This is not production security.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Roles + permissions + demo users | ✅ | `data/roles.js`, `data/users.js` |
| 2 | Mock `POST /auth/login`, `register`, `logout`, `GET /auth/me` | ✅ | `api/mock/router.js` |
| 3 | Token in `sessionStorage`; `http.js` sends `Authorization: Bearer` | ✅ | `auth/session.js`, `http.js` |
| 4 | `authStore`: login, register, logout, restore, `can()`, roles | ✅ | `stores/authStore.js` |
| 5 | Route guards: guest-only, requiresAuth, roles → login or 403 | ✅ | `router/guards.js` |
| 6 | `/login`, `/register`, `/account`, `/cms`, `/admin`, `/forbidden` | ✅ | `views/` |
| 7 | Learn: authentication vs authorization; mock vs .NET | ✅ | [auth.md](auth.md), [Q&A Day 9](interview-qa.md#day-9--authentication-and-authorization) |

---

## Day 10 — Customer account

**Goal:** `/account` is the signed-in customer hub: profile, favorites, compare, and all booking lists.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Reusable DataTable, StatusBadge, EmptyState, LoadingState, ErrorState, Modal, Pagination | ✅ | `components/common/` |
| 2 | `accountStore` loads/cancels bookings through services | ✅ | `stores/accountStore.js` |
| 3 | `useAccount` owns pagination and the confirm modal | ✅ | `composables/useAccount.js` |
| 4 | `/account` sections + route guard (`requiresAuth`) | ✅ | `AccountView.vue`, `guards.js` |
| 5 | Seed Alex Rivera’s bookings so tables are not empty | ✅ | `data/accountSeeds.js` |
| 6 | Learn: layers, reusable vs unique, API states | ✅ | [client-architecture.md](client-architecture.md), [Q&A Day 10](interview-qa.md#day-10--customer-account) |

---

## Day 11 — CMS application

**Goal:** a separate Vue app that manages website content (not inventory or bookings), with a draft → review → approve → publish pipeline.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Scaffold `cms/` (Vue 3, Vite, Bootstrap, Router, Pinia) on port 5181 | ✅ | `cms/` |
| 2 | Routes: `/cms/login`, dashboard, homepage, pages, banners, offers, media, SEO, navigation, footer | ✅ | `cms/src/router/index.js` |
| 3 | Sidebar, dashboard counts, collection tables, edit forms, preview | ✅ | `layouts/`, `views/`, `components/` |
| 4 | Workflow: Editor save draft → submit → Reviewer approve → Admin publish | ✅ | `data/workflow.js`, `WorkflowBar.vue` |
| 5 | Mock CMS API + permissions (`cms.draft` / `cms.review` / `cms.publish`) | ✅ | `cms/src/api/mock/` |
| 6 | Publish writes `client/public/cms-published.json`; client reads it | ✅ | `vite.config.js`, `publishedStore.js` |
| 7 | Learn: why CMS ≠ Client, CRUD, badges, draft vs published | ✅ | [Q&A Day 11](interview-qa.md#day-11--cms-application) |

---

## Day 12 — Admin application

**Goal:** a separate Vue app for **business operations**, with Inventory CRUD that can publish a vehicle onto the client lot.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Scaffold `admin/` (Vue 3, Vite, Bootstrap, Router, Pinia) on port 5182 | ✅ | `admin/` |
| 2 | Dashboard, inventory, customers, leads, bookings, dealers, users, roles, reports, settings | ✅ | `admin/src/views/` |
| 3 | Inventory create / view / edit / delete / publish | ✅ | `InventoryView.vue`, `VehicleFormView.vue`, `VehicleView.vue` |
| 4 | Search, filters, pagination, status badges, role permissions | ✅ | inventory table + guards |
| 5 | `vehicleService` → mock API; publish writes `admin-published.json` | ✅ | `admin/src/services/vehicleService.js` |
| 6 | Client mock merges the snapshot so `listVehicles()` returns the new unit | ✅ | `client/src/api/mock/db.js` |
| 7 | Learn: CMS vs Admin, operations CRUD | ✅ | [Q&A Day 12](interview-qa.md#day-12--admin-application) |

---

## Day 13 — Real backend integration knowledge

**Goal:** a UI developer can talk to a .NET API team, read the Network tab, and keep Vue layers so the mock flips to `fetch` without rewriting screens. No database and no C# project.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Document HTTP → .NET → JSON → Vue for UI developers | ✅ | [dotnet-for-ui.md](dotnet-for-ui.md) |
| 2 | REST verbs, URL / headers / query / path / body, status codes | ✅ | same |
| 3 | Chrome Network inspection notes | ✅ | same + [api-handling.md](api-handling.md) |
| 4 | Database words only (table, key, JOIN concept) with dealership examples | ✅ | same |
| 5 | `.env.example` — `VITE_USE_MOCK` / `VITE_API_BASE_URL` | ✅ | `client/`, `cms/`, `admin/` |
| 6 | Learn: mock → .NET without changing views | ✅ | [Q&A Day 13](interview-qa.md#day-13--real-backend-integration-knowledge) |

---

## Day 14 — Professional frontend engineering

**Goal:** stop adding features. Debug in a fixed order, add Vitest / Vue Test Utils / Playwright on the real flows, and close obvious accessibility gaps. No new dealership pages.

| # | Task | Status | Where |
|---|---|---|---|
| 1 | 12-step debug process + 10 realistic bugs | ✅ | [debugging.md](debugging.md) |
| 2 | Chrome panels: Console, Network, Elements, Application, Performance | ✅ | same |
| 3 | Viewport checklist: 375 / 768 / 1280 / 1440 | ✅ | [testing.md](testing.md) |
| 4 | Vitest + Vue Test Utils on client, CMS, Admin | ✅ | `src/**/*.spec.js` |
| 5 | Playwright: search, details, finance, test drive, CMS publish, Admin create | ✅ | `e2e/` |
| 6 | A11y: skip link, labels, focus, alt, `aria-live`, semantic `main` | ✅ | layouts + `FormField` + `Modal` |
| 7 | Learn: debugging / testing / performance questions | ✅ | [Q&A Day 14](interview-qa.md#day-14--professional-frontend-engineering) |

---

## Your practice exercises

Exercises for you to write yourself. Paste your code in chat to get it reviewed.

| # | Exercise | From | Status |
|---|---|---|---|
| 1 | Build the "Shop by body style" section | Day 2 | ✅ Built together in chat |
| 2 | Add a `Minivan` vehicle to `vehicles.js` and check that the tile, the count and the dropdown all update | Day 2 | ⬜ |
| 3 | Change the body-style row to `row-cols-lg-6` once 6 styles exist | Day 2 | ⬜ |
| 4 | Answer the Day 2 questions in [interview-qa.md](interview-qa.md#day-2--client-homepage) out loud without reading the answers | Day 2 | ⬜ |
| 5 | Add a **Body style** filter to the inventory page | Day 3 | ⬜ |
| 6 | Answer the Day 3 questions in [interview-qa.md](interview-qa.md#day-3--vehicle-inventory) out loud | Day 3 | ⬜ |
| 7 | Add Previous / Next vehicle links on the details page | Day 4 | ⬜ |
| 8 | Answer the Day 4 questions in [interview-qa.md](interview-qa.md#day-4--vehicle-details) out loud | Day 4 | ⬜ |
| 9 | Add `offerService.js` + `useOffers()` and load homepage offers through the API | Day 5 | ⬜ |
| 10 | Answer the Day 5 questions in [interview-qa.md](interview-qa.md#day-5--mock-api-and-service-layer) out loud | Day 5 | ⬜ |
| 11 | Build a `recentStore` that remembers the last 5 vehicle ids you opened | Day 6 | ⬜ |
| 12 | Answer the Day 6 questions in [interview-qa.md](interview-qa.md#day-6--pinia-and-state-management) out loud | Day 6 | ⬜ |
| 13 | Show a debt-to-income % (EMI ÷ monthly income) and warn if it is over 40% | Day 7 | ⬜ |
| 14 | Answer the Day 7 questions in [interview-qa.md](interview-qa.md#day-7--finance-calculator-and-application) out loud | Day 7 | ⬜ |
| 15 | Add a Notes textarea to the service form and send it in the POST body | Day 8 | ⬜ |
| 16 | Answer the Day 8 questions in [interview-qa.md](interview-qa.md#day-8--customer-business-flows) out loud | Day 8 | ⬜ |
| 17 | Put `meta: { requiresAuth: true }` on `/requests` and confirm a guest is sent to login | Day 9 | ⬜ |
| 18 | Answer the Day 9 questions in [interview-qa.md](interview-qa.md#day-9--authentication-and-authorization) out loud | Day 9 | ⬜ |
| 19 | Add a Notes column to the service table on `/account` | Day 10 | ⬜ |
| 20 | Explain the Client architecture in your own words, then answer the Day 10 questions | Day 10 | ⬜ |
| 21 | Add a Notes field on CMS offers and show it on the client offer card after publish | Day 11 | ⬜ |
| 22 | Answer the Day 11 questions in [interview-qa.md](interview-qa.md#day-11--cms-application) out loud | Day 11 | ⬜ |
| 23 | On a published vehicle, change price in Admin and confirm the client details page updates after refresh | Day 12 | ⬜ |
| 24 | Answer the Day 12 questions in [interview-qa.md](interview-qa.md#day-12--admin-application) out loud | Day 12 | ⬜ |
| 25 | Open Network on a real site you use, find one XHR, and name method, status, and whether the id is a path or query param | Day 13 | ⬜ |
| 26 | Answer the Day 13 questions in [interview-qa.md](interview-qa.md#day-13--real-backend-integration-knowledge) out loud | Day 13 | ⬜ |
| 27 | Break the inventory search on purpose, then walk the 12 debug steps out loud before you fix it | Day 14 | ⬜ |
| 28 | Answer the Day 14 questions in [interview-qa.md](interview-qa.md#day-14--professional-frontend-engineering) out loud | Day 14 | ⬜ |

---

## Known limitations

Things that work but are deliberately unfinished. Each one lists the day that should fix it.

| # | Limitation | Why | Planned fix |
|---|---|---|---|
| 1 | ~~"View details" buttons do nothing~~ | ✅ Fixed: cards go to `/vehicles/:id` | Done (Day 4) |
| 2 | "Claim offer" still scrolls to contact | Service and trade-in now have real pages | Offers / later |
| 3 | ~~Vehicle images are coloured placeholders~~ | ✅ Fixed: real photos added. The coloured placeholder is still the fallback for vehicles without an `image` | Done (Day 2) |
| 4 | ~~Favourite hearts reset on page reload and aren't shared across cards and the details page~~ | ✅ Fixed: `favoriteStore` + `localStorage`; `/saved` | Done (Day 6) |
| 5 | Search state lives inside `VehicleSearch`, and the parent reaches in with `defineExpose` | Left local on purpose — not every form belongs in Pinia | Optional later |
| 6 | Hash links on the homepage still get `aria-current="page"` | Those links all point at the `home` route; the hash is ignored | Later, when New/Used become real routes |
| 7 | Extra inventory cars reuse photos of a similar model | We only downloaded 12 Commons images | Inventory polish / more photos |
| 8 | Filter choices in the URL are read once, not kept in sync as you type | Enough to deep-link from the homepage; a full query-string sync is later work | Pinia / inventory polish |
| 9 | ~~No tests~~ / no linting | Vitest + Playwright added. ESLint still later | Lint / later |
| 10 | Mock data lives in memory; refresh of the tab keeps it, restarting Vite resets POST/PATCH/DELETE | There is no real database | .NET API day |
| 11 | Homepage locations still read local modules | Offers/banners/nav/footer/SEO can come from `cms-published.json` | Locations later / .NET |
| 12 | ~~CMS and Admin are guarded stubs~~ | Both are separate Vite apps | Done (Days 11–12) |
| 13 | Mock auth: plain-text passwords, unsigned tokens, Vue-only guards | Classroom login so you can learn roles | Real .NET auth |
| 14 | CMS pages and media are in the published snapshot but the client has no `/about` route yet | Day 11 taught the pipeline, not a page renderer | Later / .NET |
| 15 | Admin settings save only in the admin mock | Client still reads `dealer.js` | .NET API day |

---

## Roadmap (proposed)

A suggested order for upcoming days. It will change as we go, so treat it as a plan, not a promise.

| Day | Topic | Main tasks |
|---|---|---|
| 6 | ~~Pinia~~ | ✅ Done: vehicle / auth / favorite / compare stores |
| 7 | ~~Finance / forms~~ | ✅ Done: `/finance` calculator + validated POST application |
| 8 | ~~Customer flows~~ | ✅ Done: test drive, service, trade-in |
| 9 | ~~Auth~~ | ✅ Done: mock login, roles, guards for /account /cms /admin |
| 10 | ~~Customer account~~ | ✅ Done: /account hub with shared table/state widgets |
| 11 | ~~CMS app~~ | ✅ Done: `cms/` on 5181, draft → publish → client |
| 12 | ~~Admin app~~ | ✅ Done: `admin/` on 5182, inventory CRUD → client lot |
| 13 | ~~.NET-for-UI knowledge~~ | ✅ Done: HTTP, REST, status codes, Network, DB words |
| 14 | ~~Professional frontend engineering~~ | ✅ Done: debug process, Vitest, Playwright, a11y pass |
| 15 | Performance and production | Lazy loading review, image optimisation, build and deploy |

---

## End-of-day checklist

1. Build passes: `cd client` then `npm run build`. Also `cd cms` and `cd admin`.
2. Mark finished tasks ✅ above and add the new day's section.
3. Move anything unfinished to **Known limitations** or the **Roadmap**.
4. Add the day's questions to [interview-qa.md](interview-qa.md).
5. Update **Daily progress** in [README.md](../README.md).
6. Commit the code, commit the docs, tag, push (see [Daily Git workflow](../README.md#daily-git-workflow)).
