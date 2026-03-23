/**
 * `IonRouter` is responsible for managing the application's navigation
 * state, tracking the history of visited routes, and coordinating
 * transitions between different views. It intercepts route changes from
 * React Router and translates them into actions that Ionic can understand
 * and animate.
 */

import type {
  AnimationBuilder,
  RouteAction,
  RouteInfo,
  RouteManagerContextState,
  RouterDirection,
  RouterOptions,
} from '@ionic/react';
import { LocationHistory, NavManager, RouteManagerContext, generateId, getConfig } from '@ionic/react';
import type { Action as HistoryAction, Location } from 'history';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IonRouteInner } from './IonRouteInner';
import { ReactRouterViewStack } from './ReactRouterViewStack';
import StackManager from './StackManager';

// Use Location directly - state is typed as `unknown` in history v5
type HistoryLocation = Location;

export interface LocationState {
  direction?: RouterDirection;
  routerOptions?: RouterOptions;
}

interface IonRouterProps {
  registerHistoryListener: (cb: (location: HistoryLocation, action: HistoryAction) => void) => void;
}

type RouteParams = Record<string, string | string[] | undefined>;
type SafeRouteParams = Record<string, string | string[]>;

const filterUndefinedParams = (params: RouteParams): SafeRouteParams => {
  const result: SafeRouteParams = {};
  for (const key of Object.keys(params)) {
    const value = params[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Checks if a POP event is a multi-step back navigation (navigate(-n) where n > 1).
 * Walks the pushedByRoute chain from prevInfo to verify the destination is an ancestor
 * in the same navigation chain. This distinguishes multi-step back from tab-crossing
 * back navigation where prevInfo.pathname also differs from the browser destination.
 */
const checkIsMultiStepBack = (
  prevInfo: RouteInfo | undefined,
  destinationPathname: string,
  history: LocationHistory
): boolean => {
  if (!prevInfo || prevInfo.pathname === destinationPathname) return false;
  const visited = new Set<string>();
  let walker: RouteInfo | undefined = prevInfo;
  while (walker?.pushedByRoute) {
    if (visited.has(walker.id)) break; // cycle guard
    visited.add(walker.id);
    if (walker.pushedByRoute === destinationPathname) return true;
    walker = history.findLastLocation(walker);
  }
  return false;
};

const areParamsEqual = (a?: RouteParams, b?: RouteParams) => {
  const paramsA = a || {};
  const paramsB = b || {};
  const keysA = Object.keys(paramsA);
  const keysB = Object.keys(paramsB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => {
    const valueA = paramsA[key];
    const valueB = paramsB[key];
    if (Array.isArray(valueA) && Array.isArray(valueB)) {
      if (valueA.length !== valueB.length) {
        return false;
      }
      return valueA.every((entry, idx) => entry === valueB[idx]);
    }
    return valueA === valueB;
  });
};

export const IonRouter = ({ children, registerHistoryListener }: PropsWithChildren<IonRouterProps>) => {
  const location = useLocation();
  const navigate = useNavigate();

  const didMountRef = useRef(false);
  const locationHistory = useRef(new LocationHistory());
  const currentTab = useRef<string | undefined>(undefined);
  const viewStack = useRef(new ReactRouterViewStack());
  const incomingRouteParams = useRef<Partial<RouteInfo> | null>(null);
  /**
   * Tracks location keys that the user navigated away from via browser back.
   * When a POP event's destination key matches the top of this stack, it's a
   * browser forward navigation. Uses React Router's unique location.key
   * instead of URLs to correctly handle duplicate URLs in history (e.g.,
   * navigating to /details, then /settings, then /details via routerLink,
   * then pressing back).
   * Cleared on PUSH (new navigation invalidates forward history).
   */
  const forwardStack = useRef<string[]>([]);
  /**
   * Tracks the current location key so we can push it onto the forward stack
   * when navigating back. Updated after each history change.
   */
  const currentLocationKeyRef = useRef<string>(location.key);

  const [routeInfo, setRouteInfo] = useState<RouteInfo>({
    id: generateId('routeInfo'),
    pathname: location.pathname,
    search: location.search,
    params: {},
  });

  useEffect(() => {
    if (didMountRef.current) {
      return;
    }

    // Seed the history stack with the initial location and begin listening
    // for future navigations once React has committed the mount. This avoids
    // duplicate entries when React StrictMode runs an extra render pre-commit.
    locationHistory.current.add(routeInfo);

    // If IonTabBar already called handleSetCurrentTab during render (before this
    // effect), the tab was stored in currentTab.current but the history entry was
    // not yet seeded. Apply the pending tab to the seed entry now.
    if (currentTab.current) {
      const ri = { ...locationHistory.current.current() };
      if (ri.tab !== currentTab.current) {
        ri.tab = currentTab.current;
        locationHistory.current.update(ri);
      }
    }

    registerHistoryListener(handleHistoryChange);

    didMountRef.current = true;
  }, []);

  // Sync route params extracted by React Router's path matching back into routeInfo.
  // The view stack's match may contain params (e.g., :id) not present in the initial routeInfo.
  useEffect(() => {
    const activeView = viewStack.current.findViewItemByRouteInfo(routeInfo, undefined, true);
    const matchedParams = activeView?.routeData.match?.params as RouteParams | undefined;

    if (matchedParams) {
      const paramsCopy = filterUndefinedParams({ ...matchedParams });
      if (areParamsEqual(routeInfo.params as RouteParams | undefined, paramsCopy)) {
        return;
      }

      const updatedRouteInfo: RouteInfo = {
        ...routeInfo,
        params: paramsCopy,
      };
      locationHistory.current.update(updatedRouteInfo);
      setRouteInfo(updatedRouteInfo);
    }
  }, [routeInfo]);

  /**
   * Triggered whenever the history changes, either through user navigation
   * or programmatic changes. It transforms the raw browser history changes
   * into `RouteInfo` objects, which are needed Ionic's animations and
   * navigation patterns.
   *
   * @param location The current location object from the history.
   * @param action The action that triggered the history change.
   */
  const handleHistoryChange = (location: HistoryLocation, action: HistoryAction) => {
    let leavingLocationInfo: RouteInfo;
    /**
     * A programmatic navigation was triggered.
     * e.g., `<Navigate />`, `navigate()`, or `handleNavigate()`
     */
    if (incomingRouteParams.current) {
      /**
       * The current history entry is overwritten, so the previous entry
       * is the one we are leaving.
       */
      if (incomingRouteParams.current?.routeAction === 'replace') {
        leavingLocationInfo = locationHistory.current.previous();
      } else {
        // If the action is 'push' or 'pop', we want to use the current route.
        leavingLocationInfo = locationHistory.current.current();
      }
    } else {
      /**
       * An external navigation was triggered
       * e.g., browser back/forward button or direct link
       *
       * The leaving location is the current route.
       */
      leavingLocationInfo = locationHistory.current.current();
    }

    const leavingUrl = leavingLocationInfo.pathname + leavingLocationInfo.search;
    if (leavingUrl !== location.pathname + location.search) {
      if (!incomingRouteParams.current) {
        // Use history-based tab detection instead of URL-pattern heuristics,
        // so tab routes work with any URL structure (not just paths containing "/tabs").
        // Fall back to currentTab.current only when the destination is within the
        // current tab's path hierarchy (prevents non-tab routes from inheriting a tab).
        let tabToUse = locationHistory.current.findTabForPathname(location.pathname);
        if (!tabToUse && currentTab.current) {
          const tabFirstRoute = locationHistory.current.getFirstRouteInfoForTab(currentTab.current);
          const tabRootPath = tabFirstRoute?.pathname;
          if (tabRootPath && (location.pathname === tabRootPath || location.pathname.startsWith(tabRootPath + '/'))) {
            tabToUse = currentTab.current;
          }
        }

        /**
         * A `REPLACE` action can be triggered by React Router's
         * `<Navigate />` component.
         */
        if (action === 'REPLACE') {
          incomingRouteParams.current = {
            routeAction: 'replace',
            routeDirection: 'none',
            tab: tabToUse,
          };
        }
        /**
         * A `POP` action can be triggered by the browser's back/forward
         * button. Both fire as POP events, so we use a forward stack to
         * distinguish them: when going back, we push the leaving pathname
         * onto the stack. When the next POP's destination matches the top
         * of the stack, it's a forward navigation.
         */
        if (action === 'POP') {
          const currentRoute = locationHistory.current.current();
          const isForwardNavigation =
            forwardStack.current.length > 0 &&
            forwardStack.current[forwardStack.current.length - 1] === location.key;

          if (isForwardNavigation) {
            forwardStack.current.pop();
            incomingRouteParams.current = {
              routeAction: 'push',
              routeDirection: 'forward',
              tab: tabToUse,
            };
          } else if (currentRoute && currentRoute.pushedByRoute) {
            // Back navigation. Record current location key for potential forward
            forwardStack.current.push(currentLocationKeyRef.current);
            const prevInfo = locationHistory.current.findLastLocation(currentRoute);

            const isMultiStepBack = checkIsMultiStepBack(prevInfo, location.pathname, locationHistory.current);

            if (isMultiStepBack) {
              const destinationInfo = locationHistory.current.findLastLocationByPathname(location.pathname);
              incomingRouteParams.current = {
                ...(destinationInfo || {}),
                routeAction: 'pop',
                routeDirection: 'back',
              };
            } else if (prevInfo && prevInfo.pathname !== location.pathname && currentRoute.tab) {
              // Browser POP destination differs from within-tab back target.
              // Sync URL via replace, like handleNavigateBack's non-linear path (#25141).
              incomingRouteParams.current = { ...prevInfo, routeAction: 'pop', routeDirection: 'back' };
              forwardStack.current = [];
              handleNavigate(prevInfo.pathname + (prevInfo.search || ''), 'pop', 'back', undefined, undefined, prevInfo.tab);
              return;
            } else {
              incomingRouteParams.current = { ...prevInfo, routeAction: 'pop', routeDirection: 'back' };
            }
          } else {
            // It's a non-linear history path like a direct link.
            // Still push the current location key so browser forward is detectable.
            forwardStack.current.push(currentLocationKeyRef.current);
            incomingRouteParams.current = {
              routeAction: 'pop',
              routeDirection: 'none',
              tab: tabToUse,
            };
          }
        }
        if (!incomingRouteParams.current) {
          const state = location.state as LocationState | null;
          incomingRouteParams.current = {
            routeAction: 'push',
            routeDirection: state?.direction || 'forward',
            routeOptions: state?.routerOptions,
            tab: tabToUse,
          };
        }
      }

      // New navigation (PUSH) invalidates browser forward history,
      // so clear our forward stack to stay in sync.
      if (action === 'PUSH') {
        forwardStack.current = [];
      }

      let routeInfo: RouteInfo;

      // If we're navigating away from tabs to a non-tab route, clear the current tab
      if (!locationHistory.current.findTabForPathname(location.pathname) && currentTab.current) {
        currentTab.current = undefined;
      }

      /**
       * An existing id indicates that it's re-activating an existing route.
       * e.g., tab switching or navigating back to a previous route
       */
      if (incomingRouteParams.current?.id) {
        routeInfo = {
          ...(incomingRouteParams.current as RouteInfo),
          lastPathname: leavingLocationInfo.pathname,
        };
        locationHistory.current.add(routeInfo);
        /**
         * A new route is being created since it's not re-activating
         * an existing route.
         */
      } else {
        const isPushed =
          incomingRouteParams.current?.routeAction === 'push' &&
          incomingRouteParams.current.routeDirection === 'forward';
        routeInfo = {
          id: generateId('routeInfo'),
          ...incomingRouteParams.current,
          lastPathname: leavingLocationInfo.pathname, // The URL we just came from
          pathname: location.pathname, // The current (destination) URL
          search: location.search,
          params: incomingRouteParams.current?.params
            ? filterUndefinedParams(incomingRouteParams.current.params as RouteParams)
            : {},
          prevRouteLastPathname: leavingLocationInfo.lastPathname,
        };
        if (isPushed) {
          // Only inherit tab from leaving route if we don't already have one.
          // This preserves tab context for same-tab navigation while allowing cross-tab navigation.
          routeInfo.tab = routeInfo.tab || leavingLocationInfo.tab;
          routeInfo.pushedByRoute = leavingLocationInfo.pathname;
        } else if (
          routeInfo.routeAction === 'push' &&
          routeInfo.routeDirection === 'none' &&
          routeInfo.tab === leavingLocationInfo.tab
        ) {
          // Push with routerDirection="none" within the same tab (or non-tab) context.
          // Still needs pushedByRoute so the back button can navigate back correctly.
          // Cross-tab navigations with direction "none" are handled by the tab-switching
          // block below which has different pushedByRoute semantics.
          routeInfo.tab = routeInfo.tab || leavingLocationInfo.tab;
          routeInfo.pushedByRoute = leavingLocationInfo.pathname;
        } else if (routeInfo.routeAction === 'pop') {
          // Triggered by a browser back button or handleNavigateBack.
          // Find the route that pushed this one.
          const r = locationHistory.current.findLastLocation(routeInfo);
          routeInfo.pushedByRoute = r?.pushedByRoute;
          // Navigating to a new tab.
        } else if (routeInfo.routeAction === 'push' && routeInfo.tab !== leavingLocationInfo.tab) {
          /**
           * If we are switching tabs grab the last route info for the
           * tab and use its `pushedByRoute`.
           */
          const lastRoute = locationHistory.current.getCurrentRouteInfoForTab(routeInfo.tab);
          /**
           * Tab bar switches (direction 'none') should not create cross-tab back
           * navigation. Only inherit pushedByRoute from the tab's own history.
           */
          if (routeInfo.routeDirection === 'none') {
            routeInfo.pushedByRoute = lastRoute?.pushedByRoute;
          } else {
            routeInfo.pushedByRoute = lastRoute?.pushedByRoute ?? leavingLocationInfo.pathname;
          }
          // Triggered by `navigate()` with replace or a `<Navigate />` component, etc.
        } else if (routeInfo.routeAction === 'replace') {
          /**
           * Make sure to set the `lastPathname`, etc.. to the current route
           * so the page transitions out.
           */
          const currentRouteInfo = locationHistory.current.current();

          /**
           * Special handling for `replace` to ensure correct `pushedByRoute`
           * and `lastPathname`.
           *
           * If going from `/home` to `/child`, then replacing from
           * `/child` to `/home`, we don't want the route info to
           * say that `/home` was pushed by `/home` which is not correct.
           */
          const currentPushedBy = currentRouteInfo?.pushedByRoute;
          const pushedByRoute =
            currentPushedBy !== undefined && currentPushedBy !== routeInfo.pathname
              ? currentPushedBy
              : routeInfo.pushedByRoute;

          routeInfo.lastPathname = currentRouteInfo?.pathname || routeInfo.lastPathname;
          routeInfo.prevRouteLastPathname = currentRouteInfo?.lastPathname;
          routeInfo.pushedByRoute = pushedByRoute;

          /**
           * When replacing routes we should still prefer
           * any custom direction/animation that the developer
           * has specified when navigating first instead of relying
           * on previously used directions/animations.
           */
          routeInfo.routeDirection = routeInfo.routeDirection || currentRouteInfo?.routeDirection;
          routeInfo.routeAnimation = routeInfo.routeAnimation || currentRouteInfo?.routeAnimation;
        }

        locationHistory.current.add(routeInfo);
      }
      setRouteInfo(routeInfo);
    }

    // Update the current location key after processing the history change.
    // This ensures the forward stack records the correct key when navigating back.
    currentLocationKeyRef.current = location.key;
    incomingRouteParams.current = null;
  };

  /**
   * Resets the specified tab to its initial, root route.
   *
   * @param tab The tab to reset.
   * @param originalHref The original href for the tab.
   * @param originalRouteOptions The original route options for the tab.
   */
  const handleResetTab = (tab: string, originalHref: string, originalRouteOptions: any) => {
    const routeInfo = locationHistory.current.getFirstRouteInfoForTab(tab);
    if (routeInfo) {
      const [pathname, search] = originalHref.split('?');
      const newRouteInfo = { ...routeInfo };
      newRouteInfo.pathname = pathname;
      newRouteInfo.search = search ? '?' + search : '';
      newRouteInfo.routeOptions = originalRouteOptions;
      incomingRouteParams.current = { ...newRouteInfo, routeAction: 'pop', routeDirection: 'back' };
      navigate(newRouteInfo.pathname + (newRouteInfo.search || ''));
    }
  };

  /**
   * Handles tab changes.
   *
   * @param tab The tab to switch to.
   * @param path The new path for the tab.
   * @param routeOptions Additional route options.
   */
  const handleChangeTab = (tab: string, path?: string, routeOptions?: any) => {
    if (!path) {
      return;
    }

    const routeInfo = locationHistory.current.getCurrentRouteInfoForTab(tab);
    const [pathname, search] = path.split('?');
    // User has navigated to the current tab before.
    if (routeInfo) {
      const routeParams = {
        ...routeInfo,
        routeAction: 'push' as RouteAction,
        routeDirection: 'none' as RouterDirection,
      };
      /**
       * User is navigating to the same tab.
       * e.g., `/tabs/home` → `/tabs/home`
       */
      if (routeInfo.pathname === pathname) {
        const newSearch = search ? '?' + search : routeInfo.search;
        incomingRouteParams.current = {
          ...routeParams,
          search: newSearch || '',
          routeOptions,
        };

        navigate(routeInfo.pathname + (newSearch || ''));
        /**
         * User is navigating to a different tab.
         * e.g., `/tabs/home` → `/tabs/settings`
         */
      } else {
        incomingRouteParams.current = {
          ...routeParams,
          pathname,
          search: search ? '?' + search : '',
          routeOptions,
        };

        navigate(pathname + (search ? '?' + search : ''));
      }
      // User has not navigated to this tab before.
    } else {
      const fullPath = pathname + (search ? '?' + search : '');
      handleNavigate(fullPath, 'push', 'none', undefined, routeOptions, tab);
    }
  };

  /**
   * Set the current active tab in `locationHistory`.
   * This is crucial for maintaining tab history since each tab has
   * its own navigation stack.
   *
   * @param tab The tab to set as active.
   */
  const handleSetCurrentTab = (tab: string, _routeInfo?: RouteInfo) => {
    currentTab.current = tab;
    const current = locationHistory.current.current();
    if (!current) {
      // locationHistory not yet seeded (e.g., called during initial render
      // before mount effect). The mount effect will seed the correct entry.
      return;
    }
    const ri = { ...current };
    if (ri.tab !== tab) {
      ri.tab = tab;
      locationHistory.current.update(ri);
    }
  };

  /**
   * Handles the native back button press.
   * It's usually called when a user presses the platform-native back action.
   */
  const handleNativeBack = () => {
    navigate(-1);
  };

  /**
   * Used to manage the back navigation within the Ionic React's routing
   * system. It's deeply integrated with Ionic's view lifecycle, animations,
   * and its custom history tracking (`locationHistory`) to provide a
   * native-like transition and maintain correct application state.
   *
   * @param defaultHref The fallback URL to navigate to if there's no
   * previous entry in the `locationHistory` stack.
   * @param routeAnimation A custom animation builder to override the
   * default "back" animation.
   */
  const handleNavigateBack = (defaultHref?: string | RouteInfo, routeAnimation?: AnimationBuilder) => {
    const config = getConfig();
    defaultHref = defaultHref ?? (config && config.get('backButtonDefaultHref' as any));
    const routeInfo = locationHistory.current.current();
    // It's a linear navigation.
    if (routeInfo && routeInfo.pushedByRoute) {
      const prevInfo = locationHistory.current.findLastLocation(routeInfo);
      if (prevInfo) {
        /**
         * This needs to be passed to handleNavigate
         * otherwise incomingRouteParams.routeAnimation
         * will be overridden.
         */
        const incomingAnimation = routeAnimation || routeInfo.routeAnimation;
        incomingRouteParams.current = {
          ...prevInfo,
          routeAction: 'pop',
          routeDirection: 'back',
          routeAnimation: incomingAnimation,
        };
        /**
         * Check if it's a simple linear back navigation (not tabbed).
         * e.g., `/home` → `/settings` → back to `/home`
         */
        const condition1 = routeInfo.lastPathname === routeInfo.pushedByRoute;
        const condition2 = prevInfo.pathname === routeInfo.pushedByRoute && !routeInfo.tab && !prevInfo.tab;
        if (condition1 || condition2) {
          // Record the current location key so browser forward is detectable
          forwardStack.current.push(currentLocationKeyRef.current);
          navigate(-1);
        } else {
          /**
           * It's a non-linear back navigation.
           * e.g., direct link or tab switch or nested navigation with redirects
           * Clear forward stack since the REPLACE-based navigate resets history
           * position, making any prior forward entries unreachable.
           */
          forwardStack.current = [];
          handleNavigate(prevInfo.pathname + (prevInfo.search || ''), 'pop', 'back', incomingAnimation);
        }
        /**
         * `pushedByRoute` exists, but no corresponding previous entry in
         * the history stack.
         */
      } else if (defaultHref) {
        handleNavigate(defaultHref as string, 'pop', 'back', routeAnimation);
      }
      /**
       * No `pushedByRoute` (e.g., initial page load or tab root).
       * Navigate to defaultHref so the back button works on direct
       * deep-link loads (e.g., loading /tab1/child directly).
       * Only navigate when defaultHref is explicitly set. The core
       * back-button component hides itself when no defaultHref is
       * provided, so a click here means the user set one intentionally.
       */
    } else if (defaultHref) {
      handleNavigate(defaultHref as string, 'pop', 'back', routeAnimation);
    }
  };

  /**
   * Used to programmatically navigate through the app.
   *
   * @param path The path to navigate to.
   * @param routeAction The action to take (push, replace, etc.).
   * @param routeDirection The direction of the navigation (forward,
   * back, etc.).
   * @param routeAnimation The animation to use for the transition.
   * @param routeOptions Additional options for the route.
   * @param tab The tab to navigate to, if applicable.
   */
  const handleNavigate = (
    path: string,
    routeAction: RouteAction,
    routeDirection?: RouterDirection,
    routeAnimation?: AnimationBuilder,
    routeOptions?: any,
    tab?: string
  ) => {
    const normalizedRouteDirection =
      routeAction === 'push' && routeDirection === undefined ? 'forward' : routeDirection;

    // When navigating from tabs context, we need to determine if the destination
    // is also within tabs. If not, we should clear the tab context.
    let navigationTab = tab;

    // If no explicit tab is provided and we're in a tab context,
    // check if the destination path is outside of the current tab context.
    // Uses history-based tab detection instead of URL pattern matching,
    // so it works with any tab URL structure.
    if (!tab && currentTab.current && path) {
      // Check if destination was previously visited in a tab context
      const destinationTab = locationHistory.current.findTabForPathname(path);
      if (destinationTab) {
        // Previously visited as a tab route - use the known tab
        navigationTab = destinationTab;
      } else {
        // New destination - check if it's a child of the current tab's root path
        const tabFirstRoute = locationHistory.current.getFirstRouteInfoForTab(currentTab.current);
        if (tabFirstRoute) {
          const tabRootPath = tabFirstRoute.pathname;
          if (path === tabRootPath || path.startsWith(tabRootPath + '/')) {
            // Still within the current tab's path hierarchy
            navigationTab = currentTab.current;
          } else {
            // Destination is outside the current tab context
            currentTab.current = undefined;
            navigationTab = undefined;
          }
        }
      }
    }

    const baseParams = incomingRouteParams.current ?? {};
    incomingRouteParams.current = {
      ...baseParams,
      routeAction,
      routeDirection: normalizedRouteDirection,
      routeOptions,
      routeAnimation,
      tab: navigationTab,
    };

    navigate(path, { replace: routeAction !== 'push' });
  };

  const routeMangerContextValue: RouteManagerContextState = {
    canGoBack: () => locationHistory.current.canGoBack(),
    clearOutlet: viewStack.current.clear,
    findViewItemByPathname: viewStack.current.findViewItemByPathname,
    getChildrenToRender: viewStack.current.getChildrenToRender,
    getViewItemsForOutlet: viewStack.current.getViewItemsForOutlet.bind(viewStack.current),
    goBack: () => handleNavigateBack(),
    createViewItem: viewStack.current.createViewItem,
    findViewItemByRouteInfo: viewStack.current.findViewItemByRouteInfo,
    findLeavingViewItemByRouteInfo: viewStack.current.findLeavingViewItemByRouteInfo,
    addViewItem: viewStack.current.add,
    unMountViewItem: viewStack.current.remove,
  };

  return (
    <RouteManagerContext.Provider value={routeMangerContextValue}>
      <NavManager
        ionRoute={IonRouteInner}
        stackManager={StackManager}
        routeInfo={routeInfo}
        onNativeBack={handleNativeBack}
        onNavigateBack={handleNavigateBack}
        onNavigate={handleNavigate}
        onSetCurrentTab={handleSetCurrentTab}
        onChangeTab={handleChangeTab}
        onResetTab={handleResetTab}
        locationHistory={locationHistory.current}
      >
        {children}
      </NavManager>
    </RouteManagerContext.Provider>
  );
};

IonRouter.displayName = 'IonRouter';
