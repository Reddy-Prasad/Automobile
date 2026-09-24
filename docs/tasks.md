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
| 7 | Create the `cms` app | ⏸️ | Moved to [Roadmap](#roadmap-proposed) |
| 8 | Create the `admin` app | ⏸️ | Moved to [Roadmap](#roadmap-proposed) |

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
| 9 | Trade-in form with thank-you message | ✅ | `home/TradeInSection.vue` |
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

---

## Known limitations

Things that work but are deliberately unfinished. Each one lists the day that should fix it.

| # | Limitation | Why | Planned fix |
|---|---|---|---|
| 1 | "View details" buttons do nothing | There is no vehicle details page yet | Vehicle details route |
| 2 | "Claim offer", "Book service" and "Book a test drive" scroll to the contact section | There are no forms or pages for them yet | Forms day |
| 3 | ~~Vehicle images are coloured placeholders~~ | ✅ Fixed: real photos added. The coloured placeholder is still the fallback for vehicles without an `image` | Done (Day 2) |
| 4 | Favourite hearts reset on page reload and aren't shared | Each card keeps its own `ref` | Pinia day |
| 5 | Search state lives inside `VehicleSearch`, and the parent reaches in with `defineExpose` | Quick fix before Pinia is taught | Pinia day (search store) |
| 6 | Hash links on the homepage still get `aria-current="page"` | Those links all point at the `home` route; the hash is ignored | Later, when New/Used become real routes |
| 7 | Extra inventory cars reuse photos of a similar model | We only downloaded 12 Commons images | Inventory polish / more photos |
| 8 | Filter choices in the URL are read once, not kept in sync as you type | Enough to deep-link from the homepage; a full query-string sync is later work | Pinia / inventory polish |
| 9 | No tests, no linting | Not covered yet | Testing day |

---

## Roadmap (proposed)

A suggested order for upcoming days. It will change as we go, so treat it as a plan, not a promise.

| Day | Topic | Main tasks |
|---|---|---|
| 4 | Vehicle details | Vehicle details page (`/vehicles/:id`), "View details" wiring, related vehicles |
| 5 | Pinia | Vehicles, search and favourites stores; persist favourites in `localStorage` |
| 6 | Mock API layer | Async service functions with a fake delay; loading, empty and error states |
| 7 | Forms | Test drive and service appointment forms with validation |
| 8 | Compare and favourites | Compare up to 3 vehicles side by side; favourites page |
| 9 | CMS app | Create `cms/` (port 5181): manage offers and hero banners |
| 10 | Admin app | Create `admin/` (port 5182): inventory table and leads |
| 11 | Auth | Login, route guards, role-based access |
| 12 | Testing | Vitest unit tests and Playwright end-to-end tests |
| 13 | Performance and production | Lazy loading, image optimisation, build and deploy |

---

## End-of-day checklist

1. Build passes: `cd client` then `npm run build`.
2. Mark finished tasks ✅ above and add the new day's section.
3. Move anything unfinished to **Known limitations** or the **Roadmap**.
4. Add the day's questions to [interview-qa.md](interview-qa.md).
5. Update **Daily progress** in [README.md](../README.md).
6. Commit the code, commit the docs, tag, push (see [Daily Git workflow](../README.md#daily-git-workflow)).
