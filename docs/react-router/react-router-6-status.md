# React Router 6 Status Report

**Branch:** `sk/react-router-6`
**Design Docs:** [PR #305](https://github.com/ionic-team/ionic-framework-design-documents/pull/305)
**Last Updated:** November 22, 2025

## Summary

The React Router 6 work is in good shape. The core router integration matches the design docs, the test app exercises most of the interesting cases, and the latest Cypress run shows that almost everything behaves as expected. What remains are a small set of advanced flows around not-found handling, some tab context behavior, and one swipe-to-go-back scenario.

At this point the work feels like late-stage refinement rather than architectural surgery.

- Total Cypress tests: 69
- Passing: 62
- Failing: 7
- Suites with failures: `routing.cy.js`, `swipe-to-go-back.cy.js`, `tab-context.cy.js`

Once those are cleaned up and the types/docs are brought up to date, this should be ready for an alpha release.

---

## Test status (Cypress – React Router 6 test app)

Latest run of `npm run cypress` against the RR6 test app:

- `dynamic-ionpage-classnames.cy.js` – 1/1 passing
- `dynamic-routes.cy.js` – 3/3 passing
- `dynamic-tabs.cy.js` – 3/3 passing
- `multiple-tabs.cy.js` – 4/4 passing
- `nested-outlets.cy.js` – 11/11 passing
- `outlet-ref.cy.js` – 1/1 passing
- `overlays.cy.js` – 3/3 passing
- `refs.cy.js` – 2/2 passing
- `replace-actions.cy.js` – 1/1 passing
- `routing.cy.js` – 24/28 passing (4 failing)
- `swipe-to-go-back.cy.js` – 7/8 passing (1 failing)
- `tab-context.cy.js` – 0/2 passing (2 failing)
- `tabs.cy.js` – 2/2 passing

So the bulk of the suite is green. The remaining problems are concentrated in three areas:

1. A handful of routing edge cases in `routing.cy.js`.
2. One swipe-back path that gets confused after tab switching.
3. The small tab-context demo that drives tabs via `IonTabsContext`.

---

## What’s working well

This is the “you don’t need to worry about these anymore” list.

### Core architecture

The main pieces match the RR6 design docs and behave sensibly in practice:

- **`IonRouter`** uses `useLocation` / `useNavigate` from React Router 6, tracks a `LocationHistory`, and computes `RouteInfo` objects that drive Ionic’s view stacks and directions.
- **`ReactRouterViewStack`** owns view items per outlet, handles RR6-style matching (including params and wildcards), and coordinates mount/unmount via `ViewLifeCycleManager`.
- **`StackManager`** glues a given `ion-router-outlet` to the view stack. It:
  - picks entering/leaving views,
  - calls `routerOutlet.commit(...)` for transitions,
  - handles nested outlets via a computed parent path, and
  - wires in swipe-to-go-back.
- **Router variants** (`IonReactRouter`, `IonReactHashRouter`, `IonReactMemoryRouter`) all run on top of this stack and are behaving as expected.

There are no obvious architectural gaps left; the remaining bugs are about particular flows using this machinery, not about missing pieces.

### Navigation scenarios covered by passing suites

All of these are currently green in Cypress and line up with the v5 behavior:

- **Dynamic routes** – adding/removing routes at runtime and hitting them directly.
- **Dynamic tabs** – adding a second tab at runtime and keeping the view state correct.
- **Multiple tab bars** – apps that switch between different tab sets.
- **Nested outlets** – both the simple nested-outlet demo and the deeper `nested-outlet2` flows now pass end‑to‑end.
- **Overlays** – modal navigation (including navigating away while a modal is open) cleans up correctly.
- **Refs** – forwarding refs to Ionic components works for both function and class components.
- **Replace actions** – replace-style navigation behaves as expected in the dedicated demo.
- **Tabs** – the basic tabs test suite (separate from the tab-context demo) is fully passing.

Taken together, that covers the majority of patterns people actually use: plain stacks, nested outlets, “tabs within a shell route”, and overlays.

---

## Remaining problem areas

### 1. `routing.cy.js` – four failing tests

The main routing demo is mostly green, but four tests still fail:

1. **Not-found route** – `/routing/asdf` is expected to render a `not-found` page and never does. This suggests that either the catch‑all route is not wired correctly for the RR6 matching rules, or the page is mounted but never becomes the active view item.
2. **Menu + redirect interaction** – the “Menu → Favorites → Menu → Home with redirect” flow expects Favorites to be hidden and Home to be visible; Cypress still finds the old page. This points to a corner case in how we hide/unmount views when a redirect happens off a menu selection.
3. **Back button visibility on pushed page** – after pushing a new page, the test expects the back button to appear. The view content appears, but we never hit the “show back button” state. This is likely a mismatch between our `LocationHistory` bookkeeping and how we decide whether the current view has something to go back to.
4. **Parameterized route instances** – the “mount new view item instances of parameterized routes” test times out with a value mismatch (`'1'` vs something else). This is the same area where we do view cloning for `/user/1` → `/user/2`; we may be reusing the wrong view item or not updating route params the way the test expects.

All of these are focused on how we track history and view identity, not on basic RR6 API usage.

### 2. `swipe-to-go-back.cy.js` – one failing test

Seven of the eight swipe tests pass. The remaining failure is:

- **“should swipe and go back to correct tab after switching tabs”** – after switching tabs and using the swipe gesture, we expect to land back on the correct tab page (`data-pageid=home`) but never see it.

The other swipe tests (including aborting gestures and swiping within a tab) behave correctly, so the problem is very specific: combining tab switching with a swipe‑back is leaving the `LocationHistory` and/or active view in a slightly inconsistent state.

### 3. `tab-context.cy.js` – both tests failing

The small tab-context demo, which exercises `IonTabsContext.selectTab`, still fails both of its tests:

1. Navigating from `/tab-context` and calling `selectTab('tab2')` tries to click a button that lives on a page still marked as hidden (`ion-page-hidden`). In other words, we update the active tab in context, but the underlying view stack has not actually switched visible pages.
2. Starting on `/tab-context/tab1` and trying to flip back to tab1 via context never finds the expected `tab2` page, which again points to view items not lining up with what the context thinks is active.

The “normal” tabs test suite does not have this problem, so this looks isolated to how we bridge the context helper into the RR6 router + view stack.

---

## Non-test gaps and cleanup work

A few things that don’t show up as Cypress failures but are worth fixing before we put a label on this.

### TypeScript and types

`@ionic/react-router` is built against React Router 6, but the devDependencies still pull in v5 type packages:

```json
"@types/react-router": "^5.0.3",
"@types/react-router-dom": "^5.1.5"
```

That hasn’t bitten us in the test app, but it’s confusing and will matter for downstream consumers. We should:

- Drop the v5 type packages or replace them with the RR6 equivalents.
- Run a full type check across the package once that change is made.

### Documentation

Right now the only “docs” for this work are the design document and this status file. Before releasing anything, we should have:

- A short migration guide for going from the v5 integration to the v6 one.
- A clear explanation of any Ionic‑specific behavior that differs from plain React Router 6 (for example, `routeOptions.unmount`, how `LocationHistory` works, and how nested outlets should be declared with `/*`).

### Debug logging and general polish

During bring‑up we added logging in a few places to trace routing behavior. Before shipping we should:

- Audit `IonRouter`, `ReactRouterViewStack`, and `StackManager` for stray `console.log` / `console.warn` calls.
- Make sure any remaining logs are behind a flag or obviously diagnostic.

---

## Short-term plan

This is a realistic sequence of work to get from the current state to “alpha ready”:

1. **Close out the remaining E2E failures**
   - Fix the not‑found and redirect/menu cases in `routing.cy.js`.
   - Correct the back‑button logic and parameterized route instance handling in that same spec.
   - Align swipe‑back behavior after tab switches with the existing (passing) swipe tests.
   - Make `IonTabsContext.selectTab` and the RR6 router agree on which view is active in the tab-context demo.

2. **Clean up types and build configuration**
   - Remove or update the v5 `@types/react-router*` packages.
   - Run TypeScript with strict settings for `@ionic/react-router` and fix any fallout.

3. **Write the migration notes**
   - Document the route shape expectations (e.g., `parent/*` when using nested outlets).
   - Call out differences vs the v5 integration, especially around history behavior and any removed APIs.

4. **Do a quick manual pass on the test app**
   - Click through the main demos (tabs, nested outlets, overlays, swipe‑back) with an eye for anything the tests don’t currently cover.

If we keep the changes tightly focused on these areas, we shouldn’t need to revisit the overall architecture again.
