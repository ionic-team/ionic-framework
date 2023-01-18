import type { RouteInfo } from "./types";

export const createLocationHistory = () => {
  const locationHistory: RouteInfo[] = [];
  const tabsHistory: { [k: string]: RouteInfo[] } = {};

  const add = (routeInfo: RouteInfo) => {
    switch (routeInfo.routerAction) {
      case "pop":
        pop(routeInfo);
        break;
      default:
        addRoute(routeInfo);
        break;
    }

    if (routeInfo.routerDirection === "root") {
      clearHistory();
      addRoute(routeInfo);
    }
  };

  const update = (routeInfo: RouteInfo) => {
    const locationIndex = locationHistory.findIndex(
      (x) => x.id === routeInfo.id
    );
    if (locationIndex > -1) {
      locationHistory.splice(locationIndex, 1, routeInfo);
    }
    const tabArray = tabsHistory[routeInfo.tab || ""];
    if (tabArray) {
      const tabIndex = tabArray.findIndex((x) => x.id === routeInfo.id);
      if (tabIndex > -1) {
        tabArray.splice(tabIndex, 1, routeInfo);
      } else {
        tabArray.push(routeInfo);
      }
    } else if (routeInfo.tab) {
      tabsHistory[routeInfo.tab] = [routeInfo];
    }
  };

  const pop = (routeInfo: RouteInfo) => {
    const tabHistory = getTabsHistory(routeInfo.tab);
    let ri;
    if (tabHistory) {
      // Pop all routes until we are back
      ri = tabHistory[tabHistory.length - 1];
      while (ri && ri.id !== routeInfo.id) {
        tabHistory.pop();
        ri = tabHistory[tabHistory.length - 1];
      }
      // Replace with updated route
      tabHistory.pop();
      tabHistory.push(routeInfo);
    }

    ri = locationHistory[locationHistory.length - 1];
    while (ri && ri.id !== routeInfo.id) {
      locationHistory.pop();
      ri = locationHistory[locationHistory.length - 1];
    }
    // Replace with updated route
    locationHistory.pop();
    locationHistory.push(routeInfo);
  };

  const addRoute = (routeInfo: RouteInfo) => {
    const tabHistory = getTabsHistory(routeInfo.tab);
    if (tabHistory) {
      // If the latest routeInfo is the same (going back and forth between tabs), replace it
      if (
        tabHistory[tabHistory.length - 1] &&
        tabHistory[tabHistory.length - 1].id === routeInfo.id
      ) {
        tabHistory.pop();
      }
      tabHistory.push(routeInfo);
    }
    locationHistory.push(routeInfo);
  };

  /**
   * Wipes the location history arrays.
   * You can optionally provide a routeInfo
   * object which will wipe that entry
   * and every entry that appears after it.
   */
  const clearHistory = (routeInfo?: RouteInfo) => {
    if (routeInfo) {
      const { position, tab } = routeInfo;

      /**
       * If there is no route index in locationHistory
       * then there will not be any route index in
       * tabs either.
       */
      const existingRouteIndex = locationHistory.findIndex(
        (r) => r.position === position
      );
      if (existingRouteIndex === -1) return;

      locationHistory.splice(existingRouteIndex);

      const clearTabHistory = (tab: string) => {
        const existingTabRouteIndex = tabsHistory[tab].findIndex(
          (r) => r.position === position
        );
        if (existingTabRouteIndex === -1) return;

        tabsHistory[tab].splice(existingTabRouteIndex);
      };

      /**
       * We also need to search the current tab
       * to correctly reset the individual tab
       * stack. We should not clear the entire
       * tab stack as that means we will lose
       * a reference to the root tab route.
       */
      const tabHistory = tabsHistory[tab];
      if (tab && tabHistory) {
        clearTabHistory(tab);
        /**
         * If we are not clearing items after
         * a tabs page, it is still possible
         * that there are future tabs pages to clear.
         * As a result, we need to search through
         * all the tab stacks and remove views that appear
         * after the given routeInfo.
         *
         * Example: /non-tabs-page --> /tabs/tab1 --> /non-tabs-page
         * (via router.go(-1)) --> /tabs/tab2. The /tabs/tab1 history
         * has been overwritten with /tabs/tab2. As a result,
         * the /tabs/tab1 route info in the Tab 1 stack should be removed.
         */
      } else {
        for (const tab in tabsHistory) {
          clearTabHistory(tab);
        }
      }
    } else {
      for (const tab in tabsHistory) {
        tabsHistory[tab] = [];
      }

      locationHistory.length = 0;
    }
  };
  const getTabsHistory = (tab: string): RouteInfo[] => {
    let history;
    if (tab) {
      history = tabsHistory[tab];
      if (!history) {
        history = tabsHistory[tab] = [];
      }
    }

    return history;
  };

  const size = () => locationHistory.length;

  /**
   * Finds and returns the location history item
   * given the state of browser's history API.
   * This is useful when jumping around in browser
   * history using router.go.
   */
  const current = (initialHistory: number, currentHistory: number) => {
    /**
     * initialHistory does not always start at 0 if users navigated
     * to app from another website, so doing this math lets us
     * find the correct index in our locationHistory array.
     */
    const index = currentHistory - initialHistory;
    return locationHistory[index] || last();
  };
  const last = () => locationHistory[locationHistory.length - 1];

  /**
   * With the introduction of router.go support, we no longer remove
   * items from locationHistory as they may be needed again in the future.
   * As a result, we need to look at the current position in location history
   * to see if users can navigate back n pages. Previously we were checking
   * the length of locationHistory, but that only worked since we were pruning
   * the array.
   */
  const canGoBack = (
    deep = 1,
    initialHistory: number,
    currentHistory: number
  ) => {
    return currentHistory - deep >= initialHistory;
  };

  const getFirstRouteInfoForTab = (tab: string): RouteInfo | undefined => {
    const tabHistory = getTabsHistory(tab);
    if (tabHistory) {
      return tabHistory[0];
    }
    return undefined;
  };

  const getCurrentRouteInfoForTab = (tab: string): RouteInfo | undefined => {
    const tabHistory = getTabsHistory(tab);
    if (tabHistory) {
      return tabHistory[tabHistory.length - 1];
    }
    return undefined;
  };

  /**
   * Finds and returns the previous view based upon
   * what originally pushed it (pushedByRoute).
   * When `delta` < -1 then we should just index into
   * to array because the previous view that we want is not
   * necessarily the view that pushed our current view.
   * Additionally, when jumping around in history, we
   * do not modify the locationHistory stack so we would
   * not update pushedByRoute anyways.
   */
  const findLastLocation = (
    routeInfo: RouteInfo,
    delta = -1
  ): RouteInfo | undefined => {
    const routeInfos = getTabsHistory(routeInfo.tab);
    if (routeInfos) {
      if (delta < -1) {
        return routeInfos[routeInfos.length - 1 + delta];
      } else {
        for (let i = routeInfos.length - 2; i >= 0; i--) {
          const ri = routeInfos[i];
          if (ri) {
            if (ri.pathname === routeInfo.pushedByRoute) {
              return ri;
            }
          }
        }
      }
    }
    if (delta < -1) {
      return locationHistory[locationHistory.length - 1 + delta];
    } else {
      for (let i = locationHistory.length - 2; i >= 0; i--) {
        const ri = locationHistory[i];
        if (ri) {
          if (ri.pathname === routeInfo.pushedByRoute) {
            return ri;
          }
        }
      }
    }
    return undefined;
  };

  return {
    current,
    size,
    last,
    add,
    canGoBack,
    update,
    getFirstRouteInfoForTab,
    getCurrentRouteInfoForTab,
    findLastLocation,
    clearHistory,
  };
};
