# React Router 6 Upgrade - Status Analysis

**Branch:** `sk/react-router-6`  
**Design Docs:** [PR #305](https://github.com/ionic-team/ionic-framework-design-documents/pull/305)  
**Date:** October 26, 2025

## Executive Summary

The `sk/react-router-6` branch contains significant progress toward React Router 6 support with ~55k insertions across 94 files. Core routing logic has been migrated to React Router 6 APIs, test applications exist for both RRv5 and RRv6, and fundamental navigation patterns are working.

**Current Status:** 🟡 In Active Development  
**Alignment with Design Docs:** 🟢 Strong (80-90% aligned)  
**Alpha Readiness:** 🟡 Approaching (~70% complete)

---

## Alignment with Design Documents

### ✅ Successfully Implemented (Aligned with Docs)

#### 1. **Core API Migration**
- ✅ **Package Dependencies**: Updated peer dependencies from `react-router@^5.0.1` → `>=6.0.0`
- ✅ **Hook Migration**: 
  - Using `useLocation()`, `useNavigate()`, `useParams()` from React Router 6
  - Removed legacy `useHistory()` and `props.match` patterns
- ✅ **Route Definition**: Using `element` prop instead of `component`/`render`
- ✅ **matchPath API**: Migrated to React Router 6 signature (pathname + options object)

#### 2. **IonRouter.tsx** (0005-ion-router.md)
- ✅ Implements `handleHistoryChange` with POP/REPLACE/PUSH logic as documented
- ✅ Tracks `pushedByRoute` for linear navigation detection
- ✅ Supports tab navigation with `currentTab` tracking
- ✅ Implements `handleNavigateBack` with default href fallback
- ✅ Parameter-based route detection and matching (`areParamsEqual`)
- ✅ Uses `LocationHistory` for history stack management

**Code Evidence:**
```typescript path=/Users/shane.king/code/ionic/ionic-framework/packages/react-router/src/ReactRouter/IonRouter.tsx start=54
export const IonRouter = ({ children, registerHistoryListener }: PropsWithChildren<IonRouterProps>) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const didMountRef = useRef(false);
  const locationHistory = useRef(new LocationHistory());
  const currentTab = useRef<string | undefined>(undefined);
  const viewStack = useRef(new ReactRouterViewStack());
```

#### 3. **ReactRouterViewStack.tsx** (0003-react-router-view-stack.md)
- ✅ Manages view items with mount/unmount lifecycle
- ✅ Implements `getChildrenToRender` for rendering active views
- ✅ Handles route matching with parameter and wildcard support
- ✅ View reuse logic for navigation history
- ✅ Cleanup of stale view items to prevent memory leaks
- ✅ Navigate component special handling (unmount after redirect)

**Code Evidence:**
```typescript path=/Users/shane.king/code/ionic/ionic-framework/packages/react-router/src/ReactRouter/ReactRouterViewStack.tsx start=70
export class ReactRouterViewStack extends ViewStacks {
  private pendingViewItems: Map<string, ViewItem> = new Map();
  private deactivationQueue: Map<string, NodeJS.Timeout> = new Map();
  private viewItemCounter = 0;
```

#### 4. **StackManager.tsx** (0004-stack-manager.md)
- ✅ Page transition management with entering/leaving view detection
- ✅ Swipe-to-go-back gesture support
- ✅ Nested outlet support with parent path calculation
- ✅ Route matching for parameterized routes (e.g., `/user/:id`)
- ✅ Clone workaround for same-view transitions with different params
- ✅ Proper handling of index routes and relative routes

**Code Evidence:**
```typescript path=/Users/shane.king/code/ionic/ionic-framework/packages/react-router/src/ReactRouter/StackManager.tsx start=773
if (leavingViewItem && leavingViewItem.ionPageElement && enteringViewItem === leavingViewItem) {
  // If a page is transitioning to another version of itself
  // we clone it so we can have an animation to show
  // (e.g., `/user/1` → `/user/2`)
  const match = matchComponent(leavingViewItem.reactElement, routeInfo.pathname);
```

#### 5. **Router Variants**
- ✅ `IonReactRouter` using `BrowserRouter`
- ✅ `IonReactMemoryRouter` using `MemoryRouter`
- ✅ `IonReactHashRouter` using `HashRouter`

#### 6. **Test Infrastructure**
- ✅ Separate test apps for React Router 5 and 6
- ✅ Test pages covering:
  - Dynamic routes
  - Nested outlets
  - Tab navigation
  - Parameters (including nested params)
  - Replace actions
  - Swipe-to-go-back
  - Overlays
  - Multiple tabs
  - Dynamic tabs

---

## ⚠️ Gaps & Potential Issues

### 1. **Index Route Handling**
**Issue:** Complex logic in `ReactRouterViewStack` and `StackManager` for index routes may have edge cases.

**Evidence:**
```typescript path=/Users/shane.king/code/ionic/ionic-framework/packages/react-router/src/ReactRouter/ReactRouterViewStack.tsx start=54
const resolveIndexRouteMatch = (viewItem: ViewItem, pathname: string): PathMatch<string> | null => {
  if (!viewItem.routeData?.childProps?.index) {
    return null;
  }
  // Complex normalization logic...
}
```

**Risk:** Index routes in nested outlets may not behave consistently with React Router 6.

### 2. **Wildcard Route Precedence**
**Issue:** Multiple passes to sort and prioritize wildcard routes vs. specific routes.

**Evidence:** StackManager lines 876-904 implement custom sorting that may conflict with React Router 6's built-in matching.

**Risk:** Catch-all routes (`*`) may activate when they shouldn't, or vice versa.

### 3. **Type Safety**
**Issue:** Several `@types/react-router-dom@^5.x` types still in devDependencies but code uses RRv6.

**Evidence:**
```json path=/Users/shane.king/code/ionic/ionic-framework/packages/react-router/package.json start=55
"@types/react-router": "^5.0.3",
"@types/react-router-dom": "^5.1.5",
```

**Action Needed:** Update to `@types/react-router@6` and `@types/react-router-dom@6`.

### 4. **Unmount Behavior**
**Issue:** The `routeOptions.unmount` flag logic is custom and not part of standard React Router behavior.

**Risk:** May cause confusion for developers expecting standard React Router patterns.

### 5. **Documentation**
**Gap:** No public-facing documentation or migration guide for users.

**Action Needed:** Create migration guide following design doc 0001-upgrade-5-to-6.md.

### 6. **Testing Coverage**
**Gap:** No automated E2E tests running against React Router 6 test app visible in the diff.

**Action Needed:** Ensure Cypress/Playwright tests validate all navigation patterns.

---

## Current Work Status

### Recent Commits (Last 20)
1. ✅ Nested parameter access support
2. ✅ Redirect with replace routing (test app improvement)
3. ✅ Wildcard and parameter route matching improvements
4. ✅ Navigation stack reliability improvements
5. ✅ Memory/hash router migration issues addressed
6. ✅ Route params support added
7. ✅ Nested routes and redirection working

### What's Working
- ✅ Basic navigation (push/pop/replace)
- ✅ Tab navigation
- ✅ Nested outlets
- ✅ Route parameters (`:id` patterns)
- ✅ Wildcard routes
- ✅ Browser back/forward
- ✅ Swipe-to-go-back gesture
- ✅ Memory and hash router variants

### Known Issues from Commit Messages
1. ⚠️ "Fixing redirect for test app" - indicates redirect edge cases were problematic
2. ⚠️ "Addressing some migration issues" - vague, suggests unresolved items

---

## Objectives for Closed Alpha

### 🔴 Critical (Must Have)

1. **Type Safety Cleanup**
   - Update to `@types/react-router@6` and `@types/react-router-dom@6`
   - Remove or update any RRv5 type references
   - Fix TypeScript compilation errors

2. **Migration Guide**
   - Write comprehensive upgrade guide based on 0001-upgrade-5-to-6.md
   - Include breaking changes list
   - Provide code snippets for common patterns
   - Document API changes (component → element, exact removal, etc.)

3. **Automated Testing**
   - Ensure E2E test suite passes for React Router 6 test app
   - Add tests for edge cases:
     - Nested param routes
     - Index routes in nested outlets
     - Multiple wildcard routes
     - Tab context switching
     - Browser refresh on deep routes

4. **Known Bug Fixes**
   - Verify all "fixing" commits have corresponding tests
   - Document any workarounds or limitations
   - Test all navigation patterns manually

### 🟡 Important (Should Have)

5. **Performance Testing**
   - View item cleanup (currently 100-item limit) may need tuning
   - Test with many nested outlets
   - Test rapid navigation scenarios

6. **Developer Experience**
   - Clear error messages when routes misconfigured
   - Better debugging logs (or remove debug logs for production)
   - TypeScript autocomplete works correctly

7. **Edge Case Coverage**
   - Multiple router outlets at same level
   - Dynamic route addition/removal
   - Lazy-loaded route components
   - Redirects within nested outlets

### 🟢 Nice to Have

8. **Documentation**
   - API reference for new hooks
   - Comparison with standard React Router 6
   - Migration patterns for common Ionic React Router use cases

9. **Example Apps**
   - Tabs starter template updated to RRv6
   - Conference app example updated to RRv6

10. **Developer Tools**
    - React DevTools integration
    - Navigation history visualization

---

## Implementation Checklist for Alpha

### Pre-Alpha Blockers
- [ ] Fix TypeScript types (RRv5 → RRv6)
- [ ] Remove all debug `console.log` statements or gate with `NODE_ENV`
- [ ] Verify E2E tests pass
- [ ] Manual QA on test app for all navigation patterns
- [ ] Document breaking changes

### Alpha Requirements
- [ ] Migration guide published
- [ ] Known issues list created
- [ ] Example migration for conference app or similar
- [ ] Alpha disclaimer in README
- [ ] Community feedback mechanism (GitHub Discussions thread)

### Post-Alpha
- [ ] Performance benchmarking vs RRv5
- [ ] Memory leak testing
- [ ] Cross-browser testing (Safari, Firefox, Chrome)
- [ ] Mobile device testing (iOS/Android)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Index route bugs | Medium | High | Comprehensive testing of index routes |
| Route matching conflicts | Medium | High | Test all wildcard + specific route combos |
| Type errors in production | Low | Medium | Fix types before alpha |
| Migration confusion | High | Medium | Detailed migration guide |
| Breaking changes | High | High | Document all breaking changes |
| Performance regression | Low | Medium | Benchmark before release |

---

## Recommendation

**Ready for Closed Alpha:** 🟡 With Caveats

The branch shows strong alignment with the design documents and implements the core architecture correctly. However, before alpha release:

1. **Must fix TypeScript types** - This will cause developer pain
2. **Must create migration guide** - Users need clear upgrade path
3. **Must verify test coverage** - We need confidence in stability

**Timeline Suggestion:**
- 1-2 days: Type fixes + cleanup
- 2-3 days: Testing + bug fixes
- 1-2 days: Documentation
- **Total: ~1 week to alpha-ready**

**Alpha Scope:**
- Target advanced users / early adopters
- Focus on new projects (migration can come in beta)
- Clearly communicate breaking changes
- Set up feedback loop (GitHub Discussions)

---

## Next Steps

1. Review this analysis with team
2. Prioritize pre-alpha blockers
3. Assign tasks for alpha readiness
4. Set alpha release date
5. Prepare alpha announcement with clear expectations
