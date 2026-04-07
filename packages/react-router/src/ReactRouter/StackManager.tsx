/**
 * `StackManager` is responsible for managing page transitions, keeping track
 * of views (pages), and ensuring that navigation behaves like native apps —
 * particularly with animations and swipe gestures.
 */

import type { RouteInfo, StackContextState, ViewItem } from '@ionic/react';
import { IonRoute, RouteManagerContext, StackContext, generateId, getConfig } from '@ionic/react';
import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Route, UNSAFE_RouteContext as RouteContext, matchRoutes } from 'react-router-dom';

import { clonePageElement } from './clonePageElement';
import {
  analyzeRouteChildren,
  computeCommonPrefix,
  computeParentPath,
  isPathnameInScope,
} from './utils/computeParentPath';
import { derivePathnameToMatch, matchPath } from './utils/pathMatching';
import { stripTrailingSlash } from './utils/pathNormalization';
import { extractRouteChildren, getRoutesChildren, isNavigateElement } from './utils/routeElements';

/**
 * Delay in milliseconds before unmounting a view after a transition completes.
 * This ensures the page transition animation finishes before the view is removed.
 */
const VIEW_UNMOUNT_DELAY_MS = 250;

/**
 * Delay (ms) to wait for an IonPage to mount before proceeding with a
 * page transition. Only container routes (nested outlets with no direct
 * IonPage) actually hit this timeout; normal routes clear it early via
 * registerIonPage, so a larger value here doesn't affect the happy path.
 */
const ION_PAGE_WAIT_TIMEOUT_MS = 300;

interface StackManagerProps {
  routeInfo: RouteInfo;
  id?: string;
}

const isViewVisible = (el: HTMLElement) =>
  !el.classList.contains('ion-page-invisible') && !el.classList.contains('ion-page-hidden') && el.style.visibility !== 'hidden';

const hideIonPageElement = (element: HTMLElement | undefined): void => {
  if (element) {
    element.classList.add('ion-page-hidden');
    element.setAttribute('aria-hidden', 'true');
  }
};

