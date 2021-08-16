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

  const handleNavigateBack = (defaultHref?: string, routerAnimation?: AnimationBuilder) => {
    // todo grab default back button href from config
    const routeInfo = locationHistory.current(initialHistoryPosition, currentHistoryPosition);
    if (routeInfo && routeInfo.pushedByRoute) {
      const prevInfo = locationHistory.findLastLocation(routeInfo);
      if (prevInfo) {
        incomingRouteParams = { ...prevInfo, routerAction: 'pop', routerDirection: 'back', routerAnimation: routerAnimation || routeInfo.routerAnimation };
        if (
          routeInfo.lastPathname === routeInfo.pushedByRoute ||
          (
            /**
             * We need to exclude tab switches/tab
             * context changes here because tabbed
             * navigation is not linear, but router.back()
             * will go back in a linear fashion.
             */
            prevInfo.pathname === routeInfo.pushedByRoute &&
            routeInfo.tab === '' && prevInfo.tab === ''
          )
        ) {
          router.back();
        } else {
          router.replace({ path: prevInfo.pathname, query: parseQuery(prevInfo.search) });
        }
      } else {
        handleNavigate(defaultHref, 'pop', 'back');
      }
    } else {
      handleNavigate(defaultHref, 'pop', 'back');
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
    let leavingLocationInfo: RouteInfo;
    if (incomingRouteParams) {
      if (incomingRouteParams.routerAction === 'replace') {
        leavingLocationInfo = locationHistory.previous();
      } else if (incomingRouteParams.routerAction === 'pop') {
        leavingLocationInfo = locationHistory.current(initialHistoryPosition, currentHistoryPosition + 1);
      } else {
        leavingLocationInfo = locationHistory.current(initialHistoryPosition, currentHistoryPosition - 1);
      }
    } else {
      leavingLocationInfo = currentRouteInfo;
    }

    if (!leavingLocationInfo) {
      leavingLocationInfo = {
        pathname: '',
        search: ''
      }
    }

    const leavingUrl = leavingLocationInfo.pathname + leavingLocationInfo.search;
    if (leavingUrl !== location.fullPath) {
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

      let routeInfo: RouteInfo;
      if (incomingRouteParams?.id) {
        routeInfo = {
          ...incomingRouteParams,
          lastPathname: leavingLocationInfo.pathname
        }

      } else {
        const isPushed = incomingRouteParams.routerAction === 'push' && incomingRouteParams.routerDirection === 'forward';
        routeInfo = {
          id: generateId('routeInfo'),
          ...incomingRouteParams,
          lastPathname: leavingLocationInfo.pathname,
          pathname: location.path,
          search: location.fullPath && location.fullPath.split('?')[1] || '',
          params: location.params && location.params,
          prevRouteLastPathname: leavingLocationInfo.lastPathname
        }

        if (isPushed) {
          routeInfo.tab = leavingLocationInfo.tab;
          routeInfo.pushedByRoute = (leavingLocationInfo.pathname !== '') ? leavingLocationInfo.pathname : undefined;
        } else if (routeInfo.routerAction === 'pop') {
          const route = locationHistory.findLastLocation(routeInfo);
          routeInfo.pushedByRoute = route?.pushedByRoute;
        } else if (routeInfo.routerAction === 'push' && routeInfo.tab !== leavingLocationInfo.tab) {
          const lastRoute = locationHistory.getCurrentRouteInfoForTab(routeInfo.tab);
          routeInfo.pushedByRoute = lastRoute?.pushedByRoute;
        } else if (routeInfo.routerAction === 'replace') {
          const currentRouteInfo = locationHistory.last();

          /**
           * If going from /home to /child, then replacing from
           * /child to /home, we don't want the route info to
           * say that /home was pushed by /home which is not correct.
           */
          const currentPushedBy = currentRouteInfo?.pushedByRoute;
          const pushedByRoute = (currentPushedBy !== undefined && currentPushedBy !== routeInfo.pathname) ? currentPushedBy : routeInfo.pushedByRoute;

          routeInfo.lastPathname = currentRouteInfo?.pathname || routeInfo.lastPathname;
          routeInfo.pushedByRoute = pushedByRoute;
          routeInfo.routerDirection = currentRouteInfo?.routerDirection || routeInfo.routerDirection;
          routeInfo.routerAnimation = currentRouteInfo?.routerAnimation || routeInfo.routerAnimation;
          routeInfo.prevRouteLastPathname = currentRouteInfo?.lastPathname;
        }

      }

      routeInfo.position = currentHistoryPosition;
      const historySize = locationHistory.size();
      const historyDiff = currentHistoryPosition - initialHistoryPosition;

      /**
       * If the size of location history is greater
       * than the difference between the current history
       * position and the initial history position
       * then we are guaranteed to already have a history
       * item for this route. In other words, a user
       * is navigating within the history without pushing
       * new items within the stack.
       */
      if (historySize > historyDiff && routeInfo.tab === undefined) {
        locationHistory.updateByHistoryPosition(routeInfo);
      } else {
        locationHistory.add(routeInfo);
      }

      currentRouteInfo = routeInfo;
    }
    incomingRouteParams = undefined;
    historyChangeListeners.forEach(cb => cb(currentRouteInfo));
  }

  const getCurrentRouteInfo = () => currentRouteInfo;

  const canGoBack = (deep: number = 1) => locationHistory.canGoBack(deep);

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
    if (!path) return;

    const routeInfo = locationHistory.getCurrentRouteInfoForTab(tab);
    const [pathname] = path.split('?');

    if (routeInfo) {
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
    }
    else {
      handleNavigate(pathname, 'push', 'none', undefined, tab);
    }
  }

  const handleSetCurrentTab = (tab: string) => {
    currentTab = tab;

    const ri = { ...locationHistory.last() };
    if (ri.tab !== tab) {
      ri.tab = tab;
      locationHistory.update(ri);
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
