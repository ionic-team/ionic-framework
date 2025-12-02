/**
 * `StackManager` is responsible for managing page transitions, keeping track
 * of views (pages), and ensuring that navigation behaves like native apps —
 * particularly with animations and swipe gestures.
 */

import type { RouteInfo, StackContextState, ViewItem } from '@ionic/react';
import { RouteManagerContext, StackContext, generateId, getConfig } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';

import { clonePageElement } from './clonePageElement';
import {
  analyzeRouteChildren,
  computeCommonPrefix,
  computeParentPath,
  extractRouteChildren,
} from './utils/computeParentPath';
import { derivePathnameToMatch } from './utils/derivePathnameToMatch';
import { getRoutesChildren } from './utils/getRoutesChildren';
import { matchPath } from './utils/matchPath';
import { stripTrailingSlash } from './utils/normalizePath';
import { isNavigateElement } from './utils/routeUtils';

/**
 * Delay in milliseconds before unmounting a view after a transition completes.
 * This ensures the page transition animation finishes before the view is removed.
 */
const VIEW_UNMOUNT_DELAY_MS = 250;

/**
 * Delay in milliseconds to wait for an IonPage element to be mounted before
 * proceeding with a page transition.
 */
const ION_PAGE_WAIT_TIMEOUT_MS = 50;

interface StackManagerProps {
  routeInfo: RouteInfo;
  id?: string;
}

const isViewVisible = (el: HTMLElement) =>
  !el.classList.contains('ion-page-invisible') && !el.classList.contains('ion-page-hidden');

/**
 * Hides an ion-page element by adding hidden class and aria attribute.
 */
const hideIonPageElement = (element: HTMLElement | undefined): void => {
  if (element) {
    element.classList.add('ion-page-hidden');
    element.setAttribute('aria-hidden', 'true');
  }
};

/**
 * Shows an ion-page element by removing hidden class and aria attribute.
 */
const showIonPageElement = (element: HTMLElement | undefined): void => {
  if (element) {
    element.classList.remove('ion-page-hidden');
    element.removeAttribute('aria-hidden');
  }
};

export class StackManager extends React.PureComponent<StackManagerProps> {
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
      const routeChildren = extractRouteChildren(this.ionRouterOutlet.props.children);
      const { hasRelativeRoutes, hasIndexRoute, hasWildcardRoute } = analyzeRouteChildren(routeChildren);

      const result = computeParentPath({
        currentPathname,
        outletMountPath: this.outletMountPath,
        routeChildren,
        hasRelativeRoutes,
        hasIndexRoute,
        hasWildcardRoute,
      });

      // Update the outlet mount path if it was set
      if (result.outletMountPath && !this.outletMountPath) {
        this.outletMountPath = result.outletMountPath;
      }

