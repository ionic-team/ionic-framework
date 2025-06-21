/**
 * `ReactRouterViewStack` is a custom navigation manager used in Ionic React
 * apps to map React Router route elements (such as `<IonRoute>`) to "view
 * items" that Ionic can manage in a view stack. This is critical to maintain
 * Ionic’s animation, lifecycle, and history behavior across views.
 */

import type { RouteInfo, ViewItem } from '@ionic/react';
import { IonRoute, ViewLifeCycleManager, ViewStacks, generateId } from '@ionic/react';
import React from 'react';
import type { PathMatch } from 'react-router';
import { Routes } from 'react-router';

import { matchPath } from './utils/matchPath';

export class ReactRouterViewStack extends ViewStacks {
  constructor() {
    super();
  }

  /**
   * Creates a new view item for the given outlet and react route element.
   * Associates route props with the matched route path for further lookups.
   */
  createViewItem = (outletId: string, reactElement: React.ReactElement, routeInfo: RouteInfo, page?: HTMLElement) => {
    const viewItem: ViewItem = {
      id: generateId('viewItem'),
      outletId,
      ionPageElement: page,
      reactElement,
      mount: true,
      ionRoute: false,
    };

    if (reactElement.type === IonRoute) {
      viewItem.ionRoute = true;
      viewItem.disableIonPageManagement = reactElement.props.disableIonPageManagement;
    }

    viewItem.routeData = {
      match: matchPath({
        pathname: routeInfo.pathname,
        componentProps: reactElement.props,
      }),
      childProps: reactElement.props,
    };

    return viewItem;
  };

  /**
   * Renders a ViewLifeCycleManager for the given view item.
   * Handles cleanup if the view no longer matches.
   *
   * - Deactivates view if it no longer matches the current route
   * - Wraps the route element in <Routes> to support nested routing and ensure remounting
   * - Adds a unique key to <Routes> so React Router remounts routes when switching
   */
  private renderViewItem = (viewItem: ViewItem, routeInfo: RouteInfo) => {
    const match = matchComponent(viewItem.reactElement, routeInfo.pathname);

    if (!match && viewItem.routeData.match) {
      this.deactivateView(viewItem);
    }

    return (
      <ViewLifeCycleManager key={`view-${viewItem.id}`} mount={viewItem.mount} removeView={() => this.remove(viewItem)}>
        {/**
         * Wrapped in <Routes> to ensure React Router v6 correctly processes nested route elements
         * `key` is provided to enforce remounting of Routes when switching between view items.
         */}
        <Routes key={`routes-${viewItem.id}`}>{React.cloneElement(viewItem.reactElement)}</Routes>
      </ViewLifeCycleManager>
    );
  };

  /**
   * Re-renders all active view items for the specified outlet.
   * Ensures React elements are updated with the latest match.
   *
   * 1. Iterates through children of IonRouterOutlet
   * 2. Updates each matching viewItem with the current child React element
   *    (important for updating props or changes to elements)
   * 3. Returns a list of React components that will be rendered inside the outlet
   *    Each view is wrapped in <ViewLifeCycleManager> to manage lifecycle and rendering
   */
  getChildrenToRender = (outletId: string, ionRouterOutlet: React.ReactElement, routeInfo: RouteInfo) => {
    const viewItems = this.getViewItemsForOutlet(outletId);

    // Sync child elements with stored viewItems (e.g. to reflect new props)
    React.Children.forEach(ionRouterOutlet.props.children, (child: React.ReactElement) => {
      // Ensure the child is a valid React element sincewe
      // might have whitespace strings or other non-element children
      if (React.isValidElement(child)) {
        const viewItem = viewItems.find((v) =>
          matchComponent(child, v.routeData.childProps.path || routeInfo.pathname)
        );
        if (viewItem) {
          viewItem.reactElement = child;
        }
      }
    });

    // Render all view items using renderViewItem
    return viewItems.map((viewItem) => this.renderViewItem(viewItem, routeInfo));
  };

