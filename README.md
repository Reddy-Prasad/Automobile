# AutoDrive Platform

A learning project: a US automobile dealership platform built with Vue 3, one day and one topic at a time.

The platform is planned as three separate Vue applications that share the same stack:

| App | Purpose | Status | Dev URL |
|---|---|---|---|
| `client/` | Public dealership website for shoppers | In progress | http://localhost:5180 |
| `cms/` | Content management (offers, banners, pages) | Planned | http://localhost:5181 |
| `admin/` | Dealer/admin dashboard (inventory, leads) | Planned | http://localhost:5182 |

There is no real backend yet. Views talk to services through a mock REST layer in `client/src/api/`, seeded from `client/src/data/`. Set `VITE_USE_MOCK=false` later to point the same services at a .NET API.

## Tech stack

- Vue 3 (Composition API, `<script setup>`) — JavaScript, no TypeScript
- Vite
- Vue Router
- Pinia
- Bootstrap 5 + Bootstrap Icons

## Getting started

Requires Node.js `^20.19.0 || >=22.12.0`.

```bash
cd client
npm install
npm run dev       # start dev server at http://localhost:5180
npm run build     # production build into client/dist
npm run preview   # serve the production build locally
```

## Project structure (client)

```
client/
├── index.html                 Single HTML page; Vue mounts into #app
├── vite.config.js             Vue plugin, "@" → src alias, fixed port 5180
└── src/
    ├── main.js                Entry: loads Bootstrap, creates app, installs Pinia + Router
    ├── App.vue                Root component → MainLayout
    ├── router/index.js        Routes, 404 catch-all, smooth scroll to #hash links
    ├── layouts/MainLayout.vue Header + <RouterView /> + footer
    ├── api/                   HTTP client, request log, in-memory mock REST router
    ├── services/              vehicle, customer, testDrive, finance
    ├── composables/           useVehicles, useVehicle, request helpers
    ├── stores/                Pinia: vehicles, auth, favorites, compare
    ├── data/                  Seed data for the mock DB and UI copy
    ├── utils/                 Formatters (currency, mileage, date) and vehicle helpers
    ├── components/
    │   ├── common/            SectionHeading
    │   ├── vehicles/          VehicleCard, VehicleGallery, VehicleActions
    │   ├── layout/            AppHeader, AppFooter
    │   └── home/              Homepage sections (hero, search, showcase, finance, …)
    └── views/                 Home, inventory, details, saved, compare, requests, credits, 404
```

Vehicle photos live in `client/public/images/vehicles/` (served as `/images/vehicles/<name>.jpg`).

## Daily progress

### Day 1 — Project foundation

- Hand-built Vite + Vue 3 client app (no generator demo code)
- Bootstrap 5, Bootstrap Icons, Vue Router and Pinia installed and wired up
- `MainLayout` with header, footer and a sticky-footer layout
- Home route plus lazy-loaded 404 page
- Concepts: Vue 3, Vite, SFCs, `<script setup>`, Composition API, ES modules, Bootstrap grid and breakpoints

### Day 2 — Client homepage

- Full dealership homepage: hero carousel, vehicle search, featured/new/used vehicles, shop by body style, offers, finance calculator, service, trade-in form, locations, CTA
- Reusable components: `VehicleCard`, `VehicleShowcase` (used 4×), `SectionHeading`
- Mock data layer with 12 realistic vehicles, offers and 3 Texas locations
- Responsive for mobile, tablet, laptop and desktop
- Concepts: `ref`, `reactive`, `computed`, `watch`, `v-model` modifiers, props/emits, slots, lifecycle hooks, template refs, `defineExpose`, `nextTick`
- Bootstrap: containers, grid, `row-cols`, flex utilities, spacing, cards, badges, buttons, navbar, carousel
- Exercise: "Shop by body style" tiles built from the vehicle data; clicking a tile fills in the search form and shows the results with a summary line ("Any condition · Truck")
- Real vehicle photos in `client/public/images/vehicles/`, with a photo credits page (`/credits`) for the Creative Commons licences

