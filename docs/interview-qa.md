# AutoDrive — Interview Questions & Answers

Questions collected while building AutoDrive, grouped by day. Each answer is written the way you would say it in an interview: a short direct answer first, then the detail.

**How to revise:** read a question in the index below, answer it out loud, then open the answer to check yourself.

## Question index

**[Day 1 — Project foundation](#day-1--project-foundation)**

1. What is Vue 3?
2. What is Vite and why use it instead of Webpack?
3. What is an SFC (Single File Component)?
4. What is `<script setup>`?
5. What is the Composition API, and how is it different from the Options API?
6. What does `export default` vs a named export mean?
7. What does `app.use(router)` do in `main.js`?
8. What is `<RouterView />`?
9. Why use `<RouterLink>` instead of `<a href>`?
10. What is lazy loading a route?
11. Explain the Bootstrap grid.
12. What are Bootstrap's breakpoints?

**[Day 2 — Client homepage](#day-2--client-homepage)**

1. What's the difference between `ref()` and `reactive()`?
2. When should you use `computed()` instead of a method?
3. Explain "props down, events up".
4. What does `col-12 col-md-6 col-lg-4` do at 500px, 800px and 1100px?
5. Why create the Bootstrap carousel in `onMounted`, and why call `dispose()`?
6. What does `v-model.number` do, and why was it needed?
7. Why must `v-for` have a `:key`, and why not use the index?
8. What is a slot, and what is fallback content?
9. What do `defineExpose` and `useTemplateRef` do?
10. What does `nextTick()` do?
11. `v-if` vs `v-show`?
12. `container` vs `container-fluid`?
13. Why use `row-cols-*` instead of `col-*` for the body-style tiles?
14. Why pass `vehicles` as a prop instead of importing the data inside the component?
15. What happens if a vehicle with a new body style is added to the data?
16. Two sibling components need to share state. What are your options?
17. `public/` vs `src/assets/`: where should images go?
18. Can you use any image you find online on a website?

**[Day 3 — Vehicle inventory](#day-3--vehicle-inventory)**

1. What does `map()` return, and where is it used in AutoDrive?
2. How is `filter()` different from `find()`?
3. Why copy the array before calling `sort()`?
4. `some()` vs `every()`?
5. Why do we call `.toLowerCase()` before `includes()`?
6. What is destructuring, and why use it on `filters`?
7. What does the spread operator do in `[...vehicles]` and `{ ...filters }`?
8. Why is filtering done in a `computed` instead of a method?
9. When is `reactive()` a better fit than `ref()` for a form?
10. How does `v-model` keep the selects and the results in sync?
11. How does pagination with `slice()` work?
12. Why convert a `<select>` value with `Number()`?

**[Day 4 — Vehicle details](#day-4--vehicle-details)**

1. How does `:id` work in `/vehicles/:id`?
2. How does the page know which vehicle to display?
3. Where should data loading happen?
4. Props vs emits?
5. `useRoute()` vs `useRouter()`?
6. What does `router.push()` do that a plain `<a href>` does not?
7. What is `props: true` on a route?
8. Why watch `id` instead of reading `route.params.id` once?
9. Params vs query: `/vehicles/1` vs `/vehicles/1?action=finance`?
10. Why `@click.stop` on the card favourite button?

**[Day 5 — Mock API and service layer](#day-5--mock-api-and-service-layer)**

1. Why Component → Composable → Service → API?
2. What does `fetch` return, and why do we still wrap it?
3. Promise vs async/await?
4. Why `try/catch` around API calls?
5. How do you turn a `Response` into data?
6. How do you handle 404 vs 500?
7. What are INITIAL, LOADING, SUCCESS, EMPTY, ERROR, RETRY?
8. GET vs POST vs PUT vs PATCH vs DELETE?
9. How will this connect to a real .NET API?
10. Why must the Vue component not know about the mock?
11. Where does the real API go — one file or every view?

**[Day 6 — Pinia and state management](#day-6--pinia-and-state-management)**

1. Why do we need state management?
2. Local component state vs composable state vs Pinia?
3. What are state, getters, and actions?
4. How do you use a store in a Vue component?
5. What is an async action?
6. When should you NOT put something in Pinia?
7. Why `storeToRefs`?
8. How does AutoDrive load vehicles through Pinia?
9. How do favorites stay in sync across pages?
10. Pinia vs the Day 5 request status machine?

**[Day 7 — Finance calculator and application](#day-7--finance-calculator-and-application)**

1. Why is EMI a `computed` and not a method or an API call?
2. What does `v-model.number` do on the calculator?
3. Why validate in Vue before `POST`?
4. Walk through Submit → Vue → Service → Mock API → Response → UI.
5. Why is the finance form not in Pinia?
6. `try/catch` on submit — what happens without it?
7. How do you show field errors vs an API error?
8. What is the EMI formula AutoDrive uses?

---

## Day 1 — Project foundation

### 1. What is Vue 3?

Vue is a JavaScript framework for building user interfaces out of **components**. You describe what the UI should look like for the current state, and Vue's reactivity system updates the DOM when that state changes. Vue 3 introduced the Composition API, better TypeScript support, a faster virtual DOM, and features like `<script setup>`, Teleport and Fragments (multiple root nodes).

### 2. What is Vite and why use it instead of Webpack?

Vite is a build tool and dev server.

- **In development** it serves source files as native ES modules, so the browser only requests what it needs. Startup is almost instant and Hot Module Replacement (HMR) updates only the changed module.
- **For production** (`vite build`) it bundles, tree-shakes and minifies the code into `dist/`.

Webpack bundles everything before serving, which gets slower as the project grows.

### 3. What is an SFC (Single File Component)?

A `.vue` file that keeps a component's logic (`<script setup>`), markup (`<template>`) and styles (`<style>`) together. The Vue plugin for Vite compiles it into JavaScript. `<style scoped>` limits the CSS to that component.

### 4. What is `<script setup>`?

It's compile-time shorthand for the Composition API. Everything declared at the top level — variables, functions and imports — is automatically available in the template, with no `setup()` function and no `return`. It is shorter and performs slightly better. Macros like `defineProps`, `defineEmits` and `defineExpose` are only available inside it.

### 5. What is the Composition API, and how is it different from the Options API?

- **Options API:** logic is split by option type (`data`, `methods`, `computed`, `watch`), so one feature is spread across several places.
- **Composition API:** logic is written with functions (`ref`, `computed`, `watch`, lifecycle hooks), so everything for one feature can be kept together and extracted into reusable **composables** (`useSomething()`).

### 6. What does `export default` vs a named export mean in JavaScript modules?

- `export default router` → imported with any name: `import router from './router'`. Only one default export per file.
- `export const vehicles = [...]` → imported by its exact name in braces: `import { vehicles } from './data/vehicles'`. A file can have many named exports.

Each module has its own scope, so variables don't leak between files.

### 7. What does `app.use(router)` do in `main.js`?

It installs a plugin into the Vue app. Vue Router registers the global `<RouterLink>` and `<RouterView>` components and makes `useRoute()` / `useRouter()` work. `app.use(createPinia())` does the same for Pinia stores. Plugins must be installed **before** `app.mount('#app')`.

### 8. What is `<RouterView />`?

The placeholder where the component for the current route is rendered. On `/` it renders `HomeView`; on an unknown URL it renders `NotFoundView`. The layout (header and footer) stays in place while only the `RouterView` content changes.

### 9. Why use `<RouterLink>` instead of `<a href>`?

`RouterLink` changes the URL through the History API **without a full page reload**, so the app keeps its state and only the route component changes. It also adds active classes automatically. A plain `<a href>` reloads the whole app.

### 10. What is lazy loading a route?

```js
component: () => import('@/views/NotFoundView.vue')
```

Vite splits that view into its own JavaScript file, which is only downloaded when the route is first visited. This makes the first page load smaller.

### 11. Explain the Bootstrap grid.

A `.row` is split into **12 columns**. `.col-6` takes half the row and `.col-4` a third. Breakpoint classes like `.col-md-6` apply from that screen width **and up** (mobile-first). `g-*` sets the gutter (gap) between columns.

### 12. What are Bootstrap's breakpoints?

| Name | Min width |
|---|---|
| xs | 0 (default, no infix) |
| sm | 576px |
| md | 768px |
| lg | 992px |
| xl | 1200px |
| xxl | 1400px |

`col-12 col-md-6 col-lg-4` means 1 column on phones, 2 from tablet size and 3 from laptop size.

---

## Day 2 — Client homepage

### 1. What's the difference between `ref()` and `reactive()`?

- **`ref()`** wraps any value (number, string, boolean, object) and is read and written through `.value` in JavaScript. Templates unwrap it automatically.
- **`reactive()`** only works with objects and arrays, and has no `.value`.

**The catch with `reactive`:** reassigning the variable breaks reactivity, because the template is still watching the *old* object:

```js
const form = reactive(emptyForm())

form = { ...emptyForm() }            // ❌ breaks reactivity (and fails with const)
Object.assign(form, emptyForm())     // ✅ mutates the same object
```

Destructuring (`const { make } = form`) also loses reactivity. Use `toRefs()` if you need to destructure.

### 2. When should you use `computed()` instead of a method?

Use `computed` for **derived values** — values calculated from other state. A computed value is **cached**: it only recalculates when one of its reactive dependencies changes. A method called in the template (`{{ getMonthlyPayment() }}`) runs again on **every re-render**, even when nothing it depends on has changed.

In AutoDrive, the finance calculator's `monthlyPayment` and the search button's `matchCount` are computed values.

### 3. Explain "props down, events up".

- A **parent passes data down** to a child through props: `<VehicleCard :vehicle="vehicle" />`.
- A **child notifies the parent** through events: `emit('search', filters)`, which the parent handles with `@search="onSearch"`.

A child must not change a prop directly. The parent owns that data, so a change would be overwritten on the parent's next render, and it makes data flow hard to follow. Vue warns if you try.

### 4. What does `col-12 col-md-6 col-lg-4` do at 500px, 800px and 1100px?

- **500px** is below `md` (768px), so only `col-12` applies: **1 card per row**.
- **800px** is at least `md`, so `col-md-6` applies: **2 per row**.
- **1100px** is at least `lg` (992px), so `col-lg-4` applies: **3 per row**.

"Mobile-first" means the unprefixed class is the phone default, and each breakpoint class overrides it from that width upward.

### 5. Why create the Bootstrap carousel in `onMounted`, and why call `dispose()`?

`<script setup>` runs **before** the component's DOM exists. `onMounted` runs after the elements are in the page, so the template ref `carouselEl.value` points at a real element that Bootstrap can attach to.

`dispose()` in `onBeforeUnmount` removes Bootstrap's timers and event listeners. Without it, leaving and returning to the page would create a new carousel each time, while the old intervals keep running and leak memory.

### 6. What does `v-model.number` do, and why was it needed?

Input values are always strings. `.number` converts them with `parseFloat`. Without it, `vehiclePrice + downPayment` would join strings (`"35000" + "5000"` → `"350005000"`). Other modifiers are `.trim` (removes surrounding whitespace) and `.lazy` (syncs on `change` instead of `input`).

### 7. Why must `v-for` have a `:key`, and why not use the index?

Vue uses the key to match each item with its DOM element between renders. Without a stable key, Vue reuses elements **by position**. If the list is re-sorted or filtered, component state such as a card's favorite heart can end up on the wrong item.

The array index *is* the position, so it has the same problem. Use a unique, stable value like `vehicle.id`.

### 8. What is a slot, and what is fallback content?

A slot lets the parent pass **markup** into a child. `VehicleShowcase` has a named `actions` slot:

```html
<slot name="actions">
  <span class="badge">12 vehicles</span>   <!-- fallback -->
</slot>
```

If the parent passes nothing, the fallback shows. The search results pass a "Clear search" button instead:

```html
<VehicleShowcase ...>
  <template #actions><button>Clear search</button></template>
</VehicleShowcase>
```

### 9. What do `defineExpose` and `useTemplateRef` do?

Components that use `<script setup>` are **closed by default**: a parent can't reach inside them. `defineExpose({ searchBy, reset })` makes those functions public. The parent gets the component instance with `useTemplateRef('vehicleSearch')` plus `ref="vehicleSearch"` in the template, then calls `vehicleSearch.value.searchBy({ bodyType: 'SUV' })`.

Use this for **commands** ("search now", "focus", "reset"). For normal data, use props and events.

### 10. What does `nextTick()` do?

Vue batches DOM updates and applies them asynchronously. After changing state, the DOM has not been updated yet. `await nextTick()` waits until it has.

In AutoDrive, `onSearch` sets `searchCriteria`, awaits `nextTick()`, and only then scrolls to `#search-results`. Before that, the section (rendered with `v-if`) doesn't exist yet.

### 11. `v-if` vs `v-show`?

- **`v-if`** adds or removes the element from the DOM. It is more expensive to toggle but costs nothing while false. It supports `v-else`.
- **`v-show`** always renders the element and toggles `display: none`. It is cheap to toggle but always costs the initial render.

Use `v-show` for things toggled often (tabs, dropdowns), and `v-if` for things that rarely change or that shouldn't exist at all (the search results before a search).

### 12. `container` vs `container-fluid`?

- `.container` has a fixed max width at each breakpoint and is centred. Use it for readable content.
- `.container-fluid` is always 100% wide. AutoDrive's header uses it so the navbar spans the full screen.

Section backgrounds go on the `<section>`, and the content goes in a `.container` inside it: full-width colour, centred content.

### 13. Why use `row-cols-*` instead of `col-*` for the body-style tiles?

`row-cols-lg-5` is set on the **row** and means "5 columns per row". It can split a row into 5 equal parts, which is impossible with `col-*` because 12 isn't divisible by 5. Each child just uses `.col`.

### 14. Why pass `vehicles` as a prop instead of importing the data inside the component?

It decouples the component from where the data comes from. The parent decides *which* vehicles to show (all, used only, search results). When the data later comes from an API or a Pinia store, only the parent changes. It also makes the component easy to unit-test with fake data.

### 15. What happens if a vehicle with a new body style, like "Minivan", is added to the data?

Everything that is built from the data updates on its own:

- A 6th "Minivan" tile appears, because `uniqueValues(vehicles, 'bodyType')` finds it.
- It gets the fallback icon, because `icons[type] ?? 'bi-car-front'` handles unknown types.
- The search form's **Body style** dropdown gains "Minivan", because it uses the same helper.

This is the advantage of rendering UI from data instead of hard-coding lists.

### 16. Two sibling components need to share state. What are your options?

In AutoDrive, clicking a body-style tile had to update the separate search form.

1. **Lift the state up** into the common parent and pass it down as props. This is the standard answer for a few components.
2. **Expose a command** with `defineExpose` and call it from the parent through a template ref. AutoDrive uses this: `vehicleSearch.value.searchBy({ bodyType })`. It's quick, but it couples the parent to the child's API.
3. **Use a Pinia store** when many components, or several pages, need the same state. Search filters that must survive navigation to an inventory page are a good fit.

### 17. `public/` vs `src/assets/`: where should images go?

- **`public/`**: files are copied to the build as-is and referenced by an absolute URL, e.g. `'/images/vehicles/bmw-x5.jpg'`. Use it when the path comes from **data** (like `vehicle.image`), because Vite can't see a path inside a string.
- **`src/assets/`**: files are imported (`import logo from '@/assets/logo.png'`) and Vite processes them: it adds a content hash to the filename for caching, and it fails the build if the file is missing. Use it for images written directly in a component.

AutoDrive's car photos live in `public/` because the paths come from `vehicles.js`, the same way they would come from an API later.

Related: `loading="lazy"` delays off-screen images, and `width`/`height` attributes let the browser reserve space before the image loads (with `height: auto` in CSS, so `aspect-ratio` still controls the shape).

### 18. Can you use any image you find online on a website?

No. Images are copyrighted by default. Use photos you own, stock photos you have a licence for, or openly licensed images. AutoDrive's photos come from Wikimedia Commons under Creative Commons licences:

- **CC BY / CC BY-SA** require you to credit the author, link the licence and say if you changed the image. **SA** (ShareAlike) means that if you modify the image, you must share your modified version under the same licence.
- **Public domain** needs no credit, but giving one is good practice.

That's why the site has a `/credits` page built from `data/imageCredits.js`.

## Day 3 — Vehicle inventory

### 1. What does `map()` return, and where is it used in AutoDrive?

`map()` always returns a **new array** of the same length, with each item transformed.

`uniqueValues` uses it to pull one field off every vehicle: `vehicles.map((vehicle) => vehicle[key])`. Then `new Set(...)` drops duplicates and `[...]` turns the set back into an array. That is how the Make / Fuel / Transmission dropdowns are built from the data instead of being hard-coded.

### 2. How is `filter()` different from `find()`?

- `filter()` returns **every** match as a new array (possibly empty).
- `find()` returns the **first** match, or `undefined`.

Inventory uses `filter()` because a search can match many cars. The sort dropdown uses `find()` because it only needs the one option whose `value` equals `sortBy`.

### 3. Why copy the array before calling `sort()`?

`sort()` changes the array it is called on. `sortInventory` does `return [...vehicles].sort(compare)` so the original `vehicles` export stays in its original order. If you write `vehicles.sort(...)`, the homepage featured row would also change, because both pages import the same array.

### 4. `some()` vs `every()`?

- `some()` is true if **at least one** item passes the test. AutoDrive uses it for "EV option on this page".
- `every()` is true only if **all** items pass. AutoDrive uses it for "Every vehicle on this page is available".

On an empty array, `some()` is false and `every()` is true, which is why the available badge also checks `visibleVehicles.length > 0`.

### 5. Why do we call `.toLowerCase()` before `includes()`?

`includes()` is case-sensitive. `"civic".includes("Civic")` is false. The search box lowercases both the typed term and the haystack (`year + make + model + trim + bodyType + stockNumber`) so "civic", "CIVIC" and "Civic" all match.

### 6. What is destructuring, and why use it on `filters`?

Destructuring pulls properties out of an object into variables:

```js
const { search, make, fuelType } = filters
```

It keeps the `filter()` callback readable. Without it you would write `filters.search`, `filters.make`, `filters.fuelType` on every line.

### 7. What does the spread operator do in `[...vehicles]` and `{ ...filters }`?

Spread copies items into a new array or object. `[...vehicles]` is a shallow copy used before `sort()`. `{ ...filters }` (used on the homepage search emit) is a snapshot of the current form, so later typing does not change the object that was already sent.

### 8. Why is filtering done in a `computed` instead of a method?

A computed value is cached. Vue re-runs `filteredVehicles` only when `vehicles`, `filters` or `sortBy` change. A method would run again on every render — including unrelated ones, like hovering a favourite heart.

That is why computed is the right tool for a derived list: the work is somewhat expensive (filter + sort 24 items, later hundreds), and the result should stay in sync with the form automatically.

`visibleVehicles` is a second computed that depends on `filteredVehicles` and `currentPage`. Changing page does not re-filter; it only re-slices.

### 9. When is `reactive()` a better fit than `ref()` for a form?

Use `reactive()` when you have a group of related fields (`search`, `make`, `fuelType`, …) and you want `v-model="filters.make"` without `.value`. Use `ref()` for a single value such as `sortBy` or `currentPage`.

Resetting a reactive form is `Object.assign(filters, emptyFilters())` — that mutates the same object, so Vue still tracks it. Replacing `filters = emptyFilters()` would not work, because `const filters` cannot be reassigned.

### 10. How does `v-model` keep the selects and the results in sync?

`v-model="filters.make"` is sugar for `:value="filters.make"` plus `@change`/`@input` that writes back. Because `filters` is reactive, that write triggers the `filteredVehicles` computed, which updates the cards. There is no "Search" click required on this page — every keystroke and dropdown change is live.

### 11. How does pagination with `slice()` work?

`paginate` does `items.slice((page - 1) * pageSize, page * pageSize)`. Page 1 of size 6 is indexes 0–5; page 2 is 6–11. `slice` does not change the original array. A `watch` on the filters resets `currentPage` to 1 so you never land on an empty page 4 after narrowing the results.

### 12. Why convert a `<select>` value with `Number()`?

HTML form values are always strings. `vehicle.year === "2026"` is false when `year` is the number `2026`. `filterInventory` uses `Number(year)` and `Number(maxPrice)` so the comparison is number-to-number.

## Day 4 — Vehicle details

### 1. How does `:id` work in `/vehicles/:id`?

`:id` is a **dynamic segment**. Vue Router matches any value in that position and puts it on the route: `/vehicles/7` → `route.params.id === '7'`. Params are always **strings**.

The same `VehicleDetailsView` is reused for every id. The catch-all `/:pathMatch(.*)*` stays last so it does not swallow `/vehicles/7`.

### 2. How does the page know which vehicle to display?

It reads the id (from the `id` prop, because the route has `props: true`) and looks it up in the mock list:

```js
const vehicle = computed(() => findVehicleById(vehicles, props.id))
```

`findVehicleById` compares with `String(...)` on both sides so `"7"` matches `7`. If nothing matches, the template shows "Vehicle not found".

### 3. Where should data loading happen?

In the **page** (the view), not in the router file and not in a presentational child.

Today that is a synchronous `find` inside a `computed`, because the data is a local module. When there is an API, the same place becomes `watch` / `onMounted` plus an async function: read `id`, fetch, set a `ref`. Children like `VehicleGallery` only receive the result as props.

Do not fetch inside `VehicleCard`. A card should not need to know how data is loaded.

### 4. Props vs emits?

**Props go down. Events go up.**

`VehicleActions` does not toggle favourite itself in a way the parent cannot see. The parent owns `isFavorite` and passes it as a prop. The child emits `favorite`; the parent runs `onFavorite`. Same for compare, finance, test drive and trade-in.

If the child mutated a prop, Vue would warn and the parent would lose control. If the parent imported the button markup, reuse would be harder.

### 5. `useRoute()` vs `useRouter()`?

- `useRoute()` is the **current route** (params, query, hash, name). Read-only snapshot that stays reactive.
- `useRouter()` is the **router instance**. You call `push`, `replace` and `back` on it.

Trade-in uses `router.push({ name: 'home', hash: '#trade-in', query: { vehicle: id } })`. The finance panel can be opened from a query: `/vehicles/1?action=finance`.

### 6. What does `router.push()` do that a plain `<a href>` does not?

`router.push` changes the URL **without a full page reload**, so the Vue app stays alive (Pinia, scroll position helpers, layout). `<RouterLink>` is the template version of the same thing. A raw `<a href="/vehicles/1">` would remount the whole app.

### 7. What is `props: true` on a route?

It copies `route.params` onto the page component as props. `VehicleDetailsView` declares `defineProps({ id: … })` instead of only reading `useRoute()`. That makes the page easier to test: you can mount it with `id="3"` and skip the router.

### 8. Why watch `id` instead of reading `route.params.id` once?

Vue **reuses** the same details component when you go from `/vehicles/1` to `/vehicles/17`. `onMounted` does not run again. A `const id = route.params.id` string captured once would stay `1`.

A `computed` / `watch` on `props.id` (or `() => route.params.id`) updates the vehicle, resets the test-drive form, and sets `document.title`.

### 9. Params vs query: `/vehicles/1` vs `/vehicles/1?action=finance`?

- **Params** (`:id`) identify the resource. They belong in the path.
- **Query** (`?action=finance`) is optional extra state: which panel to open, where the user came from, a filter to restore.

`/vehicles?condition=new` (Day 3) is query. `/vehicles/1` is a param. `/vehicles/1?action=finance` is both.

### 10. Why `@click.stop` on the card favourite button?

The card uses Bootstrap's `stretched-link`, so a click anywhere on the card follows **View details**. Without `.stop`, clicking the heart would also navigate. `.stop` calls `stopPropagation()` so only the favourite `ref` toggles.

## Day 5 — Mock API and service layer

### 1. Why Component → Composable → Service → API?

Each layer has one job:

- **Component** — render status and bind buttons. It does not know URLs.
- **Composable** — `useVehicles`, `useVehicle`. Owns status (`loading`, `error`) and calls the service.
- **Service** — `vehicleService.listVehicles()`. Knows the path and HTTP method.
- **API client** — `request()` / `fetch`. Knows headers, JSON, and whether we are on the mock or .NET.

If a component imported `handleMockRequest`, swapping to .NET would mean editing every screen.

### 2. What does `fetch` return, and why do we still wrap it?

`fetch` returns a **Promise** that resolves to a `Response`. It does **not** throw on 404 or 500. You must check `response.ok` and then `response.json()`.

`request()` in `api/http.js` does that once. Services call `request('/vehicles')` and either get data or an `ApiError`.

### 3. Promise vs async/await?

A Promise is an object for a value that will exist later. `async/await` is syntax on top of Promises.

```js
const vehicle = await getVehicle(1)
```

is the same idea as `getVehicle(1).then(...)`. `await` can only be used inside `async` functions. AutoDrive composables are `async function load()`.

### 4. Why `try/catch` around API calls?

`await request()` throws `ApiError` when the response is not ok. Without `try/catch`, an unhandled rejection appears in the console and the UI stays on "loading" forever. The composable catches, sets `status = 'error'`, and the view shows **Retry**.

### 5. How do you turn a `Response` into data?

```js
const payload = await response.json()
```

The body is a string of JSON. `.json()` parses it into objects. 204 No Content has no body — `request()` returns `null` for DELETE.

### 6. How do you handle 404 vs 500?

Both are `!response.ok`. We read `payload.message` and throw `ApiError` with the **status code**. The UI can say "not found" for 404 and "try again" for 500. **Simulate API error** on inventory sends a 500; `/vehicles/101` is a 404.

### 7. What are INITIAL, LOADING, SUCCESS, EMPTY, ERROR, RETRY?

| Status | Meaning |
|---|---|
| `initial` | The composable exists; no request yet |
| `loading` | A request is in flight (spinner) |
| `success` | We have data to render |
| `empty` | The request worked but the list is `[]` |
| `error` | The request failed |
| `retry` | Not a status — it is `load()` called again |

Empty and success are both "the API worked". Mixing them with error is a common bug.

### 8. GET vs POST vs PUT vs PATCH vs DELETE?

| Method | AutoDrive example |
|---|---|
| GET | `GET /vehicles`, `GET /vehicles/1` — read |
| POST | Test drive and finance **create** |
| PUT | Replace a finance application (48-month switch) |
| PATCH | Confirm a test drive; save a vehicle favourite |
| DELETE | Cancel a test drive; withdraw an application |

PUT sends a full replacement. PATCH sends only the fields that change.

### 9. How will this connect to a real .NET API?

Set `VITE_USE_MOCK=false` and `VITE_API_BASE_URL=https://localhost:5001/api` in `.env`. `request()` then calls `fetch(baseUrl + path)` with the same JSON body. Controllers on the .NET side should expose the same routes: `GET /vehicles`, `POST /test-drives`, and so on. **No Vue component changes.**

### 10. Why must the Vue component not know about the mock?

The mock is a stand-in for the network. If `VehiclesView` imported `db.vehicles`, you would have to rewrite the view for .NET, and you could not show loading or retry. The view only knows `status`, `vehicles`, and `retry()`.

### 11. Where does the real API go — one file or every view?

**One file:** `client/src/api/http.js`. The `else` branch is already `fetch(baseUrl + path)`. Views never call `fetch`.

Request **state** (loading / empty / error) is a second file: `useAsyncResource.js`. That is not Pinia. Pinia is shared app state later.

Full map: [api-handling.md](api-handling.md).

## Day 6 — Pinia and state management

### 1. Why do we need state management?

When two screens must see the **same** data at the same time — the header favorite count and the heart on a card — a `ref` inside one component is not enough. Pinia is a shared box those screens both read and write.

### 2. Local component state vs composable state vs Pinia?

| Kind | Lives | Example in AutoDrive |
|---|---|---|
| **Local** | One component | Inventory filters, pagination, which details panel is open |
| **Composable** | One feature, can be reused | `useTestDriveRequest` — form + POST status for that screen |
| **Pinia** | The whole app | Favorite ids, compare list, signed-in user, cached vehicle list |

### 3. What are state, getters, and actions?

- **state** — the data (`items`, `ids`, `user`)
- **getters** — derived values (`count`, `has(id)`, `featured`)
- **actions** — functions that change state, including **async** ones (`loadVehicles`, `toggle`)

### 4. How do you use a store in a Vue component?

```js
const favoriteStore = useFavoriteStore()
favoriteStore.toggle(vehicle)
```

In the template, `favoriteStore.count` is reactive. If you destructure state, use `storeToRefs` or you lose reactivity.

### 5. What is an async action?

An action that `await`s a service. `vehicleStore.loadVehicles()` sets `listStatus = 'loading'`, then `await listVehicles()`, then success or error. The view still does not call `vehicleService` itself.

### 6. When should you NOT put something in Pinia?

If only one screen needs it, keep it local. Filters, sort, page number, test-drive name, and the open finance panel are not Pinia. A store for every input is harder to debug, not easier.

### 7. Why `storeToRefs`?

`const { items } = vehicleStore` copies the value once — it will not update. `storeToRefs(vehicleStore)` gives refs that stay in sync. Actions are functions; take them from the store, not from `storeToRefs`.

### 8. How does AutoDrive load vehicles through Pinia?

`VehiclesView` → `vehicleStore.loadVehicles()` → `vehicleService.listVehicles()` → `request('/vehicles')` → mock (or later .NET). Home uses the same store, so the second visit can reuse the cached list.

### 9. How do favorites stay in sync across pages?

`favoriteStore` holds `ids`. Cards, details, the header badge, and `/saved` all call the same store. `localStorage` keeps ids after refresh. Toggle also PATCHes `{ saved }` so the mock API stays in practice.

### 10. Pinia vs the Day 5 request status machine?

Day 5 status (`loading` / `error`) answers “what is **this request** doing?” Pinia answers “what does the **app** remember?” `vehicleStore` happens to store both: the cached list (app memory) and `listStatus` (that request). Favorites do not need a loading spinner to toggle an id.

## Day 7 — Finance calculator and application

### 1. Why is EMI a `computed` and not a method or an API call?

Price, down payment, APR and tenure are already on the page. EMI is just math. A `computed` recalculates when those refs change. An API call would add loading for a formula you can do in the browser.

### 2. What does `v-model.number` do on the calculator?

`v-model` on an `<input type="number">` is still a **string** unless you add `.number`. The modifier runs `Number()` so `35000 + 1` is `35001`, not `"350001"`.

### 3. Why validate in Vue before `POST`?

A 400 from the API is slower and vaguer. Client checks catch empty name or a bad email immediately. The mock still rejects a missing name or loan amount — that is the server's job too.

### 4. Walk through Submit → Vue → Service → Mock API → Response → UI.

Submit calls `onSubmit` → `useFinanceApply.submit()` validates → `createFinanceApplication()` → `request('POST', /finance-applications)` → mock delay + 201 JSON (or 500) → composable sets `success` or `error` → the view shows the alert. The `.vue` file never calls `handleMockRequest`.

### 5. Why is the finance form not in Pinia?

Only this page needs the draft. Header and inventory do not. Day 6 rule: if one screen owns it, keep it local.

### 6. `try/catch` on submit — what happens without it?

`await request()` throws `ApiError` on 500. Without `catch`, the UI can stay on **loading** and you get an unhandled rejection. The composable catches, sets `status = 'error'`, and shows Retry.

### 7. How do you show field errors vs an API error?

Field errors are `errors.name` from `validateFinanceApplication` — red text under the input. An API error is `status === 'error'` and `error.message` after the network call. Validation failure never hits the API.

### 8. What is the EMI formula AutoDrive uses?

Loan amount `P` = price − down. Monthly rate `r` = APR / 100 / 12. Tenure `n` months.

If `r === 0`: EMI = `P / n`.  
Else: EMI = `P * r / (1 - (1 + r) ** -n)`.

Total payment = EMI × n. Total interest = total payment − P.
