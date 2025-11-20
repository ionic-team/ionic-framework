/**
 * `IonRouter` is responsible for managing the application's navigation
 * state, tracking the history of visited routes, and coordinating
 * transitions between different views. It intercepts route changes from
 * React Router and translates them into actions that Ionic can understand
 * and animate.
 */

import type { AnimationBuilder, RouteAction, RouteInfo, RouteManagerContextState, RouterDirection } from '@ionic/react';
import { LocationHistory, NavManager, RouteManagerContext, generateId, getConfig } from '@ionic/react';
import type { Action as HistoryAction, Location as HistoryLocation } from 'history';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IonRouteInner } from './IonRouteInner';
import { ReactRouterViewStack } from './ReactRouterViewStack';
import StackManager from './StackManager';

export interface LocationState {
  direction?: RouterDirection;
  routerOptions?: { as?: string; unmount?: boolean };
}

interface IonRouterProps {
  registerHistoryListener: (cb: (location: HistoryLocation<any>, action: HistoryAction) => void) => void;
}

type RouteParams = Record<string, string | string[] | undefined>;

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

  const [routeInfo, setRouteInfo] = useState({
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
    registerHistoryListener(handleHistoryChange);

    didMountRef.current = true;
  }, []);

  useEffect(() => {
    const activeView = viewStack.current.findViewItemByRouteInfo(routeInfo, undefined, true);
    const matchedParams = activeView?.routeData.match?.params as RouteParams | undefined;

    if (matchedParams) {
      const paramsCopy = { ...matchedParams };
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
  const handleHistoryChange = (location: HistoryLocation<LocationState>, action: HistoryAction) => {
    let leavingLocationInfo: RouteInfo;
    /**
     * A programmatic navigation was triggered.
     * e.g., `<Redirect />`, `history.push()`, or `handleNavigate()`
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
    // Check if the URL has changed.
    if (leavingUrl !== location.pathname) {
      // An external navigation was triggered.
      if (!incomingRouteParams.current) {
        // Determine if the destination is a tab route by checking if it matches
        // the pattern of tab routes (containing /tabs/ in the path)
        const isTabRoute = /\/tabs(\/|$)/.test(location.pathname);
        let tabToUse = isTabRoute ? currentTab.current : undefined;

        // If we're leaving tabs entirely, clear the current tab
        if (!isTabRoute && currentTab.current) {
          currentTab.current = undefined;
          tabToUse = undefined;
        }

        /**
         * A `REPLACE` action can be triggered by React Router's
         * `<Redirect />` component.
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
         * button.
         */
        if (action === 'POP') {
          const currentRoute = locationHistory.current.current();
          /**
           * Check if the current route was "pushed" by a previous route
           * (indicates a linear history path).
           */
          if (currentRoute && currentRoute.pushedByRoute) {
            const prevInfo = locationHistory.current.findLastLocation(currentRoute);
            incomingRouteParams.current = { ...prevInfo, routeAction: 'pop', routeDirection: 'back' };
            // It's a non-linear history path like a direct link.
          } else {
            incomingRouteParams.current = {
              routeAction: 'pop',
              routeDirection: 'none',
              tab: tabToUse,
            };
          }
        }
        // Still found no params, set it to a default state of forward.
        if (!incomingRouteParams.current) {
          incomingRouteParams.current = {
            routeAction: 'push',
            routeDirection: location.state?.direction || 'forward',
            routeOptions: location.state?.routerOptions,
            tab: tabToUse,
          };
        }
      }

      let routeInfo: RouteInfo;

      // If we're navigating away from tabs to a non-tab route, clear the current tab
      if (!/\/tabs(\/|$)/.test(location.pathname) && currentTab.current) {
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
          params: (incomingRouteParams.current?.params as RouteParams | undefined) ?? {},
          prevRouteLastPathname: leavingLocationInfo.lastPathname, // The lastPathname of the route we are leaving
        };
        // It's a linear navigation.
        if (isPushed) {
          routeInfo.tab = leavingLocationInfo.tab;
          routeInfo.pushedByRoute = leavingLocationInfo.pathname;
          // Triggered by a browser back button or handleNavigateBack.
        } else if (routeInfo.routeAction === 'pop') {
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
          // This helps maintain correct back stack behavior within tabs.
          routeInfo.pushedByRoute = lastRoute?.pushedByRoute;
          // Triggered by `history.replace()` or a `<Redirect />` component, etc.
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

    // Reset for the next navigation.
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
      const newRouteInfo = { ...routeInfo };
      newRouteInfo.pathname = originalHref;
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
        incomingRouteParams.current = {
          ...routeParams,
          routeOptions,
        };

        navigate(routeInfo.pathname + (routeInfo.search || ''));
        /**
         * User is navigating to a different tab.
         * e.g., `/tabs/home` → `/tabs/settings`
         */
      } else {
        incomingRouteParams.current = {
          ...routeParams,
          pathname,
          search: search ? '?' + search : undefined,
          routeOptions,
        };

        navigate(pathname + (search ? '?' + search : ''));
      }
      // User has not navigated to this tab before.
    } else {
      handleNavigate(pathname, 'push', 'none', undefined, routeOptions, tab);
    }
  };

  /**
   * Set the current active tab in `locationHistory`.
   * This is crucial for maintaining tab history since each tab has
   * its own navigation stack.
   *
   * @param tab The tab to set as active.
   */
  const handleSetCurrentTab = (tab: string) => {
    currentTab.current = tab;
    const ri = { ...locationHistory.current.current() };
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
  const handleNavigateBack = (defaultHref: string | RouteInfo = '/', routeAnimation?: AnimationBuilder) => {
    const config = getConfig();
    defaultHref = defaultHref ? defaultHref : config && config.get('backButtonDefaultHref' as any);
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
        if (
          routeInfo.lastPathname === routeInfo.pushedByRoute ||
          /**
           * We need to exclude tab switches/tab
           * context changes here because tabbed
           * navigation is not linear, but router.back()
           * will go back in a linear fashion.
           */
          (prevInfo.pathname === routeInfo.pushedByRoute && routeInfo.tab === '' && prevInfo.tab === '')
        ) {
          navigate(-1);
        } else {
          /**
           * It's a non-linear back navigation.
           * e.g., direct link or tab switch or nested navigation with redirects
           */
          handleNavigate(prevInfo.pathname + (prevInfo.search || ''), 'pop', 'back', incomingAnimation);
        }
        /**
         * `pushedByRoute` exists, but no corresponding previous entry in
         * the history stack.
         */
      } else {
        handleNavigate(defaultHref as string, 'pop', 'back', routeAnimation);
      }
      /**
       * No `pushedByRoute`
       * e.g., initial page load
       */
    } else {
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
    // check if the destination path is outside of the current tab context
    if (!tab && currentTab.current && path) {
      // Get the current route info to understand where we are
      const currentRoute = locationHistory.current.current();

      // If we're navigating from a tab route to a completely different path structure,
      // we should clear the tab context. This is a simplified check that assumes
      // tab routes share a common parent path.
      if (currentRoute && currentRoute.pathname) {
        // Extract the base tab path (e.g., /routing/tabs from /routing/tabs/home)
        const tabBaseMatch = currentRoute.pathname.match(/^(.*\/tabs)/);
        if (tabBaseMatch) {
          const tabBasePath = tabBaseMatch[1];
          // If the new path doesn't start with the tab base path, we're leaving tabs
          if (!path.startsWith(tabBasePath)) {
            currentTab.current = undefined;
            navigationTab = undefined;
          } else {
            // Still within tabs, preserve the tab context
            navigationTab = currentTab.current;
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
        ionRedirect={{}}
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
