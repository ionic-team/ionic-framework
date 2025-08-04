/**
 * `ReactRouterViewStack` is a custom navigation manager used in Ionic React
 * apps to map React Router route elements (such as `<IonRoute>`) to "view
 * items" that Ionic can manage in a view stack. This is critical to maintain
 * Ionic’s animation, lifecycle, and history behavior across views.
 */

import type { RouteInfo, ViewItem } from '@ionic/react';
import { IonRoute, ViewLifeCycleManager, ViewStacks } from '@ionic/react';
import React from 'react';
import type { PathMatch } from 'react-router';

import { matchPath } from './utils/matchPath';

export class ReactRouterViewStack extends ViewStacks {
  private pendingViewItems: Map<string, ViewItem> = new Map();
  private deactivationQueue: Map<string, NodeJS.Timeout> = new Map();
  private viewItemCounter: number = 0;

  constructor() {
    super();
  }

  /**
   * Creates a new view item for the given outlet and react route element.
   * Associates route props with the matched route path for further lookups.
   */
  createViewItem = (outletId: string, reactElement: React.ReactElement, routeInfo: RouteInfo, page?: HTMLElement) => {
    // Create a truly unique ID by combining outlet ID with an incrementing counter
    this.viewItemCounter++;
    const id = `${outletId}-${this.viewItemCounter}`;
    const routePath = reactElement.props.path || '';
    
    console.log(`[ReactRouterViewStack] LOOP CHECK: Creating view item ${id} for route ${routeInfo.pathname} with path: ${routePath} (counter: ${this.viewItemCounter})`);
    
    // Add infinite loop detection
    if (this.viewItemCounter > 50) {
      console.error(`[ReactRouterViewStack] INFINITE LOOP DETECTED: Too many view items created (${this.viewItemCounter}). Stopping creation.`);
      throw new Error(`Infinite loop detected in view item creation`);
    }
    
    const viewItem: ViewItem = {
      id,
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

    // Store in pending until properly added
    const key = `${outletId}-${routeInfo.pathname}`;
    this.pendingViewItems.set(key, viewItem);

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
    
    console.log(`[ReactRouterViewStack] renderViewItem ${viewItem.id}: path=${viewItem.reactElement.props.path}, pathname=${routeInfo.pathname}, match=${!!match}, mount=${viewItem.mount}`);

    // Cancel any pending deactivation if we have a match
    if (match) {
      const timeoutId = this.deactivationQueue.get(viewItem.id);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.deactivationQueue.delete(viewItem.id);
      }
    }

    // Don't deactivate views automatically - let the StackManager handle view lifecycle
    // This preserves views in the stack for navigation history like native apps
    // Views will be hidden/shown by the StackManager's transition logic instead of being unmounted

    // Reactivate view if it matches but was previously deactivated
    if (match && !viewItem.mount) {
      viewItem.mount = true;
      viewItem.routeData.match = match;
    }
    
    console.log(`[ReactRouterViewStack] renderViewItem ${viewItem.id}: final mount=${viewItem.mount}`);
    
    const routeElement = React.cloneElement(viewItem.reactElement);
    const componentElement = routeElement.props.element;
    
    console.log(`[ReactRouterViewStack] renderViewItem ${viewItem.id}: componentElement type:`, componentElement?.type?.name || componentElement?.type?.displayName || 'unknown');
    console.log(`[ReactRouterViewStack] renderViewItem ${viewItem.id}: using ViewLifeCycleManager with mount=${viewItem.mount}`);
    
    return (
      <ViewLifeCycleManager key={`view-${viewItem.id}`} mount={viewItem.mount} removeView={() => this.remove(viewItem)}>
        {/**
         * Render the component element directly instead of wrapping in Routes
         * The Routes component is handled at the IonRouterOutlet level
         */}
        {componentElement}
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
      // Ensure the child is a valid React element since we
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

    // Filter out duplicate view items by ID (but keep all mounted items)
    const uniqueViewItems = viewItems.filter((viewItem, index, array) => {
      // Remove duplicates by ID (keep first occurrence)
      const isFirstOccurrence = array.findIndex(v => v.id === viewItem.id) === index;
      return isFirstOccurrence;
    });
    
    // Render all view items using renderViewItem
    const renderedItems = uniqueViewItems.map((viewItem) => this.renderViewItem(viewItem, routeInfo));
    return renderedItems;
  };

  /**
   * Finds a view item matching the current route, optionally updating its match state.
   */
  findViewItemByRouteInfo = (routeInfo: RouteInfo, outletId?: string, updateMatch?: boolean) => {
    console.log(`[ReactRouterViewStack] findViewItemByRouteInfo called for ${routeInfo.pathname} in outlet ${outletId}`);
    const { viewItem, match } = this.findViewItemByPath(routeInfo.pathname, outletId);
    console.log(`[ReactRouterViewStack] findViewItemByRouteInfo result:`, viewItem ? `${viewItem.id}(outlet:${viewItem.outletId}, path:${viewItem.routeData?.childProps?.path})` : 'null');
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

    // First check pending items
    if (outletId) {
      const pendingKey = `${outletId}-${pathname}`;
      const pendingItem = this.pendingViewItems.get(pendingKey);
      if (pendingItem) {
        // Move from pending to active
        this.pendingViewItems.delete(pendingKey);
        this.add(pendingItem);
        return { viewItem: pendingItem, match: pendingItem.routeData.match };
      }
    }

    // Helper function to sort views by specificity (most specific first)
    const sortBySpecificity = (views: ViewItem[]) => {
      return [...views].sort((a, b) => {
        const pathA = a.routeData.childProps.path || '';
        const pathB = b.routeData.childProps.path || '';
        
        // Exact matches (no wildcards/params) come first
        const aHasWildcard = pathA.includes('*') || pathA.includes(':');
        const bHasWildcard = pathB.includes('*') || pathB.includes(':');
        
        if (!aHasWildcard && bHasWildcard) return -1;
        if (aHasWildcard && !bHasWildcard) return 1;
        
        // Among wildcard routes, longer paths are more specific
        return pathB.length - pathA.length;
      });
    };

    if (outletId) {
      viewStack = sortBySpecificity(this.getViewItemsForOutlet(outletId));
      viewStack.some(matchView);
      if (!viewItem) viewStack.some(matchDefaultRoute);
    } else {
      const viewItems = sortBySpecificity(this.getAllViewItems());
      viewItems.some(matchView);
      if (!viewItem) viewItems.some(matchDefaultRoute);
    }

    // Only search other outlets if this is not a specific outlet request
    // or if no outlet was specified in the first place
    if (!viewItem && !outletId) {
      console.log(`[ReactRouterViewStack] No outlet specified, searching all outlets for ${pathname}`);
      const allViewItems = sortBySpecificity(this.getAllViewItems());
      allViewItems.some(matchView);
      if (!viewItem) allViewItems.some(matchDefaultRoute);
      
      if (viewItem) {
        console.log(`[ReactRouterViewStack] Found match in outlet: ${viewItem.id}(outlet:${viewItem.outletId})`);
      }
    }

    if (!viewItem && process.env.NODE_ENV !== 'production') {
      const allViewItems = this.getAllViewItems();
      console.warn(`[ReactRouterViewStack] No matching view item found for: ${pathname}. Available views:`, 
        allViewItems.map(v => `${v.id}(outlet:${v.outletId}, path:${v.routeData?.childProps?.path || 'undefined'})`).join(', '));
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

        // Don't allow view items with undefined paths to match specific routes
        // This prevents broken index route view items from interfering with navigation
        const viewItemPath = v.routeData.childProps.path;
        if (!viewItemPath && pathname !== '/' && pathname !== '') {
          console.log(`[ReactRouterViewStack] BLOCKING UNDEFINED PATH: ${v.id}(path:undefined) cannot match specific route ${pathname}`);
          return false;
        }

        // Accept matches in these cases:
        // - No params (exact string matches)
        // - Same path as previous match (parameter changes on same route)
        // - No previous match (first time matching this view)
        // - Previous match is compatible with current path
        if (!hasParams || isSamePath || !previousMatch) {
          console.log(`[ReactRouterViewStack] MATCH FOUND: ${v.id}(path:${v.routeData.childProps.path}) matches ${pathname} - reason: ${!hasParams ? 'no-params' : isSamePath ? 'same-path' : 'no-previous-match'}`);
          match = result;
          viewItem = v;
          return true;
        } else {
          // For parameterized routes with previous matches, be more flexible
          // Allow the match if it's a related path or wildcard route
          const routePath = v.routeData.childProps.path || '';
          const isWildcardRoute = routePath.includes('*');
          const isParameterRoute = routePath.includes(':');
          
          if (isParameterRoute) {
            console.log(`[ReactRouterViewStack] MATCH FOUND: ${v.id}(path:${routePath}) matches ${pathname} - reason: parameter-route`);
            match = result;
            viewItem = v;
            return true;
          } else if (isWildcardRoute) {
            console.log(`[ReactRouterViewStack] MATCH FOUND: ${v.id}(path:${routePath}) matches ${pathname} - reason: wildcard-route`);
            match = result;
            viewItem = v;
            return true;
          } else {
            console.log(`[ReactRouterViewStack] MATCH REJECTED: ${v.id}(path:${routePath}) vs ${pathname} - hasParams:${hasParams}, previousMatch:${previousMatch?.pathname}`);
          }
        }
      } else {
        console.log(`[ReactRouterViewStack] NO MATCH: ${v.id}(path:${v.routeData.childProps.path}) vs ${pathname}`);
      }

      return false;
    }

    /**
     * Matches a view with no path prop (default fallback route) or index route.
     */
    function matchDefaultRoute(_v: ViewItem) {
      // Don't use view items with no path as default matches for different pathnames
      // This prevents index routes from incorrectly matching other routes
      return false;
    }
  }

