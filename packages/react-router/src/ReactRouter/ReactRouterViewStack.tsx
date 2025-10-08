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
import { UNSAFE_RouteContext as RouteContext } from 'react-router-dom';

import { matchPath } from './utils/matchPath';

export class ReactRouterViewStack extends ViewStacks {
  private pendingViewItems: Map<string, ViewItem> = new Map();
  private deactivationQueue: Map<string, NodeJS.Timeout> = new Map();
  private viewItemCounter = 0;

  constructor() {
    super();
  }

  /**
   * Creates a new view item for the given outlet and react route element.
   * Associates route props with the matched route path for further lookups.
   */
  createViewItem = (outletId: string, reactElement: React.ReactElement, routeInfo: RouteInfo, page?: HTMLElement) => {
    const routePath = reactElement.props.path || '';

    // Check if we already have a view item for this exact route that we can reuse
    // Include wildcard routes like tabs/* since they should be reused
    // Also check unmounted items that might have been preserved for browser navigation
    const existingViewItem = this.getViewItemsForOutlet(outletId).find((v) => {
      const existingPath = v.reactElement?.props?.path || '';
      const existingElement = v.reactElement?.props?.element;
      const newElement = reactElement.props.element;

      // For Navigate components, match by destination
      if (existingElement?.type?.name === 'Navigate' && newElement?.type?.name === 'Navigate') {
        const existingTo = existingElement.props?.to;
        const newTo = newElement.props?.to;
        if (existingTo === newTo) {
          return true;
        }
      }

      // Reuse view items with the same path
      // Special case: reuse tabs/* and other specific wildcard routes
      // Don't reuse index routes (empty path) or generic catch-all wildcards (*)
      if (existingPath === routePath && existingPath !== '' && existingPath !== '*') {
        return true;
      }
      // Also reuse specific wildcard routes like tabs/*
      if (existingPath === routePath && existingPath.endsWith('/*') && existingPath !== '/*') {
        return true;
      }
      return false;
    });

    if (existingViewItem) {
      console.log(
        `[ReactRouterViewStack] Reusing existing view item ${existingViewItem.id} for route ${routeInfo.pathname}`
      );
      // Update and ensure the existing view item is properly configured
      existingViewItem.reactElement = reactElement;
      existingViewItem.mount = true;
      existingViewItem.ionPageElement = page || existingViewItem.ionPageElement;
      existingViewItem.routeData = {
        match: matchPath({
          pathname: routeInfo.pathname,
          componentProps: reactElement.props,
        }),
        childProps: reactElement.props,
        lastPathname: existingViewItem.routeData?.lastPathname, // Preserve navigation history
      };
      return existingViewItem;
    }

    // Create a truly unique ID by combining outlet ID with an incrementing counter
    this.viewItemCounter++;
    const id = `${outletId}-${this.viewItemCounter}`;

    console.log(
      `[ReactRouterViewStack] Creating new view item ${id} for route ${routeInfo.pathname} with path: ${routePath}`
    );

    // Add infinite loop detection with a more reasonable limit
    // In complex navigation flows, we may have many view items across different outlets
    if (this.viewItemCounter > 100) {
      console.warn(`[ReactRouterViewStack] Many view items created (${this.viewItemCounter}). Performing cleanup.`);
      // Clean up all outlets to prevent memory leaks
      this.getStackIds().forEach((stackId) => this.cleanupStaleViewItems(stackId));
      // Reset counter to a lower value after cleanup
      if (this.viewItemCounter > 100) {
        this.viewItemCounter = 50;
      }
    }

    const viewItem: ViewItem = {
      id,
      outletId,
      ionPageElement: page,
      reactElement,
      mount: true,
      ionRoute: true,
    };

    if (reactElement.type === IonRoute) {
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
    // For relative paths in nested outlets, we need to compute the relative pathname
    let pathnameToMatch = routeInfo.pathname;
    const routePath = viewItem.reactElement.props.path || '';

    // If this is a relative route (doesn't start with '/'), we need to extract the relative portion
    if (routePath && !routePath.startsWith('/')) {
      // Find the relative portion of the pathname for this nested outlet
      const pathSegments = routeInfo.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 1) {
        // For wildcard routes like "tabs/*", we need to match the remaining path segments
        // that would be captured by the wildcard
        if (routePath.endsWith('/*') || routePath.includes('*')) {
          // Extract the base path (everything before /*) and find its position in the segments
          const baseRoutePath = routePath.replace('/*', '');
          const baseSegmentIndex = pathSegments.findIndex((segment) => segment === baseRoutePath);

          if (baseSegmentIndex >= 0 && baseSegmentIndex < pathSegments.length - 1) {
            // Take all segments from the base route onwards
            // e.g., for "tabs/*" with "/routing/tabs/home", we want "tabs/home"
            const remainingSegments = pathSegments.slice(baseSegmentIndex);
            pathnameToMatch = remainingSegments.join('/');
          } else {
            // Fallback: for simple cases, take the last segment
            pathnameToMatch = pathSegments[pathSegments.length - 1];
          }
        } else {
          // For non-wildcard routes like "otherpage", take the last segment
          // e.g., for "otherpage" in outlet "main" with pathname "/routing/otherpage"
          // we want to match "otherpage" against "otherpage" (the last segment)
          pathnameToMatch = pathSegments[pathSegments.length - 1];
        }
      }
    }

    const match = matchComponent(viewItem.reactElement, pathnameToMatch);

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

    // Special handling for Navigate components - they should unmount after redirecting
    const elementComponent = viewItem.reactElement?.props?.element;
    if (elementComponent?.type?.name === 'Navigate') {
      // Navigate components should only be mounted when they match
      // Once they redirect (no longer match), they should be removed completely
      if (!match && viewItem.mount) {
        viewItem.mount = false;
        // Schedule removal of the Navigate view item after a short delay
        // This ensures the redirect completes before removal
        setTimeout(() => {
          this.remove(viewItem);
        }, 100);
      }
    }

    // Components that don't have IonPage elements and no longer match should be cleaned up
    // BUT we need to be careful not to remove them if they're part of browser navigation history
    // This handles components that perform immediate actions like programmatic navigation
    if (!match && viewItem.mount && !viewItem.ionPageElement) {
      // Check if this view item should be preserved for browser navigation
      // We'll keep it if it was recently active (within the last navigation)
      const shouldPreserve =
        viewItem.routeData.lastPathname === routeInfo.pathname ||
        viewItem.routeData.match?.pathname === routeInfo.lastPathname;

      if (!shouldPreserve) {
        // This view item doesn't match and doesn't have an IonPage
        // It's likely a utility component that performs an action and navigates away
        viewItem.mount = false;
        // Schedule removal to allow it to be recreated on next navigation
        setTimeout(() => {
          // Double-check before removing - the view might be needed again
          const stillNotNeeded = !viewItem.mount && !viewItem.ionPageElement;
          if (stillNotNeeded) {
            this.remove(viewItem);
          }
        }, 200);
      } else {
        // Preserve it but unmount it for now
        viewItem.mount = false;
      }
    }

    // Reactivate view if it matches but was previously deactivated
    if (match && !viewItem.mount) {
      viewItem.mount = true;
      viewItem.routeData.match = match;
    }

    // Deactivate wildcard routes when we have specific route matches
    // This prevents "Not found" from showing alongside valid routes
    if (routePath === '*') {
      // Check if any other view in this outlet has a match for the current route
      const hasSpecificMatch = this.getViewItemsForOutlet(viewItem.outletId).some((v) => {
        if (v.id === viewItem.id) return false; // Skip self
        const vRoutePath = v.reactElement?.props?.path || '';
        if (vRoutePath === '*' || vRoutePath === '') return false; // Skip other wildcard/empty routes

        // Check if this view item would match the current route
        let vPathnameToMatch = routeInfo.pathname;
        if (vRoutePath && !vRoutePath.startsWith('/')) {
          const pathSegments = routeInfo.pathname.split('/').filter(Boolean);
          if (pathSegments.length > 1) {
            vPathnameToMatch = pathSegments[pathSegments.length - 1];
          }
        }

        const vMatch = matchComponent(v.reactElement, vPathnameToMatch);
        const hasMatch = !!vMatch;

        return hasMatch;
      });

      if (hasSpecificMatch) {
        viewItem.mount = false;
      }
    }

    const routeElement = React.cloneElement(viewItem.reactElement);
    const componentElement = routeElement.props.element;

    // Create the route context value for React Router v6
    const routeMatch = viewItem.routeData?.match;
    const routeContextValue = {
      outlet: null,
      matches: [
        {
          params: routeMatch?.params || {},
          pathname: routeMatch?.pathname || routeInfo.pathname,
          pathnameBase: routeMatch?.pathnameBase || routeInfo.pathname,
          route: {
            id: viewItem.id,
            path: routeElement.props.path,
            element: componentElement,
            hasErrorBoundary: false,
          },
        },
      ],
      isDataRoute: false,
    };

    return (
      <ViewLifeCycleManager key={`view-${viewItem.id}`} mount={viewItem.mount} removeView={() => this.remove(viewItem)}>
        {/**
         * Wrap component in RouteContext to provide params for React Router v6
         */}
        <RouteContext.Provider value={routeContextValue}>{componentElement}</RouteContext.Provider>
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
        // Find view item by exact path match to avoid wildcard routes overwriting specific routes
        const childPath = (child.props as any).path;
        const viewItem = viewItems.find((v) => {
          const viewItemPath = v.reactElement?.props?.path;
          // Only update if paths match exactly (prevents wildcard routes from overwriting specific routes)
          return viewItemPath === childPath;
        });
        if (viewItem) {
          viewItem.reactElement = child;
        }
      }
    });

    // Filter out duplicate view items by ID (but keep all mounted items)
    const uniqueViewItems = viewItems.filter((viewItem, index, array) => {
      // Remove duplicates by ID (keep first occurrence)
      const isFirstOccurrence = array.findIndex((v) => v.id === viewItem.id) === index;
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

      // Fallback: If we did not find a pending item for this outlet, look for
      // a pending view item created under a different outlet for the same pathname
      // and adopt it into the current outlet. This can happen if an outlet remounts
      // (e.g., during browser forward navigation) and gets a new generated id.
      // Disable cross-outlet adoption for now; it can cause mismatches where
      // views are moved between outlets with different routing scopes.
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

    // If we still have not found a view item for this outlet, try to find a matching
    // view item across all outlets and adopt it into the current outlet. This helps
    // recover when an outlet remounts and receives a new id, leaving views associated
    // with the previous outlet id.
    // Do not adopt across outlets; if we didn't find a view for this outlet,
    // defer to route matching to create a new one.

    if (!viewItem && process.env.NODE_ENV !== 'production') {
      const allViewItems = this.getAllViewItems();
      console.warn(
        `[ReactRouterViewStack] No matching view item found for: ${pathname}. Available views:`,
        allViewItems
          .map((v) => `${v.id}(outlet:${v.outletId}, path:${v.routeData?.childProps?.path || 'undefined'})`)
          .join(', ')
      );
    }

    return { viewItem, match };

    /**
     * Matches a route path with dynamic parameters (e.g. /tabs/:id)
     */
    function matchView(v: ViewItem) {
      if (mustBeIonRoute && !v.ionRoute) return false;

      const viewItemPath = v.routeData.childProps.path || '';

      // For relative paths in nested outlets, we need to match against the appropriate pathname
      let pathnameToMatch = pathname;

      // If the view item has a relative path (doesn't start with '/'),
      // we should match it against the relative portion of the pathname
      if (viewItemPath && !viewItemPath.startsWith('/')) {
        // Extract the relative portion from the full pathname
        const pathSegments = pathname.split('/').filter(Boolean);
        if (pathSegments.length > 1) {
          // For wildcard routes like "tabs/*", we need to match the remaining path segments
          // that would be captured by the wildcard
          if (viewItemPath.endsWith('/*') || viewItemPath.includes('*')) {
            // Extract the base path (everything before /*) and find its position in the segments
            const baseRoutePath = viewItemPath.replace(/\/?\*$/, '');
            const baseSegmentIndex = pathSegments.findIndex((segment) => segment === baseRoutePath);

            if (baseSegmentIndex >= 0 && baseSegmentIndex < pathSegments.length - 1) {
              // Take all segments from the base route onwards
              // e.g., for "tabs/*" with "/routing/tabs/home", we want "tabs/home"
              const remainingSegments = pathSegments.slice(baseSegmentIndex);
              pathnameToMatch = remainingSegments.join('/');
            } else {
              // Fallback: for simple cases, take the last segment
              pathnameToMatch = pathSegments[pathSegments.length - 1];
            }
          } else {
            // For non-wildcard routes like "otherpage", take the last segment
            // e.g., for "otherpage" in outlet "main" with pathname "/routing/otherpage"
            // we want to match "otherpage" against "otherpage" (the last segment)
            const lastSegment = pathSegments[pathSegments.length - 1];
            if (viewItemPath === lastSegment) {
              pathnameToMatch = lastSegment;
            }
          }
        }
      }

      const result = matchPath({
        pathname: pathnameToMatch,
        componentProps: v.routeData.childProps,
      });

      if (result) {
        const hasParams = result.params && Object.keys(result.params).length > 0;
        const previousMatch = v.routeData?.match;
        const isSamePath = result.pathname === previousMatch?.pathname;

        // Don't allow view items with undefined paths to match specific routes
        // This prevents broken index route view items from interfering with navigation
        if (!viewItemPath && pathname !== '/' && pathname !== '') {
          return false;
        }

        // Accept matches in these cases:
        // - No params (exact string matches)
        // - Same path as previous match (parameter changes on same route)
        // - No previous match (first time matching this view)
        // - Previous match is compatible with current path
        if (!hasParams || isSamePath || !previousMatch) {
          match = result;
          viewItem = v;
          return true;
        } else {
          // For parameterized routes with previous matches, be more flexible
          // Allow the match if it's a related path or wildcard route
          const isWildcardRoute = viewItemPath.includes('*');
          const isParameterRoute = viewItemPath.includes(':');

          if (isParameterRoute) {
            match = result;
            viewItem = v;
            return true;
          } else if (isWildcardRoute) {
            match = result;
            viewItem = v;
            return true;
          }
        }
      }

      return false;
    }

    /**
     * Matches a view with no path prop (default fallback route) or index route.
     */
    function matchDefaultRoute(v: ViewItem): boolean {
      const childProps = v.routeData.childProps;

      const isDefaultRoute = childProps.path === undefined || childProps.path === '';
      const isIndexRoute = !!childProps.index;

      if (isDefaultRoute || isIndexRoute) {
        match = {
          params: {},
          pathname,
          pathnameBase: pathname === '' ? '/' : pathname,
          pattern: {
            path: '',
            caseSensitive: childProps.caseSensitive ?? false,
            end: true,
          },
        };
        viewItem = v;
        return true;
      }

      return false;
    }
  }

  /**
   * Clean up old, unmounted view items to prevent memory leaks
   */
  private cleanupStaleViewItems = (outletId: string) => {
    const viewItems = this.getViewItemsForOutlet(outletId);

    // Keep only the most recent mounted views and a few unmounted ones for history
    const maxUnmountedItems = 3;
    const unmountedItems = viewItems.filter((v) => !v.mount);

    if (unmountedItems.length > maxUnmountedItems) {
      // Remove oldest unmounted items
      const itemsToRemove = unmountedItems.slice(0, unmountedItems.length - maxUnmountedItems);
      itemsToRemove.forEach((item) => {
        this.remove(item);
      });
    }
  };

  /**
   * Override add to prevent duplicate view items with the same ID in the same outlet
   * But allow multiple view items for the same route path (for navigation history)
   */
  add = (viewItem: ViewItem) => {
    const existingViewItem = this.getViewItemsForOutlet(viewItem.outletId).find((v) => v.id === viewItem.id);

    if (existingViewItem) {
      return;
    }

    super.add(viewItem);

    // Clean up stale view items after adding new ones
    this.cleanupStaleViewItems(viewItem.outletId);
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
