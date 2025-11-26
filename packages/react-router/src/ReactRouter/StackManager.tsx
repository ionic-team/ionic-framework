/**
 * `StackManager` is responsible for managing page transitions, keeping track
 * of views (pages), and ensuring that navigation behaves like native apps —
 * particularly with animations and swipe gestures.
 */

import type { RouteInfo, StackContextState, ViewItem } from '@ionic/react';
import { RouteManagerContext, StackContext, generateId, getConfig } from '@ionic/react';
import React from 'react';
import { Navigate, Route } from 'react-router-dom';

import { clonePageElement } from './clonePageElement';
import { findRoutesNode } from './utils/findRoutesNode';
import { derivePathnameToMatch } from './utils/derivePathnameToMatch';
import { matchPath } from './utils/matchPath';

/**
 * Checks if a route is a specific match (not wildcard or index).
 */
const isSpecificRouteMatch = (route: React.ReactElement, remainingPath: string) => {
  const routePath = route.props.path;
  const isWildcardOnly = routePath === '*' || routePath === '/*';
  const isIndex = route.props.index;

  // Skip wildcards and index routes
  if (isIndex || isWildcardOnly) {
    return false;
  }

  return !!matchPath({
    pathname: remainingPath,
    componentProps: route.props,
  });
};

// TODO(FW-2959): types

interface StackManagerProps {
  routeInfo: RouteInfo;
  id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StackManagerState {}

const isViewVisible = (el: HTMLElement) =>
  !el.classList.contains('ion-page-invisible') && !el.classList.contains('ion-page-hidden');

export class StackManager extends React.PureComponent<StackManagerProps, StackManagerState> {
  id: string; // Unique id for the router outlet aka outletId
  context!: React.ContextType<typeof RouteManagerContext>;
  ionRouterOutlet?: React.ReactElement;
  routerOutletElement: HTMLIonRouterOutletElement | undefined;
  prevProps?: StackManagerProps;
  skipTransition: boolean;

  stackContextValue: StackContextState = {
    registerIonPage: this.registerIonPage.bind(this),
    isInOutlet: () => true,
  };

  private clearOutletTimeout: any;
  private pendingPageTransition = false;
  private waitingForIonPage = false;
  private ionPageWaitTimeout?: ReturnType<typeof setTimeout>;
  private outOfScopeUnmountTimeout?: ReturnType<typeof setTimeout>;
  /**
   * Track the last transition's entering and leaving view IDs to prevent
   * duplicate transitions during rapid navigation (e.g., Navigate redirects)
   */
  private lastTransition?: { enteringId: string; leavingId?: string };

  constructor(props: StackManagerProps) {
    super(props);
    this.registerIonPage = this.registerIonPage.bind(this);
    this.transitionPage = this.transitionPage.bind(this);
    this.handlePageTransition = this.handlePageTransition.bind(this);
    // Use provided id prop if available; otherwise generate a unique id.
    this.id = props.id || `routerOutlet-${generateId('routerOutlet')}`;
    this.prevProps = undefined;
    this.skipTransition = false;
  }

  private outletMountPath: string | undefined = undefined;

