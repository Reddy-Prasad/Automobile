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
