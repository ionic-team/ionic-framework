# React Router 6 Migration

**Branch:** `sk/react-router-6`
**Design Docs:** [PR #305](https://github.com/ionic-team/ionic-framework-design-documents/pull/305)
**Last Updated:** December 2, 2025

## Overview

The `@ionic/react-router` package has been updated to support React Router 6. This migration replaces the React Router 5 integration with native RR6 APIs while preserving Ionic's navigation patterns, animations, and view lifecycle management.

All Cypress tests are passing.

| Metric | Count |
|--------|-------|
| Total tests | 77 |
| Passing | 77 |
| Failing | 0 |

## What Changed

### Package Dependencies

The `@ionic/react-router` package now requires React Router 6:

```json
"peerDependencies": {
  "react-router": ">=6.0.0",
  "react-router-dom": ">=6.0.0"
}
```

The `history` package dependency was updated from v4 to v5 (which RR6 uses internally).

### Core Components

**IonRouter** (`IonRouter.tsx`) was rewritten as a functional component using React hooks. It now uses `useLocation` and `useNavigate` from React Router 6 instead of the `withRouter` HOC and `history` object from v5. The component continues to manage `LocationHistory` and compute `RouteInfo` objects for Ionic's view stacks and transition directions.

**ReactRouterViewStack** (`ReactRouterViewStack.tsx`) was substantially expanded to handle RR6's matching semantics. Key changes include:
- Support for RR6's `PathMatch` objects and pattern matching
- Handling of index routes and wildcard routes (`*`)
- View identity tracking for parameterized routes (`/user/:id`)
- Proper computation of parent paths for nested outlets
- View cleanup for cross-navigation scenarios (e.g., navigating between different tab stacks)

**StackManager** (`StackManager.tsx`) was updated to work with the new view stack implementation. Changes include:
- Parent path derivation using RR6's route matching
- Improved handling of `Navigate` redirect components
- Better coordination of entering/leaving views during transitions
- Hiding of deactivated catch-all routes to prevent visual glitches

**IonRouteInner** (`IonRouteInner.tsx`) was simplified to work with RR6's element-based routing instead of the component/render prop pattern.

**Router Components** (`IonReactRouter.tsx`, `IonReactHashRouter.tsx`, `IonReactMemoryRouter.tsx`) were updated to use RR6's router components and hooks.

### New Utilities

Five utility modules were added to support RR6's routing model:

| File | Purpose |
|------|---------|
| `computeParentPath.ts` | Computes common path prefixes and determines specific route matches for nested outlets |
| `pathMatching.ts` | Extended path matching using RR6's `matchPath` with support for index routes |
| `pathNormalization.ts` | Path string normalization (leading/trailing slashes) |
| `routeElements.ts` | Extracts Route children from Routes wrappers, detects Navigate elements |
| `viewItemUtils.ts` | Sorts views by route specificity for proper matching priority |

The old `matchPath.ts` utility was removed as its functionality is now handled by RR6's native matching.

### @ionic/react Changes

Several changes were made to the `@ionic/react` package to support the migration:

- **IonRoute** (`IonRoute.tsx`): Updated to work with RR6's element-based routing
- **IonRouterOutlet** (`IonRouterOutlet.tsx`): Updated for RR6 compatibility
- **LocationHistory** (`LocationHistory.ts`): Enhanced to track navigation direction more accurately
- **RouteManagerContext** (`RouteManagerContext.ts`): Added `clearOutletViews` method for cross-navigation cleanup
- **ViewLifeCycleManager** (`ViewLifeCycleManager.tsx`): Added support for new lifecycle events
- **createInlineOverlayComponent** (`createInlineOverlayComponent.tsx`): New utility to automatically dismiss inline overlays on navigation

### Test App Updates

All test pages in `packages/react-router/test/base/src/pages/` were updated to use RR6 syntax:
- `<Route path="/foo" component={Foo} />` became `<Route path="/foo" element={<Foo />} />`
- Nested routes now require trailing wildcards (`path="parent/*"`) when they contain child outlets
- `<Redirect to="..." />` became `<Navigate to="..." replace />`
- Route params accessed via `useParams()` instead of `props.match.params`
- Links use relative paths where appropriate

A new test page (`nested-params/NestedParams.tsx`) was added to test parameterized nested routing scenarios.

The `reactrouter5` test app was removed since the package no longer supports RR5.

## Test Coverage

The Cypress test suite covers the following scenarios:

| Suite | Tests | Description |
|-------|-------|-------------|
| routing.cy.js | 29 | Core navigation, tabs, back button, redirects, params |
| nested-outlets.cy.js | 11 | Nested `IonRouterOutlet` behavior, back navigation |
| swipe-to-go-back.cy.js | 8 | Gesture navigation, abort handling, tab interactions |
| cross-route-navigation.cy.js | 7 | Navigation between different route contexts (tabs, outlets) |
| multiple-tabs.cy.js | 4 | Switching between different tab configurations |
| overlays.cy.js | 3 | Modal cleanup on navigation |
| dynamic-routes.cy.js | 3 | Adding routes at runtime |
| dynamic-tabs.cy.js | 3 | Adding tabs at runtime |
| tabs.cy.js | 2 | Basic tab navigation and history |
| tab-context.cy.js | 2 | Programmatic tab switching via context |
| refs.cy.js | 2 | Ref forwarding to Ionic components |
| dynamic-ionpage-classnames.cy.js | 1 | Dynamic class application to IonPage |
| outlet-ref.cy.js | 1 | Ref access to IonRouterOutlet |
| replace-actions.cy.js | 1 | History replacement behavior |

### New Test Suite: Cross-Route Navigation

A new test suite (`cross-route-navigation.cy.js`) was added to verify proper view cleanup when navigating between different route contexts:
- Tab-to-non-tab navigation
- Non-tab-to-tab navigation
- Between different tab configurations
- Deep link scenarios

## Known Limitations

### Route Path Syntax

Nested outlets require parent routes to include a trailing wildcard:

```tsx
// Correct
<Route path="parent/*" element={<Parent />} />

// Incorrect - child routes won't match
<Route path="parent" element={<Parent />} />
```

This aligns with React Router 6's nested routing semantics where child routes are matched relative to the parent's path.

### Relative vs Absolute Paths

React Router 6 strongly favors relative paths for nested routing. While absolute paths still work, using relative paths in nested outlets is recommended:

```tsx
// Inside a component at /tabs/home
<Link to="details">Details</Link>  // Navigates to /tabs/home/details
<Link to="/tabs/home/details">Details</Link>  // Also works, but less flexible
```

## CI Integration

The GitHub Actions workflows have been updated to run the RR6 test app:
- `.github/workflows/build.yml`
- `.github/workflows/stencil-nightly.yml`

The matrix now uses `reactrouter6` instead of `reactrouter5`.

## Architecture Reference

The data flow through the routing system:

```
Browser History Change
        |
        v
   IonRouter (useLocation/useNavigate)
        |
        +-- Updates LocationHistory
        +-- Computes RouteInfo (action, direction, params)
        |
        v
   RouteManagerContext
        |
        v
   StackManager (per IonRouterOutlet)
        |
        +-- Derives parent path from route children
        +-- Matches routes using ReactRouterViewStack
        +-- Determines entering/leaving views
        +-- Clears stale views on cross-navigation
        |
        v
   ion-router-outlet.commit()
        |
        v
   Native Ionic Transition
```

The key insight is that Ionic intercepts React Router's navigation events and translates them into its own view management system, which enables native-feeling animations and gestures while still using React Router for URL management.

## Next Steps

### Before Release

1. ~~**Run a TypeScript strict check** on the `@ionic/react-router` package~~ Complete
2. ~~**All Cypress tests passing**~~ Complete (77/77)
3. **Manual testing pass** through the test app to verify animations and gestures feel correct
4. **Code review** of the implementation

### Documentation

The following documentation should be prepared before public release:

1. **Migration guide** covering:
   - Route syntax changes (`component` to `element`, `Redirect` to `Navigate`)
   - Nested route wildcard requirements
   - Accessing route params with hooks (`useParams()`)
   - Link syntax changes (relative paths)
   - Any removed or deprecated APIs

2. **Updated API reference** for:
   - `IonReactRouter`, `IonReactHashRouter`, `IonReactMemoryRouter`
   - `IonRouterOutlet` behavior with nested routes
   - `routeOptions.unmount` and `LocationHistory` behavior

## Related Files

Source code:
- `packages/react-router/src/ReactRouter/IonRouter.tsx`
- `packages/react-router/src/ReactRouter/ReactRouterViewStack.tsx`
- `packages/react-router/src/ReactRouter/StackManager.tsx`
- `packages/react-router/src/ReactRouter/IonRouteInner.tsx`
- `packages/react-router/src/ReactRouter/IonReactRouter.tsx`
- `packages/react-router/src/ReactRouter/IonReactHashRouter.tsx`
- `packages/react-router/src/ReactRouter/IonReactMemoryRouter.tsx`
- `packages/react-router/src/ReactRouter/utils/` (5 utility modules)

Test infrastructure:
- `packages/react-router/test/base/` (shared test code)
- `packages/react-router/test/apps/reactrouter6/` (RR6 config)
- `packages/react-router/scripts/test_runner.sh` (test automation)

Supporting changes in @ionic/react:
- `packages/react/src/components/IonRoute.tsx`
- `packages/react/src/components/IonRouterOutlet.tsx`
- `packages/react/src/components/createInlineOverlayComponent.tsx`
- `packages/react/src/routing/LocationHistory.ts`
- `packages/react/src/routing/RouteManagerContext.ts`
- `packages/react/src/routing/ViewLifeCycleManager.tsx`

## Commit History

Key commits on this branch:

| Commit | Description |
|--------|-------------|
| `418ac75` | Cleaning up util files |
| `82fd1ba` | Fix views not being cleaned up properly, causing cross navigation issues |
| `3912623` | Hide deactivated catch-all routes |
| `7fd0659` | Nested redirect fix |
| `b02c197` | Prevent incorrect view reuse for parameterized routes |
| `584dcf2` | Prioritize specific route matches |
| `045b0a7` | Correct tab and nested outlet navigation |
| `59f2dbe` | Automatically dismiss inline overlays on navigation |