  /**
   * Determines the parent path that was matched to reach this outlet.
   * This helps with nested routing in React Router 6.
   *
   * The algorithm finds the shortest parent path where a route matches the remaining path.
   * Priority: specific routes > wildcard routes > index routes (only at mount point)
   */
  private getParentPath(): string | undefined {
    const currentPathname = this.props.routeInfo.pathname;

    // If this outlet previously established a mount path and the current
    // pathname is outside of that scope, do not attempt to re-compute a new
    // parent path. This prevents out-of-scope outlets from "adopting"
    // unrelated routes (e.g., matching their index route under /overlays).
    if (this.outletMountPath && !currentPathname.startsWith(this.outletMountPath)) {
      return undefined;
    }

    // If this is a nested outlet (has an explicit ID like "main"),
    // we need to figure out what part of the path was already matched
    if (this.id !== 'routerOutlet' && this.ionRouterOutlet) {
      // Check if this outlet has relative routes (routes that don't start with /)
      const routesNode = findRoutesNode(this.ionRouterOutlet.props.children) ?? this.ionRouterOutlet.props.children;
      const routeChildren = React.Children.toArray(routesNode).filter(
        (child): child is React.ReactElement => React.isValidElement(child) && child.type === Route
      );

      const hasRelativeRoutes = routeChildren.some((route) => {
        const path = route.props.path;
        const isRelative = path && !path.startsWith('/') && path !== '*';
        return isRelative;
      });

      const hasIndexRoute = routeChildren.some((route) => route.props.index);
      const hasWildcardRoute = routeChildren.some((route) => {
        const routePath = route.props.path;
        return routePath === '*' || routePath === '/*';
      });

      if ((hasRelativeRoutes || hasIndexRoute) && currentPathname.includes('/')) {
        const segments = currentPathname.split('/').filter(Boolean);

        if (segments.length >= 1) {
          // Find matches at each level, keeping track of the FIRST (shortest) match
          let firstSpecificMatch: string | undefined = undefined;
          let firstWildcardMatch: string | undefined = undefined;
          let indexMatchAtMount: string | undefined = undefined;

          for (let i = 1; i <= segments.length; i++) {
            const parentPath = '/' + segments.slice(0, i).join('/');
            const remainingPath = segments.slice(i).join('/');

            // Check for specific (non-wildcard, non-index) route matches
            const hasSpecificMatch = routeChildren.some((route) => isSpecificRouteMatch(route, remainingPath));
            if (hasSpecificMatch && !firstSpecificMatch) {
              firstSpecificMatch = parentPath;
              // Found a specific match - this is our answer for non-index routes
              break;
            }

            // Check if wildcard would match this remaining path
            // Only if remaining is non-empty (wildcard needs something to match)
            if (remainingPath !== '' && remainingPath !== '/' && hasWildcardRoute && !firstWildcardMatch) {
              // Check if any specific route could plausibly match this remaining path
              const remainingFirstSegment = remainingPath.split('/')[0];
              const couldAnyRouteMatch = routeChildren.some((route) => {
                const routePath = route.props.path as string | undefined;
                if (!routePath || routePath === '*' || routePath === '/*') return false;
                if (route.props.index) return false;

                const routeFirstSegment = routePath.split('/')[0].replace(/[*:]/g, '');
                if (!routeFirstSegment) return false;

                // Check for prefix overlap (either direction)
                return routeFirstSegment.startsWith(remainingFirstSegment.slice(0, 3)) ||
                       remainingFirstSegment.startsWith(routeFirstSegment.slice(0, 3));
              });

              // Only save wildcard match if no specific route could match
              if (!couldAnyRouteMatch) {
                firstWildcardMatch = parentPath;
                // Continue looking - might find a specific match at a longer path
              }
            }

            // Check for index route match when remaining path is empty
            // BUT only at the outlet's mount path level
            if ((remainingPath === '' || remainingPath === '/') && hasIndexRoute) {
              // Index route matches when current path exactly matches the mount path
              // If we already have an outletMountPath, index should only match there
              if (this.outletMountPath) {
                if (parentPath === this.outletMountPath) {
                  indexMatchAtMount = parentPath;
                }
              } else {
                // No mount path set yet - index would establish this as mount path
                // But only if we haven't found a better match
                indexMatchAtMount = parentPath;
              }
            }
          }

          // Determine the best parent path:
          // 1. Specific match (routes like tabs/*, favorites) - highest priority
          // 2. Wildcard match (route path="*") - catches unmatched segments
          // 3. Index match - only valid at the outlet's mount point, not deeper
          let bestPath: string | undefined = undefined;

          if (firstSpecificMatch) {
            bestPath = firstSpecificMatch;
          } else if (firstWildcardMatch) {
            bestPath = firstWildcardMatch;
          } else if (indexMatchAtMount) {
            // Only use index match if no specific or wildcard matched
            // This handles the case where pathname exactly matches the mount path
            bestPath = indexMatchAtMount;
          }

          // Store the mount path when we first successfully match a route
          if (!this.outletMountPath && bestPath) {
            this.outletMountPath = bestPath;
          }

          // If we have a mount path, verify the current pathname is within scope
          if (this.outletMountPath && !currentPathname.startsWith(this.outletMountPath)) {
            return undefined;
          }

          return bestPath;
        }
      }
    }
    return this.outletMountPath;
  }

  componentDidMount() {
    if (this.clearOutletTimeout) {
      /**
       * The clearOutlet integration with React Router is a bit hacky.
       * It uses a timeout to clear the outlet after a transition.
       * In React v18, components are mounted and unmounted in development mode
       * to check for side effects.
       *
       * This clearTimeout prevents the outlet from being cleared when the component is re-mounted,
       * which should only happen in development mode and as a result of a hot reload.
       */
      clearTimeout(this.clearOutletTimeout);
    }
    if (this.routerOutletElement) {
      this.setupRouterOutlet(this.routerOutletElement);
      this.handlePageTransition(this.props.routeInfo);
    }
  }

  componentDidUpdate(prevProps: StackManagerProps) {
    const { pathname } = this.props.routeInfo;
    const { pathname: prevPathname } = prevProps.routeInfo;

    if (pathname !== prevPathname) {
      this.prevProps = prevProps;
      this.handlePageTransition(this.props.routeInfo);
    } else if (this.pendingPageTransition) {
      this.handlePageTransition(this.props.routeInfo);
      this.pendingPageTransition = false;
    }
  }

  componentWillUnmount() {
    if (this.ionPageWaitTimeout) {
      clearTimeout(this.ionPageWaitTimeout);
      this.ionPageWaitTimeout = undefined;
    }
    if (this.outOfScopeUnmountTimeout) {
      clearTimeout(this.outOfScopeUnmountTimeout);
      this.outOfScopeUnmountTimeout = undefined;
    }
    this.waitingForIonPage = false;
    this.clearOutletTimeout = this.context.clearOutlet(this.id);
  }

