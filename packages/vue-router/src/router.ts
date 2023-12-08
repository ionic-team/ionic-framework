import type { AnimationBuilder } from "@ionic/vue";
import type {
  Router,
  RouteLocationNormalized,
  NavigationFailure,
  RouteLocationRaw,
} from "vue-router";
import { parseQuery } from "vue-router";

import { createLocationHistory } from "./locationHistory";
import type {
  ExternalNavigationOptions,
  RouteInfo,
  RouteParams,
  RouteAction,
  RouteDirection,
  IonicVueRouterOptions,
  NavigationInformation,
} from "./types";
import { generateId } from "./utils";

// TODO(FW-2969): types

export const createIonRouter = (
  opts: IonicVueRouterOptions,
  router: Router
) => {
  let currentNavigationInfo: NavigationInformation = {
    direction: undefined,
    action: undefined,
    delta: undefined,
  };

  /**
   * Ionic Vue should only react to navigation
   * changes once they have been confirmed and should
   * never affect the outcome of navigation (with the
   * exception of going back or selecting a tab).
   * As a result, we should do our work in afterEach
   * which is fired once navigation is confirmed
   * and any user guards have run.
   */
  router.afterEach(
    (
      to: RouteLocationNormalized,
      _: RouteLocationNormalized,
      failure?: NavigationFailure
    ) => {
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

      const replaceAction = opts.history.state.replaced ? "replace" : undefined;
      handleHistoryChange(to, action || replaceAction, direction, delta);

      currentNavigationInfo = {
        direction: undefined,
        action: undefined,
        delta: undefined,
      };
    }
  );

  const locationHistory = createLocationHistory();

  /**
   * Keeping track of the history position
   * allows us to determine if a user is pushing
   * new pages or updating history via the forward
   * and back browser buttons.
   */
  let initialHistoryPosition = opts.history.state.position as number;
  let currentHistoryPosition = opts.history.state.position as number;

  let currentRouteInfo: RouteInfo;
  let incomingRouteParams: RouteParams;

  const historyChangeListeners: any[] = [];

  if (typeof (document as any) !== "undefined") {
    document.addEventListener("ionBackButton", (ev: Event) => {
      (ev as any).detail.register(0, (processNextHandler: () => void) => {
        opts.history.go(-1);
        processNextHandler();
      });
    });
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
      action: info.type === "pop" && info.delta >= 1 ? "push" : info.type,
      direction: info.direction === "" ? "forward" : info.direction,
    };
  });

  const handleNavigateBack = (
    defaultHref?: string,
    routerAnimation?: AnimationBuilder
  ) => {
    const routeInfo = locationHistory.current(
      initialHistoryPosition,
      currentHistoryPosition
    );
    if (routeInfo && routeInfo.pushedByRoute) {
      const prevInfo = locationHistory.findLastLocation(routeInfo);
      if (prevInfo) {
        incomingRouteParams = {
          ...prevInfo,
          routerAction: "pop",
          routerDirection: "back",
          routerAnimation: routerAnimation || routeInfo.routerAnimation,
        };
        if (
          routeInfo.lastPathname === routeInfo.pushedByRoute ||
          /**
           * We need to exclude tab switches/tab
           * context changes here because tabbed
           * navigation is not linear, but router.back()
           * will go back in a linear fashion.
           */
          (prevInfo.pathname === routeInfo.pushedByRoute &&
            /**
             * Tab info can be undefined or '' (empty string)
             * both are false-y values, so we can just use !.
             */
            !routeInfo.tab &&
            !prevInfo.tab)
        ) {
          router.back();
        } else {
          /**
           * When going back to a child page of a tab
           * after being on another tab, we need to use
           * router.go() here instead of pushing or replacing.
           * Consider the following example:
           * /tabs/tab1 --> /tabs/tab1/child1 --> /tabs/tab1/child2
           * --> /tabs/tab2 (via Tab 2 button) --> /tabs/tab1/child2 (via Tab 1 button)
           *
           * Pressing the ion-back-button on /tabs/tab1/child2 should take
           * us back to /tabs/tab1/child1 not /tabs/tab2 because each tab
           * is its own stack.
           *
           * If we called pressed the ion-back-button and this code called
           * router.replace, then the state of /tabs/tab1/child2 would
           * be replaced with /tabs/tab1/child1. However, this means that
           * there would be two /tabs/tab1/child1 entries in the location
           * history as the original /tabs/tab1/child1 entry is still there.
           * As a result, clicking the ion-back-button on /tabs/tab1/child1 does
           * nothing because this code would try to route to the same page
           * we are currently on.
           *
           * If we called router.push instead then we would push a
           * new /tabs/tab1/child1 entry to the location history. This
           * is not good because we would have two /tabs/tab1/child1 entries
           * separated by a /tabs/tab1/child2 entry.
           */
          router.go(prevInfo.position - routeInfo.position);
        }
      } else {
        handleNavigate(defaultHref, "pop", "back", routerAnimation);
      }
    } else {
      handleNavigate(defaultHref, "pop", "back", routerAnimation);
    }
  };

  const handleNavigate = (
    path: RouteLocationRaw,
    routerAction?: RouteAction,
    routerDirection?: RouteDirection,
    routerAnimation?: AnimationBuilder,
    tab?: string
  ) => {
    setIncomingRouteParams(routerAction, routerDirection, routerAnimation, tab);

    if (routerAction === "push") {
      router.push(path);
    } else {
      router.replace(path);
    }
  };

  // TODO RouteLocationNormalized
  const handleHistoryChange = (
    location: any,
    action?: RouteAction,
    direction?: RouteDirection,
    delta?: number
  ) => {
    let leavingLocationInfo: RouteInfo;
    if (incomingRouteParams) {
      /**
       * If we are replacing the state of a route
       * with another route, the "leaving" route
       * is at the same position in location history
       * as where the replaced route will exist.
       */
      if (incomingRouteParams.routerAction === "replace") {
        leavingLocationInfo = locationHistory.current(
          initialHistoryPosition,
          currentHistoryPosition
        );
      } else if (incomingRouteParams.routerAction === "pop") {
        leavingLocationInfo = locationHistory.current(
          initialHistoryPosition,
          currentHistoryPosition + 1
        );

        /**
         * If the Ionic Router action was "pop"
         * and the browser history action was "replace", then
         * it is the case that the user clicked an IonBackButton
         * that is trying to go back to the route specified
         * by the defaultHref property.
         *
         * The problem is that this route currently does
         * not exist in the browser history, and we cannot
         * prepend an item in the browser's history stack.
         * To work around this, we replace the state of
         * the current item instead.
         * Given this scenario:
         * /page2 --> /page3 --> (back) /page2 --> (defaultHref) /page1
         * We would replace the state of /page2 with the state of /page1.
         *
         * When doing this, we are essentially re-writing past
         * history which makes the future history no longer relevant.
         * As a result, we clear out the location history so that users
         * can begin pushing new routes to the stack.
         *
         * This pattern is aligned with how the browser handles
         * pushing new routes after going back as well as how
         * other stack based operations such as undo/redo work.
         * For example, if you do tasks A, B, C, undo B and C, and
         * then do task D, you cannot "redo" B and C because you
         * rewrote the stack's past history.
         *
         * With browser history, it is a similar concept.
         * Going /page1 --> /page2 --> /page3 and then doing
         * router.go(-2) will bring you back to /page1.
         * If you then push /page4, you have rewritten
         * the past history and you can no longer go
         * forward to /page2 or /page3.
         */
        if (action === "replace") {
          locationHistory.clearHistory();
        }
      } else {
        /**
         * If the routerDirection was specified as "root", then
         * we are replacing the initial state of location history
         * with this incoming route. As a result, the leaving
         * history info is stored at the same location as
         * where the incoming history location will be stored.
         *
         * Otherwise, we can assume this is just another route
         * that will be pushed onto the end of location history,
         * so we can grab the previous item in history relative
         * to where the history state currently is.
         */
        const position =
          incomingRouteParams.routerDirection === "root"
            ? currentHistoryPosition
            : currentHistoryPosition - 1;
        leavingLocationInfo = locationHistory.current(
          initialHistoryPosition,
          position
        );
      }
    } else {
      leavingLocationInfo = currentRouteInfo;
    }

    if (!leavingLocationInfo) {
      leavingLocationInfo = {
        pathname: "",
        search: "",
      };
    }

    const leavingUrl =
      leavingLocationInfo.pathname + leavingLocationInfo.search;
    if (leavingUrl !== location.fullPath) {
      if (!incomingRouteParams) {
        if (action === "replace") {
          incomingRouteParams = {
            routerAction: "replace",
            routerDirection: "none",
          };
        } else if (action === "pop") {
          const routeInfo = locationHistory.current(
            initialHistoryPosition,
            currentHistoryPosition - delta
          );

          if (routeInfo && routeInfo.pushedByRoute) {
            const prevRouteInfo = locationHistory.findLastLocation(
              routeInfo,
              delta
            );
            incomingRouteParams = {
              ...prevRouteInfo,
              routerAction: "pop",
              routerDirection: "back",
            };
          } else {
            incomingRouteParams = {
              routerAction: "pop",
              routerDirection: "none",
            };
          }
        }

        if (!incomingRouteParams) {
          incomingRouteParams = {
            routerAction: "push",
            routerDirection: direction || "forward",
          };
        }
      }

      let routeInfo: RouteInfo;
      if (incomingRouteParams?.id) {
        routeInfo = {
          ...incomingRouteParams,
          lastPathname: leavingLocationInfo.pathname,
        };
      } else {
        const isPushed =
          incomingRouteParams.routerAction === "push" &&
          incomingRouteParams.routerDirection === "forward";
        routeInfo = {
          id: generateId("routeInfo"),
          ...incomingRouteParams,
          lastPathname: leavingLocationInfo.pathname,
          pathname: location.path,
          search: (location.fullPath && location.fullPath.split("?")[1]) || "",
          params: location.params && location.params,
          prevRouteLastPathname: leavingLocationInfo.lastPathname,
        };

        if (isPushed) {
          routeInfo.pushedByRoute =
            leavingLocationInfo.pathname !== ""
              ? leavingLocationInfo.pathname
              : undefined;
        } else if (routeInfo.routerAction === "pop") {
          const route = locationHistory.findLastLocation(routeInfo);
          routeInfo.pushedByRoute = route?.pushedByRoute;
        } else if (
          routeInfo.routerAction === "push" &&
          routeInfo.tab !== leavingLocationInfo.tab
        ) {
          const lastRoute = locationHistory.getCurrentRouteInfoForTab(
            routeInfo.tab
          );
          routeInfo.pushedByRoute = lastRoute?.pushedByRoute;
        } else if (routeInfo.routerAction === "replace") {
          /**
           * When replacing a route, we want to make sure we select the current route
           * that we are on, not the last route in the stack. The last route in the stack
           * is not always the current route.
           * Example:
           * Given the following history: /page1 --> /page2
           * Doing router.go(-1) would bring you to /page1.
           * If you then did router.replace('/page3'), /page1 should
           * be replaced with /page3 even though /page2 is the last
           * item in the stack/
           */
          const currentRouteInfo = locationHistory.current(
            initialHistoryPosition,
            currentHistoryPosition
          );

          /**
           * If going from /home to /child, then replacing from
           * /child to /home, we don't want the route info to
           * say that /home was pushed by /home which is not correct.
           */
          const currentPushedBy = currentRouteInfo?.pushedByRoute;
          const pushedByRoute =
            currentPushedBy !== undefined &&
            currentPushedBy !== routeInfo.pathname
              ? currentPushedBy
              : routeInfo.pushedByRoute;

          routeInfo.lastPathname =
            currentRouteInfo?.pathname || routeInfo.lastPathname;
          routeInfo.pushedByRoute = pushedByRoute;

          /**
           * When replacing routes we should still prefer
           * any custom direction/animation that the developer
           * has specified when navigating first instead of relying
           * on previously used directions/animations.
           */
          routeInfo.routerDirection = routeInfo.routerDirection || currentRouteInfo?.routerDirection;
          routeInfo.routerAnimation = routeInfo.routerAnimation || currentRouteInfo?.routerAnimation;
          routeInfo.prevRouteLastPathname = currentRouteInfo?.lastPathname;
        }
      }

      routeInfo.position = currentHistoryPosition;
      routeInfo.delta = delta;
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
       *
       * If the historySize === historyDiff,
       * then we are still re-writing history
       * by replacing the current route state
       * with a new route state. The initial
       * action when loading an app is
       * going to be replace operation, so
       * we want to make sure we exclude that
       * action by ensuring historySize > 0.
       */
      const isReplacing =
        historySize === historyDiff && historySize > 0 && action === "replace";
      if (historySize > historyDiff || isReplacing) {
        /**
         * When navigating back through the history,
         * if users then push a new route the future
         * history stack is no longer relevant. As
         * a result, we need to clear out all entries
         * that appear after the current routeInfo
         * so that we can then append the new history.
         *
         * This does not apply when using router.go
         * as that is traversing through the history,
         * not altering it.
         *
         * Previously we had only updated the existing route
         * and then left the future history alone. That
         * worked for some use cases but was not sufficient
         * in other scenarios.
         */

        if (
          (routeInfo.routerAction === "push" ||
            routeInfo.routerAction === "replace") &&
          delta === undefined
        ) {
          locationHistory.clearHistory(routeInfo);
          locationHistory.add(routeInfo);
        }
      } else {
        locationHistory.add(routeInfo);
      }

      /**
       * If we recently reset the location history
       * then we also need to update the initial
       * history position.
       */
      if (locationHistory.size() === 1) {
        initialHistoryPosition = routeInfo.position;
      }

      currentRouteInfo = routeInfo;
    }
    incomingRouteParams = undefined;
    historyChangeListeners.forEach((cb) => cb(currentRouteInfo));
  };

  const getCurrentRouteInfo = () => currentRouteInfo;

  const canGoBack = (deep = 1) =>
    locationHistory.canGoBack(
      deep,
      initialHistoryPosition,
      currentHistoryPosition
    );

  const navigate = (navigationOptions: ExternalNavigationOptions) => {
    const { routerAnimation, routerDirection, routerLink } = navigationOptions;

    setIncomingRouteParams("push", routerDirection, routerAnimation);

    router.push(routerLink);
  };

  const resetTab = (tab: string) => {
    /**
     * Resetting the tab should go back
     * to the initial view in the tab stack.
     * It should not push a new instance of the
     * root tab page onto the stack.
     *
     * To do this, we get the initial view in the
     * tab stack and subtract the position of that
     * entry from our current position. From there
     * we call router.go() to move us back the
     * appropriate number of positions.
     */
    const routeInfo = locationHistory.getFirstRouteInfoForTab(tab);
    if (routeInfo) {
      router.go(routeInfo.position - currentHistoryPosition);
    }
  };

  const changeTab = (tab: string, path?: string) => {
    if (!path) return;

    const routeInfo = locationHistory.getCurrentRouteInfoForTab(tab);
    const [pathname] = path.split("?");

    if (routeInfo) {
      incomingRouteParams = {
        ...incomingRouteParams,
        routerAction: "push",
        routerDirection: "none",
        tab,
      };

      /**
       * When going back to a tab
       * you just left, it's possible
       * for the route info to be incorrect
       * as the tab you want is not the
       * tab you are on.
       */
      if (routeInfo.pathname === pathname) {
        router.push({
          path: routeInfo.pathname,
          query: parseQuery(routeInfo.search),
        });
      } else {
        router.push({ path: pathname, query: parseQuery(routeInfo.search) });
      }
    } else {
      handleNavigate(pathname, "push", "none", undefined, tab);
    }
  };

  /**
   * This method is invoked by the IonTabs component
   * during a history change callback. It is responsible
   * for ensuring that tabbed routes have the correct
   * "tab" field in its routeInfo object.
   *
   * IonTabs will determine if the current route
   * is in tabs and assign it the correct tab.
   * If the current route is not in tabs,
   * then IonTabs will not invoke this.
   */
  const handleSetCurrentTab = (tab: string) => {
    /**
     * Note that the current page that we
     * are on is not necessarily the last item
     * in the locationHistory stack. As a result,
     * we cannot use locationHistory.last() here.
     */
    const ri = {
      ...locationHistory.current(
        initialHistoryPosition,
        currentHistoryPosition
      ),
    };

    /**
     * handleHistoryChange is tabs-agnostic by design.
     * One side effect of this is that certain tabs
     * routes have extraneous/incorrect information
     * that we need to remove. To not tightly couple
     * handleHistoryChange with tabs, we let the
     * handleSetCurrentTab function. This function is
     * only called by IonTabs.
     */

    if (ri.tab !== tab) {
      ri.tab = tab;
      locationHistory.update(ri);
    }

    /**
     * lastPathname typically equals pushedByRoute
     * when navigating in a linear manner. When switching between
     * tabs, this is almost never the case.
     *
     * Example: /tabs/tabs1 --> /tabs/tab2 --> /tabs/tab1
     * The latest Tab 1 route would have the following information
     * lastPathname: '/tabs/tab2'
     * pushedByRoute: '/tabs/tab2'
     *
     * A tab cannot push another tab, so we need to set
     * pushedByRoute to `undefined`. Alternative way of thinking
     * about this: You cannot swipe to go back from Tab 1 to Tab 2.
     *
     * However, there are some instances where we do want to keep
     * the pushedByRoute. As a result, we need to ensure that
     * we only wipe the pushedByRoute state when the both of the
     * following conditions are met:
     * 1. pushedByRoute is different from lastPathname
     * 2. The tab for the pushedByRoute info is different
     * from the current route tab.
     *
     * Example of when we would not want to clear pushedByRoute:
     * /tabs/tab1 --> /tabs/tab1/child --> /tabs/tab2 --> /tabs/tab1/child
     * The latest Tab 1 Child route would have the following information:
     * lastPathname: '/tabs/tab2'
     * pushedByRoute: '/tabs/tab1
     *
     * In this case, /tabs/tab1/child should be able to swipe to go back
     * to /tabs/tab1 so we want to keep the pushedByRoute.
     */
    const pushedByRoute = locationHistory.findLastLocation(ri);
    if (ri.pushedByRoute !== ri.lastPathname && pushedByRoute?.tab !== tab) {
      ri.pushedByRoute = undefined;
      locationHistory.update(ri);
    }
  };

  const registerHistoryChangeListener = (cb: any) => {
    historyChangeListeners.push(cb);
  };

  const setIncomingRouteParams = (
    routerAction: RouteAction = "push",
    routerDirection: RouteDirection = "forward",
    routerAnimation?: AnimationBuilder,
    tab?: string
  ) => {
    incomingRouteParams = {
      routerAction,
      routerDirection,
      routerAnimation,
      tab,
    };
  };

  const goBack = (routerAnimation?: AnimationBuilder) => {
    setIncomingRouteParams("pop", "back", routerAnimation);
    router.back();
  };

  const goForward = (routerAnimation?: AnimationBuilder) => {
    setIncomingRouteParams("push", "forward", routerAnimation);
    router.forward();
  };

  const getLeavingRouteInfo = () => {
    return locationHistory.current(
      initialHistoryPosition,
      currentHistoryPosition
    );
  };

  return {
    handleNavigate,
    getLeavingRouteInfo,
    handleNavigateBack,
    handleSetCurrentTab,
    getCurrentRouteInfo,
    canGoBack,
    navigate,
    resetTab,
    changeTab,
    registerHistoryChangeListener,
    goBack,
    goForward,
  };
};
