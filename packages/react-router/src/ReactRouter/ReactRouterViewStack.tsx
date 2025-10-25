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

import { derivePathnameToMatch } from './utils/derivePathnameToMatch';
import { matchPath } from './utils/matchPath';

const createDefaultMatch = (
  fullPathname: string,
  routeProps: { path?: string; caseSensitive?: boolean; end?: boolean; index?: boolean }
): PathMatch<string> => {
  const isIndexRoute = !!routeProps.index;
  const patternPath = routeProps.path ?? '';
  const pathnameBase = fullPathname === '' ? '/' : fullPathname;
  const computedEnd =
    routeProps.end !== undefined ? routeProps.end : patternPath !== '' ? !patternPath.endsWith('*') : true;

  return {
    params: {},
    pathname: isIndexRoute ? '' : fullPathname,
    pathnameBase,
    pattern: {
      path: patternPath,
      caseSensitive: routeProps.caseSensitive ?? false,
      end: isIndexRoute ? true : computedEnd,
    },
  };
};

const ensureLeadingSlash = (value: string): string => {
  if (value === '') {
    return '/';
  }
  return value.startsWith('/') ? value : `/${value}`;
};

const normalizePathnameForComparison = (value: string | undefined): string => {
  if (!value || value === '') {
    return '/';
  }
  const withLeadingSlash = ensureLeadingSlash(value);
  return withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/') ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
};