  /**
   * Sets the transition between pages within this router outlet.
   * This function determines the entering and leaving views based on the
   * provided route information and triggers the appropriate animation.
   * It also handles scenarios like initial loads, back navigation, and
   * navigation to the same view with different parameters.
   *
   * @param routeInfo It contains info about the current route,
   * the previous route, and the action taken (e.g., push, replace).
   *
   * @returns A promise that resolves when the transition is complete.
   * If no transition is needed or if the router outlet isn't ready,
   * the Promise may resolve immediately.
   */
  async handlePageTransition(routeInfo: RouteInfo) {
    if (!this.routerOutletElement || !this.routerOutletElement.commit) {
      /**
       * The route outlet has not mounted yet (i.e., not in the DOM yet).
       * We need to wait for it to render before we can transition the page.
       *
       * Set a flag to indicate that we should transition the page after
       * the component has updated (i.e., in `componentDidUpdate`).
       */
      this.pendingPageTransition = true;
    } else {
      let enteringViewItem = this.context.findViewItemByRouteInfo(routeInfo, this.id);
      let leavingViewItem = this.context.findLeavingViewItemByRouteInfo(routeInfo, this.id);

      /**
       * If we don't have a leaving view item, but the route info indicates
       * that the user has routed from a previous path, then the leaving view
       * can be found by the last known pathname.
       */
      if (!leavingViewItem && routeInfo.prevRouteLastPathname) {
        leavingViewItem = this.context.findViewItemByPathname(routeInfo.prevRouteLastPathname, this.id);
      }

      /**
       * Special case for redirects: When a redirect happens inside a nested route,
       * the entering and leaving view might be the same (the container route like tabs/*).
       * In this case, we need to look at prevRouteLastPathname to find the actual
       * view we're transitioning away from (e.g., favorites when going from
       * /favorites -> /tabs -> /tabs/home via redirect).
       */
      if (
        enteringViewItem &&
        leavingViewItem &&
        enteringViewItem === leavingViewItem &&
        routeInfo.routeAction === 'replace' &&
        routeInfo.prevRouteLastPathname
      ) {
        const actualLeavingView = this.context.findViewItemByPathname(routeInfo.prevRouteLastPathname, this.id);
        if (actualLeavingView && actualLeavingView !== enteringViewItem) {
          leavingViewItem = actualLeavingView;
        }
      }

      /**
       * Also check if we're in a redirect scenario where entering and leaving are different
       * but we still need to handle the actual previous view. This handles cases where
       * lastPathname doesn't match a view but prevRouteLastPathname does.
       */
      if (
        enteringViewItem &&
        !leavingViewItem &&
        routeInfo.routeAction === 'replace' &&
        routeInfo.prevRouteLastPathname
      ) {
        const actualLeavingView = this.context.findViewItemByPathname(routeInfo.prevRouteLastPathname, this.id);
        if (actualLeavingView && actualLeavingView !== enteringViewItem) {
          leavingViewItem = actualLeavingView;
        }
      }

      /**
       * The leaving view item should be unmounted in the following cases:
       * - Navigating with `replace` (not within a nested outlet container route)
       * - Navigating forward but not pushing a new view (e.g., back navigation or non-animated transition) and the leaving view is not the same as the entering view
       *
       * NOTE: routeOptions.unmount is handled separately - it means the React component should unmount,
       * but the DOM element should remain hidden for tab navigation purposes.
       * The view item should NOT be removed from the stack when routeOptions.unmount is used,
       * as we may need to show it again when navigating back.
       */
      const shouldUnmountLeavingViewItem = (() => {
        if (!leavingViewItem) {
          return false;
        }

        // routeOptions.unmount should NOT trigger view removal - it just hides the view
        // The view needs to remain in the stack for tab navigation and back navigation
        // Don't set mount = false, just let the transition hide the page
        // if (routeInfo.routeOptions?.unmount) {
        //   return true;
        // }

        if (routeInfo.routeAction === 'replace') {
          return true;
        }

        const isForwardPush = routeInfo.routeAction === 'push' && (routeInfo as any).routeDirection === 'forward';
        if (!isForwardPush && routeInfo.routeDirection !== 'none' && enteringViewItem !== leavingViewItem) {
          return true;
        }

        return false;
      })();

      // Match the route element to render
      // For nested outlets, we need to pass parent path info
      const parentPath = this.getParentPath();

      // CRITICAL: If we have a mount path and current route is outside of it,
      // don't process any routes in this outlet - it's completely out of scope
      if (this.outletMountPath && !routeInfo.pathname.startsWith(this.outletMountPath)) {
        // Clear any pending unmount timeout to avoid conflicts
        if (this.outOfScopeUnmountTimeout) {
          clearTimeout(this.outOfScopeUnmountTimeout);
          this.outOfScopeUnmountTimeout = undefined;
        }

        // When an outlet is out of scope, unmount its views immediately
        // No transition is happening in this outlet - the transition is in the parent
        const allViewsInOutlet = this.context.getViewItemsForOutlet
          ? this.context.getViewItemsForOutlet(this.id)
          : [];

        // Unmount and remove all views in this outlet immediately to avoid leftover content
        allViewsInOutlet.forEach((viewItem) => {
          if (viewItem.ionPageElement) {
            viewItem.ionPageElement.classList.add('ion-page-hidden');
            viewItem.ionPageElement.setAttribute('aria-hidden', 'true');
          }
          // Remove the view from the stack so it is no longer rendered
          this.context.unMountViewItem(viewItem);
        });

        // Do not reset outletMountPath here; keeping it prevents this outlet
        // from re-adopting an unrelated parent path on subsequent navigations.
        this.forceUpdate();
        return;
      }

      // Clear any pending out-of-scope unmount timeout since we're processing an in-scope route
      if (this.outOfScopeUnmountTimeout) {
        clearTimeout(this.outOfScopeUnmountTimeout);
        this.outOfScopeUnmountTimeout = undefined;
      }

      // If this is a nested outlet with relative routes but no valid parent path,
      // it means the outlet is outside its expected routing context
      if (this.id !== 'routerOutlet' && parentPath === undefined && this.ionRouterOutlet) {
        const routesNode = findRoutesNode(this.ionRouterOutlet.props.children) ?? this.ionRouterOutlet.props.children;
        const routeChildren = React.Children.toArray(routesNode).filter(
          (child): child is React.ReactElement => React.isValidElement(child) && child.type === Route
        );

        const hasRelativeRoutes = routeChildren.some((route) => {
          const path = route.props.path;
          return path && !path.startsWith('/') && path !== '*';
        });

        if (hasRelativeRoutes) {
          // Hide any visible views in this outlet since it's out of scope
          if (leavingViewItem && leavingViewItem.ionPageElement) {
            leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
            leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
          }
          if (leavingViewItem) {
            leavingViewItem.mount = false;
          }
          this.forceUpdate();
          return;
        }
      }

      const enteringRoute = findRouteByRouteInfo(
        this.ionRouterOutlet?.props.children,
        routeInfo,
        parentPath
      ) as React.ReactElement;

      // If this is a nested outlet (has an explicit ID) and no route matches,
      // it means this outlet shouldn't handle this route
      if (this.id !== 'routerOutlet' && !enteringRoute && !enteringViewItem) {
        // Hide any visible views in this outlet since it has no matching route
        if (leavingViewItem && leavingViewItem.ionPageElement) {
          leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
          leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
        }
        // Unmount the leaving view to prevent components from staying active
        if (leavingViewItem) {
          leavingViewItem.mount = false;
        }
        this.forceUpdate();
        return;
      }

      /**
       * If we already have a view item for this route, update its element.
       * Otherwise, create a new view item for the route.
       */
      if (enteringViewItem && enteringRoute) {
        // Update existing view item
        enteringViewItem.reactElement = enteringRoute;
      } else if (enteringRoute) {
        enteringViewItem = this.context.createViewItem(this.id, enteringRoute, routeInfo);
        this.context.addViewItem(enteringViewItem);
      }

      /**
       * Begin transition only if we have an ionPageElement (i.e., the page has rendered).
       */
      if (enteringViewItem && enteringViewItem.ionPageElement) {
        if (this.waitingForIonPage) {
          this.waitingForIonPage = false;
        }
        if (this.ionPageWaitTimeout) {
          clearTimeout(this.ionPageWaitTimeout);
          this.ionPageWaitTimeout = undefined;
        }

        // Ensure the entering view is not hidden by ion-page-hidden from previous navigations
        const enteringEl = enteringViewItem.ionPageElement as HTMLElement;
        if (enteringEl.classList.contains('ion-page-hidden')) {
          enteringEl.classList.remove('ion-page-hidden');
          enteringEl.removeAttribute('aria-hidden');
        }

        /**
         * If the entering view item is the same as the leaving view item,
         * then we don't need to transition.
         */
        if (enteringViewItem === leavingViewItem) {
          const routePath = enteringViewItem.reactElement?.props?.path as string | undefined;
          const isParameterizedRoute = routePath ? routePath.includes(':') : false;

          if (isParameterizedRoute) {
            /**
             * When the same view instance handles the new route (e.g. navigating between
             * parameterised URLs), refresh its match metadata so the component receives
             * the updated params, then skip triggering another transition.
             */
            const updatedMatch = matchComponent(enteringViewItem.reactElement, routeInfo.pathname, true);
            if (updatedMatch) {
              enteringViewItem.routeData.match = updatedMatch;
            }

            const enteringEl = enteringViewItem.ionPageElement;
            if (enteringEl) {
              enteringEl.classList.remove('ion-page-hidden', 'ion-page-invisible');
              enteringEl.removeAttribute('aria-hidden');
            }

            this.forceUpdate();
            return;
          }
        }

        /**
         * If the leaving view is still not found, especially during a
         * 'pop' (back navigation) operation, try to retrieve it using the
         * previous route information that was available as a prop on the
         * component.
         */
        if (!leavingViewItem && this.props.routeInfo.prevRouteLastPathname) {
          leavingViewItem = this.context.findViewItemByPathname(this.props.routeInfo.prevRouteLastPathname, this.id);
        }

        /**
         * If the entering view is already visible and the leaving view is not, the transition does not need to occur.
         */
        if (
          enteringViewItem.ionPageElement &&
          isViewVisible(enteringViewItem.ionPageElement) &&
          leavingViewItem !== undefined &&
          leavingViewItem.ionPageElement &&
          !isViewVisible(leavingViewItem.ionPageElement)
        ) {
          return;
        }

        /**
         * The view should only be transitioned in the following cases:
         * 1. Performing a replace or pop action, such as a swipe to go back gesture
         * to animation the leaving view off the screen.
         *
         * 2. Navigating between top-level router outlets, such as /page-1 to /page-2;
         * or navigating within a nested outlet, such as /tabs/tab-1 to /tabs/tab-2.
         *
         * 3. The entering view is an ion-router-outlet containing a page
         * matching the current route and that hasn't already transitioned in.
         *
         * This should only happen when navigating directly to a nested router outlet
         * route or on an initial page load (i.e. refreshing). In cases when loading
         * /tabs/tab-1, we need to transition the /tabs page element into the view.
         */

        /**
         * Check if we've already started a transition for the same entering/leaving pair.
         * This can happen during rapid navigation (e.g., Navigate redirects) where
         * multiple handlePageTransition calls occur before the first transition completes.
         *
         * Only skip if there's an actual leaving view involved - we don't want to skip
         * transitions where leaving is undefined as those could be legitimate initial loads
         * or transitions to new views.
         */
        const currentTransition = {
          enteringId: enteringViewItem.id,
          leavingId: leavingViewItem?.id,
        };

        if (
          leavingViewItem &&
          this.lastTransition &&
          this.lastTransition.leavingId &&
          this.lastTransition.enteringId === currentTransition.enteringId &&
          this.lastTransition.leavingId === currentTransition.leavingId
        ) {
          return;
        }

        this.lastTransition = currentTransition;
        this.transitionPage(routeInfo, enteringViewItem, leavingViewItem);

        if (shouldUnmountLeavingViewItem && leavingViewItem && enteringViewItem !== leavingViewItem) {
          leavingViewItem.mount = false;
          // For replace actions, remove actual pages (with ionPageElement) from the stack entirely
          // Don't remove utility components like Navigate that don't have ionPageElement
          if (routeInfo.routeAction === 'replace' && leavingViewItem.ionPageElement) {
            // Check if we should skip removal for nested outlet redirects.
            // Only skip if:
            // 1. The entering view's route is a container (ends with /*)
            // 2. The leaving view is also a container/utility (like index redirect)
            //
            // If the leaving view is a specific route (like "favorites"), we should
            // remove it when navigating to a container route via replace.
            const enteringRoutePath = enteringViewItem.reactElement?.props?.path as string | undefined;
            const leavingRoutePath = leavingViewItem.reactElement?.props?.path as string | undefined;
            const isEnteringContainerRoute = enteringRoutePath && enteringRoutePath.endsWith('/*');
            const isLeavingSpecificRoute = leavingRoutePath &&
              leavingRoutePath !== '' &&
              leavingRoutePath !== '*' &&
              !leavingRoutePath.endsWith('/*') &&
              !leavingViewItem.reactElement?.props?.index;

            // Skip removal only for container-to-container transitions (nested outlet redirects)
            // Remove the leaving view if it's a specific route being replaced
            if (!(isEnteringContainerRoute && !isLeavingSpecificRoute)) {
              // Capture leavingViewItem for the closure since TypeScript can't
              // track the outer if-block's null check through the setTimeout
              const viewToUnmount = leavingViewItem;
              setTimeout(() => {
                // Use a timeout to ensure the transition completes before removal
                this.context.unMountViewItem(viewToUnmount);
              }, 250);
            }
          }
        }
      } else if (enteringViewItem && !enteringViewItem.ionPageElement) {
        const enteringRouteElement = enteringViewItem.reactElement?.props?.element;
        const isNavigateElement = React.isValidElement(enteringRouteElement) && enteringRouteElement.type === Navigate;

        if (isNavigateElement) {
          /**
           * `<Navigate />` components never render an IonPage. They perform an immediate
           * history change instead, so waiting for `ionPageElement` would stall the redirect
           * and repeatedly hide the leaving view. Treat this as a no-op transition and allow
           * the follow-up navigation to proceed.
           */
          this.waitingForIonPage = false;
          if (this.ionPageWaitTimeout) {
            clearTimeout(this.ionPageWaitTimeout);
            this.ionPageWaitTimeout = undefined;
          }
          this.pendingPageTransition = false;

          // Hide and unmount the leaving view immediately for Navigate redirects
          if (leavingViewItem?.ionPageElement) {
            leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
            leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
          }
          // IMPORTANT: Don't unmount if entering and leaving are the same view item
          // This happens during chained Navigate redirects where the same Navigate view item
          // is being processed multiple times before it can render and trigger the redirect
          if (shouldUnmountLeavingViewItem && leavingViewItem && enteringViewItem !== leavingViewItem) {
            leavingViewItem.mount = false;
          }

          this.forceUpdate();
          return;
        }

        /**
         * We have a view item but no page element yet. This can happen during
         * initial page load with nested routes where the view item is created
         * but the component hasn't rendered yet.
         *
         * Hide the leaving view immediately to avoid duplicate/overlapping content
         * while we wait for the entering view's IonPage to mount, then retry the
         * transition once the page is ready.
         */
        if (leavingViewItem?.ionPageElement) {
          leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
          leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
        }

        this.waitingForIonPage = true;

        if (this.ionPageWaitTimeout) {
          clearTimeout(this.ionPageWaitTimeout);
        }

        this.ionPageWaitTimeout = setTimeout(() => {
          this.ionPageWaitTimeout = undefined;

          if (!this.waitingForIonPage) {
            return;
          }
          this.waitingForIonPage = false;

          const latestEnteringView = this.context.findViewItemByRouteInfo(routeInfo, this.id) ?? enteringViewItem;
          const latestLeavingView =
            this.context.findLeavingViewItemByRouteInfo(routeInfo, this.id) ?? leavingViewItem;

          if (latestEnteringView?.ionPageElement) {
            this.transitionPage(routeInfo, latestEnteringView, latestLeavingView ?? undefined);

            if (shouldUnmountLeavingViewItem && latestLeavingView && latestEnteringView !== latestLeavingView) {
              latestLeavingView.mount = false;
            }

            this.forceUpdate();
          }
        }, 50);

        this.forceUpdate();
        return;
      } else if (!enteringViewItem && !enteringRoute) {
        /**
         * No view item and no route found. This can happen during initial page load
         * with nested routes where the nested router outlet hasn't rendered its
         * children yet. Schedule a retry to allow nested routes to be processed.
         */
        if (leavingViewItem) {
          /**
           * If we have a leavingView but no entering view/route, we are probably
           * leaving to another outlet, so hide this leavingView.
           * (e.g., /tabs/tab1 → /settings)
           */
          if (leavingViewItem.ionPageElement) {
            leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
            leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
          }
          if (shouldUnmountLeavingViewItem && leavingViewItem) {
            leavingViewItem.mount = false;
          }
        } else {
          // No entering or leaving view - this might be a routing issue
          // Don't retry endlessly to avoid infinite loops
        }
      }

      // Force re-render so views update according to their new mount/visible status
      this.forceUpdate();
    }
  }

