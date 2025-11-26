# React Router 6 Migration

**Branch:** `sk/react-router-6`
**Design Docs:** [PR #305](https://github.com/ionic-team/ionic-framework-design-documents/pull/305)
**Last Updated:** November 26, 2025

## Overview

The `@ionic/react-router` package has been updated to support React Router 6. This migration replaces the React Router 5 integration with native RR6 APIs while preserving Ionic's navigation patterns, animations, and view lifecycle management.

All Cypress tests are now passing.

| Metric | Count |
|--------|-------|
| Total tests | 70 |
| Passing | 70 |
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

### Core Components

**IonRouter** was rewritten as a functional component using React hooks. It now uses `useLocation` and `useNavigate` from React Router 6 instead of the `withRouter` HOC and `history` object from v5. The component continues to manage `LocationHistory` and compute `RouteInfo` objects for Ionic's view stacks and transition directions.

**ReactRouterViewStack** was substantially expanded to handle RR6's matching semantics. Key additions include:
- Support for RR6's `PathMatch` objects and pattern matching
- Handling of index routes and wildcard routes (`*`)
- View identity tracking for parameterized routes (`/user/:id`)
- Proper computation of parent paths for nested outlets

**StackManager** was updated to work with the new view stack implementation. Changes include:
- Parent path derivation using RR6's route matching
- Improved handling of `Navigate` redirect components
- Better coordination of entering/leaving views during transitions

### New Utilities

Four utility modules were added to support RR6's routing model:

| File | Purpose |
|------|---------|
| `matchPath.ts` | Extended path matching with RR6 pattern syntax |
| `matchRoutesFromChildren.ts` | Converts Route children to RouteObjects for RR6's `matchRoutes` |
| `derivePathnameToMatch.ts` | Computes the pathname portion relevant to a nested outlet |
| `findRoutesNode.ts` | Locates Routes containers in the component tree |

### Test App Updates

All test pages in `packages/react-router/test/base/src/pages/` were updated to use RR6 syntax:
- `<Route path="/foo" component={Foo} />` became `<Route path="/foo" element={<Foo />} />`
- Nested routes now require trailing wildcards (`path="parent/*"`) when they contain child outlets
- `<Redirect to="..." />` became `<Navigate to="..." replace />`
- Route params accessed via `useParams()` instead of `props.match.params`

## Test Coverage

The Cypress test suite covers the following scenarios:

| Suite | Tests | Description |
|-------|-------|-------------|
| routing.cy.js | 29 | Core navigation, tabs, back button, redirects, params |
| nested-outlets.cy.js | 11 | Nested `IonRouterOutlet` behavior, back navigation |
| swipe-to-go-back.cy.js | 8 | Gesture navigation, abort handling, tab interactions |
| multiple-tabs.cy.js | 4 | Switching between different tab configurations |
| dynamic-tabs.cy.js | 3 | Adding tabs at runtime |
| dynamic-routes.cy.js | 3 | Adding routes at runtime |
| overlays.cy.js | 3 | Modal cleanup on navigation |
| refs.cy.js | 2 | Ref forwarding to Ionic components |
| tabs.cy.js | 2 | Basic tab navigation and history |
| tab-context.cy.js | 2 | Programmatic tab switching via context |
| dynamic-ionpage-classnames.cy.js | 1 | Dynamic class application to IonPage |
| outlet-ref.cy.js | 1 | Ref access to IonRouterOutlet |
| replace-actions.cy.js | 1 | History replacement behavior |

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

## Next Steps

### Before Alpha Release

1. ~~**Run a TypeScript strict check** on the `@ionic/react-router` package~~ Complete - all type errors resolved
2. **Manual testing pass** through the test app to verify animations and gestures feel correct

### Documentation

The following documentation should be prepared before public release:

1. **Migration guide** covering:
   - Route syntax changes (`component` to `element`, `Redirect` to `Navigate`)
   - Nested route wildcard requirements
   - Accessing route params with hooks
   - Any removed or deprecated APIs

2. **Updated API reference** for:
   - `IonReactRouter`, `IonReactHashRouter`, `IonReactMemoryRouter`
   - `IonRouterOutlet` behavior with nested routes
   - `routeOptions.unmount` and `LocationHistory` behavior

### CI Integration

The GitHub Actions workflows have been updated to run the RR6 test app:
- `.github/workflows/build.yml`
- `.github/workflows/stencil-nightly.yml`

## Architecture Reference

The data flow through the routing system:

```
Browser History Change
        │
        ▼
   IonRouter (useLocation/useNavigate)
        │
        ├── Updates LocationHistory
        ├── Computes RouteInfo (action, direction, params)
        │
        ▼
   RouteManagerContext
        │
        ▼
   StackManager (per IonRouterOutlet)
        │
        ├── Derives parent path from route children
        ├── Matches routes using ReactRouterViewStack
        ├── Determines entering/leaving views
        │
        ▼
   ion-router-outlet.commit()
        │
        ▼
   Native Ionic Transition
```

The key insight is that Ionic intercepts React Router's navigation events and translates them into its own view management system, which enables native-feeling animations and gestures while still using React Router for URL management.

## Related Files

Source code:
- `packages/react-router/src/ReactRouter/IonRouter.tsx`
- `packages/react-router/src/ReactRouter/ReactRouterViewStack.tsx`
- `packages/react-router/src/ReactRouter/StackManager.tsx`
- `packages/react-router/src/ReactRouter/utils/`

Test app:
- `packages/react-router/test/base/` (shared test code)
- `packages/react-router/test/apps/reactrouter6/` (RR6 config)