const resolveIndexRouteMatch = (viewItem: ViewItem, pathname: string): PathMatch<string> | null => {
  if (!viewItem.routeData?.childProps?.index) {
    return null;
  }

  const previousMatch = viewItem.routeData?.match;
  if (!previousMatch) {
    return null;
  }

  const normalizedPathname = normalizePathnameForComparison(pathname);
  const normalizedBase = normalizePathnameForComparison(previousMatch.pathnameBase || previousMatch.pathname || '');

  return normalizedPathname === normalizedBase ? previousMatch : null;
};

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
      const existingRouteProps = v.reactElement?.props ?? {};
      const existingPath = existingRouteProps.path || '';
      const existingElement = existingRouteProps.element;
      const newElement = reactElement.props.element;
      const existingIsIndexRoute = !!existingRouteProps.index;
      const newIsIndexRoute = !!reactElement.props.index;

      // For Navigate components, match by destination
      if (existingElement?.type?.name === 'Navigate' && newElement?.type?.name === 'Navigate') {
        const existingTo = existingElement.props?.to;
        const newTo = newElement.props?.to;
        if (existingTo === newTo) {
          return true;
        }
      }

      if (existingIsIndexRoute && newIsIndexRoute) {
        return true;
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
      const updatedMatch =
        matchComponent(reactElement, routeInfo.pathname, false) ||
        existingViewItem.routeData?.match ||
        createDefaultMatch(routeInfo.pathname, reactElement.props);

      existingViewItem.routeData = {
        match: updatedMatch,
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

    const initialMatch =
      matchComponent(reactElement, routeInfo.pathname, true) || createDefaultMatch(routeInfo.pathname, reactElement.props);

    viewItem.routeData = {
      match: initialMatch,
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
    const routePath = viewItem.reactElement.props.path || '';
    let match = matchComponent(viewItem.reactElement, routeInfo.pathname);

    if (!match) {
      const indexMatch = resolveIndexRouteMatch(viewItem, routeInfo.pathname);
      if (indexMatch) {
        match = indexMatch;
      }
    }

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
        const vMatch = v.reactElement ? matchComponent(v.reactElement, routeInfo.pathname) : null;
        const hasMatch = !!vMatch;

        return hasMatch;
      });

      if (hasSpecificMatch) {
        viewItem.mount = false;
      }
    }

    const routeElement = React.cloneElement(viewItem.reactElement);
    const componentElement = routeElement.props.element;
    if (match && viewItem.routeData.match !== match) {
      viewItem.routeData.match = match;
    }
    const routeMatch = match || viewItem.routeData?.match;

    return (
      <RouteContext.Consumer key={`view-context-${viewItem.id}`}>
        {(parentContext) => {
          const parentMatches = parentContext?.matches ?? [];
          const accumulatedParentParams = parentMatches.reduce<Record<string, string | string[] | undefined>>(
            (acc, match) => {
              return { ...acc, ...match.params };
            },
            {}
          );

          const combinedParams = {
            ...accumulatedParentParams,
            ...(routeMatch?.params ?? {}),
          };

          const contextMatches = [
            ...parentMatches,
            {
              params: combinedParams,
              pathname: routeMatch?.pathname || routeInfo.pathname,
              pathnameBase: routeMatch?.pathnameBase || routeInfo.pathname,
              route: {
                id: viewItem.id,
                path: routeElement.props.path,
                element: componentElement,
                index: !!routeElement.props.index,
                caseSensitive: routeElement.props.caseSensitive,
                hasErrorBoundary: false,
              },
            },
          ];

          const routeContextValue = parentContext
            ? {
                ...parentContext,
                matches: contextMatches,
              }
            : {
                outlet: null,
                matches: contextMatches,
                isDataRoute: false,
              };

          return (
            <ViewLifeCycleManager
              key={`view-${viewItem.id}`}
              mount={viewItem.mount}
              removeView={() => this.remove(viewItem)}
            >
              <RouteContext.Provider value={routeContextValue}>{componentElement}</RouteContext.Provider>
            </ViewLifeCycleManager>
          );
        }}
      </RouteContext.Consumer>
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
  private findViewItemByPath(
    pathname: string,
    outletId?: string,
    mustBeIonRoute?: boolean,
    allowDefaultMatch = true
  ) {
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
      if (!viewItem && allowDefaultMatch) viewStack.some(matchDefaultRoute);
    } else {
      const viewItems = sortBySpecificity(this.getAllViewItems());
      viewItems.some(matchView);
      if (!viewItem && allowDefaultMatch) viewItems.some(matchDefaultRoute);
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
      const isIndexRoute = !!v.routeData.childProps.index;
      const previousMatch = v.routeData?.match;
      let result = v.reactElement ? matchComponent(v.reactElement, pathname) : null;

      if (!result) {
        const indexMatch = resolveIndexRouteMatch(v, pathname);
        if (indexMatch) {
          match = indexMatch;
          viewItem = v;
          return true;
        }
      }

      if (result) {
        const hasParams = result.params && Object.keys(result.params).length > 0;
        const isSamePath = result.pathname === previousMatch?.pathname;

        // Don't allow view items with undefined paths to match specific routes
        // This prevents broken index route view items from interfering with navigation
        if (!viewItemPath && !isIndexRoute && pathname !== '/' && pathname !== '') {
          return false;
        }

        if (!hasParams || isSamePath || !previousMatch) {
          match = result;
          viewItem = v;
          return true;
        }

        const isWildcardRoute = viewItemPath.includes('*');
        const isParameterRoute = viewItemPath.includes(':');

        if (isParameterRoute || isWildcardRoute) {
          match = result;
          viewItem = v;
          return true;
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

      if (isIndexRoute) {
        const indexMatch = resolveIndexRouteMatch(v, pathname);
        if (indexMatch) {
          match = indexMatch;
          viewItem = v;
          return true;
        }
        return false;
      }

      if (isDefaultRoute) {
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
function matchComponent(node: React.ReactElement, pathname: string, allowFallback = false) {
  const routeProps = node?.props ?? {};
  const routePath: string | undefined = routeProps.path;
  const pathnameToMatch = derivePathnameToMatch(pathname, routePath);

  const match = matchPath({
    pathname: pathnameToMatch,
    componentProps: routeProps,
  });

  if (match || !allowFallback) {
    return match;
  }

  const isIndexRoute = !!routeProps.index;

  if (isIndexRoute) {
    return createDefaultMatch(pathname, routeProps);
  }

  if (!routePath || routePath === '') {
    return createDefaultMatch(pathname, routeProps);
  }

  return null;
}