  /**
   * Registers an `<IonPage>` DOM element with the `StackManager`.
   * This is called when `<IonPage>` has been mounted.
   *
   * @param page The element of the rendered `<IonPage>`.
   * @param routeInfo The route information that associates with `<IonPage>`.
   */
  registerIonPage(page: HTMLElement, routeInfo: RouteInfo) {
    this.waitingForIonPage = false;
    if (this.ionPageWaitTimeout) {
      clearTimeout(this.ionPageWaitTimeout);
      this.ionPageWaitTimeout = undefined;
    }
    this.pendingPageTransition = false;
    const foundView = this.context.findViewItemByRouteInfo(routeInfo, this.id);
    if (foundView) {
      const oldPageElement = foundView.ionPageElement;
      foundView.ionPageElement = page;
      foundView.ionRoute = true;

      /**
       * React 18 will unmount and remount IonPage
       * elements in development mode when using createRoot.
       * This can cause duplicate page transitions to occur.
       */
      if (oldPageElement === page) {
        return;
      }
    }
    this.handlePageTransition(routeInfo);
  }

  /**
   * Configures the router outlet for the swipe-to-go-back gesture.
   *
   * @param routerOutlet The Ionic router outlet component: `<IonRouterOutlet>`.
   */
  async setupRouterOutlet(routerOutlet: HTMLIonRouterOutletElement) {
    const canStart = () => {
      const config = getConfig();
      // Check if swipe back is enabled in config (default to true for iOS mode)
      const swipeEnabled = config && config.get('swipeBackEnabled', routerOutlet.mode === 'ios');
      if (!swipeEnabled) {
        return false;
      }

      const { routeInfo } = this.props;

      // Determine the route to use for finding the view we would be navigating back to
      const propsToUse =
        this.prevProps && this.prevProps.routeInfo.pathname === routeInfo.pushedByRoute
          ? this.prevProps.routeInfo
          : ({ pathname: routeInfo.pushedByRoute || '' } as any);
      // Find the view item for the route we are going back to
      const enteringViewItem = this.context.findViewItemByRouteInfo(propsToUse, this.id, false);

      const canStartSwipe = !!enteringViewItem &&
        /**
         * The root url '/' is treated as
         * the first view item (but is never mounted),
         * so we do not want to swipe back to the
         * root url.
         */
        enteringViewItem.mount &&
        /**
         * When on the first page (whatever view
         * you land on after the root url) it
         * is possible for findViewItemByRouteInfo to
         * return the exact same view you are currently on.
         * Make sure that we are not swiping back to the same
         * instances of a view.
         */
        enteringViewItem.routeData.match.pattern.path !== routeInfo.pathname;

      return canStartSwipe;
    };

    const onStart = async () => {
      const { routeInfo } = this.props;

      // Determine the route to use for finding the view we would be navigating back to
      const propsToUse =
        this.prevProps && this.prevProps.routeInfo.pathname === routeInfo.pushedByRoute
          ? this.prevProps.routeInfo
          : ({ pathname: routeInfo.pushedByRoute || '' } as any);
      // Find the view item for the route we are going back to
      const enteringViewItem = this.context.findViewItemByRouteInfo(propsToUse, this.id, false);
      // Find the view item for the route we are going back from
      const leavingViewItem = this.context.findViewItemByRouteInfo(routeInfo, this.id, false);

      /**
       * When the gesture starts, kick off
       * a transition that is controlled
       * via a swipe gesture.
       */
      if (enteringViewItem && leavingViewItem) {
        await this.transitionPage(routeInfo, enteringViewItem, leavingViewItem, 'back', true);
      }

      return Promise.resolve();
    };

    const onEnd = (shouldContinue: boolean) => {
      if (shouldContinue) {
        // User finished the swipe gesture, so complete the back navigation
        this.skipTransition = true;

        this.context.goBack();
      } else {
        /**
         * In the event that the swipe
         * gesture was aborted, we should
         * re-hide the page that was going to enter.
         */
        const { routeInfo } = this.props;

        // Determine the route to use for finding the view we would be navigating back to
        const propsToUse =
          this.prevProps && this.prevProps.routeInfo.pathname === routeInfo.pushedByRoute
            ? this.prevProps.routeInfo
            : ({ pathname: routeInfo.pushedByRoute || '' } as any);
        // Find the view item for the route we are going back to
        const enteringViewItem = this.context.findViewItemByRouteInfo(propsToUse, this.id, false);
        // Find the view item for the route we are going back from
        const leavingViewItem = this.context.findViewItemByRouteInfo(routeInfo, this.id, false);

        /**
         * Ionic React has a design defect where it
         * a) Unmounts the leaving view item when using parameterized routes
         * b) Considers the current view to be the entering view when using
         * parameterized routes
         *
         * As a result, we should not hide the view item here
         * as it will cause the current view to be hidden.
         */
        if (enteringViewItem !== leavingViewItem && enteringViewItem?.ionPageElement !== undefined) {
          const { ionPageElement } = enteringViewItem;
          ionPageElement.setAttribute('aria-hidden', 'true');
          ionPageElement.classList.add('ion-page-hidden');
        }
      }
    };

    routerOutlet.swipeHandler = {
      canStart,
      onStart,
      onEnd,
    };
  }