### Day 3 — Vehicle inventory

- New `/vehicles` page: live search, make / fuel / transmission / price / year / condition filters, sort, pagination (6 per page) and an empty state
- Mock inventory grown to 24 vehicles, including `transmission` and `availability`
- Homepage, header and footer link into inventory; `/vehicles?condition=new` seeds the form
- Concepts: `map`, `filter`, `find`, `sort`, `some`, `every`, `includes`, destructuring, spread; Vue `ref`, `reactive`, `computed`, `v-model`, `v-for`
- Exercise: add a Body style filter on the inventory page yourself

### Day 4 — Vehicle details

- `/vehicles/:id` details page: gallery, price, specs, features, dealer and store location
- Cards and **View details** go to the page; the heart does not
- Actions: favorite, compare, payment estimate, test-drive request, trade-in (jumps to the homepage form)
- Concepts: dynamic routes, params, query, `useRoute`, `useRouter`, `router.push`, route `props: true`, props vs emits
- Exercise: add Previous / Next vehicle links on the details page

### Day 5 — Mock API and service layer

- Architecture: Vue view → composable → service → `request()` → mock REST (or later `fetch` to .NET)
- GET / POST / PUT / PATCH / DELETE with a visible delay, loading / empty / error / retry
- Inventory **Simulate API error**; details forms POST test drives and finance apps; `/requests` confirms, updates and deletes
- Footer API log + `console.info('[API] GET /vehicles → 200')`
- Switch later with `VITE_USE_MOCK=false` and `VITE_API_BASE_URL`
- Exercise: put homepage offers behind `offerService` + `useOffers()`

### Day 6 — Pinia and state management

- Four stores only: `vehicleStore`, `authStore`, `favoriteStore`, `compareStore`
- Flow: view → store → service → mock API. Inventory filters and test-drive forms stay local
- Hearts and compare are shared; `/saved` and `/compare`; header counts; demo Sign in
- Favorites persist in `localStorage`; compare and auth use `sessionStorage`
- Exercise: build a `recentStore` for the last 5 opened vehicles

## Learning notes

- [Task tracker](docs/tasks.md): what's done, your practice exercises, known limitations and the roadmap. Updated every day.
- [Interview questions & answers](docs/interview-qa.md): question index for self-testing plus full answers, grouped by day. Updated every day.
- [API handling and request state](docs/api-handling.md): one page for `http.js` (mock vs real API) and INITIAL / LOADING / SUCCESS / EMPTY / ERROR / Retry.

## Daily Git workflow

Repository: https://github.com/Reddy-Prasad/Automobile (branch `main`)

Every day ends with the same sequence: **code first, docs second, then tag and push.**

```bash
# 1. Check the app still builds
cd client
npm run build
cd ..

# 2. Commit the code changes
git status
git add client
git commit -m "feat(client): short summary of today's feature"

# 3. Update docs: docs/tasks.md, docs/interview-qa.md and README "Daily progress"
git add README.md docs
git commit -m "docs: day N notes and interview Q&A"

# 4. Tag the end of the day and push commits + tag
git tag -a day-NN -m "Day N - topic"
git push origin main
git push origin day-NN
```

Keeping code and docs in separate commits keeps the history easy to read: each day's code can be reviewed on its own, and `git checkout day-02` shows the project exactly as it was at the end of Day 2.

| Tag | Contents |
|---|---|
| `day-02` | Project foundation (Day 1) and client homepage (Day 2), including the body-style exercise and these docs |

Commit message format: `type(scope): summary`

| Type | Use for |
|---|---|
| `feat` | New feature or page |
| `fix` | Bug fix |
| `docs` | README / notes only |
| `refactor` | Code change with no behaviour change |
| `chore` | Setup, config, dependencies |
