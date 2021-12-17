import {
  parseQuery,
  Router,
  RouteLocationNormalized,
  NavigationFailure
} from 'vue-router';
import { createLocationHistory } from './locationHistory';
import { generateId } from './utils';
import {
  ExternalNavigationOptions,
  RouteInfo,
  RouteParams,
  RouteAction,
  RouteDirection,
  IonicVueRouterOptions,
  NavigationInformation
} from './types';
import { AnimationBuilder } from '@ionic/vue';

//@TODO: declare types
export const createIonRouter = (opts: IonicVueRouterOptions, router: Router) => {
  let currentNavigationInfo: NavigationInformation = { direction: undefined, action: undefined, delta: undefined };

  /**
   * Ionic Vue should only react to navigation
   * changes once they have been confirmed and should
   * never affect the outcome of navigation (with the
   * exception of going back or selecting a tab).
   * As a result, we should do our work in afterEach
   * which is fired once navigation is confirmed
   * and any user guards have run.
   */
  router.afterEach((to: RouteLocationNormalized, _: RouteLocationNormalized, failure?: NavigationFailure) => {
    if (failure) return;

    const { direction, action, delta } = currentNavigationInfo;

    /**
     * When calling router.replace, we are not informed
     * about the replace action in opts.history.listen
     * but we can check to see if the latest routing action
     * was a replace action by looking at the history state.
     * We need to use opts.history rather than window.history
     * because window.history will be undefined when using SSR.
     */

    currentHistoryPosition = opts.history.state.position as number;

    const replaceAction = opts.history.state.replaced ? 'replace' : undefined;
    handleHistoryChange(to, action || replaceAction, direction, delta);

    currentNavigationInfo = { direction: undefined, action: undefined, delta: undefined };
  });

  const locationHistory = createLocationHistory();

  /**
   * Keeping track of the history position
   * allows us to determine if a user is pushing
   * new pages or updating history via the forward
   * and back browser buttons.
   */
  const initialHistoryPosition = opts.history.state.position as number;
  let currentHistoryPosition = opts.history.state.position as number;

  let currentRouteInfo: RouteInfo;
  let incomingRouteParams: RouteParams;
  let currentTab: string | undefined;

  // TODO types
  let historyChangeListeners: any[] = [];

  if (typeof (document as any) !== 'undefined') {
    document.addEventListener('ionBackButton', (ev: Event) => {
      (ev as any).detail.register(0, (processNextHandler: () => void) => {
        opts.history.go(-1);
        processNextHandler();
      });
    })
  }

  opts.history.listen((_: any, _x: any, info: any) => {
    /**
     * history.listen only fires on certain
     * event such as when the user clicks the
     * browser back button. It also gives us
     * additional information as to the type
     * of navigation (forward, backward, etc).
     *
     * We can use this to better handle the
     * `handleHistoryChange` call in
     * router.beforeEach
     */
    currentNavigationInfo = {
      delta: info.delta,

      /**
       * Both the browser forward and backward actions
       * are considered "pop" actions, but when going forward
       * we want to make sure the forward animation is used.
       */
      action: (info.type === 'pop' && info.delta >= 1) ? 'push' : info.type,
      direction: info.direction === '' ? 'forward' : info.direction
    };
  });

  /**
   *
   * @param defaultHref
   * @param routerAnimation
   */
  const handleNavigateBack = (defaultHref?: string, routerAnimation?: AnimationBuilder) => {
    // todo grab default back button href from config
    const routeInfo = locationHistory.current(initialHistoryPosition, currentHistoryPosition);
    const hasRoute = routeInfo !== undefined;
    const wasRoutePushed = hasRoute && routeInfo.pushedByRoute !== undefined;

    if (!hasRoute || !wasRoutePushed) {
      return handleNavigate(defaultHref, 'pop', 'back');
    }

    const lastLocation = locationHistory.findLastLocation(routeInfo);
    const hasLastLocation = lastLocation !== undefined;
    if (hasLastLocation === false) {
      return handleNavigate(defaultHref, 'pop', 'back');
    }

    incomingRouteParams = {
      ...lastLocation,
      routerAction: 'pop',
      routerDirection: 'back',
      routerAnimation: routerAnimation || routeInfo.routerAnimation
    };
    const wasPushedByLastPath = routeInfo.lastPathname === routeInfo.pushedByRoute;
    const isCurrentPushedByLast = lastLocation.pathname === routeInfo.pushedByRoute;
    const isLastNotTab = lastLocation.tab === '';
    const isNotTab = routeInfo.tab === '';
    if (wasPushedByLastPath ||
      (
        /**
         * We need to exclude tab switches/tab
         * context changes here because tabbed
         * navigation is not linear, but router.back()
         * will go back in a linear fashion.
         */
        isCurrentPushedByLast && isNotTab && isLastNotTab
      )
    ) {
      router.back();
    } else {
      router.replace({ path: lastLocation.pathname, query: parseQuery(lastLocation.search) });
    }
  }

  const handleNavigate = (path: string, routerAction?: RouteAction, routerDirection?: RouteDirection, routerAnimation?: AnimationBuilder, tab?: string) => {
    incomingRouteParams = {
      routerAction,
      routerDirection,
      routerAnimation,
      tab
    }

    if (routerAction === 'push') {
      router.push(path);
    } else {
      router.replace(path);
    }
  }

  // TODO RouteLocationNormalized
  const handleHistoryChange = (
    location: any,
    action?: RouteAction,
    direction?: RouteDirection,
    delta?: number
  ) => {
    let leavingRouteInfo: RouteInfo;
    if (incomingRouteParams) {
      if (incomingRouteParams.routerAction === 'replace') {
        leavingRouteInfo = locationHistory.previous();
      } else if (incomingRouteParams.routerAction === 'pop') {
        leavingRouteInfo = locationHistory.current(initialHistoryPosition, currentHistoryPosition + 1);
      } else {
        leavingRouteInfo = locationHistory.current(initialHistoryPosition, currentHistoryPosition - 1);
      }
    } else {
      leavingRouteInfo = currentRouteInfo;
    }

    if (leavingRouteInfo === undefined) {
      leavingRouteInfo = {
        pathname: '',
        search: ''
      }
    }

    const leavingUrl = leavingRouteInfo.pathname + leavingRouteInfo.search;
    const isNewRoute = leavingUrl !== location.fullPath;

    let nextRouteInfo: RouteInfo;
    if (isNewRoute) {
      if (!incomingRouteParams) {
        if (action === 'replace') {
          incomingRouteParams = {
            routerAction: 'replace',
            routerDirection: 'none',
            tab: currentTab
          }
        } else if (action === 'pop') {
          const routeInfo = locationHistory.current(initialHistoryPosition, currentHistoryPosition - delta);

          if (routeInfo && routeInfo.pushedByRoute) {
            const prevRouteInfo = locationHistory.findLastLocation(routeInfo, delta);
            incomingRouteParams = {
              ...prevRouteInfo,
              routerAction: 'pop',
              routerDirection: 'back'
            };
          } else {
            incomingRouteParams = {
              routerAction: 'pop',
              routerDirection: 'none',
              tab: currentTab
            }
          }
        }
        if (!incomingRouteParams) {
          incomingRouteParams = {
            routerAction: 'push',
            routerDirection: direction || 'forward',
            tab: currentTab
          }
        }
      }
      nextRouteInfo = {
        ...incomingRouteParams,
        id: generateId('routeInfo'),
        replacedRoute: undefined,//reset to undefined
        pathname: location.path,
        search: location.fullPath && location.fullPath.split('?')[1] || '',
        params: location.params && location.params,
      }

      const isNewTab = nextRouteInfo.tab !== leavingRouteInfo.tab;
      const isPushed = incomingRouteParams.routerAction === 'push' && incomingRouteParams.routerDirection === 'forward';
      if (isPushed) {
        /**
         * Push/Forward occurs whenever navigating forward, page -> page/a -> page/b
         *
         * Going to page/a and page/b would be push events
         */
        nextRouteInfo.lastPathname = leavingRouteInfo.pathname;
        nextRouteInfo.tab = leavingRouteInfo.tab;
        //@TODO: Check if bug, why would pathname be blank?
        nextRouteInfo.pushedByRoute = (leavingRouteInfo.pathname !== '') ? leavingRouteInfo.pathname : undefined;
      } else if (nextRouteInfo.routerAction === 'pop') {
        /**
         * Pop can occur by the user going from page -> page/a -> page/b -> page/a
         *
         * Going back from page/b to page/a would be a `pop` action
         */
        //could point to itself
        nextRouteInfo.prevRouteLastPathname = leavingRouteInfo?.lastPathname;
        nextRouteInfo.routerAnimation = leavingRouteInfo?.routerAnimation;
        nextRouteInfo.pushedByRoute = leavingRouteInfo?.pathname;
        nextRouteInfo.lastPathname = leavingRouteInfo?.pathname;
      } else if (nextRouteInfo.routerAction === 'push' && isNewTab) {
        // const lastTabRouteInfo = locationHistory.getCurrentRouteInfoForTab(nextRouteInfo.tab);
        nextRouteInfo.pushedByRoute = (leavingRouteInfo.pathname !== '') ? leavingRouteInfo.pathname : undefined;
        nextRouteInfo.lastPathname = leavingRouteInfo.pathname;
      } else if (nextRouteInfo.routerAction === 'replace') {
        /**
         * Replace occurs when replacing a route, page -> page/a -(replace)-> page/b
         * The history stack would have page -> page/b as page/a was replaced with page/b
         */
        const lastRouteInfo = locationHistory.last();
        //the last item could be wrong for replacedRoute, we only care about the route we are leaving to define this
        nextRouteInfo.replacedRoute = (leavingRouteInfo?.pathname === '') ? undefined : leavingRouteInfo?.pathname;

        nextRouteInfo.lastPathname = lastRouteInfo?.lastPathname;
        nextRouteInfo.pushedByRoute = lastRouteInfo?.prevRouteLastPathname;
        nextRouteInfo.routerDirection = lastRouteInfo?.routerDirection;
        nextRouteInfo.routerAnimation = lastRouteInfo?.routerAnimation;
        nextRouteInfo.prevRouteLastPathname = lastRouteInfo?.lastPathname;

        /**
         * If going from /home to /child, then replacing from
         * /child to /home, we don't want the route info to
         * say that /home was pushed by /home which is not correct.
         */
        // const lastPushedBy = lastRouteInfo?.pushedByRoute;
        // const pushedByRoute = (lastPushedBy !== undefined && lastPushedBy !== nextRouteInfo.pathname) ? lastPushedBy : nextRouteInfo.pushedByRoute;

        // routeInfo.lastPathname = lastRouteInfo?.pathname;//lastRouteInfo?.pathname || routeInfo.lastPathname;
        // routeInfo.pushedByRoute = pushedByRoute;
        // routeInfo.routerDirection = lastRouteInfo?.routerDirection || routeInfo.routerDirection;
        // routeInfo.routerAnimation = lastRouteInfo?.routerAnimation || routeInfo.routerAnimation;
        // routeInfo.prevRouteLastPathname = lastRouteInfo?.lastPathname;
      }

      nextRouteInfo.position = currentHistoryPosition;
      nextRouteInfo.delta = delta;
      const historySize = locationHistory.size();
      const historyDiff = currentHistoryPosition - initialHistoryPosition;
      const isExistingRoute = historySize > historyDiff;
      const isNotTab = nextRouteInfo.tab === undefined;

      /**
       * If the size of location history is greater
       * than the difference between the current history
       * position and the initial history position
       * then we are guaranteed to already have a history
       * item for this route. In other words, a user
       * is navigating within the history without pushing
       * new items within the stack.
       */
      if (isExistingRoute && isNotTab) {
        /**
         * When going from /a --> /a/1 --> /b, then going
         * back to /a, then going /a --> /a/2 --> /b, clicking
         * the ion-back-button should return us to /a/2, not /a/1.
         * However, since the route entry for /b already exists,
         * we need to update other information such as the "pushedByRoute"
         * so we know which route pushed this new route.
         *
         * However, when using router.go with a stride of >1 or <-1,
         * we should not update this additional information because
         * we are traversing through the history, not pushing new states.
         * Going from /a --> /b --> /c, then doing router.go(-2), then doing
         * router.go(2) to go from /a --> /c should not update the route
         * listing to say that /c was pushed by /a.
         */
        // const hasDeltaStride = delta !== undefined && Math.abs(delta) !== 1;
        locationHistory.updateByHistoryPosition(nextRouteInfo);//, !hasDeltaStride);
      } else {
        locationHistory.add(nextRouteInfo);
      }

      currentRouteInfo = nextRouteInfo;
    }
    incomingRouteParams = undefined;
    historyChangeListeners.forEach(cb => cb(currentRouteInfo));
  }

  const getCurrentRouteInfo = () => currentRouteInfo;

  const canGoBack = (deep: number = 1) => locationHistory.canGoBack(deep, initialHistoryPosition, currentHistoryPosition);

  const navigate = (navigationOptions: ExternalNavigationOptions) => {
    const { routerAnimation, routerDirection, routerLink } = navigationOptions;

    incomingRouteParams = {
      routerAnimation,
      routerDirection: routerDirection || 'forward',
      routerAction: 'push'
    }

    router.push(routerLink);
  }

  const resetTab = (tab: string, originalHref: string) => {
    const routeInfo = locationHistory.getFirstRouteInfoForTab(tab);
    if (routeInfo) {
      const newRouteInfo = { ...routeInfo };
      newRouteInfo.pathname = originalHref;
      incomingRouteParams = { ...newRouteInfo, routerAction: 'pop', routerDirection: 'back' };
      router.push({ path: newRouteInfo.pathname, query: parseQuery(newRouteInfo.search) });
    }
  }

  const changeTab = (tab: string, path?: string) => {
    if (path === undefined) {
      console.warn('No tab path defined for:', tab);
      return;
    }

    const routeInfo = locationHistory.getCurrentRouteInfoForTab(tab);
    const [pathname] = path.split('?');
    const isExistingTab = routeInfo !== undefined;

    if (isExistingTab) {
      incomingRouteParams = {
        ...incomingRouteParams,
        routerAction: 'push',
        routerDirection: 'none',
        tab
      }

      /**
       * When going back to a tab
       * you just left, it's possible
       * for the route info to be incorrect
       * as the tab you want is not the
       * tab you are on.
       */
      if (routeInfo.pathname === pathname) {
        router.push({ path: routeInfo.pathname, query: parseQuery(routeInfo.search) });
      } else {
        router.push({ path: pathname, query: parseQuery(routeInfo.search) });
      }
    } else {
      handleNavigate(pathname, 'push', 'none', undefined, tab);
    }
  }

  const handleSetCurrentTab = (tab: string) => {
    currentTab = tab;

    const lastViewItemClone = { ...locationHistory.last() };
    if (lastViewItemClone.tab !== tab) {
      lastViewItemClone.tab = tab;
      locationHistory.update(lastViewItemClone);
    }
  }

  // TODO types
  const registerHistoryChangeListener = (cb: any) => {
    historyChangeListeners.push(cb);
  }

  const getLeavingRouteInfo = () => {
    return locationHistory.current(initialHistoryPosition, currentHistoryPosition);
  }

  return {
    getLeavingRouteInfo,
    handleNavigateBack,
    handleSetCurrentTab,
    getCurrentRouteInfo,
    canGoBack,
    navigate,
    resetTab,
    changeTab,
    registerHistoryChangeListener
  }
}