  /**
   * Unmounts a view by clearing its match and setting mount to false.
   */
  private deactivateView = (viewItem: ViewItem) => {
    // Clear any pending deactivation
    const timeoutId = this.deactivationQueue.get(viewItem.id);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Schedule deactivation with a delay to prevent race conditions
    const timeout = setTimeout(() => {
      // Double-check the view should still be deactivated
      const currentMatch = matchPath({
        pathname: viewItem.routeData.match?.pathname || '',
        componentProps: viewItem.routeData.childProps,
      });

      if (!currentMatch) {
        viewItem.routeData.match = undefined;
        viewItem.mount = false;
      }

      this.deactivationQueue.delete(viewItem.id);
    }, 100); // 100ms delay to allow for re-renders

    this.deactivationQueue.set(viewItem.id, timeout);
  };

  /**
   * Override add to prevent duplicate view items with the same ID in the same outlet
   * But allow multiple view items for the same route path (for navigation history)
   */
  add = (viewItem: ViewItem) => {
    const existingViewItem = this.getViewItemsForOutlet(viewItem.outletId)
      .find(v => v.id === viewItem.id);
    
    if (existingViewItem) {
      console.log(`[ReactRouterViewStack] Preventing duplicate view item ${viewItem.id} in outlet ${viewItem.outletId}`);
      return;
    }
    
    console.log(`[ReactRouterViewStack] Adding view item ${viewItem.id} to outlet ${viewItem.outletId}`);
    super.add(viewItem);
  };

  /**
   * Override remove to clear any pending deactivations
   */
  remove = (viewItem: ViewItem) => {
    const timeoutId = this.deactivationQueue.get(viewItem.id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.deactivationQueue.delete(viewItem.id);
    }
    super.remove(viewItem);
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

// Note: createDefaultMatch function removed as it was unused
