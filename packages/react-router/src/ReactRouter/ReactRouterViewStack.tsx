/**
 * `ReactRouterViewStack` is a custom navigation manager used in Ionic React
 * apps to map React Router route elements (such as `<IonRoute>`) to "view
 * items" that Ionic can manage in a view stack. This is critical to maintain
 * Ionic’s animation, lifecycle, and history behavior across views.
 */

import type { RouteInfo, ViewItem } from '@ionic/react';
import { generateId, IonRoute, ViewLifeCycleManager, ViewStacks } from '@ionic/react';
import React from 'react';
import type { PathMatch } from 'react-router';
import { Navigate, UNSAFE_RouteContext as RouteContext } from 'react-router-dom';

import { analyzeRouteChildren, computeParentPath } from './utils/computeParentPath';
import { derivePathnameToMatch, matchPath } from './utils/pathMatching';
import { normalizePathnameForComparison } from './utils/pathNormalization';
import { extractRouteChildren, isNavigateElement } from './utils/routeElements';
import { sortViewsBySpecificity } from './utils/viewItemUtils';

/**
 * Delay in milliseconds before removing a Navigate view item after a redirect.
 * This ensures the redirect navigation completes before the view is removed.
 */
const NAVIGATE_REDIRECT_DELAY_MS = 100;

/**
 * Delay in milliseconds before cleaning up a view without an IonPage element.
 * This double-checks that the view is truly not needed before removal.
 */
const VIEW_CLEANUP_DELAY_MS = 200;

type RouteParams = Record<string, string | undefined>;

type RouteContextMatch = {
  params: RouteParams;
  pathname: string;
  pathnameBase: string;
  route: {
    id: string;
    path?: string;
    element: React.ReactNode;
    index: boolean;
    caseSensitive?: boolean;
    hasErrorBoundary: boolean;
  };
};

/**
 * Computes the absolute pathnameBase for a route element based on its type.
 * Handles relative paths, index routes, and splat routes differently.
 */
const computeAbsolutePathnameBase = (
  routeElement: React.ReactElement,
  routeMatch: PathMatch<string> | undefined,
  parentPathnameBase: string,
  routeInfoPathname: string
): string => {
  const routePath = routeElement.props.path;
  const isRelativePath = routePath && !routePath.startsWith('/');
  const isIndexRoute = !!routeElement.props.index;
  const isSplatOnlyRoute = routePath === '*' || routePath === '/*';

  if (isSplatOnlyRoute) {
    // Splat routes should NOT contribute their matched portion to pathnameBase
    // This aligns with React Router v7's v7_relativeSplatPath behavior
    return parentPathnameBase;
  }

  if (isRelativePath && routeMatch?.pathnameBase) {
    const relativeBase = routeMatch.pathnameBase.startsWith('/')
      ? routeMatch.pathnameBase.slice(1)
      : routeMatch.pathnameBase;
    return parentPathnameBase === '/' ? `/${relativeBase}` : `${parentPathnameBase}/${relativeBase}`;
  }

  if (isIndexRoute) {
    return parentPathnameBase;
  }

  return routeMatch?.pathnameBase || routeInfoPathname;
};

/**
 * Gets fallback params from view items in other outlets when parent context is empty.
 * This handles cases where React context propagation doesn't work as expected.
 */
const getFallbackParamsFromViewItems = (
  allViewItems: ViewItem[],
  currentOutletId: string,
  currentPathname: string
): RouteParams => {
  const params: RouteParams = {};

  for (const otherViewItem of allViewItems) {
    if (otherViewItem.outletId === currentOutletId) continue;

    const otherMatch = otherViewItem.routeData?.match;
    if (otherMatch?.params && Object.keys(otherMatch.params).length > 0) {
      const matchedPathname = otherMatch.pathnameBase || otherMatch.pathname;
      if (matchedPathname && currentPathname.startsWith(matchedPathname)) {
        Object.assign(params, otherMatch.params);
      }
    }
  }

  return params;
};

/**
 * Builds the matches array for RouteContext.
 */
