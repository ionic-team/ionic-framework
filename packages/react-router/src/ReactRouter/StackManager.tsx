/**
 * `StackManager` is responsible for managing page transitions, keeping track
 * of views (pages), and ensuring that navigation behaves like native apps —
 * particularly with animations and swipe gestures.
 */

import type { RouteInfo, StackContextState, ViewItem } from '@ionic/react';
import { RouteManagerContext, StackContext, generateId, getConfig } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router';

import { clonePageElement } from './clonePageElement';
import { findRoutesNode } from './utils/findRoutesNode';
import { matchPath } from './utils/matchPath';

// TODO(FW-2959): types

interface StackManagerProps {
  routeInfo: RouteInfo;
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
    this.id = generateId('routerOutlet');
    this.prevProps = undefined;
    this.skipTransition = false;
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
       * The leaving view item should be unmounted in the following cases:
       * - Navigating with `replace`
       * - Navigating forward but not pushing a new view (e.g., back navigation or non-animated transition) and the leaving view is not the same as the entering view
       * - The routeOptions explicitly says unmount
       */
      if (leavingViewItem) {
        if (routeInfo.routeAction === 'replace') {
          leavingViewItem.mount = false;
        } else if (!(routeInfo.routeAction === 'push' && routeInfo.routeDirection === 'forward')) {
          if (routeInfo.routeDirection !== 'none' && enteringViewItem !== leavingViewItem) {
            leavingViewItem.mount = false;
          }
        } else if (routeInfo.routeOptions?.unmount) {
          leavingViewItem.mount = false;
        }
      }

      // Match the route element to render
      const enteringRoute = findRouteByRouteInfo(this.ionRouterOutlet?.props.children, routeInfo) as React.ReactElement;

      /**
       * If we already have a view item for this route, update its element.
       * Otherwise, create a new view item for the route.
       */
      if (enteringViewItem) {
        enteringViewItem.reactElement = enteringRoute;
      } else if (enteringRoute) {
        enteringViewItem = this.context.createViewItem(this.id, enteringRoute, routeInfo);
        this.context.addViewItem(enteringViewItem);
      }

      /**
       * Begin transition only if we have an ionPageElement (i.e., the page has rendered).
       */
      if (enteringViewItem && enteringViewItem.ionPageElement) {
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
          if (enteringViewItem.routeData.match.pathname !== routeInfo.pathname) {
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
          isViewVisible(enteringViewItem.ionPageElement) &&
          leavingViewItem !== undefined &&
          !isViewVisible(leavingViewItem.ionPageElement!)
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
      } else if (leavingViewItem && !enteringRoute && !enteringViewItem) {
        /**
         * If we have a leavingView but no entering view/route, we are probably
         * leaving to  another outlet, so hide this leavingView.
         * (e.g., /tabs/tab1 → /settings)
         */
        if (leavingViewItem.ionPageElement) {
          leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
          leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
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
 *
 * @param node The root node to search for `<Route />` nodes.
 * @param routeInfo The route information to match against.
 */
function findRouteByRouteInfo(node: React.ReactNode, routeInfo: RouteInfo) {
  let matchedNode: React.ReactNode;
  let fallbackNode: React.ReactNode;

  // `<Route />` nodes are rendered inside of a <Routes /> node
  const routesNode = findRoutesNode(node) ?? node;

  for (const child of React.Children.toArray(routesNode) as React.ReactElement[]) {
    // Check if the child is a `<Route />` node
    if (child.type === Route) {
      const match = matchPath({
        pathname: routeInfo.pathname,
        componentProps: child.props,
      });

      if (match) {
        matchedNode = child;
        break;
      }
    }
  }

  if (matchedNode) {
    return matchedNode;
  }

  // If we haven't found a node
  // try to find one that doesn't have a path prop, that will be our not found route
  for (const child of React.Children.toArray(routesNode) as React.ReactElement[]) {
    if (child.type === Route) {
      if (!child.props.path) {
        fallbackNode = child;
        break;
      }
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
