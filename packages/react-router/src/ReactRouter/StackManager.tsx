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
import { analyzeRouteChildren, computeCommonPrefix, computeParentPath } from './utils/computeParentPath';
import { derivePathnameToMatch, matchPath } from './utils/pathMatching';
import { stripTrailingSlash } from './utils/pathNormalization';
import { extractRouteChildren, getRoutesChildren, isNavigateElement } from './utils/routeElements';

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

const hideIonPageElement = (element: HTMLElement | undefined): void => {
  if (element) {
    element.classList.add('ion-page-hidden');
    element.setAttribute('aria-hidden', 'true');
  }
};

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
   * Determines the parent path for nested routing in React Router 6.
   * Priority: specific routes > wildcard routes > index routes (only at mount point)
   */
  private getParentPath(): string | undefined {
    const currentPathname = this.props.routeInfo.pathname;

    // Prevent out-of-scope outlets from adopting unrelated routes
    if (this.outletMountPath && !currentPathname.startsWith(this.outletMountPath)) {
      return undefined;
    }

    if (this.ionRouterOutlet) {
      const routeChildren = extractRouteChildren(this.ionRouterOutlet.props.children);
      const { hasRelativeRoutes, hasIndexRoute, hasWildcardRoute } = analyzeRouteChildren(routeChildren);

      const isRootOutlet = this.id.startsWith('routerOutlet');
      const needsParentPath = !isRootOutlet || hasRelativeRoutes || hasIndexRoute;

      if (needsParentPath) {
        const result = computeParentPath({
          currentPathname,
          outletMountPath: this.outletMountPath,
          routeChildren,
          hasRelativeRoutes,
          hasIndexRoute,
          hasWildcardRoute,
        });

        if (result.outletMountPath && !this.outletMountPath) {
          this.outletMountPath = result.outletMountPath;
        }

        return result.parentPath;
      }
    }

    return this.outletMountPath;
  }

  /**
   * Finds the entering and leaving view items, handling redirect cases.
   */
  private findViewItems(routeInfo: RouteInfo): {
    enteringViewItem: ViewItem | undefined;
    leavingViewItem: ViewItem | undefined;
  } {
    const enteringViewItem = this.context.findViewItemByRouteInfo(routeInfo, this.id);
    let leavingViewItem = this.context.findLeavingViewItemByRouteInfo(routeInfo, this.id);

    // Try to find leaving view by previous pathname
    if (!leavingViewItem && routeInfo.prevRouteLastPathname) {
      leavingViewItem = this.context.findViewItemByPathname(routeInfo.prevRouteLastPathname, this.id);
    }

    // For redirects where entering === leaving, find the actual previous view
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

    // Handle redirect scenario with no leaving view
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

  private shouldUnmountLeavingView(
    routeInfo: RouteInfo,
    enteringViewItem: ViewItem | undefined,
    leavingViewItem: ViewItem | undefined
  ): boolean {
    if (!leavingViewItem) {
      return false;
    }

    if (routeInfo.routeAction === 'replace') {
      const enteringRoutePath = enteringViewItem?.reactElement?.props?.path as string | undefined;
      const leavingRoutePath = leavingViewItem?.reactElement?.props?.path as string | undefined;

      // Never unmount root path - needed for back navigation
      if (leavingRoutePath === '/' || leavingRoutePath === '') {
        return false;
      }

      if (enteringRoutePath && leavingRoutePath) {
        const getParentPath = (path: string) => {
          const normalized = path.replace(/\/\*$/, '');
          const lastSlash = normalized.lastIndexOf('/');
          return lastSlash > 0 ? normalized.substring(0, lastSlash) : '/';
        };

        const enteringParent = getParentPath(enteringRoutePath);
        const leavingParent = getParentPath(leavingRoutePath);

        // Unmount if routes are siblings or entering is a child of leaving (redirect)
        const areSiblings = enteringParent === leavingParent && enteringParent !== '/';
        const isChildRedirect =
          enteringRoutePath.startsWith(leavingRoutePath) ||
          (leavingRoutePath.endsWith('/*') && enteringRoutePath.startsWith(leavingRoutePath.slice(0, -2)));

        return areSiblings || isChildRedirect;
      }

      return false;
    }

    // For non-replace actions, only unmount for back navigation
    const isForwardPush = routeInfo.routeAction === 'push' && (routeInfo as any).routeDirection === 'forward';
    if (!isForwardPush && routeInfo.routeDirection !== 'none' && enteringViewItem !== leavingViewItem) {
      return true;
    }

    return false;
  }

  /**
   * Handles out-of-scope outlet. Returns true if transition should be aborted.
   */
  private handleOutOfScopeOutlet(routeInfo: RouteInfo): boolean {
    if (!this.outletMountPath || routeInfo.pathname.startsWith(this.outletMountPath)) {
      return false;
    }

    if (this.outOfScopeUnmountTimeout) {
      clearTimeout(this.outOfScopeUnmountTimeout);
      this.outOfScopeUnmountTimeout = undefined;
    }

    const allViewsInOutlet = this.context.getViewItemsForOutlet ? this.context.getViewItemsForOutlet(this.id) : [];

    allViewsInOutlet.forEach((viewItem) => {
      hideIonPageElement(viewItem.ionPageElement);
      this.context.unMountViewItem(viewItem);
    });

    this.forceUpdate();
    return true;
  }

  /**
   * Handles nested outlet with relative routes but no parent path. Returns true to abort.
   */
  private handleOutOfContextNestedOutlet(
    parentPath: string | undefined,
    leavingViewItem: ViewItem | undefined
  ): boolean {
    const isRootOutlet = this.id.startsWith('routerOutlet');
    if (isRootOutlet || parentPath !== undefined || !this.ionRouterOutlet) {
      return false;
    }

    const routesChildren =
      getRoutesChildren(this.ionRouterOutlet.props.children) ?? this.ionRouterOutlet.props.children;
    const routeChildren = React.Children.toArray(routesChildren).filter(
      (child): child is React.ReactElement => React.isValidElement(child) && child.type === Route
    );

    const hasRelativeRoutes = routeChildren.some((route) => {
      const path = route.props.path;
      return path && !path.startsWith('/') && path !== '*';
    });

    if (hasRelativeRoutes) {
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
   * Handles nested outlet with no matching route. Returns true to abort.
   */
  private handleNoMatchingRoute(
    enteringRoute: React.ReactElement | undefined,
    enteringViewItem: ViewItem | undefined,
    leavingViewItem: ViewItem | undefined
  ): boolean {
    const isRootOutlet = this.id.startsWith('routerOutlet');
    if (isRootOutlet || enteringRoute || enteringViewItem) {
      return false;
    }

    hideIonPageElement(leavingViewItem?.ionPageElement);
    if (leavingViewItem) {
      leavingViewItem.mount = false;
    }
    this.forceUpdate();
    return true;
  }

  /**
   * Handles transition when entering view has ion-page element ready.
   */
  private handleReadyEnteringView(
    routeInfo: RouteInfo,
    enteringViewItem: ViewItem,
    leavingViewItem: ViewItem | undefined,
    shouldUnmountLeavingViewItem: boolean
  ): void {
    const routePath = enteringViewItem.reactElement?.props?.path as string | undefined;
    const isParameterizedRoute = routePath ? routePath.includes(':') : false;
    const isWildcardContainerRoute = routePath ? routePath.endsWith('/*') : false;

    // Handle same-view transitions (parameterized routes like /user/:id or container routes like /tabs/*)
    // When entering === leaving, the view is already visible - skip transition to prevent flash
    if (enteringViewItem === leavingViewItem) {
      if (isParameterizedRoute || isWildcardContainerRoute) {
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

    // For wildcard container routes, check if we're navigating within the same container.
    // If both the current pathname and the previous pathname match the same container route,
    // skip the transition - the nested outlet will handle the actual page change.
    // This handles cases where leavingViewItem lookup fails (e.g., no IonPage wrapper).
    if (isWildcardContainerRoute && routeInfo.lastPathname) {
      // routePath is guaranteed to exist since isWildcardContainerRoute checks routePath?.endsWith('/*')
      const containerBase = routePath!.replace(/\/\*$/, '');
      const currentInContainer =
        routeInfo.pathname.startsWith(containerBase + '/') || routeInfo.pathname === containerBase;
      const previousInContainer =
        routeInfo.lastPathname.startsWith(containerBase + '/') || routeInfo.lastPathname === containerBase;

      if (currentInContainer && previousInContainer) {
        const updatedMatch = matchComponent(enteringViewItem.reactElement, routeInfo.pathname, true);
        if (updatedMatch) {
          enteringViewItem.routeData.match = updatedMatch;
        }
        this.forceUpdate();
        return;
      }
    }

    if (!leavingViewItem && this.props.routeInfo.prevRouteLastPathname) {
      leavingViewItem = this.context.findViewItemByPathname(this.props.routeInfo.prevRouteLastPathname, this.id);
    }

    // Re-mount views that were previously unmounted (e.g., navigating back to home)
    if (!enteringViewItem.mount) {
      enteringViewItem.mount = true;
    }

    // Check visibility state BEFORE showing entering view
    const enteringWasVisible = enteringViewItem.ionPageElement && isViewVisible(enteringViewItem.ionPageElement);
    const leavingIsHidden =
      leavingViewItem !== undefined && leavingViewItem.ionPageElement && !isViewVisible(leavingViewItem.ionPageElement);

    const currentTransition = {
      enteringId: enteringViewItem.id,
      leavingId: leavingViewItem?.id,
    };

    const isDuplicateTransition =
      leavingViewItem &&
      this.lastTransition &&
      this.lastTransition.leavingId &&
      this.lastTransition.enteringId === currentTransition.enteringId &&
      this.lastTransition.leavingId === currentTransition.leavingId;

    // Skip if transition already performed (e.g., via swipe gesture)
    if (enteringWasVisible && leavingIsHidden && isDuplicateTransition) {
      if (
        this.skipTransition &&
        shouldUnmountLeavingViewItem &&
        leavingViewItem &&
        enteringViewItem !== leavingViewItem
      ) {
        leavingViewItem.mount = false;
        // Trigger ionViewDidLeave lifecycle for ViewLifeCycleManager cleanup
        this.transitionPage(routeInfo, enteringViewItem, leavingViewItem, 'back');
      }
      this.skipTransition = false;
      this.forceUpdate();
      return;
    }

    showIonPageElement(enteringViewItem.ionPageElement);

    // Handle duplicate transition or swipe gesture completion
    if (isDuplicateTransition || this.skipTransition) {
      if (
        this.skipTransition &&
        shouldUnmountLeavingViewItem &&
        leavingViewItem &&
        enteringViewItem !== leavingViewItem
      ) {
        leavingViewItem.mount = false;
        // Re-fire ionViewDidLeave since gesture completed before mount=false was set
        this.transitionPage(routeInfo, enteringViewItem, leavingViewItem, 'back');
      }
      this.skipTransition = false;
      this.forceUpdate();
      return;
    }

    this.lastTransition = currentTransition;

    this.transitionPage(routeInfo, enteringViewItem, leavingViewItem);

    if (shouldUnmountLeavingViewItem && leavingViewItem && enteringViewItem !== leavingViewItem) {
      leavingViewItem.mount = false;
      this.handleLeavingViewUnmount(routeInfo, enteringViewItem, leavingViewItem);
    }

    // Clean up orphaned sibling views after replace actions (redirects)
    this.cleanupOrphanedSiblingViews(routeInfo, enteringViewItem, leavingViewItem);
  }

  /**
   * Handles leaving view unmount for replace actions.
   */
  private handleLeavingViewUnmount(routeInfo: RouteInfo, enteringViewItem: ViewItem, leavingViewItem: ViewItem): void {
    if (!leavingViewItem.ionPageElement) {
      return;
    }

    // Only replace actions unmount views; push/pop cache for navigation history
    if (routeInfo.routeAction !== 'replace') {
      return;
    }

    const enteringRoutePath = enteringViewItem.reactElement?.props?.path as string | undefined;
    const leavingRoutePath = leavingViewItem.reactElement?.props?.path as string | undefined;
    const isEnteringContainerRoute = enteringRoutePath && enteringRoutePath.endsWith('/*');
    const isLeavingSpecificRoute =
      leavingRoutePath &&
      leavingRoutePath !== '' &&
      leavingRoutePath !== '*' &&
      !leavingRoutePath.endsWith('/*') &&
      !leavingViewItem.reactElement?.props?.index;

    // Skip removal for container-to-container transitions (e.g., /tabs/* → /settings/*).
    // These routes manage their own nested outlets; unmounting would disrupt child views.
    if (isEnteringContainerRoute && !isLeavingSpecificRoute) {
      return;
    }

    const viewToUnmount = leavingViewItem;
    setTimeout(() => {
      this.context.unMountViewItem(viewToUnmount);
      this.forceUpdate();
    }, VIEW_UNMOUNT_DELAY_MS);
  }

  /**
   * Cleans up orphaned sibling views after replace actions or push-to-container navigations.
   */
  private cleanupOrphanedSiblingViews(
    routeInfo: RouteInfo,
    enteringViewItem: ViewItem,
    leavingViewItem: ViewItem | undefined
  ): void {
    const enteringRoutePath = enteringViewItem.reactElement?.props?.path as string | undefined;
    if (!enteringRoutePath) {
      return;
    }

    const leavingRoutePath = leavingViewItem?.reactElement?.props?.path as string | undefined;
    const isContainerRoute = (path: string | undefined) => path?.endsWith('/*');

    const isReplaceAction = routeInfo.routeAction === 'replace';
    const isPushToContainer =
      routeInfo.routeAction === 'push' && routeInfo.routeDirection === 'none' && isContainerRoute(enteringRoutePath);

    if (!isReplaceAction && !isPushToContainer) {
      return;
    }

    // Skip cleanup for tab switches
    const isSameView = enteringViewItem === leavingViewItem;
    const isSameContainerRoute = isContainerRoute(enteringRoutePath) && leavingRoutePath === enteringRoutePath;
    const isNavigatingWithinContainer =
      isPushToContainer &&
      !leavingViewItem &&
      routeInfo.prevRouteLastPathname?.startsWith(enteringRoutePath.replace(/\/\*$/, ''));

    if (isSameView || isSameContainerRoute || isNavigatingWithinContainer) {
      return;
    }

    const allViewsInOutlet = this.context.getViewItemsForOutlet ? this.context.getViewItemsForOutlet(this.id) : [];

    const areSiblingRoutes = (path1: string, path2: string): boolean => {
      const path1IsRelative = !path1.startsWith('/');
      const path2IsRelative = !path2.startsWith('/');

      if (path1IsRelative && path2IsRelative) {
        const path1Depth = path1.replace(/\/\*$/, '').split('/').filter(Boolean).length;
        const path2Depth = path2.replace(/\/\*$/, '').split('/').filter(Boolean).length;
        return path1Depth === path2Depth && path1Depth <= 1;
      }

      const getParent = (path: string) => {
        const normalized = path.replace(/\/\*$/, '');
        const lastSlash = normalized.lastIndexOf('/');
        return lastSlash > 0 ? normalized.substring(0, lastSlash) : '/';
      };

      return getParent(path1) === getParent(path2);
    };

    for (const viewItem of allViewsInOutlet) {
      const viewRoutePath = viewItem.reactElement?.props?.path as string | undefined;

      const shouldSkip =
        viewItem.id === enteringViewItem.id ||
        (leavingViewItem && viewItem.id === leavingViewItem.id) ||
        !viewItem.mount ||
        !viewRoutePath ||
        (viewRoutePath.endsWith('/*') && enteringRoutePath.endsWith('/*'));

      if (shouldSkip) {
        continue;
      }

      if (areSiblingRoutes(enteringRoutePath, viewRoutePath)) {
        hideIonPageElement(viewItem.ionPageElement);
        viewItem.mount = false;

        const viewToRemove = viewItem;
        setTimeout(() => {
          this.context.unMountViewItem(viewToRemove);
          this.forceUpdate();
        }, VIEW_UNMOUNT_DELAY_MS);
      }
    }
  }

  /**
   * Handles entering view with no ion-page element yet (waiting for render).
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

    // Do not hide the leaving view here - wait until the entering view is ready.
    // Hiding the leaving view while the entering view is still mounting causes a flash
    // where both views are hidden/invisible simultaneously.
    // The leaving view will be hidden in transitionPage() after the entering view is visible.

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
          // Call handleLeavingViewUnmount to ensure the view is properly removed
          this.handleLeavingViewUnmount(routeInfo, latestEnteringView, latestLeavingView);
        }

        this.forceUpdate();
      } else {
        /**
         * Timeout fired and entering view still has no ionPageElement.
         * This happens for container routes that render nested outlets without a direct IonPage.
         * Hide the leaving view since there's no entering IonPage to wait for.
         */
        if (latestLeavingView?.ionPageElement) {
          hideIonPageElement(latestLeavingView.ionPageElement);
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
    const allViewsInOutlet = this.context.getViewItemsForOutlet ? this.context.getViewItemsForOutlet(this.id) : [];
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
    const viewItems = this.findViewItems(routeInfo);
    let enteringViewItem = viewItems.enteringViewItem;
    const leavingViewItem = viewItems.leavingViewItem;
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
    // Check if the ionPageElement is still in the document.
    // If the view was previously unmounted (mount=false), the ViewLifeCycleManager
    // removes the React component from the tree, which removes the IonPage from the DOM.
    // The ionPageElement reference becomes stale and we need to wait for a new one.
    const ionPageIsInDocument =
      enteringViewItem?.ionPageElement && document.body.contains(enteringViewItem.ionPageElement);

    if (enteringViewItem && ionPageIsInDocument) {
      // Clear waiting state
      if (this.waitingForIonPage) {
        this.waitingForIonPage = false;
      }
      if (this.ionPageWaitTimeout) {
        clearTimeout(this.ionPageWaitTimeout);
        this.ionPageWaitTimeout = undefined;
      }

      this.handleReadyEnteringView(routeInfo, enteringViewItem, leavingViewItem, shouldUnmountLeavingViewItem);
    } else if (enteringViewItem && !ionPageIsInDocument) {
      // Wait for ion-page to mount
      // This handles both: no ionPageElement, or stale ionPageElement (not in document)
      // Clear stale reference if the element is no longer in the document
      if (enteringViewItem.ionPageElement && !document.body.contains(enteringViewItem.ionPageElement)) {
        enteringViewItem.ionPageElement = undefined;
      }
      // Ensure the view is marked as mounted so ViewLifeCycleManager renders the IonPage
      if (!enteringViewItem.mount) {
        enteringViewItem.mount = true;
      }
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
    /**
     * DO NOT remove ion-page-invisible here.
     *
     * PageManager.render() adds ion-page-invisible to prevent flash before componentDidMount.
     * At this point, the <IonPage> div exists but its CHILDREN (header, toolbar, menu-button)
     * have NOT rendered yet. If we remove ion-page-invisible now, the page becomes visible
     * with empty/incomplete content, causing a flicker (especially for ion-menu-button which
     * starts with menu-button-hidden class).
     *
     * Instead, let transitionPage handle visibility AFTER waiting for components to be ready.
     * This ensures the page only becomes visible when its content is fully rendered.
     */
    this.waitingForIonPage = false;
    if (this.ionPageWaitTimeout) {
      clearTimeout(this.ionPageWaitTimeout);
      this.ionPageWaitTimeout = undefined;
    }
    this.pendingPageTransition = false;

    const foundView = this.context.findViewItemByRouteInfo(routeInfo, this.id);

    if (foundView) {
      const oldPageElement = foundView.ionPageElement;

      /**
       * FIX for issue #28878: Reject orphaned IonPage registrations.
       *
       * When a component conditionally renders different IonPages (e.g., list vs empty state)
       * using React keys, and state changes simultaneously with navigation, the new IonPage
       * tries to register for a route we're navigating away from. This creates a stale view.
       *
       * Only reject if both pageIds exist and differ, to allow nested outlet registrations.
       */
      if (this.shouldRejectOrphanedPage(page, oldPageElement, routeInfo)) {
        this.hideAndRemoveOrphanedPage(page);
        return;
      }

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
   * Checks if a new IonPage should be rejected (component re-rendered while navigating away).
   */
  private shouldRejectOrphanedPage(
    newPage: HTMLElement,
    oldPageElement: HTMLElement | undefined,
    routeInfo: RouteInfo
  ): boolean {
    if (!oldPageElement || oldPageElement === newPage) {
      return false;
    }

    const newPageId = newPage.getAttribute('data-pageid');
    const oldPageId = oldPageElement.getAttribute('data-pageid');

    if (!newPageId || !oldPageId || newPageId === oldPageId) {
      return false;
    }

    return this.props.routeInfo.pathname !== routeInfo.pathname;
  }

  private hideAndRemoveOrphanedPage(page: HTMLElement): void {
    page.classList.add('ion-page-hidden');
    page.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      if (page.parentElement) {
        page.remove();
      }
    }, VIEW_UNMOUNT_DELAY_MS);
  }

  /**
   * Configures swipe-to-go-back gesture for the router outlet.
   */
  async setupRouterOutlet(routerOutlet: HTMLIonRouterOutletElement) {
    const canStart = () => {
      const config = getConfig();
      const swipeEnabled = config && config.get('swipeBackEnabled', routerOutlet.mode === 'ios');
      if (!swipeEnabled) {
        return false;
      }

      const { routeInfo } = this.props;
      const swipeBackRouteInfo = this.getSwipeBackRouteInfo();
      let enteringViewItem = this.context.findViewItemByRouteInfo(swipeBackRouteInfo, this.id, false);
      if (!enteringViewItem) {
        enteringViewItem = this.context.findViewItemByRouteInfo(swipeBackRouteInfo, undefined, false);
      }

      // View might have mount=false but ionPageElement still in DOM
      const ionPageInDocument = Boolean(
        enteringViewItem?.ionPageElement && document.body.contains(enteringViewItem.ionPageElement)
      );

      const canStartSwipe =
        !!enteringViewItem &&
        (enteringViewItem.mount || ionPageInDocument) &&
        enteringViewItem.routeData.match.pattern.path !== routeInfo.pathname;

      return canStartSwipe;
    };

    const onStart = async () => {
      const { routeInfo } = this.props;
      const swipeBackRouteInfo = this.getSwipeBackRouteInfo();
      // First try to find the view in the current outlet, then search all outlets
      let enteringViewItem = this.context.findViewItemByRouteInfo(swipeBackRouteInfo, this.id, false);
      if (!enteringViewItem) {
        enteringViewItem = this.context.findViewItemByRouteInfo(swipeBackRouteInfo, undefined, false);
      }
      const leavingViewItem = this.context.findViewItemByRouteInfo(routeInfo, this.id, false);

      // Ensure the entering view is mounted so React keeps rendering it during the gesture.
      // This is important when the view was previously marked for unmount but its
      // ionPageElement is still in the DOM.
      if (enteringViewItem && !enteringViewItem.mount) {
        enteringViewItem.mount = true;
      }

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
        // First try to find the view in the current outlet, then search all outlets
        let enteringViewItem = this.context.findViewItemByRouteInfo(swipeBackRouteInfo, this.id, false);
        if (!enteringViewItem) {
          enteringViewItem = this.context.findViewItemByRouteInfo(swipeBackRouteInfo, undefined, false);
        }
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
        /**
         * Only add ion-page-invisible if the element is not already visible.
         * During tab switches, the container page (e.g., TabContext wrapper) is
         * already visible and should remain so. Adding ion-page-invisible would
         * cause a flash where the visible page briefly becomes invisible.
         */
        if (!isViewVisible(enteringEl)) {
          enteringEl.classList.add('ion-page-invisible');
        }
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
        // Clone page for same-view transitions (e.g., /user/1 → /user/2)
        const match = matchComponent(leavingViewItem.reactElement, routeInfo.pathname);
        if (match) {
          const newLeavingElement = clonePageElement(leavingViewItem.ionPageElement.outerHTML);
          if (newLeavingElement) {
            this.routerOutletElement.appendChild(newLeavingElement);
            await runCommit(enteringViewItem.ionPageElement, newLeavingElement);
            this.routerOutletElement.removeChild(newLeavingElement);
          }
        } else {
          // Route no longer matches (e.g., /user/1 → /settings)
          await runCommit(enteringViewItem.ionPageElement, undefined);
        }
      } else {
        const leavingEl = leavingViewItem?.ionPageElement;
        // For non-animated transitions, don't pass leaving element to commit() to avoid
        // flicker caused by commit() briefly unhiding the leaving page
        const isNonAnimatedTransition = directionToUse === undefined && !progressAnimation;

        if (isNonAnimatedTransition && leavingEl) {
          /**
           * Flicker prevention for non-animated transitions:
           * Skip commit() entirely for simple visibility swaps (like tab switches).
           * commit() runs animation logic that can cause intermediate paints even with
           * duration: 0. Instead, we directly swap visibility classes and wait for
           * components to be ready before showing the entering element.
           */
          const enteringEl = enteringViewItem.ionPageElement;

          // Ensure entering element has proper base classes
          enteringEl.classList.add('ion-page');
          // Only add ion-page-invisible if not already visible (e.g., tab switches)
          if (!isViewVisible(enteringEl)) {
            enteringEl.classList.add('ion-page-invisible');
          }
          enteringEl.classList.remove('ion-page-hidden');
          enteringEl.removeAttribute('aria-hidden');

          // Handle can-go-back class since we're skipping commit() which normally sets this
          if (routeInfo.pushedByRoute) {
            enteringEl.classList.add('can-go-back');
          } else {
            enteringEl.classList.remove('can-go-back');
          }

          /**
           * Wait for components to be ready. Menu buttons start hidden (menu-button-hidden)
           * and become visible after componentDidLoad. Wait for hydration and visibility.
           */
          const waitForComponentsReady = () => {
            return new Promise<void>((resolve) => {
              const checkReady = () => {
                const ionicComponents = enteringEl.querySelectorAll(
                  'ion-header, ion-toolbar, ion-buttons, ion-menu-button, ion-title, ion-content'
                );
                const allHydrated = Array.from(ionicComponents).every((el) => el.classList.contains('hydrated'));

                const menuButtons = enteringEl.querySelectorAll('ion-menu-button');
                const menuButtonsReady = Array.from(menuButtons).every(
                  (el) => !el.classList.contains('menu-button-hidden')
                );

                return allHydrated && menuButtonsReady;
              };

              if (checkReady()) {
                resolve();
                return;
              }

              let resolved = false;
              const observer = new MutationObserver(() => {
                if (!resolved && checkReady()) {
                  resolved = true;
                  observer.disconnect();
                  resolve();
                }
              });

              observer.observe(enteringEl, {
                subtree: true,
                attributes: true,
                attributeFilter: ['class'],
              });

              setTimeout(() => {
                if (!resolved) {
                  resolved = true;
                  observer.disconnect();
                  resolve();
                }
              }, 100);
            });
          };

          await waitForComponentsReady();

          // Swap visibility in sync with browser's render cycle
          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => {
              enteringEl.classList.remove('ion-page-invisible');
              // Second rAF ensures entering is painted before hiding leaving
              requestAnimationFrame(() => {
                leavingEl.classList.add('ion-page-hidden');
                leavingEl.setAttribute('aria-hidden', 'true');
                resolve();
              });
            });
          });
        } else {
          await runCommit(enteringViewItem.ionPageElement, leavingEl);
          // For animated transitions, hide leaving element after commit completes
          if (leavingEl && !progressAnimation) {
            leavingEl.classList.add('ion-page-hidden');
            leavingEl.setAttribute('aria-hidden', 'true');
          }
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
  const originalPathname = routeInfo.pathname;
  let relativePathnameToMatch = routeInfo.pathname;

  // Check if we have relative routes (routes that don't start with '/')
  const hasRelativeRoutes = sortedRoutes.some((r) => r.props.path && !r.props.path.startsWith('/'));
  const hasIndexRoute = sortedRoutes.some((r) => r.props.index);

  // SIMPLIFIED: Trust React Router 6's matching more, compute relative path when parent is known
  if ((hasRelativeRoutes || hasIndexRoute) && parentPath) {
    const parentPrefix = parentPath.replace('/*', '');
    // Normalize both paths to start with '/' for consistent comparison
    const normalizedParent = stripTrailingSlash(parentPrefix.startsWith('/') ? parentPrefix : `/${parentPrefix}`);
    const normalizedPathname = stripTrailingSlash(routeInfo.pathname);

    // Only compute relative path if pathname is within parent scope
    if (normalizedPathname.startsWith(normalizedParent + '/') || normalizedPathname === normalizedParent) {
      const pathSegments = routeInfo.pathname.split('/').filter(Boolean);
      const parentSegments = normalizedParent.split('/').filter(Boolean);
      const relativeSegments = pathSegments.slice(parentSegments.length);
      relativePathnameToMatch = relativeSegments.join('/'); // Empty string is valid for index routes
    }
  }

  // Find the first matching route
  for (const child of sortedRoutes) {
    const childPath = child.props.path as string | undefined;
    const isAbsoluteRoute = childPath && childPath.startsWith('/');

    // Determine which pathname to match against:
    // - For absolute routes: use the original full pathname
    // - For relative routes with a parent: use the computed relative pathname
    // - For relative routes at root level (no parent): use the original pathname
    //   (matchPath will handle the relative-to-absolute normalization)
    const pathnameToMatch = isAbsoluteRoute ? originalPathname : relativePathnameToMatch;

    // Determine the path portion to match:
    // - For absolute routes: use derivePathnameToMatch
    // - For relative routes at root level (no parent): use original pathname
    //   directly since matchPath normalizes both path and pathname
    // - For relative routes with parent: use derivePathnameToMatch for wildcards,
    //   or the computed relative pathname for non-wildcards
    let pathForMatch: string;
    if (isAbsoluteRoute) {
      pathForMatch = derivePathnameToMatch(pathnameToMatch, childPath);
    } else if (!parentPath && childPath) {
      // Root-level relative route: use the full pathname and let matchPath
      // handle the normalization (it adds '/' to both path and pathname)
      pathForMatch = originalPathname;
    } else if (childPath && childPath.includes('*')) {
      // Relative wildcard route with parent path: use derivePathnameToMatch
      pathForMatch = derivePathnameToMatch(pathnameToMatch, childPath);
    } else {
      pathForMatch = pathnameToMatch;
    }

    const match = matchPath({
      pathname: pathForMatch,
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
