/**
 * `StackManager` is responsible for managing page transitions, keeping track
 * of views (pages), and ensuring that navigation behaves like native apps —
 * particularly with animations and swipe gestures.
 */

import type { RouteInfo, StackContextState, ViewItem } from '@ionic/react';
import { RouteManagerContext, StackContext, getConfig } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';

import { clonePageElement } from './clonePageElement';
import { findRoutesNode } from './utils/findRoutesNode';
import { matchPath } from './utils/matchPath';

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

  constructor(props: StackManagerProps) {
    super(props);
    this.registerIonPage = this.registerIonPage.bind(this);
    this.transitionPage = this.transitionPage.bind(this);
    this.handlePageTransition = this.handlePageTransition.bind(this);
    // Use provided id prop if available; otherwise use a stable default id so
    // view items are associated to the same outlet across re-renders.
    this.id = props.id || 'routerOutlet';
    this.prevProps = undefined;
    this.skipTransition = false;
  }

  private parentPathCache: { [key: string]: string | undefined } = {};
  private outletMountPath: string | undefined = undefined;

  /**
   * Determines the parent path that was matched to reach this outlet.
   * This is crucial for nested routing in React Router 6.
   */
  private getParentPath(): string | undefined {
    const currentPathname = this.props.routeInfo.pathname;

    // If this is a nested outlet (has an explicit ID like "main"),
    // we need to figure out what part of the path was already matched
    if (this.id !== 'routerOutlet' && this.ionRouterOutlet) {
      // Check if this outlet has relative routes (routes that don't start with /)
      const routesNode = findRoutesNode(this.ionRouterOutlet.props.children) ?? this.ionRouterOutlet.props.children;
      const routeChildren = React.Children.toArray(routesNode).filter(
        (child): child is React.ReactElement =>
          React.isValidElement(child) && child.type === Route
      );

      const hasRelativeRoutes = routeChildren.some(route => {
        const path = route.props.path;
        const isRelative = path && !path.startsWith('/') && path !== '*';
        return isRelative;
      });

      const hasIndexRoute = routeChildren.some(route => route.props.index);

      if ((hasRelativeRoutes || hasIndexRoute) && currentPathname.includes('/')) {
        const segments = currentPathname.split('/').filter(Boolean);

        if (segments.length >= 1) {
          // Store the mount path when we first successfully match a route
          // This helps us determine our scope for future navigations
          if (!this.outletMountPath) {
            // Try to find the mount path by looking for successful matches
            for (let i = 1; i <= segments.length; i++) {
              const testParentPath = '/' + segments.slice(0, i).join('/');
              const testRemainingPath = segments.slice(i).join('/');

              const hasMatch = routeChildren.some(route => {
                if (route.props.index && testRemainingPath === '') return true;
                const routePath = route.props.path;
                if (!routePath || routePath.startsWith('/')) return false;

                if (routePath.endsWith('/*')) {
                  const basePath = routePath.slice(0, -2);
                  return testRemainingPath === basePath || testRemainingPath.startsWith(basePath + '/');
                }

                return testRemainingPath === routePath || testRemainingPath.startsWith(routePath + '/');
              });

              if (hasMatch) {
                this.outletMountPath = testParentPath;
                break;
              }
            }
          }

          // If we have a mount path and the current pathname doesn't start with it,
          // this outlet is out of scope
          if (this.outletMountPath && !currentPathname.startsWith(this.outletMountPath)) {
            return undefined;
          }

          // Try different parent path possibilities
          // Start with shorter parent paths first to find the most appropriate match
          for (let i = 1; i <= segments.length; i++) {
            const parentPath = '/' + segments.slice(0, i).join('/');
            const remainingPath = segments.slice(i).join('/');

            // Check if any relative route could match the remaining path
            const couldMatchRemaining = routeChildren.some(route => {
              const routePath = route.props.path;

              // Index routes match when remaining path is empty
              if (route.props.index && remainingPath === '') {
                return true;
              }

              if (!routePath || routePath.startsWith('/')) return false;

              // Handle wildcard routes like "tabs/*"
              if (routePath.endsWith('/*')) {
                const baseRoutePath = routePath.slice(0, -2);
                const matches = remainingPath.startsWith(baseRoutePath);
                return matches;
              }

              // Handle exact routes like "tabs"
              const matches = remainingPath === routePath || remainingPath.startsWith(routePath + '/');
              return matches;
            });

            if (couldMatchRemaining) {
              // this.parentPathCache[currentPathname] = parentPath;
              return parentPath;
            }
          }

          // If we couldn't find any parent path that makes sense for our relative routes,
          // it means this outlet is being rendered outside its expected routing context
          // Return undefined to signal that this outlet shouldn't handle routes
          return undefined;
        }
      }
    }
    // this.parentPathCache[currentPathname] = undefined;
    return undefined;
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

    // Clear cache if the pathname changed to avoid stale cached values
    // Temporarily disabled while debugging infinite loop issues
    // if (prevPathname !== pathname) {
    //   this.parentPathCache = {};
    // }

    if (pathname !== prevPathname) {
      this.prevProps = prevProps;
      this.handlePageTransition(this.props.routeInfo);
    } else if (this.pendingPageTransition) {
      this.handlePageTransition(this.props.routeInfo);
      this.pendingPageTransition = false;
    }
  }

  componentWillUnmount() {
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

      console.log(`[StackManager] handlePageTransition in outlet ${this.id}: pathname=${routeInfo.pathname}, entering=${enteringViewItem?.id}, leaving=${leavingViewItem?.id}`);

      /**
       * If we don't have a leaving view item, but the route info indicates
       * that the user has routed from a previous path, then the leaving view
       * can be found by the last known pathname.
       */
      if (!leavingViewItem && routeInfo.prevRouteLastPathname) {
        leavingViewItem = this.context.findViewItemByPathname(routeInfo.prevRouteLastPathname, this.id);
      }

      /**
       * The leaving view item should be unmounted in the following cases:
       * - Navigating with `replace`
       * - Navigating forward but not pushing a new view (e.g., back navigation or non-animated transition) and the leaving view is not the same as the entering view
       * - The routeOptions explicitly says unmount
       */
      if (leavingViewItem) {
        if (routeInfo.routeAction === 'replace') {
          leavingViewItem.mount = false;
        } else if (!(routeInfo.routeAction === 'push' && (routeInfo as any).routeDirection === 'forward')) {
          if (routeInfo.routeDirection !== 'none' && enteringViewItem !== leavingViewItem) {
            leavingViewItem.mount = false;
          }
        } else if (routeInfo.routeOptions?.unmount) {
          leavingViewItem.mount = false;
        }
      }

      // Match the route element to render
      // For nested outlets, we need to pass parent path info
      const parentPath = this.getParentPath();

      // CRITICAL: If we have a mount path and current route is outside of it,
      // don't process any routes in this outlet - it's completely out of scope
      if (this.outletMountPath && !routeInfo.pathname.startsWith(this.outletMountPath)) {
        // Don't unmount views - just skip processing
        // The views should be preserved for when we return to this outlet
        this.forceUpdate();
        return;
      }

      // If this is a nested outlet with relative routes but no valid parent path,
      // it means the outlet is outside its expected routing context
      if (this.id !== 'routerOutlet' && parentPath === undefined && this.ionRouterOutlet) {
        const routesNode = findRoutesNode(this.ionRouterOutlet.props.children) ?? this.ionRouterOutlet.props.children;
        const routeChildren = React.Children.toArray(routesNode).filter(
          (child): child is React.ReactElement =>
            React.isValidElement(child) && child.type === Route
        );

        const hasRelativeRoutes = routeChildren.some(route => {
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

      const enteringRoute = findRouteByRouteInfo(this.ionRouterOutlet?.props.children, routeInfo, parentPath) as React.ReactElement;

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
      console.log(`[StackManager] Checking for transition: enteringViewItem=${enteringViewItem?.id}, hasIonPage=${!!enteringViewItem?.ionPageElement}, leavingViewItem=${leavingViewItem?.id}, hasIonPage=${!!leavingViewItem?.ionPageElement}`);

      if (enteringViewItem && enteringViewItem.ionPageElement) {
        console.log(`[StackManager] Transitioning pages - entering: ${enteringViewItem.id}, leaving: ${leavingViewItem?.id || 'none'}`);

        // Ensure the entering view is not hidden by ion-page-hidden from previous navigations
        const enteringEl = enteringViewItem.ionPageElement as HTMLElement;
        if (enteringEl.classList.contains('ion-page-hidden')) {
          console.log(`[StackManager] Removing ion-page-hidden from entering view ${enteringViewItem.id} before transition`);
          enteringEl.classList.remove('ion-page-hidden');
          enteringEl.removeAttribute('aria-hidden');
        }

        /**
         * If the entering view item is the same as the leaving view item,
         * then we don't need to transition.
         */
        if (enteringViewItem === leavingViewItem) {
          /**
           * If the entering view item is the same as the leaving view item,
           * we are either transitioning using parameterized routes to the same
           * view (e.g., `/user/1` → `/user/2`)
           * or a parent router outlet is re-rendering as a result of React props
           * changing (e.g., tab navigation).
           *
           * If the route data does not match the current path, it indicates a
           * situation where the view within this nested outlet might already be
           * visible due to the parent's re-render. In such cases
           * (like tab navigation), we prevent a  redundant transition in this
           * outlet to avoid flickering.
           */
          if (enteringViewItem.routeData.match?.pathname !== routeInfo.pathname) {
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
        this.transitionPage(routeInfo, enteringViewItem, leavingViewItem);
      } else if (enteringViewItem && !enteringViewItem.ionPageElement) {
        /**
         * We have a view item but no page element yet. This can happen during
         * initial page load with nested routes where the view item is created
         * but the component hasn't rendered yet.
         *
         * Hide the leaving view immediately if it exists, then schedule retry for transition.
         */
        console.log(`[StackManager] Entering view ${enteringViewItem.id} has no ionPageElement yet, will hide leaving view and retry`);

        // Hide leaving view immediately to avoid duplicate/overlapping content while waiting
        if (leavingViewItem?.ionPageElement) {
          leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
          leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
          console.log(`[StackManager] HIDING leaving view ${leavingViewItem.id} (no entering ionPage yet)`);
        }

        setTimeout(() => {
          if (enteringViewItem && enteringViewItem.ionPageElement) {
            console.log(`[StackManager] Retrying transition for ${enteringViewItem.id}`);
            this.transitionPage(routeInfo, enteringViewItem, leavingViewItem);
          } else {
            console.log(`[StackManager] Still no ionPageElement for ${enteringViewItem?.id}, giving up`);
          }
        }, 50);
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
    console.log(`[StackManager] registerIonPage called for outlet ${this.id}, pathname=${routeInfo.pathname}`);
    const foundView = this.context.findViewItemByRouteInfo(routeInfo, this.id);
    if (foundView) {
      console.log(`[StackManager] Found view ${foundView.id} for IonPage registration`);
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

      return (
        !!enteringViewItem &&
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
        enteringViewItem.routeData.match.pattern.path !== routeInfo.pathname
      );
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
    (child): child is React.ReactElement =>
      React.isValidElement(child) && child.type === Route
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
  const hasRelativeRoutes = sortedRoutes.some(r => r.props.path && !r.props.path.startsWith('/'));
  const hasIndexRoute = sortedRoutes.some(r => r.props.index);

  // For nested outlets with relative routes, we need to determine if this outlet
  // should even attempt to handle this route
  if (hasRelativeRoutes || hasIndexRoute) {
    // If we have a parent path, check if the current pathname is within scope
    if (parentPath) {
      const parentPrefix = parentPath.replace('/*', '');
      // If the current path doesn't start with the parent prefix, this outlet shouldn't handle it
      if (!routeInfo.pathname.startsWith(parentPrefix + '/') && routeInfo.pathname !== parentPrefix) {
        // This nested outlet is out of scope for this pathname
        return null;
      }
    } else if (hasIndexRoute && !hasRelativeRoutes) {
      // Special case: if we only have an index route and no relative routes,
      // and we couldn't determine a parent path, this outlet likely shouldn't
      // handle this route (the index route would only match at the outlet's root)
      return null;
    }

    // For nested routing, we need to compute the relative path
    // This is the part of the pathname that comes after the parent's matched path


    // Try to determine the parent path from the context
    // In React Router 6, nested outlets match against the remaining path segment
    const pathSegments = routeInfo.pathname.split('/').filter(Boolean);

    // If we have a parentPath, use it to compute the relative path
    if (parentPath) {
      const parentSegments = parentPath.replace('/*', '').split('/').filter(Boolean);

      // Remove parent segments from the full path to get the relative path
      const relativeSegments = pathSegments.slice(parentSegments.length);
      pathnameToMatch = relativeSegments.join('/'); // This can be empty string, which is correct for index routes
    } else if (pathSegments.length > 0) {
      // If we have relative routes but couldn't determine a parent path,
      // this likely means the current pathname is not within this outlet's scope
      // Check if we can find any route that could match
      let foundMatch = false;

      // Check each possible parent path length starting from the longest
      for (let parentLength = pathSegments.length - 1; parentLength > 0; parentLength--) {
        const remainingSegments = pathSegments.slice(parentLength);
        const remainingPath = remainingSegments.join('/');

        // Check if any route in this outlet could match the remaining path
        const couldMatchRemaining = sortedRoutes.some(r => {
          // Index routes match when remaining path is empty
          if (r.props.index && remainingPath === '') {
            return true;
          }

          if (!r.props.path) return false;

          const routePath = r.props.path;

          // Skip absolute paths - they should be handled by parent outlets
          if (routePath.startsWith('/')) return false;

          // Handle wildcard routes like "tabs/*"
          if (routePath.endsWith('/*')) {
            const baseRoutePath = routePath.slice(0, -2);
            const matches = remainingPath === baseRoutePath || remainingPath.startsWith(baseRoutePath + '/');
            return matches;
          }

          // Handle exact routes
          const matches = remainingPath === routePath || remainingPath.startsWith(routePath + '/');
          return matches;
        });

        if (couldMatchRemaining) {
          pathnameToMatch = remainingPath;
          foundMatch = true;
          break;
        }
      }

      // If we couldn't find any match and we have relative routes,
      // this outlet shouldn't handle this route
      if (!foundMatch && (hasRelativeRoutes || hasIndexRoute)) {
        return null;
      }

      // If no parent could be inferred, try matching the last segment only
      // This handles the common case where we directly navigate to /parent/child
      if (pathnameToMatch === routeInfo.pathname && pathSegments.length > 0) {
        const lastSegment = pathSegments[pathSegments.length - 1];
        const couldMatchLastSegment = sortedRoutes.some(r => {
          if (!r.props.path || r.props.path.startsWith('/')) return false;
          // Only match if there's an exact match, be more conservative
          return r.props.path === lastSegment;
        });

        if (couldMatchLastSegment) {
          pathnameToMatch = lastSegment;
        }
      }
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
  return matchPath({
    pathname,
    componentProps: {
      ...node.props,
      end: forceExact,
    },
  });
}