  /**
   * Animates the transition between the entering and leaving pages within the
   * router outlet.
   *
   * @param routeInfo Info about the current route.
   * @param enteringViewItem The view item that is entering.
   * @param leavingViewItem The view item that is leaving.
   * @param direction The direction of the transition.
   * @param progressAnimation Indicates if the transition is part of a
   * gesture controlled animation (e.g., swipe to go back).
   * Defaults to `false`.
   */
  async transitionPage(
    routeInfo: RouteInfo,
    enteringViewItem: ViewItem,
    leavingViewItem?: ViewItem,
    direction?: 'forward' | 'back',
    progressAnimation = false
  ) {
    const runCommit = async (enteringEl: HTMLElement, leavingEl?: HTMLElement) => {
      const skipTransition = this.skipTransition;

      /**
       * If the transition was handled
       * via the swipe to go back gesture,
       * then we do not want to perform
       * another transition.
       *
       * We skip adding ion-page or ion-page-invisible
       * because the entering view already exists in the DOM.
       * If we added the classes, there would be a flicker where
       * the view would be briefly hidden.
       */
      if (skipTransition) {
        /**
         * We need to reset skipTransition before
         * we call routerOutlet.commit otherwise
         * the transition triggered by the swipe
         * to go back gesture would reset it. In
         * that case you would see a duplicate
         * transition triggered by handlePageTransition
         * in componentDidUpdate.
         */
        this.skipTransition = false;
      } else {
        enteringEl.classList.add('ion-page');
        enteringEl.classList.add('ion-page-invisible');
      }

      await routerOutlet.commit(enteringEl, leavingEl, {
        duration: skipTransition || directionToUse === undefined ? 0 : undefined,
        direction: directionToUse,
        showGoBack: !!routeInfo.pushedByRoute,
        progressAnimation,
        animationBuilder: routeInfo.routeAnimation,
      });
    };

    const routerOutlet = this.routerOutletElement!;

    const routeInfoFallbackDirection =
      routeInfo.routeDirection === 'none' || routeInfo.routeDirection === 'root' ? undefined : routeInfo.routeDirection;
    const directionToUse = direction ?? routeInfoFallbackDirection;

    if (enteringViewItem && enteringViewItem.ionPageElement && this.routerOutletElement) {
      if (leavingViewItem && leavingViewItem.ionPageElement && enteringViewItem === leavingViewItem) {
        // If a page is transitioning to another version of itself
        // we clone it so we can have an animation to show
        // (e.g., `/user/1` → `/user/2`)
        const match = matchComponent(leavingViewItem.reactElement, routeInfo.pathname);
        if (match) {
          const newLeavingElement = clonePageElement(leavingViewItem.ionPageElement.outerHTML);
          if (newLeavingElement) {
            this.routerOutletElement.appendChild(newLeavingElement);
            await runCommit(enteringViewItem.ionPageElement, newLeavingElement);
            this.routerOutletElement.removeChild(newLeavingElement);
          }
        } else {
          /**
           * The route no longer matches the component type of the leaving view.
           * (e.g., `/user/1` → `/settings`)
           *
           * This can also occur in edge cases like rapid navigation
           * or during parent component re-renders that briefly cause
           * the view items to be the same instance before the final
           * route component is determined.
           */
          await runCommit(enteringViewItem.ionPageElement, undefined);
        }
      } else {
        // The leaving view is not the same as the entering view
        // (e.g., `/home` → `/settings` or initial load `/`)
        await runCommit(enteringViewItem.ionPageElement, leavingViewItem?.ionPageElement);
        if (leavingViewItem && leavingViewItem.ionPageElement && !progressAnimation) {
          // An initiial load will not have a leaving view.
          leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
          leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }

  render() {
    const { children } = this.props;
    const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
    this.ionRouterOutlet = ionRouterOutlet; // TODO: check if we can use a ref instead of storing this in the class

    const components = this.context.getChildrenToRender(this.id, this.ionRouterOutlet, this.props.routeInfo, () => {
      this.forceUpdate(); // TODO: investigate why this is needed
    });

    return (
      <StackContext.Provider value={this.stackContextValue}>
        {React.cloneElement(
          ionRouterOutlet as any,
          {
            ref: (node: HTMLIonRouterOutletElement) => {
              if (ionRouterOutlet.props.setRef) {
                // Needed to handle external refs from devs.
                ionRouterOutlet.props.setRef(node);
              }
              if (ionRouterOutlet.props.forwardedRef) {
                // Needed to handle external refs from devs.
                ionRouterOutlet.props.forwardedRef.current = node;
              }
              this.routerOutletElement = node;
              const { ref } = ionRouterOutlet as any;
              // Check for legacy refs.
              if (typeof ref === 'function') {
                ref(node);
              }
            },
          },
          components
        )}
      </StackContext.Provider>
    );
  }

  static get contextType() {
    return RouteManagerContext;
  }
}

export default StackManager;

/**
 * Finds the `<Route />` node matching the current route info.
 * If no `<Route />` can be matched, a fallback node is returned.
 * Routes are prioritized by specificity (most specific first).
 *
 * @param node The root node to search for `<Route />` nodes.
 * @param routeInfo The route information to match against.
 * @param parentPath The parent path that was matched by the parent outlet (for nested routing)
 */
function findRouteByRouteInfo(node: React.ReactNode, routeInfo: RouteInfo, parentPath?: string) {
  let matchedNode: React.ReactNode;
  let fallbackNode: React.ReactNode;

  // `<Route />` nodes are rendered inside of a <Routes /> node
  const routesNode = findRoutesNode(node) ?? node;

  // Collect all route children
  const routeChildren = React.Children.toArray(routesNode).filter(
    (child): child is React.ReactElement => React.isValidElement(child) && child.type === Route
  );

  // Sort routes by specificity (most specific first)
  const sortedRoutes = routeChildren.sort((a, b) => {
    const pathA = a.props.path || '';
    const pathB = b.props.path || '';

    // Index routes come first
    if (a.props.index && !b.props.index) return -1;
    if (!a.props.index && b.props.index) return 1;

    // Wildcard-only routes (*) should come LAST
    const aIsWildcardOnly = pathA === '*';
    const bIsWildcardOnly = pathB === '*';

    if (!aIsWildcardOnly && bIsWildcardOnly) return -1;
    if (aIsWildcardOnly && !bIsWildcardOnly) return 1;

    // Exact matches (no wildcards/params) come before wildcard/param routes
    const aHasWildcard = pathA.includes('*') || pathA.includes(':');
    const bHasWildcard = pathB.includes('*') || pathB.includes(':');

    if (!aHasWildcard && bHasWildcard) return -1;
    if (aHasWildcard && !bHasWildcard) return 1;

    // Among routes with same wildcard status, longer paths are more specific
    if (pathA.length !== pathB.length) {
      return pathB.length - pathA.length;
    }

    return 0;
  });

  // For nested routes in React Router 6, we need to extract the relative path
  // that this outlet should be responsible for matching
  let pathnameToMatch = routeInfo.pathname;

  // Check if we have relative routes (routes that don't start with '/')
  const hasRelativeRoutes = sortedRoutes.some((r) => r.props.path && !r.props.path.startsWith('/'));
  const hasIndexRoute = sortedRoutes.some((r) => r.props.index);

  // SIMPLIFIED: Trust React Router 6's matching more, compute relative path when parent is known
  if ((hasRelativeRoutes || hasIndexRoute) && parentPath) {
    const parentPrefix = parentPath.replace('/*', '');
    const normalizedParent = parentPrefix.endsWith('/') ? parentPrefix.slice(0, -1) : parentPrefix;
    const normalizedPathname = routeInfo.pathname.endsWith('/') ? routeInfo.pathname.slice(0, -1) : routeInfo.pathname;

    // Only compute relative path if pathname is within parent scope
    if (normalizedPathname.startsWith(normalizedParent + '/') || normalizedPathname === normalizedParent) {
      const pathSegments = routeInfo.pathname.split('/').filter(Boolean);
      const parentSegments = normalizedParent.split('/').filter(Boolean);
      const relativeSegments = pathSegments.slice(parentSegments.length);
      pathnameToMatch = relativeSegments.join('/'); // Empty string is valid for index routes
    }
  }

  // Find the first matching route
  for (const child of sortedRoutes) {
    const match = matchPath({
      pathname: pathnameToMatch,
      componentProps: child.props,
    });

    if (match) {
      matchedNode = child;
      break;
    }
  }

  if (matchedNode) {
    return matchedNode;
  }

  // If we haven't found a node, try to find one that doesn't have a path prop (fallback route)
  for (const child of routeChildren) {
    if (!child.props.path) {
      fallbackNode = child;
      break;
    }
  }

  return matchedNode ?? fallbackNode;
}

function matchComponent(node: React.ReactElement, pathname: string, forceExact?: boolean) {
  const routePath: string | undefined = node?.props?.path;
  const pathnameToMatch = derivePathnameToMatch(pathname, routePath);

  return matchPath({
    pathname: pathnameToMatch,
    componentProps: {
      ...node.props,
      end: forceExact,
    },
  });
}