const buildContextMatches = (
  parentMatches: RouteContextMatch[],
  combinedParams: RouteParams,
  routeMatch: PathMatch<string> | undefined,
  routeInfoPathname: string,
  absolutePathnameBase: string,
  viewItem: ViewItem,
  routeElement: React.ReactElement,
  componentElement: React.ReactNode
): RouteContextMatch[] => {
  return [
    ...parentMatches,
    {
      params: combinedParams,
      pathname: routeMatch?.pathname || routeInfoPathname,
      pathnameBase: absolutePathnameBase,
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
};

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

const computeRelativeToParent = (pathname: string, parentPath?: string): string | null => {
  if (!parentPath) return null;
  const normalizedParent = normalizePathnameForComparison(parentPath);
  const normalizedPathname = normalizePathnameForComparison(pathname);

  if (normalizedPathname === normalizedParent) {
    return '';
  }

  const withSlash = normalizedParent === '/' ? '/' : normalizedParent + '/';
  if (normalizedPathname.startsWith(withSlash)) {
    return normalizedPathname.slice(withSlash.length);
  }
  return null;
};

const resolveIndexRouteMatch = (
  viewItem: ViewItem,
  pathname: string,
  parentPath?: string
): PathMatch<string> | null => {
  if (!viewItem.routeData?.childProps?.index) {
    return null;
  }

  // Prefer computing against the parent path when available to align with RRv6 semantics
  const relative = computeRelativeToParent(pathname, parentPath);
  if (relative !== null) {
    // Index routes match only when there is no remaining path
    if (relative === '' || relative === '/') {
      return createDefaultMatch(parentPath || pathname, viewItem.routeData.childProps);
    }
    return null;
  }

  // Fallback: use previously computed match base for equality check
  const previousMatch = viewItem.routeData?.match;
  if (!previousMatch) {
    return null;
  }

  const normalizedPathname = normalizePathnameForComparison(pathname);
  const normalizedBase = normalizePathnameForComparison(previousMatch.pathnameBase || previousMatch.pathname || '');

  return normalizedPathname === normalizedBase ? previousMatch : null;
};

export class ReactRouterViewStack extends ViewStacks {
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
      const existingIsNavigate = React.isValidElement(existingElement) && existingElement.type === Navigate;
      const newIsNavigate = React.isValidElement(newElement) && newElement.type === Navigate;
      if (existingIsNavigate && newIsNavigate) {
        const existingTo = (existingElement.props as { to?: string })?.to;
        const newTo = (newElement.props as { to?: string })?.to;
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
        // Parameterized routes need pathname matching to ensure /details/1 and /details/2
        // get separate view items. For wildcard routes (e.g., user/:userId/*), compare
        // pathnameBase to allow child path changes while preserving the parent view.
        const hasParams = routePath.includes(':');
        const isWildcard = routePath.includes('*');
        if (hasParams) {
          if (isWildcard) {
            const existingPathnameBase = v.routeData?.match?.pathnameBase;
            const newMatch = matchComponent(reactElement, routeInfo.pathname, false);
            const newPathnameBase = newMatch?.pathnameBase;
            if (existingPathnameBase !== newPathnameBase) {
              return false;
            }
          } else {
            const existingPathname = v.routeData?.match?.pathname;
            if (existingPathname !== routeInfo.pathname) {
              return false;
            }
          }
        }
        return true;
      }
      // Also reuse specific wildcard routes like tabs/*
      if (existingPath === routePath && existingPath.endsWith('/*') && existingPath !== '/*') {
        return true;
      }
      return false;
    });

    if (existingViewItem) {
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

    const id = `${outletId}-${generateId(outletId)}`;

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
      matchComponent(reactElement, routeInfo.pathname, true) ||
      createDefaultMatch(routeInfo.pathname, reactElement.props);

    viewItem.routeData = {
      match: initialMatch,
      childProps: reactElement.props,
    };

    this.add(viewItem);

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
  private renderViewItem = (viewItem: ViewItem, routeInfo: RouteInfo, parentPath?: string) => {
    const routePath = viewItem.reactElement.props.path || '';
    let match = matchComponent(viewItem.reactElement, routeInfo.pathname);

    if (!match) {
      const indexMatch = resolveIndexRouteMatch(viewItem, routeInfo.pathname, parentPath);
      if (indexMatch) {
        match = indexMatch;
      }
    }

    // For parameterized routes, check if this is a navigation to a different path instance
    // In that case, we should NOT reuse this view - a new view should be created
    const isParameterRoute = routePath.includes(':');
    const previousMatch = viewItem.routeData?.match;
    const isSamePath = match?.pathname === previousMatch?.pathname;

    // Flag to indicate this view should not be reused for this different parameterized path
    const shouldSkipForDifferentParam = isParameterRoute && match && previousMatch && !isSamePath;

    // Don't deactivate views automatically - let the StackManager handle view lifecycle
    // This preserves views in the stack for navigation history like native apps
    // Views will be hidden/shown by the StackManager's transition logic instead of being unmounted

    // Special handling for Navigate components - they should unmount after redirecting
    const elementComponent = viewItem.reactElement?.props?.element;
    const isNavigateComponent = isNavigateElement(elementComponent);

    if (isNavigateComponent) {
      // Navigate components should only be mounted when they match
      // Once they redirect (no longer match), they should be removed completely
      // IMPORTANT: For index routes, we need to check indexMatch too since matchComponent
      // may not properly match index routes without explicit parent path context
      const indexMatch = viewItem.routeData?.childProps?.index
        ? resolveIndexRouteMatch(viewItem, routeInfo.pathname, parentPath)
        : null;
      const hasValidMatch = match || indexMatch;

      if (!hasValidMatch && viewItem.mount) {
        viewItem.mount = false;
        // Schedule removal of the Navigate view item after a short delay
        // This ensures the redirect completes before removal
        setTimeout(() => {
          this.remove(viewItem);
        }, NAVIGATE_REDIRECT_DELAY_MS);
      }
    }

    // Components that don't have IonPage elements and no longer match should be cleaned up
    // BUT we need to be careful not to remove them if they're part of browser navigation history
    // This handles components that perform immediate actions like programmatic navigation
    // EXCEPTION: Navigate components should ALWAYS remain mounted until they redirect
    // since they need to be rendered to trigger the navigation
    if (!match && viewItem.mount && !viewItem.ionPageElement && !isNavigateComponent) {
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
        }, VIEW_CLEANUP_DELAY_MS);
      } else {
        // Preserve it but unmount it for now
        viewItem.mount = false;
      }
    }

    // Reactivate view if it matches but was previously deactivated
    // Don't reactivate if this is a parameterized route navigating to a different path instance
    if (match && !viewItem.mount && !shouldSkipForDifferentParam) {
      viewItem.mount = true;
      viewItem.routeData.match = match;
    }

    // Deactivate wildcard routes and catch-all routes (empty path) when we have specific route matches
    // This prevents "Not found" or fallback pages from showing alongside valid routes
    if (routePath === '*' || routePath === '') {
      // Check if any other view in this outlet has a match for the current route
      const hasSpecificMatch = this.getViewItemsForOutlet(viewItem.outletId).some((v) => {
        if (v.id === viewItem.id) return false; // Skip self
        const vRoutePath = v.reactElement?.props?.path || '';
        if (vRoutePath === '*' || vRoutePath === '') return false; // Skip other wildcard/empty routes

        // Check if this view item would match the current route
        const vMatch = v.reactElement ? matchComponent(v.reactElement, routeInfo.pathname) : null;
        return !!vMatch;
      });

      if (hasSpecificMatch) {
        viewItem.mount = false;
        if (viewItem.ionPageElement) {
          viewItem.ionPageElement.classList.add('ion-page-hidden');
          viewItem.ionPageElement.setAttribute('aria-hidden', 'true');
        }
      }
    }

    const routeElement = React.cloneElement(viewItem.reactElement);
    const componentElement = routeElement.props.element;
    // Don't update match for parameterized routes navigating to different path instances
    // This preserves the original match so that findViewItemByPath can correctly skip this view
    if (match && viewItem.routeData.match !== match && !shouldSkipForDifferentParam) {
      viewItem.routeData.match = match;
    }
    const routeMatch = shouldSkipForDifferentParam ? viewItem.routeData?.match : match || viewItem.routeData?.match;

    return (
      <RouteContext.Consumer key={`view-context-${viewItem.id}`}>
        {(parentContext) => {
          const parentMatches = (parentContext?.matches ?? []) as RouteContextMatch[];

          // Accumulate params from parent matches, with fallback to other outlets
          let accumulatedParentParams = parentMatches.reduce<RouteParams>((acc, m) => ({ ...acc, ...m.params }), {});
          if (parentMatches.length === 0 && Object.keys(accumulatedParentParams).length === 0) {
            accumulatedParentParams = getFallbackParamsFromViewItems(
              this.getAllViewItems(),
              viewItem.outletId,
              routeInfo.pathname
            );
          }

          const combinedParams = { ...accumulatedParentParams, ...(routeMatch?.params ?? {}) };
          const parentPathnameBase =
            parentMatches.length > 0 ? parentMatches[parentMatches.length - 1].pathnameBase : '/';
          const absolutePathnameBase = computeAbsolutePathnameBase(
            routeElement,
            routeMatch,
            parentPathnameBase,
            routeInfo.pathname
          );

          const contextMatches = buildContextMatches(
            parentMatches,
            combinedParams,
            routeMatch,
            routeInfo.pathname,
            absolutePathnameBase,
            viewItem,
            routeElement,
            componentElement
          );

          const routeContextValue = parentContext
            ? { ...parentContext, matches: contextMatches }
            : { outlet: null, matches: contextMatches, isDataRoute: false };

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

    // Determine parentPath for nested outlets to properly evaluate index routes
    let parentPath: string | undefined = undefined;
    try {
      // Only attempt parent path computation for non-root outlets
      // Root outlets have IDs like 'routerOutlet' or 'routerOutlet-2'
      const isRootOutlet = outletId.startsWith('routerOutlet');
      if (!isRootOutlet) {
        const routeChildren = extractRouteChildren(ionRouterOutlet.props.children);
        const { hasRelativeRoutes, hasIndexRoute, hasWildcardRoute } = analyzeRouteChildren(routeChildren);

        if (hasRelativeRoutes || hasIndexRoute) {
          const result = computeParentPath({
            currentPathname: routeInfo.pathname,
            outletMountPath: undefined,
            routeChildren,
            hasRelativeRoutes,
            hasIndexRoute,
            hasWildcardRoute,
          });
          parentPath = result.parentPath;
        }
      }
    } catch (e) {
      // Non-fatal: if we fail to compute parentPath, fall back to previous behavior
    }

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

    // Filter out unmounted Navigate components to prevent them from being rendered
    // and triggering unwanted redirects
    const renderableViewItems = uniqueViewItems.filter((viewItem) => {
      const elementComponent = viewItem.reactElement?.props?.element;
      const isNavigateComponent = isNavigateElement(elementComponent);

      // Exclude unmounted Navigate components from rendering
      if (isNavigateComponent && !viewItem.mount) {
        return false;
      }

      // Filter out views that are unmounted, have no ionPageElement, and don't match the current route.
      // These are "stale" views from previous routes that should not be rendered.
      // Views WITH ionPageElement are handled by the normal lifecycle events.
      // Views that MATCH the current route should be kept (they might be transitioning).
      if (!viewItem.mount && !viewItem.ionPageElement) {
        // Check if this view's route path matches the current pathname
        const viewRoutePath = viewItem.reactElement?.props?.path as string | undefined;
        if (viewRoutePath) {
          // First try exact match using matchComponent
          const routeMatch = matchComponent(viewItem.reactElement, routeInfo.pathname);
          if (routeMatch) {
            // View matches current route, keep it
            return true;
          }

          // For parent routes (like /multiple-tabs or /routing), check if current pathname
          // starts with this route's path. This handles views with IonSplitPane/IonTabs
          // that don't have IonPage but should remain mounted while navigating within their children.
          const normalizedViewPath = normalizePathnameForComparison(viewRoutePath.replace(/\/?\*$/, '')); // Remove trailing wildcard
          const normalizedCurrentPath = normalizePathnameForComparison(routeInfo.pathname);

          // Check if current pathname is within this view's route hierarchy
          const isWithinRouteHierarchy =
            normalizedCurrentPath === normalizedViewPath || normalizedCurrentPath.startsWith(normalizedViewPath + '/');

          if (!isWithinRouteHierarchy) {
            // View is outside current route hierarchy, remove it
            setTimeout(() => {
              this.remove(viewItem);
            }, 0);
            return false;
          }
        }
      }

      return true;
    });

    const renderedItems = renderableViewItems.map((viewItem) => this.renderViewItem(viewItem, routeInfo, parentPath));
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
  private findViewItemByPath(pathname: string, outletId?: string, mustBeIonRoute?: boolean, allowDefaultMatch = true) {
    let viewItem: ViewItem | undefined;
    let match: PathMatch<string> | null = null;
    let viewStack: ViewItem[];

    if (outletId) {
      viewStack = sortViewsBySpecificity(this.getViewItemsForOutlet(outletId));
      viewStack.some(matchView);
      if (!viewItem && allowDefaultMatch) viewStack.some(matchDefaultRoute);
    } else {
      const viewItems = sortViewsBySpecificity(this.getAllViewItems());
      viewItems.some(matchView);
      if (!viewItem && allowDefaultMatch) viewItems.some(matchDefaultRoute);
    }

    // If we still have not found a view item for this outlet, try to find a matching
    // view item across all outlets and adopt it into the current outlet. This helps
    // recover when an outlet remounts and receives a new id, leaving views associated
    // with the previous outlet id.
    // Do not adopt across outlets; if we didn't find a view for this outlet,
    // defer to route matching to create a new one.

    return { viewItem, match };

    /**
     * Matches a route path with dynamic parameters (e.g. /tabs/:id)
     */
    function matchView(v: ViewItem) {
      if (mustBeIonRoute && !v.ionRoute) return false;

      const viewItemPath = v.routeData.childProps.path || '';
      const isIndexRoute = !!v.routeData.childProps.index;
      const previousMatch = v.routeData?.match;
      const result = v.reactElement ? matchComponent(v.reactElement, pathname) : null;

      if (!result) {
        const indexMatch = resolveIndexRouteMatch(v, pathname, undefined);
        if (indexMatch) {
          match = indexMatch;
          viewItem = v;
          return true;
        }
      }

      if (result) {
        const hasParams = result.params && Object.keys(result.params).length > 0;
        const isSamePath = result.pathname === previousMatch?.pathname;
        const isWildcardRoute = viewItemPath.includes('*');
        const isParameterRoute = viewItemPath.includes(':');

        // Don't allow view items with undefined paths to match specific routes
        // This prevents broken index route view items from interfering with navigation
        if (!viewItemPath && !isIndexRoute && pathname !== '/' && pathname !== '') {
          return false;
        }

        // For parameterized routes, check if we should reuse the view item.
        // Wildcard routes (e.g., user/:userId/*) compare pathnameBase to allow
        // child path changes while preserving the parent view.
        if (isParameterRoute && !isSamePath) {
          if (isWildcardRoute) {
            const isSameBase = result.pathnameBase === previousMatch?.pathnameBase;
            if (isSameBase) {
              match = result;
              viewItem = v;
              return true;
            }
          }
          return false;
        }

        // For routes without params, or when navigating to the exact same path,
        // or when there's no previous match, reuse the view item
        if (!hasParams || isSamePath || !previousMatch) {
          match = result;
          viewItem = v;
          return true;
        }

        // For pure wildcard routes (without : params), compare pathnameBase to allow
        // child path changes while preserving the parent view. This handles container
        // routes like /tabs/* where switching between /tabs/tab1 and /tabs/tab2
        // should reuse the same ViewItem.
        if (isWildcardRoute && !isParameterRoute) {
          const isSameBase = result.pathnameBase === previousMatch?.pathnameBase;
          if (isSameBase) {
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

      if (isIndexRoute) {
        const indexMatch = resolveIndexRouteMatch(v, pathname, undefined);
        if (indexMatch) {
          match = indexMatch;
          viewItem = v;
          return true;
        }
        return false;
      }

      // For empty path routes, only match if we're at the same level as when the view was created.
      // This prevents an empty path view item from being reused for different routes.
      if (isDefaultRoute) {
        const previousPathnameBase = v.routeData?.match?.pathnameBase || '';
        const normalizedBase = normalizePathnameForComparison(previousPathnameBase);
        const normalizedPathname = normalizePathnameForComparison(pathname);

        if (normalizedPathname !== normalizedBase) {
          return false;
        }

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

    this.cleanupStaleViewItems(viewItem.outletId);
  };

  /**
   * Override remove
   */
  remove = (viewItem: ViewItem) => {
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