const showIonPageElement = (element: HTMLElement | undefined): void => {
  if (element) {
    element.style.removeProperty('visibility');
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

  private pendingPageTransition = false;
  private waitingForIonPage = false;
  private ionPageWaitTimeout?: ReturnType<typeof setTimeout>;
  private outOfScopeUnmountTimeout?: ReturnType<typeof setTimeout>;
  /** Whether this outlet was previously in scope. */
  private wasInScope = true;
  /**
   * Track the last transition's entering and leaving view IDs to prevent
   * duplicate transitions during rapid navigation (e.g., Navigate redirects)
   */
  private lastTransition?: { enteringId: string; leavingId?: string };
  /** Tracks whether the component is mounted to guard async transition paths. */
  private _isMounted = false;
  /** In-flight requestAnimationFrame IDs from transitionPage, cancelled on unmount. */
  private transitionRafIds: number[] = [];
  /** In-flight MutationObserver from waitForComponentsReady, disconnected on unmount. */
  private transitionObserver?: MutationObserver;
  /**
   * Monotonically increasing counter incremented at the start of each transitionPage call.
   * Used to detect when an async commit() resolves after a newer transition has already run,
   * preventing the stale commit from hiding an element that the newer transition made visible.
   */
  private transitionGeneration = 0;
  /**
   * The entering element of the most recent transitionPage call.
   * Used alongside transitionGeneration to undo incorrect ion-page-hidden applied
   * by a stale animated commit that raced with a newer non-animated transition.
   */
  private transitionEnteringElement?: HTMLElement;

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
   * Whether this outlet is at the root level (no parent route matches).
   * Derived from UNSAFE_RouteContext in render() — empty matches means root.
   */
  private isRootOutlet = true;

  /**
   * Determines the parent path for nested routing in React Router 6.
   *
   * When the mount path is known (seeded from UNSAFE_RouteContext), returns
   * it directly — no iterative discovery needed. The computeParentPath
   * fallback only runs for root outlets where RouteContext doesn't provide
   * a parent match.
   */
  private getParentPath(): string | undefined {
    const currentPathname = this.props.routeInfo.pathname;

    // Prevent out-of-scope outlets from adopting unrelated routes.
    // Uses segment-aware comparison: /tabs-secondary must NOT match /tabs scope.
    if (this.outletMountPath && !isPathnameInScope(currentPathname, this.outletMountPath)) {
      return undefined;
    }

    // Fast path: mount path is known from RouteContext. The parent path IS the
    // mount path — no need to run the iterative computeParentPath algorithm.
    if (this.outletMountPath && !this.isRootOutlet) {
      return this.outletMountPath;
    }

    // Fallback: root outlet or mount path not yet seeded. Run the full
    // computeParentPath algorithm to discover the parent depth.
    if (this.ionRouterOutlet) {
      const routeChildren = extractRouteChildren(this.ionRouterOutlet.props.children);
      const { hasRelativeRoutes, hasIndexRoute, hasWildcardRoute } = analyzeRouteChildren(routeChildren);

      if (!this.isRootOutlet || hasRelativeRoutes || hasIndexRoute) {
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
      const leavingRoutePath = leavingViewItem?.reactElement?.props?.path as string | undefined;

      // Never unmount root path or views without a path - needed for back navigation
      if (!leavingRoutePath || leavingRoutePath === '/' || leavingRoutePath === '') {
        return false;
      }

      // Replace actions unmount the leaving view since it's being replaced in history.
      return true;
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
    if (!this.outletMountPath || isPathnameInScope(routeInfo.pathname, this.outletMountPath)) {
      this.wasInScope = true;
      // Cancel any pending deferred unmount from a previous out-of-scope transition.
      if (this.outOfScopeUnmountTimeout) {
        clearTimeout(this.outOfScopeUnmountTimeout);
        this.outOfScopeUnmountTimeout = undefined;
      }
      return false;
    }

    // Only run the out-of-scope cleanup on the first transition out of scope.
    // When parameterized routes create multiple StackManager instances with the
    // same outlet ID, a stale (hidden) instance must not destroy views that an
    // active instance just created. After the initial cleanup, the stale instance
    // stays dormant until its mount path becomes in-scope again.
    if (!this.wasInScope) {
      return true;
    }
    this.wasInScope = false;

    // Fire lifecycle events on any visible view before unmounting.
    // When navigating away from a tabbed section, the parent outlet fires
    // ionViewDidLeave on the tabs container, but the active tab child page
    // never receives its own lifecycle events because the core transition
    // dispatches events with bubbles:false. This ensures tab child pages
    // get ionViewWillLeave/ionViewDidLeave so useIonViewDidLeave fires.
    const allViewsInOutlet = this.context.getViewItemsForOutlet(this.id);
    allViewsInOutlet.forEach((viewItem) => {
      if (viewItem.ionPageElement && isViewVisible(viewItem.ionPageElement)) {
        viewItem.ionPageElement.dispatchEvent(
          new CustomEvent('ionViewWillLeave', { bubbles: false, cancelable: false })
        );
        viewItem.ionPageElement.dispatchEvent(
          new CustomEvent('ionViewDidLeave', { bubbles: false, cancelable: false })
        );
      }
    });

    // Defer removal of view items to allow the parent outlet's leaving-page
    // animation to complete with content still visible. When the nested outlet
    // unmounts views immediately, React removes the child DOM elements before
    // the parent's transition animation can render them. On MD mode the back
    // animation only animates the leaving page (slide down + fade), so an
    // empty shell is invisible and the transition appears instant.
    //
    // VIEW_UNMOUNT_DELAY_MS exceeds the MD back transition (200ms).
    this.outOfScopeUnmountTimeout = setTimeout(() => {
      if (!this._isMounted) return;
      allViewsInOutlet.forEach((viewItem) => {
        this.context.unMountViewItem(viewItem);
      });
      this.forceUpdate();
    }, VIEW_UNMOUNT_DELAY_MS);

    return true;
  }

  /**
   * Handles root navigation by unmounting all non-entering views in this outlet.
   * Fires ionViewWillLeave / ionViewDidLeave only on views that are currently visible.
   * Views that are mounted but not visible (e.g., pages earlier in the back stack)
   * are silently unmounted without lifecycle events, consistent with the behavior
   * of out-of-scope outlet cleanup.
   */
  private handleRootNavigation(enteringViewItem: ViewItem | undefined): void {
    const allViewsInOutlet = this.context.getViewItemsForOutlet(this.id);
    allViewsInOutlet.forEach((viewItem) => {
      if (viewItem === enteringViewItem) {
        return;
      }
      if (viewItem.ionPageElement && isViewVisible(viewItem.ionPageElement)) {
        viewItem.ionPageElement.dispatchEvent(
          new CustomEvent('ionViewWillLeave', { bubbles: false, cancelable: false })
        );
        viewItem.ionPageElement.dispatchEvent(
          new CustomEvent('ionViewDidLeave', { bubbles: false, cancelable: false })
        );
      }
      this.context.unMountViewItem(viewItem);
    });
  }

  /**
   * Handles nested outlet with relative routes but no parent path. Returns true to abort.
   */
  private handleOutOfContextNestedOutlet(
    parentPath: string | undefined,
    leavingViewItem: ViewItem | undefined
  ): boolean {
    if (this.isRootOutlet || parentPath !== undefined || !this.ionRouterOutlet) {
      return false;
    }

    const routesChildren =
      getRoutesChildren(this.ionRouterOutlet.props.children) ?? this.ionRouterOutlet.props.children;
    const routeChildren = React.Children.toArray(routesChildren).filter(
      (child): child is React.ReactElement =>
        React.isValidElement(child) && (child.type === Route || child.type === IonRoute)
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
    if (this.isRootOutlet || enteringRoute || enteringViewItem) {
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
        const updatedMatch = matchComponent(enteringViewItem.reactElement, routeInfo.pathname, true, this.outletMountPath);
        if (updatedMatch) {
          enteringViewItem.routeData.match = updatedMatch;
        }

        const enteringEl = enteringViewItem.ionPageElement;
        if (enteringEl) {
          showIonPageElement(enteringEl);
          enteringEl.classList.remove('ion-page-invisible');
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
        const updatedMatch = matchComponent(enteringViewItem.reactElement, routeInfo.pathname, true, this.outletMountPath);
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

    const shouldSkipAnimation = this.applySkipAnimationIfNeeded(enteringViewItem, leavingViewItem);

    this.transitionPage(routeInfo, enteringViewItem, leavingViewItem, undefined, false, shouldSkipAnimation);

    if (shouldUnmountLeavingViewItem && leavingViewItem && enteringViewItem !== leavingViewItem) {
      // For non-replace actions (back nav), set mount=false here to hide the view.
      // For replace actions, handleLeavingViewUnmount sets mount=false only after
      // its container-to-container guard passes, avoiding zombie state.
      if (routeInfo.routeAction !== 'replace') {
        leavingViewItem.mount = false;
      }
      this.handleLeavingViewUnmount(routeInfo, enteringViewItem, leavingViewItem);
    }

    // Clean up orphaned sibling views after replace actions (redirects)
    this.cleanupOrphanedSiblingViews(routeInfo, enteringViewItem, leavingViewItem);
  }

  /**
   * Handles leaving view unmount for replace actions.
   */
  private handleLeavingViewUnmount(routeInfo: RouteInfo, enteringViewItem: ViewItem, leavingViewItem: ViewItem): void {
    // Only replace actions unmount views; push/pop cache for navigation history
    if (routeInfo.routeAction !== 'replace') {
      return;
    }

    if (!leavingViewItem.ionPageElement) {
      leavingViewItem.mount = false;
      const viewToUnmount = leavingViewItem;
      setTimeout(() => {
        this.context.unMountViewItem(viewToUnmount);
        this.forceUpdate();
      }, VIEW_UNMOUNT_DELAY_MS);
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

    leavingViewItem.mount = false;

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

    const allViewsInOutlet = this.context.getViewItemsForOutlet(this.id);
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
        const segments = normalized.split('/').filter(Boolean);
        // Strip trailing parameter segments (e.g., :id) so that
        // sibling routes like /items/list/:id and /items/detail/:id
        // resolve to the same parent (/items).
        while (segments.length > 0 && segments[segments.length - 1].startsWith(':')) {
          segments.pop();
        }
        segments.pop();
        return segments.length > 0 ? '/' + segments.join('/') : '/';
      };

      const parent = getParent(path1);
      // Exclude root-level routes from sibling detection to avoid unintended
      // cleanup of unrelated top-level routes. Also covers single-depth param
      // routes (e.g., /items/:id) which resolve to root after param stripping.
      if (parent === '/') {
        return false;
      }
      return parent === getParent(path2);
    };

    for (const viewItem of allViewsInOutlet) {
      const viewRoutePath = viewItem.reactElement?.props?.path as string | undefined;

      const shouldSkip =
        viewItem.id === enteringViewItem.id ||
        (leavingViewItem && viewItem.id === leavingViewItem.id) ||
        !viewItem.mount ||
        !viewRoutePath ||
        // Don't clean up container routes when entering a container route
        // (e.g., /tabs/* and /settings/* coexist for tab switching)
        (viewRoutePath.endsWith('/*') && enteringRoutePath.endsWith('/*'));

      if (shouldSkip) {
        continue;
      }

      const isOrphanedSpecificRoute = !viewRoutePath.endsWith('/*');

      // Clean up sibling non-container routes that are no longer reachable.
      let shouldCleanup = false;
      if ((isReplaceAction || isPushToContainer) && isOrphanedSpecificRoute) {
        shouldCleanup = areSiblingRoutes(enteringRoutePath, viewRoutePath);
      }

      if (shouldCleanup) {
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
   * Determines whether to skip the transition animation and, if so, immediately
   * hides the leaving view with inline `visibility:hidden`.
   *
   * Skips transitions only for outlets nested inside a parent IonPage's content
   * area (i.e., an ion-content sits between the outlet and the .ion-page). These
   * outlets render child pages inside a parent page's scrollable area, and the MD
   * animation shows both entering and leaving pages simultaneously — causing text
   * overlap and nested scrollbars. Standard page-level outlets (tabs, routing,
   * swipe-to-go-back) animate normally even though they sit inside a framework-
   * managed .ion-page wrapper from the parent outlet's view stack.
   *
   * Uses inline visibility:hidden rather than ion-page-hidden class because
   * core's beforeTransition() removes ion-page-hidden via setPageHidden().
   * Inline visibility:hidden survives that removal, keeping the page hidden
   * until React unmounts it after ionViewDidLeave fires. Unlike display:none,
   * visibility:hidden preserves element geometry so commit() animations
   * can resolve normally.
   */
  private applySkipAnimationIfNeeded(
    enteringViewItem: ViewItem,
    leavingViewItem: ViewItem | undefined
  ): boolean {
    // Only skip for outlets genuinely nested inside a page's content area.
    // Walk from the outlet up to the nearest .ion-page; if an ion-content
    // sits in between, the outlet is inside scrollable page content and
    // animating would cause overlapping pages with duplicate scrollbars.
    let isInsidePageContent = false;
    let el: HTMLElement | null = this.routerOutletElement?.parentElement ?? null;
    while (el) {
      if (el.classList.contains('ion-page')) break;
      if (el.tagName === 'ION-CONTENT') {
        isInsidePageContent = true;
        break;
      }
      el = el.parentElement;
    }

    const shouldSkip = isInsidePageContent && !!leavingViewItem && enteringViewItem !== leavingViewItem;

    if (shouldSkip && leavingViewItem?.ionPageElement) {
      leavingViewItem.ionPageElement.style.setProperty('visibility', 'hidden');
      leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
    }

    return shouldSkip;
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

      // Hide ALL other visible views in this outlet for Navigate redirects.
      // Same rationale as the timeout path: intermediate redirects can shift
      // the leaving view reference, leaving the original page visible.
      const allViewsInOutlet = this.context.getViewItemsForOutlet(this.id);
      allViewsInOutlet.forEach((viewItem) => {
        if (viewItem.id !== enteringViewItem.id && viewItem.ionPageElement) {
          hideIonPageElement(viewItem.ionPageElement);
        }
      });

      // Don't unmount if entering and leaving are the same view item
      if (shouldUnmountLeavingViewItem && leavingViewItem && enteringViewItem !== leavingViewItem) {
        if (routeInfo.routeAction !== 'replace') {
          leavingViewItem.mount = false;
        }
        this.handleLeavingViewUnmount(routeInfo, enteringViewItem, leavingViewItem);
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
        const shouldSkipAnimation = this.applySkipAnimationIfNeeded(latestEnteringView, latestLeavingView ?? undefined);
        this.transitionPage(routeInfo, latestEnteringView, latestLeavingView ?? undefined, undefined, false, shouldSkipAnimation);

        if (shouldUnmountLeavingViewItem && latestLeavingView && latestEnteringView !== latestLeavingView) {
          if (routeInfo.routeAction !== 'replace') {
            latestLeavingView.mount = false;
          }
          this.handleLeavingViewUnmount(routeInfo, latestEnteringView, latestLeavingView);
        }

        this.forceUpdate();
      } else {
        /**
         * Timeout fired and entering view still has no ionPageElement.
         * This happens for container routes that render nested outlets without a direct IonPage.
         * Hide ALL other visible views in this outlet, not just the computed leaving view.
         * This handles cases where intermediate redirects (e.g., Navigate in nested routes)
         * change the leaving view reference, leaving the original page still visible.
         */
        const allViewsInOutlet = this.context.getViewItemsForOutlet(this.id);
        allViewsInOutlet.forEach((viewItem) => {
          if (viewItem.id !== latestEnteringView.id && viewItem.ionPageElement) {
            hideIonPageElement(viewItem.ionPageElement);
          }
        });
        this.forceUpdate();

        // Safety net: after forceUpdate triggers a React render cycle, check if
        // any pages in this outlet are stuck with ion-page-invisible. This can
        // happen when view lookup fails (e.g., wildcard-to-index transitions
        // where the view item gets corrupted). The forceUpdate above causes
        // React to render the correct component, but ion-page-invisible may
        // persist if no transition runs for that page.
        setTimeout(() => {
          if (!this._isMounted || !this.routerOutletElement) return;
          const stuckPages = this.routerOutletElement.querySelectorAll(':scope > .ion-page-invisible');
          stuckPages.forEach((page) => {
            page.classList.remove('ion-page-invisible');
          });
        }, ION_PAGE_WAIT_TIMEOUT_MS);
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
    this._isMounted = true;
    if (this.routerOutletElement) {
      this.setupRouterOutlet(this.routerOutletElement);
      // Defer to a microtask to avoid calling forceUpdate() synchronously during
      // React 19's reappearLayoutEffects phase, which re-runs componentDidMount
      // without a preceding componentWillUnmount and causes "Maximum update depth exceeded".
      const routeInfo = this.props.routeInfo;
      queueMicrotask(() => {
        if (this._isMounted && this.props.routeInfo.pathname === routeInfo.pathname) {
          this.handlePageTransition(routeInfo);
        }
      });
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
    this._isMounted = false;

    // Cancel any in-flight transition rAFs
    for (const id of this.transitionRafIds) {
      cancelAnimationFrame(id);
    }
    this.transitionRafIds = [];

    // Disconnect any in-flight MutationObserver from waitForComponentsReady
    if (this.transitionObserver) {
      this.transitionObserver.disconnect();
      this.transitionObserver = undefined;
    }

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
    const allViewsInOutlet = this.context.getViewItemsForOutlet(this.id);
    allViewsInOutlet.forEach((viewItem) => {
      hideIonPageElement(viewItem.ionPageElement);
    });

    this.context.clearOutlet(this.id);
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
    let leavingViewItem = viewItems.leavingViewItem;
    let shouldUnmountLeavingViewItem = this.shouldUnmountLeavingView(routeInfo, enteringViewItem, leavingViewItem);

    // Get parent path for nested outlets
    const parentPath = this.getParentPath();

    // Handle out-of-scope outlet (route outside mount path)
    if (this.handleOutOfScopeOutlet(routeInfo)) {
      return;
    }

    // Handle root navigation: unmount all non-entering views
    if (routeInfo.routeDirection === 'root') {
      this.handleRootNavigation(enteringViewItem);
      leavingViewItem = undefined;
      shouldUnmountLeavingViewItem = false;
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
     * PageManager's ref callback adds ion-page-invisible synchronously to prevent flash.
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

      /**
       * Don't let a nested element (e.g., ion-router-outlet with ionPage prop)
       * override an existing IonPage registration when the existing element is
       * an ancestor of the new one. This ensures ionPageElement always points
       * to the outermost IonPage, which is needed to properly hide the entire
       * page during back navigation (not just the inner outlet).
       */
      if (oldPageElement && oldPageElement !== page && oldPageElement.isConnected && oldPageElement.contains(page)) {
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

      // For wildcard/parameterized routes, the pattern path (e.g. "/foo/*") will
      // never equal the resolved pathname (e.g. "/foo/bar"), so the pattern check
      // alone isn't sufficient. Also, verify the entering view's resolved pathname
      // differs from the current pathname — if they match, the entering and leaving
      // views are the same and the swipe gesture shouldn't start.
      const canStartSwipe =
        !!enteringViewItem &&
        (enteringViewItem.mount || ionPageInDocument) &&
        enteringViewItem.routeData.match.pattern.path !== routeInfo.pathname &&
        enteringViewItem.routeData.match.pathname !== routeInfo.pathname;

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
   * @param skipAnimation When true, forces `duration: 0` so the page
   * swap is instant (no visible animation). Used for ionPage outlets
   * and back navigations that unmount the leaving view to prevent
   * overlapping content during the transition. Defaults to `false`.
   */
  async transitionPage(
    routeInfo: RouteInfo,
    enteringViewItem: ViewItem,
    leavingViewItem?: ViewItem,
    direction?: 'forward' | 'back',
    progressAnimation = false,
    skipAnimation = false
  ) {
    const myGeneration = ++this.transitionGeneration;

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

      const commitDuration = skipTransition || skipAnimation || directionToUse === undefined ? 0 : undefined;

      // Race commit against a timeout to recover from hangs
      const commitPromise = routerOutlet.commit(enteringEl, leavingEl, {
        duration: commitDuration,
        direction: directionToUse,
        showGoBack: !!routeInfo.pushedByRoute,
        progressAnimation,
        animationBuilder: routeInfo.routeAnimation,
      });

      const timeoutMs = 5000;
      const timeoutPromise = new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), timeoutMs));
      const result = await Promise.race([commitPromise.then(() => 'done' as const), timeoutPromise]);

      // Bail out if the component unmounted during the commit animation
      if (!this._isMounted) return;

      if (result === 'timeout') {
        // Force entering page visible even though commit hung
        enteringEl.classList.remove('ion-page-invisible');
      }

      /**
       * If a newer transitionPage call ran while this commit was in-flight (e.g., a tab
       * switch fired during a forward animation), the core commit may have applied
       * ion-page-hidden to leavingEl even though the newer transition already made it
       * visible. Undo that stale hide so the newer transition's DOM state wins.
       */
      if (myGeneration !== this.transitionGeneration && leavingEl && leavingEl === this.transitionEnteringElement) {
        showIonPageElement(leavingEl);
      }

      if (!progressAnimation) {
        enteringEl.classList.remove('ion-page-invisible');
      }
    };

    const routerOutlet = this.routerOutletElement!;

    const routeInfoFallbackDirection =
      routeInfo.routeDirection === 'none' || routeInfo.routeDirection === 'root' ? undefined : routeInfo.routeDirection;
    const directionToUse = direction ?? routeInfoFallbackDirection;

    if (enteringViewItem && enteringViewItem.ionPageElement && this.routerOutletElement) {
      this.transitionEnteringElement = enteringViewItem.ionPageElement;

      if (leavingViewItem && leavingViewItem.ionPageElement && enteringViewItem === leavingViewItem) {
        // Clone page for same-view transitions (e.g., /user/1 → /user/2)
        const match = matchComponent(leavingViewItem.reactElement, routeInfo.pathname, undefined, this.outletMountPath);
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
           * Skip commit() for non-animated transitions (like tab switches).
           * commit() runs animation logic that can cause intermediate paints
           * even with duration: 0. Instead, swap visibility synchronously.
           *
           * Synchronous DOM class changes are batched into a single browser
           * paint, so there's no gap frame where neither page is visible and
           * no overlap frame where both pages are visible.
           */
          const enteringEl = enteringViewItem.ionPageElement;

          // Ensure entering element has proper base classes
          enteringEl.classList.add('ion-page');

          // Clear ALL hidden state from entering element. showIonPageElement
          // removes visibility:hidden (from applySkipAnimationIfNeeded),
          // ion-page-hidden, and aria-hidden in one call.
          showIonPageElement(enteringEl);

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
                  if (this.transitionObserver === observer) {
                    this.transitionObserver = undefined;
                  }
                  resolve();
                }
              });

              // Disconnect any previous observer before tracking the new one
              if (this.transitionObserver) {
                this.transitionObserver.disconnect();
              }
              this.transitionObserver = observer;

              observer.observe(enteringEl, {
                subtree: true,
                attributes: true,
                attributeFilter: ['class'],
              });

              setTimeout(() => {
                if (!resolved) {
                  resolved = true;
                  observer.disconnect();
                  if (this.transitionObserver === observer) {
                    this.transitionObserver = undefined;
                  }
                  resolve();
                }
              }, 100);
            });
          };

          await waitForComponentsReady();

          // Bail out if the component unmounted during waitForComponentsReady
          if (!this._isMounted) return;

          // Swap visibility synchronously - show entering, hide leaving
          // Skip hiding if a newer transition already made leavingEl the entering view
          enteringEl.classList.remove('ion-page-invisible');
          if (myGeneration === this.transitionGeneration || leavingEl !== this.transitionEnteringElement) {
            leavingEl.classList.add('ion-page-hidden');
            leavingEl.setAttribute('aria-hidden', 'true');
          }
        } else {
          await runCommit(enteringViewItem.ionPageElement, leavingEl);
          if (leavingEl && !progressAnimation) {
            // Skip hiding if a newer transition already made leavingEl the entering view
            // runCommit's generation check has already restored its visibility in that case
            if (myGeneration === this.transitionGeneration || leavingEl !== this.transitionEnteringElement) {
              leavingEl.classList.add('ion-page-hidden');
              leavingEl.setAttribute('aria-hidden', 'true');
            }
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

    return (
      <RouteContext.Consumer>
        {(parentContext) => {
          // Derive the outlet's mount path from React Router's matched route context.
          // This eliminates the need for heuristic-based mount path discovery in
          // computeParentPath, since React Router already knows the matched base path.
          const parentMatches = parentContext?.matches as { pathnameBase: string }[] | undefined;
          const parentPathnameBase =
            parentMatches && parentMatches.length > 0
              ? parentMatches[parentMatches.length - 1].pathnameBase
              : undefined;

          // Derive isRootOutlet from RouteContext: empty matches means root.
          this.isRootOutlet = !parentMatches || parentMatches.length === 0;

          // Seed StackManager's mount path from the parent route context
          if (parentPathnameBase && !this.outletMountPath) {
            this.outletMountPath = parentPathnameBase;
          }

          const components = this.context.getChildrenToRender(
            this.id,
            this.ionRouterOutlet,
            this.props.routeInfo,
            () => {
              // Callback triggers re-render when view items are modified during getChildrenToRender
              this.forceUpdate();
            },
            parentPathnameBase
          );

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
        }}
      </RouteContext.Consumer>
    );
  }

  static get contextType() {
    return RouteManagerContext;
  }
}

export default StackManager;

/**
 * Converts React Route elements to RouteObject format for use with matchRoutes().
 * Filters out pathless routes (which are handled by fallback logic separately).
 *
 * When a basename is provided, absolute route paths are relativized by stripping
 * the basename prefix. This is necessary because matchRoutes() strips the basename
 * from the LOCATION pathname but not from route paths — absolute paths must be
 * made relative to the basename for matching to work correctly.
 *
 * @param routeChildren The flat array of Route/IonRoute elements from the outlet.
 * @param basename The resolved parent path (without trailing slash or `/*`) used to relativize absolute paths.
 */
function routeElementsToRouteObjects(routeChildren: React.ReactElement[], basename?: string): RouteObject[] {
  return routeChildren
    .filter((child) => child.props.path != null || child.props.index)
    .map((child): RouteObject => {
      const handle = { _element: child };
      let path = child.props.path as string | undefined;

      // Relativize absolute paths by stripping the basename prefix
      if (path && path.startsWith('/') && basename) {
        if (path === basename) {
          path = '';
        } else if (path.startsWith(basename + '/')) {
          path = path.slice(basename.length + 1);
        }
      }

      if (child.props.index) {
        return {
          index: true,
          handle,
          caseSensitive: child.props.caseSensitive || undefined,
        };
      }
      return {
        path,
        handle,
        caseSensitive: child.props.caseSensitive || undefined,
      };
    });
}

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
    (child): child is React.ReactElement =>
      React.isValidElement(child) && (child.type === Route || child.type === IonRoute)
  );

  // Delegate route matching to RR6's matchRoutes(), which handles specificity ranking internally.
  const basename = parentPath ? stripTrailingSlash(parentPath.replace('/*', '')) : undefined;
  const routeObjects = routeElementsToRouteObjects(routeChildren, basename);
  const matches = matchRoutes(routeObjects, { pathname: routeInfo.pathname }, basename);

  if (matches && matches.length > 0) {
    const bestMatch = matches[matches.length - 1];
    matchedNode = (bestMatch.route as any).handle?._element ?? undefined;
  }

  // Fallback: try pathless routes, but only if pathname is within scope.
  if (!matchedNode) {
    let pathnameInScope = true;

    if (parentPath) {
      pathnameInScope = isPathnameInScope(routeInfo.pathname, parentPath);
    } else {
      const absolutePathRoutes = routeChildren.filter((r) => r.props.path && r.props.path.startsWith('/'));
      if (absolutePathRoutes.length > 0) {
        const absolutePaths = absolutePathRoutes.map((r) => r.props.path as string);
        const commonPrefix = computeCommonPrefix(absolutePaths);
        if (commonPrefix && commonPrefix !== '/') {
          pathnameInScope = routeInfo.pathname.startsWith(commonPrefix);
        }
      }
    }

    if (pathnameInScope) {
      for (const child of routeChildren) {
        if (!child.props.path) {
          fallbackNode = child;
          break;
        }
      }
    }
  }

  return matchedNode ?? fallbackNode;
}

function matchComponent(node: React.ReactElement, pathname: string, forceExact?: boolean, parentPath?: string) {
  const routePath: string | undefined = node?.props?.path;

  let pathnameToMatch: string;
  if (parentPath && routePath && !routePath.startsWith('/')) {
    // When parent path is known, compute exact relative pathname
    const relative = pathname.startsWith(parentPath)
      ? pathname.slice(parentPath.length).replace(/^\//, '')
      : pathname;
    pathnameToMatch = relative;
  } else {
    pathnameToMatch = derivePathnameToMatch(pathname, routePath);
  }

  return matchPath({
    pathname: pathnameToMatch,
    componentProps: {
      ...node.props,
      end: forceExact,
    },
  });
}