  /**
   * Finds a view item matching the current route, optionally updating its match state.
   */
  findViewItemByRouteInfo = (routeInfo: RouteInfo, outletId?: string, updateMatch?: boolean) => {
    const { viewItem, match } = this.findViewItemByPath(routeInfo.pathname, outletId);
    const shouldUpdateMatch = updateMatch === undefined || updateMatch === true;
    if (shouldUpdateMatch && viewItem && match) {
      viewItem.routeData.match = match;
    }
    return viewItem;
  };

  /**
   * Finds the view item that was previously active before a route change.
   */
  findLeavingViewItemByRouteInfo = (routeInfo: RouteInfo, outletId?: string, mustBeIonRoute = true) => {
    // If the lastPathname is not set, we cannot find a leaving view item
    if (!routeInfo.lastPathname) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[ReactRouterViewStack] No matching leaving view item found for: ${routeInfo.pathname}`);
      }
      return undefined;
    }

    const { viewItem } = this.findViewItemByPath(routeInfo.lastPathname, outletId, mustBeIonRoute);
    return viewItem;
  };

  /**
   * Finds a view item by pathname only, used in simpler queries.
   */
  findViewItemByPathname = (pathname: string, outletId?: string) => {
    const { viewItem } = this.findViewItemByPath(pathname, outletId);
    return viewItem;
  };

  /**
   * Core function that matches a given pathname against all view items.
   * Returns both the matched view item and match metadata.
   */
  private findViewItemByPath(pathname: string, outletId?: string, mustBeIonRoute?: boolean) {
    let viewItem: ViewItem | undefined;
    let match: PathMatch<string> | null = null;
    let viewStack: ViewItem[];

    if (outletId) {
      viewStack = this.getViewItemsForOutlet(outletId);
      viewStack.some(matchView);
      if (!viewItem) viewStack.some(matchDefaultRoute);
    } else {
      const viewItems = this.getAllViewItems();
      viewItems.some(matchView);
      if (!viewItem) viewItems.some(matchDefaultRoute);
    }

    if (!viewItem && process.env.NODE_ENV !== 'production') {
      console.warn(`[ReactRouterViewStack] No matching view item found for: ${pathname}`);
    }

    return { viewItem, match };

    /**
     * Matches a route path with dynamic parameters (e.g. /tabs/:id)
     */
    function matchView(v: ViewItem) {
      if (mustBeIonRoute && !v.ionRoute) return false;

      const result = matchPath({
        pathname,
        componentProps: v.routeData.childProps,
      });

      if (result) {
        const hasParams = result.params && Object.keys(result.params).length > 0;
        const previousMatch = v.routeData?.match;
        const isSamePath = result.pathname === previousMatch?.pathname;

        if (!hasParams || isSamePath) {
          match = result;
          viewItem = v;
          return true;
        }
      }

      return false;
    }

    /**
     * Matches a view with no path prop (default fallback route).
     */
    function matchDefaultRoute(v: ViewItem) {
      if (!v.routeData.childProps.path) {
        match = createDefaultMatch(pathname);
        viewItem = v;
        return true;
      }
      return false;
    }
  }

  /**
   * Unmounts a view by clearing its match and setting mount to false.
   */
  private deactivateView = (viewItem: ViewItem) => {
    viewItem.routeData.match = undefined; //  clear it so it's no longer active
    viewItem.mount = false; // do not display the view anymore
  };
}

/**
 * Utility to apply matchPath to a React element and return its match state.
 */
function matchComponent(node: React.ReactElement, pathname: string) {
  return matchPath({
    pathname,
    componentProps: node.props,
  });
}

/**
 * Creates a default match object for a fallback route.
 */
function createDefaultMatch(pathname: string): PathMatch<string> {
  return {
    params: {},
    pathname,
    pathnameBase: pathname,
    pattern: {
      path: pathname,
      caseSensitive: false,
      end: true,
    },
  };
}
