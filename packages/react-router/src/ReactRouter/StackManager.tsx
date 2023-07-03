import type { RouteInfo, StackContextState, ViewItem } from '@ionic/react';
import { RouteManagerContext, StackContext, generateId, getConfig } from '@ionic/react';
import type { PropsWithChildren } from 'react';
import React, { cloneElement, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Route, Routes, matchPath } from 'react-router-dom';

import { clonePageElement } from './clonePageElement';

// TODO(FW-2959): types

interface StackManagerProps {
  routeInfo: RouteInfo;
}

const isViewVisible = (el: HTMLElement) =>
  !el.classList.contains('ion-page-invisible') && !el.classList.contains('ion-page-hidden');

export const StackManager = ({ children, ...props }: PropsWithChildren<StackManagerProps>) => {
  const { routeInfo } = props;
  const {
    findViewItemByRouteInfo,
    findLeavingViewItemByRouteInfo,
    findViewItemByPathname,
    createViewItem,
    addViewItem,
    goBack,
    getChildrenToRender,
    clearOutlet,
  } = useContext(RouteManagerContext);

  const routerOutletRef = useRef<HTMLIonRouterOutletElement>();
  const routerOutletElement = routerOutletRef.current;
  const ionRouterOutletRef = useRef<React.ReactElement>();
  const skipTransitionRef = useRef(false);
  const clearOutletTimeout = useRef(null);
  const pendingPageTransitionRef = useRef(false);
  const prevProps = useRef<{ routeInfo: RouteInfo }>();

  const forceUpdate = useReducer((x) => x + 1, 0)[1];

  const [id] = useState(generateId('routerOutlet'));

  const stackContextValue: StackContextState = useMemo(
    () => ({
      isInOutlet: () => true,
      registerIonPage: (page: HTMLElement, routeInfo: RouteInfo) => {
        const foundView = findViewItemByRouteInfo(routeInfo, id);
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
        handlePageTransition(routeInfo);
      },
    }),
    [routerOutletElement]
  );

  useEffect(() => {
    if (routerOutletElement) {
      // Mount behavior for the initial route
      setupRouterOutlet(routerOutletElement);
      handlePageTransition(routeInfo);
    }
  }, [routerOutletElement]);

  useEffect(() => {
    const { pathname } = routeInfo;

    if (pathname !== prevProps.current?.routeInfo.pathname) {
      prevProps.current = props;
      handlePageTransition(routeInfo);
    } else if (pendingPageTransitionRef.current) {
      handlePageTransition(routeInfo);
      pendingPageTransitionRef.current = false;
    }
  }, [routeInfo]);

  useEffect(() => {
    return () => {
      clearOutlet(id);
      if (clearOutletTimeout.current) {
        clearTimeout(clearOutletTimeout.current);
        clearOutletTimeout.current = null;
      }
    };
  }, []);

  const handlePageTransition = (routeInfo: RouteInfo) => {
    if (!routerOutletElement || !routerOutletElement.commit) {
      /**
       * The route outlet has not mounted yet. We need to wait for it to render
       * before we can transition the page.
       *
       * Set a flag to indicate that we should transition the page after
       * the component has updated.
       */
      pendingPageTransitionRef.current = true;
    } else {
      let enteringViewItem = findViewItemByRouteInfo(routeInfo, id);
      let leavingViewItem = findLeavingViewItemByRouteInfo(routeInfo, id);

      if (!leavingViewItem && routeInfo.prevRouteLastPathname) {
        leavingViewItem = findViewItemByPathname(routeInfo.prevRouteLastPathname, id);
      }

      // Check if the leavingViewItem should be unmounted
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

      const enteringRoute = matchRoute(ionRouterOutletRef.current?.props.children, routeInfo) as React.ReactElement; // TODO @sean can we return React.ReactElement so we don't need to cast?

      if (enteringViewItem) {
        // If the entering view is already in the stack, then we need to clone it
        enteringViewItem.reactElement = enteringRoute;
      } else if (enteringRoute) {
        // Otherwise we need to create a new view item
        enteringViewItem = createViewItem(id, enteringRoute, routeInfo);
        addViewItem(enteringViewItem);
      }

      if (enteringViewItem && enteringViewItem.ionPageElement) {
        /**
         * If the entering view item is the same as the leaving view item,
         * then we don't need to transition.
         */
        if (enteringViewItem === leavingViewItem) {
          /**
           * If the entering view item is the same as the leaving view item,
           * we are either transitioning using parameterized routes to the same view
           * or a parent router outlet is re-rendering as a result of React props changing.
           *
           * If the route data does not match the current path, the parent router outlet
           * is attempting to transition and we cancel the operation.
           */
          if (enteringViewItem.routeData.match.url !== routeInfo.pathname) {
            return;
          }
        }

        /**
         * If there isn't a leaving view item, but the route info indicates
         * that the user has routed from a previous path, then we need
         * to find the leaving view item to transition between.
         */
        if (!leavingViewItem && routeInfo.prevRouteLastPathname) {
          leavingViewItem = findViewItemByPathname(routeInfo.prevRouteLastPathname, id);
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
        transitionPage(routeInfo, enteringViewItem, leavingViewItem!); // TODO @sean why do we need to use ! on the leavingViewItem here? Didn't need to originally.
      } else if (leavingViewItem && !enteringRoute && !enteringViewItem) {
        // If we have a leavingView but no entering view/route, we are probably leaving to
        // another outlet, so hide this leavingView.
        if (leavingViewItem.ionPageElement) {
          leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
          leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
        }
      }

      // This causes the router outlet to re-render with the updated view items.
      // Without it, a push navigation will remove the previous route's view item,
      // but will not render the new route's view item.
      // this.forceUpdate();
      forceUpdate();
    }
  };

  const setupRouterOutlet = (routerOutlet: HTMLIonRouterOutletElement) => {
    const canStart = (): boolean => {
      const config = getConfig();
      const swipeEnabled = config?.getBoolean('swipeBackEnabled', routerOutlet.mode === 'ios');

      if (!swipeEnabled) {
        return false;
      }

      const propsToUse =
        prevProps.current?.routeInfo.pathname === routeInfo.pushedByRoute
          ? prevProps.current!.routeInfo
          : ({ pathname: routeInfo.pushedByRoute || '' } as any); // TODO figure out what this does

      const enteringViewItem = findViewItemByRouteInfo(propsToUse, id, false);

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
        enteringViewItem.routeData.match.path !== routeInfo.pathname
      );
    };

    const onStart = async () => {
      const propsToUse =
        prevProps.current?.routeInfo.pathname === routeInfo.pushedByRoute
          ? prevProps.current!.routeInfo
          : ({ pathname: routeInfo.pushedByRoute || '' } as any); // TODO figure out what this does
      const enteringViewItem = findViewItemByRouteInfo(propsToUse, id, false);
      const leavingViewItem = findViewItemByRouteInfo(routeInfo, id, false);

      /**
       * When the gesture starts, kick off
       * a transition that is controlled
       * via a swipe gesture.
       */
      if (enteringViewItem && leavingViewItem) {
        await transitionPage(routeInfo, enteringViewItem, leavingViewItem, 'back', true);
      }

      return Promise.resolve();
    };

    const onEnd = (shouldContinue: boolean) => {
      if (shouldContinue) {
        skipTransitionRef.current = true;
        goBack();
      } else {
        /**
         * In the event that the swipe
         * gesture was aborted, we should
         * re-hide the page that was going to enter.
         */
        const propsToUse =
          prevProps.current?.routeInfo.pathname === routeInfo.pushedByRoute
            ? prevProps.current!.routeInfo
            : ({ pathname: routeInfo.pushedByRoute || '' } as any); // TODO figure out what this does
        const enteringViewItem = findViewItemByRouteInfo(propsToUse, id, false);
        const leavingViewItem = findViewItemByRouteInfo(routeInfo, id, false);

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
  };

  const transitionPage = async (
    routeInfo: RouteInfo,
    enteringViewItem: ViewItem,
    leavingViewItem: ViewItem,
    direction?: 'forward' | 'back',
    progressAnimation = false
  ) => {
    const runCommit = async (enteringEl: HTMLElement, leavingEl?: HTMLElement) => {
      const skipTransition = skipTransitionRef.current;

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
        skipTransitionRef.current = false;
      } else {
        enteringEl.classList.add('ion-page', 'ion-page-invisible');
      }

      if (routerOutletElement) {
        await routerOutletElement.commit(enteringEl, leavingEl, {
          duration: skipTransitionRef.current || directionToUse === undefined ? 0 : undefined,
          direction: directionToUse,
          showGoBack: !!routeInfo.pushedByRoute,
          progressAnimation,
          animationBuilder: routeInfo.routeAnimation,
        });
      }
    };

    const routerInfoFallbackDirection =
      routeInfo.routeDirection === 'none' || routeInfo.routeDirection === 'root' ? undefined : routeInfo.routeDirection;
    const directionToUse = direction ?? routerInfoFallbackDirection;

    if (enteringViewItem?.ionPageElement && routerOutletElement) {
      if (leavingViewItem?.ionPageElement && enteringViewItem === leavingViewItem) {
        // If a page is transitioning to another version of itself
        // we clone it so we can have an animation to show
        const match = matchComponent(leavingViewItem.reactElement, routeInfo.pathname, true);
        if (match) {
          const newLeavingElement = clonePageElement(leavingViewItem.ionPageElement.outerHTML);
          if (newLeavingElement) {
            routerOutletElement.appendChild(newLeavingElement);
            await runCommit(enteringViewItem.ionPageElement, newLeavingElement);
            routerOutletElement.removeChild(newLeavingElement);
          }
        } else {
          await runCommit(enteringViewItem.ionPageElement, undefined);
        }
      } else {
        await runCommit(enteringViewItem.ionPageElement, leavingViewItem?.ionPageElement);
        if (leavingViewItem?.ionPageElement && !progressAnimation) {
          const { ionPageElement } = leavingViewItem;
          ionPageElement.setAttribute('aria-hidden', 'true');
          ionPageElement.classList.add('ion-page-hidden');
        }
      }
    }
  };

  const renderComponents = () => {
    const ionRouterOutlet = React.Children.only<React.ReactElement>(children as React.ReactElement);
    ionRouterOutletRef.current = ionRouterOutlet;

    const components = getChildrenToRender(id, ionRouterOutlet, routeInfo, () => {
      forceUpdate();
    });

    return cloneElement(ionRouterOutlet, {
      ref: (node: HTMLIonRouterOutletElement) => {
        if (ionRouterOutlet.props.setRef) {
          ionRouterOutlet.props.setRef(node);
        }
        if (ionRouterOutlet.props.forwardedRef) {
          ionRouterOutlet.props.forwardedRef.current = node;
        }
        routerOutletRef.current = node;
        const { ref } = ionRouterOutlet as any; // TODO @sean why do we need to cast any here? Is there a better type?
        if (typeof ref === 'function') {
          ref(node);
        }
      },
      children: components,
    });
  };

  return <StackContext.Provider value={stackContextValue}>{renderComponents()}</StackContext.Provider>;
};

export default StackManager;

const findRoutesNode = (node: React.ReactNode) => {
  // Finds the <Routes /> component node
  let routesNode: React.ReactNode;
  React.Children.forEach(node as React.ReactElement, (child: React.ReactElement) => {
    if (child.type === Routes) {
      routesNode = child;
    }
  });
  if (routesNode) {
    return (routesNode as React.ReactElement).props.children;
  }
  return undefined;
};

function matchRoute(node: React.ReactNode, routeInfo: RouteInfo) {
  let matchedNode: React.ReactNode;

  const routesNode = findRoutesNode(node);

  if (!routesNode) {
    console.error('No <Routes /> component found in the stack');
  }

  React.Children.forEach(routesNode as React.ReactElement, (child: React.ReactElement) => {
    if (child.type === Route) {
      const match = matchPath(child.props, routeInfo.pathname);
      if (match) {
        matchedNode = child;
      }
    }
  });

  if (matchedNode) {
    return matchedNode;
  }
  // If we haven't found a node
  // try to find one that doesn't have a path or from prop, that will be our not found route
  React.Children.forEach(node as React.ReactElement, (child: React.ReactElement) => {
    if (!(child.props.path || child.props.from)) {
      matchedNode = child;
    }
  });

  return matchedNode;
}

function matchComponent(node: React.ReactElement, pathname: string, forceExact?: boolean) {
  const matchProps = {
    exact: forceExact ? true : node.props.exact,
    path: node.props.path || node.props.from,
    component: node.props.component,
  };
  const match = matchPath(matchProps, pathname);

  return match;
}