      return result.parentPath;
    }
    return this.outletMountPath;
  }

  /**
   * Finds the entering and leaving view items for a route transition,
   * handling special redirect cases.
   */
  private findViewItems(routeInfo: RouteInfo): {
    enteringViewItem: ViewItem | undefined;
    leavingViewItem: ViewItem | undefined;
  } {
    let enteringViewItem = this.context.findViewItemByRouteInfo(routeInfo, this.id);
    let leavingViewItem = this.context.findLeavingViewItemByRouteInfo(routeInfo, this.id);

    // If we don't have a leaving view item, but the route info indicates
    // that the user has routed from a previous path, then the leaving view
    // can be found by the last known pathname.
    if (!leavingViewItem && routeInfo.prevRouteLastPathname) {
      leavingViewItem = this.context.findViewItemByPathname(routeInfo.prevRouteLastPathname, this.id);
    }

    // Special case for redirects: When a redirect happens inside a nested route,
    // the entering and leaving view might be the same (the container route like tabs/*).
    // In this case, we need to look at prevRouteLastPathname to find the actual
    // view we're transitioning away from.
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

    // Also check if we're in a redirect scenario where entering and leaving are different
    // but we still need to handle the actual previous view.
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

    return { enteringViewItem, leavingViewItem };
  }

  /**
   * Determines if the leaving view item should be unmounted after a transition.
   */
  private shouldUnmountLeavingView(
    routeInfo: RouteInfo,
    enteringViewItem: ViewItem | undefined,
    leavingViewItem: ViewItem | undefined
  ): boolean {
    if (!leavingViewItem) {
      return false;
    }

    if (routeInfo.routeAction === 'replace') {
      return true;
    }

    const isForwardPush = routeInfo.routeAction === 'push' && (routeInfo as any).routeDirection === 'forward';
    if (!isForwardPush && routeInfo.routeDirection !== 'none' && enteringViewItem !== leavingViewItem) {
      return true;
    }

    return false;
  }

  /**
   * Handles the case when the outlet is out of scope (current route is outside mount path).
   * Returns true if the transition should be aborted.
   */
  private handleOutOfScopeOutlet(routeInfo: RouteInfo): boolean {
    if (!this.outletMountPath || routeInfo.pathname.startsWith(this.outletMountPath)) {
      return false;
    }

    // Clear any pending unmount timeout to avoid conflicts
    if (this.outOfScopeUnmountTimeout) {
      clearTimeout(this.outOfScopeUnmountTimeout);
      this.outOfScopeUnmountTimeout = undefined;
    }

    // When an outlet is out of scope, unmount its views immediately
    const allViewsInOutlet = this.context.getViewItemsForOutlet ? this.context.getViewItemsForOutlet(this.id) : [];

    // Unmount and remove all views in this outlet immediately to avoid leftover content
    allViewsInOutlet.forEach((viewItem) => {
      hideIonPageElement(viewItem.ionPageElement);
      this.context.unMountViewItem(viewItem);
    });

    this.forceUpdate();
    return true;
  }

  /**
   * Handles the case when this is a nested outlet with relative routes but no valid parent path.
   * Returns true if the transition should be aborted.
   */
  private handleOutOfContextNestedOutlet(
    parentPath: string | undefined,
    leavingViewItem: ViewItem | undefined
  ): boolean {
    if (this.id === 'routerOutlet' || parentPath !== undefined || !this.ionRouterOutlet) {
      return false;
    }

    const routesChildren = getRoutesChildren(this.ionRouterOutlet.props.children) ?? this.ionRouterOutlet.props.children;
    const routeChildren = React.Children.toArray(routesChildren).filter(
      (child): child is React.ReactElement => React.isValidElement(child) && child.type === Route
    );

    const hasRelativeRoutes = routeChildren.some((route) => {
      const path = route.props.path;
      return path && !path.startsWith('/') && path !== '*';
    });

    if (hasRelativeRoutes) {
      // Hide any visible views in this outlet since it's out of scope
      hideIonPageElement(leavingViewItem?.ionPageElement);
      if (leavingViewItem) {
        leavingViewItem.mount = false;
      }
      this.forceUpdate();
      return true;
    }

    return false;
  }

  /**
   * Handles the case when a nested outlet has no matching route.
   * Returns true if the transition should be aborted.
   */
  private handleNoMatchingRoute(
    enteringRoute: React.ReactElement | undefined,
    enteringViewItem: ViewItem | undefined,
    leavingViewItem: ViewItem | undefined
  ): boolean {
    if (this.id === 'routerOutlet' || enteringRoute || enteringViewItem) {
      return false;
    }

    // Hide any visible views in this outlet since it has no matching route
    hideIonPageElement(leavingViewItem?.ionPageElement);
    if (leavingViewItem) {
      leavingViewItem.mount = false;
    }
    this.forceUpdate();
    return true;
  }

  /**
   * Handles the transition when entering view item has an ion-page element ready.
   */
  private handleReadyEnteringView(
    routeInfo: RouteInfo,
    enteringViewItem: ViewItem,
    leavingViewItem: ViewItem | undefined,
    shouldUnmountLeavingViewItem: boolean
  ): void {
    // Ensure the entering view is not hidden from previous navigations
    showIonPageElement(enteringViewItem.ionPageElement);

    // Handle same view item case (e.g., parameterized route changes)
    if (enteringViewItem === leavingViewItem) {
      const routePath = enteringViewItem.reactElement?.props?.path as string | undefined;
      const isParameterizedRoute = routePath ? routePath.includes(':') : false;

      if (isParameterizedRoute) {
        // Refresh match metadata so the component receives updated params
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

    // Try to find leaving view using prev route info if still not found
    if (!leavingViewItem && this.props.routeInfo.prevRouteLastPathname) {
      leavingViewItem = this.context.findViewItemByPathname(this.props.routeInfo.prevRouteLastPathname, this.id);
    }

    // Skip transition if entering view is visible and leaving view is not
    if (
      enteringViewItem.ionPageElement &&
      isViewVisible(enteringViewItem.ionPageElement) &&
      leavingViewItem !== undefined &&
      leavingViewItem.ionPageElement &&
      !isViewVisible(leavingViewItem.ionPageElement)
    ) {
      return;
    }

    // Check for duplicate transition
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

    // Handle unmounting the leaving view
    if (shouldUnmountLeavingViewItem && leavingViewItem && enteringViewItem !== leavingViewItem) {
      leavingViewItem.mount = false;
      this.handleLeavingViewUnmount(routeInfo, enteringViewItem, leavingViewItem);
    }
  }

  /**
   * Handles the delayed unmount of the leaving view item after a replace action.
   */
  private handleLeavingViewUnmount(
    routeInfo: RouteInfo,
    enteringViewItem: ViewItem,
    leavingViewItem: ViewItem
  ): void {
    if (routeInfo.routeAction !== 'replace' || !leavingViewItem.ionPageElement) {
      return;
    }

    // Check if we should skip removal for nested outlet redirects
    const enteringRoutePath = enteringViewItem.reactElement?.props?.path as string | undefined;
    const leavingRoutePath = leavingViewItem.reactElement?.props?.path as string | undefined;
    const isEnteringContainerRoute = enteringRoutePath && enteringRoutePath.endsWith('/*');
    const isLeavingSpecificRoute =
      leavingRoutePath &&
      leavingRoutePath !== '' &&
      leavingRoutePath !== '*' &&
      !leavingRoutePath.endsWith('/*') &&
      !leavingViewItem.reactElement?.props?.index;

    // Skip removal only for container-to-container transitions
    if (isEnteringContainerRoute && !isLeavingSpecificRoute) {
      return;
    }

    const viewToUnmount = leavingViewItem;
    setTimeout(() => {
      this.context.unMountViewItem(viewToUnmount);
    }, VIEW_UNMOUNT_DELAY_MS);
  }

  /**
   * Handles the case when entering view has no ion-page element yet (waiting for render).
   */
  private handleWaitingForIonPage(
    routeInfo: RouteInfo,
    enteringViewItem: ViewItem,
    leavingViewItem: ViewItem | undefined,
    shouldUnmountLeavingViewItem: boolean
  ): void {
    const enteringRouteElement = enteringViewItem.reactElement?.props?.element;

    // Handle Navigate components (they never render an IonPage)
    if (isNavigateElement(enteringRouteElement)) {
      this.waitingForIonPage = false;
      if (this.ionPageWaitTimeout) {
        clearTimeout(this.ionPageWaitTimeout);
        this.ionPageWaitTimeout = undefined;
      }
      this.pendingPageTransition = false;

      // Hide the leaving view immediately for Navigate redirects
      hideIonPageElement(leavingViewItem?.ionPageElement);

      // Don't unmount if entering and leaving are the same view item
      if (shouldUnmountLeavingViewItem && leavingViewItem && enteringViewItem !== leavingViewItem) {
        leavingViewItem.mount = false;
      }

      this.forceUpdate();
      return;
    }

    // Hide leaving view while we wait for the entering view's IonPage to mount
    hideIonPageElement(leavingViewItem?.ionPageElement);

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
      const latestLeavingView = this.context.findLeavingViewItemByRouteInfo(routeInfo, this.id) ?? leavingViewItem;

      if (latestEnteringView?.ionPageElement) {
        this.transitionPage(routeInfo, latestEnteringView, latestLeavingView ?? undefined);

        if (shouldUnmountLeavingViewItem && latestLeavingView && latestEnteringView !== latestLeavingView) {
          latestLeavingView.mount = false;
        }

        this.forceUpdate();
      }
    }, ION_PAGE_WAIT_TIMEOUT_MS);

    this.forceUpdate();
  }

  /**
   * Gets the route info to use for finding views during swipe-to-go-back gestures.
   * This pattern is used in multiple places in setupRouterOutlet.
   */
  private getSwipeBackRouteInfo(): RouteInfo {
    const { routeInfo } = this.props;
    return this.prevProps && this.prevProps.routeInfo.pathname === routeInfo.pushedByRoute
      ? this.prevProps.routeInfo
      : ({ pathname: routeInfo.pushedByRoute || '' } as RouteInfo);
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

    // Hide all views in this outlet before clearing.
    // This is critical for nested outlets - when the parent component unmounts,
    // the nested outlet's componentDidUpdate won't be called, so we must hide
    // the ion-page elements here to prevent them from remaining visible on top
    // of other content after navigation to a different route.
    const allViewsInOutlet = this.context.getViewItemsForOutlet
      ? this.context.getViewItemsForOutlet(this.id)
      : [];
    allViewsInOutlet.forEach((viewItem) => {
      hideIonPageElement(viewItem.ionPageElement);
    });

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
    // Wait for router outlet to mount
    if (!this.routerOutletElement || !this.routerOutletElement.commit) {
      this.pendingPageTransition = true;
      return;
    }

    // Find entering and leaving view items
    let { enteringViewItem, leavingViewItem } = this.findViewItems(routeInfo);
    const shouldUnmountLeavingViewItem = this.shouldUnmountLeavingView(routeInfo, enteringViewItem, leavingViewItem);

    // Get parent path for nested outlets
    const parentPath = this.getParentPath();

    // Handle out-of-scope outlet (route outside mount path)
    if (this.handleOutOfScopeOutlet(routeInfo)) {
      return;
    }

    // Clear any pending out-of-scope unmount timeout
    if (this.outOfScopeUnmountTimeout) {
      clearTimeout(this.outOfScopeUnmountTimeout);
      this.outOfScopeUnmountTimeout = undefined;
    }

    // Handle nested outlet with relative routes but no valid parent path
    if (this.handleOutOfContextNestedOutlet(parentPath, leavingViewItem)) {
      return;
    }

    // Find the matching route element
    const enteringRoute = findRouteByRouteInfo(
      this.ionRouterOutlet?.props.children,
      routeInfo,
      parentPath
    ) as React.ReactElement;

    // Handle nested outlet with no matching route
    if (this.handleNoMatchingRoute(enteringRoute, enteringViewItem, leavingViewItem)) {
      return;
    }

    // Create or update the entering view item
    if (enteringViewItem && enteringRoute) {
      enteringViewItem.reactElement = enteringRoute;
    } else if (enteringRoute) {
      enteringViewItem = this.context.createViewItem(this.id, enteringRoute, routeInfo);
      this.context.addViewItem(enteringViewItem);
    }

    // Handle transition based on ion-page element availability
    if (enteringViewItem && enteringViewItem.ionPageElement) {
      // Clear waiting state
      if (this.waitingForIonPage) {
        this.waitingForIonPage = false;
      }
      if (this.ionPageWaitTimeout) {
        clearTimeout(this.ionPageWaitTimeout);
        this.ionPageWaitTimeout = undefined;
      }

      this.handleReadyEnteringView(routeInfo, enteringViewItem, leavingViewItem, shouldUnmountLeavingViewItem);
    } else if (enteringViewItem && !enteringViewItem.ionPageElement) {
      // Wait for ion-page to mount
      this.handleWaitingForIonPage(routeInfo, enteringViewItem, leavingViewItem, shouldUnmountLeavingViewItem);
      return;
    } else if (!enteringViewItem && !enteringRoute) {
      // No view or route found - likely leaving to another outlet
      if (leavingViewItem) {
        hideIonPageElement(leavingViewItem.ionPageElement);
        if (shouldUnmountLeavingViewItem) {
          leavingViewItem.mount = false;
        }
      }
    }

    this.forceUpdate();
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
      const swipeBackRouteInfo = this.getSwipeBackRouteInfo();
      const enteringViewItem = this.context.findViewItemByRouteInfo(swipeBackRouteInfo, this.id, false);

      const canStartSwipe =
        !!enteringViewItem &&
        // The root url '/' is treated as the first view item (but is never mounted),
        // so we do not want to swipe back to the root url.
        enteringViewItem.mount &&
        // When on the first page it is possible for findViewItemByRouteInfo to
        // return the exact same view you are currently on.
        // Make sure that we are not swiping back to the same instances of a view.
        enteringViewItem.routeData.match.pattern.path !== routeInfo.pathname;

      return canStartSwipe;
    };

    const onStart = async () => {
      const { routeInfo } = this.props;
      const swipeBackRouteInfo = this.getSwipeBackRouteInfo();
      const enteringViewItem = this.context.findViewItemByRouteInfo(swipeBackRouteInfo, this.id, false);
      const leavingViewItem = this.context.findViewItemByRouteInfo(routeInfo, this.id, false);

      // When the gesture starts, kick off a transition controlled via swipe gesture
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
        // Swipe gesture was aborted - re-hide the page that was going to enter
        const { routeInfo } = this.props;
        const swipeBackRouteInfo = this.getSwipeBackRouteInfo();
        const enteringViewItem = this.context.findViewItemByRouteInfo(swipeBackRouteInfo, this.id, false);
        const leavingViewItem = this.context.findViewItemByRouteInfo(routeInfo, this.id, false);

        // Don't hide if entering and leaving are the same (parameterized route edge case)
        if (enteringViewItem !== leavingViewItem && enteringViewItem?.ionPageElement !== undefined) {
          hideIonPageElement(enteringViewItem.ionPageElement);
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
        await runCommit(enteringViewItem.ionPageElement, leavingViewItem?.ionPageElement);
        if (leavingViewItem && leavingViewItem.ionPageElement && !progressAnimation) {
          leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
          leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }

  render() {
    const { children } = this.props;
    const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
    // Store reference for use in getParentPath() and handlePageTransition()
    this.ionRouterOutlet = ionRouterOutlet;

    const components = this.context.getChildrenToRender(this.id, this.ionRouterOutlet, this.props.routeInfo, () => {
      // Callback triggers re-render when view items are modified during getChildrenToRender
      this.forceUpdate();
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
  const routesChildren = getRoutesChildren(node) ?? node;

  // Collect all route children
  const routeChildren = React.Children.toArray(routesChildren).filter(
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
    const normalizedParent = stripTrailingSlash(parentPrefix);
    const normalizedPathname = stripTrailingSlash(routeInfo.pathname);

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
  // BUT only return the fallback if the current pathname is within the outlet's scope.
  // For outlets with absolute paths, compute the common prefix to determine scope.
  const absolutePathRoutes = routeChildren.filter((r) => r.props.path && r.props.path.startsWith('/'));

  // Determine if pathname is within scope before returning fallback
  let isPathnameInScope = true;

  if (absolutePathRoutes.length > 0) {
    // Find common prefix of all absolute paths to determine outlet scope
    const absolutePaths = absolutePathRoutes.map((r) => r.props.path as string);
    const commonPrefix = computeCommonPrefix(absolutePaths);

    // If we have a common prefix, check if the current pathname is within that scope
    if (commonPrefix && commonPrefix !== '/') {
      isPathnameInScope = routeInfo.pathname.startsWith(commonPrefix);
    }
  }

  // Only look for fallback route if pathname is within scope
  if (isPathnameInScope) {
    for (const child of routeChildren) {
      if (!child.props.path) {
        fallbackNode = child;
        break;
      }
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
