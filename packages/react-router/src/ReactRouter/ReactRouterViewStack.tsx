import type { RouteInfo, ViewItem } from '@ionic/react';
import { IonRoute, ViewLifeCycleManager, ViewStacks, generateId } from '@ionic/react';
import React from 'react';
import { Route, Routes, matchPath } from 'react-router';

export class ReactRouterViewStack extends ViewStacks {
  constructor() {
    super();
    this.createViewItem = this.createViewItem.bind(this);
    this.findViewItemByRouteInfo = this.findViewItemByRouteInfo.bind(this);
    this.findLeavingViewItemByRouteInfo = this.findLeavingViewItemByRouteInfo.bind(this);
    this.getChildrenToRender = this.getChildrenToRender.bind(this);
    this.findViewItemByPathname = this.findViewItemByPathname.bind(this);
  }

  createViewItem(outletId: string, reactElement: React.ReactElement, routeInfo: RouteInfo, page?: HTMLElement) {
    const viewItem: ViewItem = {
      id: generateId('viewItem'),
      outletId,
      ionPageElement: page,
      reactElement,
      mount: true,
      ionRoute: false,
    };

    if (reactElement.type !== Route) {
      console.warn('something is wrong, reactElement is not a Route', reactElement);
    }

    const match = matchPath(reactElement.props, routeInfo.pathname);

    if (reactElement.type === IonRoute) {
      viewItem.ionRoute = true;
      viewItem.disableIonPageManagement = reactElement.props.disableIonPageManagement;
    }

    viewItem.routeData = {
      match,
      childProps: reactElement.props,
    };

    return viewItem;
  }

  getChildrenToRender(outletId: string, ionRouterOutlet: React.ReactElement, routeInfo: RouteInfo) {
    const viewItems = this.getViewItemsForOutlet(outletId);

    const routesNode = findRoutesNode(ionRouterOutlet.props.children);

    // Sync latest routes with viewItems
    React.Children.forEach(routesNode, (child: React.ReactElement) => {
      const viewItem = viewItems.find((v) => {
        return matchComponent(child, v.routeData.childProps.path || v.routeData.childProps.from);
      });
      if (viewItem) {
        viewItem.reactElement = child;
      }
    });

    const children = viewItems.map((viewItem) => {
      if (!viewItem.ionRoute || viewItem.disableIonPageManagement) {
        const match = matchComponent(viewItem.reactElement, routeInfo.pathname);

        if (!match && viewItem.routeData.match) {
          viewItem.routeData.match = undefined;
          viewItem.mount = false;
        }
      }

      const clonedChild = (
        <ViewLifeCycleManager
          key={`view-${viewItem.id}`}
          mount={viewItem.mount}
          removeView={() => this.remove(viewItem)}
        >
          {/*
            TODO @sean it is currently required to render a <Routes /> or you will get:
            Uncaught Error: A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.
          */}
          <Routes>{React.cloneElement(viewItem.reactElement)}</Routes>
        </ViewLifeCycleManager>
      );

      return clonedChild;
    });
    return children;
  }

  findViewItemByRouteInfo(routeInfo: RouteInfo, outletId?: string, updateMatch?: boolean) {
    const { viewItem, match } = this.findViewItemByPath(routeInfo.pathname, outletId);
    const shouldUpdateMatch = updateMatch === undefined || updateMatch === true;
    if (shouldUpdateMatch && viewItem && match) {
      viewItem.routeData.match = match;
    }
    return viewItem;
  }

  findLeavingViewItemByRouteInfo(routeInfo: RouteInfo, outletId?: string, mustBeIonRoute = true) {
    const { viewItem } = this.findViewItemByPath(routeInfo.lastPathname!, outletId, false, mustBeIonRoute);
    return viewItem;
  }

  findViewItemByPathname(pathname: string, outletId?: string) {
    const { viewItem } = this.findViewItemByPath(pathname, outletId);
    return viewItem;
  }

  private findViewItemByPath(pathname: string, outletId?: string, forceExact?: boolean, mustBeIonRoute?: boolean) {
    let viewItem: ViewItem | undefined;
    let match: ReturnType<typeof matchPath> | undefined;
    let viewStack: ViewItem[];

    if (outletId) {
      viewStack = this.getViewItemsForOutlet(outletId);
      viewStack.some(matchView);
      if (!viewItem) {
        viewStack.some(matchDefaultRoute);
      }
    } else {
      const viewItems = this.getAllViewItems();
      viewItems.some(matchView);
      if (!viewItem) {
        viewItems.some(matchDefaultRoute);
      }
    }

    return { viewItem, match };

    function matchView(v: ViewItem) {
      if (mustBeIonRoute && !v.ionRoute) {
        return false;
      }

      if (pathname === undefined) {
        // This wasn't needed in react router v5
        // it is possible we are re-rendering or calling something too early.
        return false;
      }

      const matchProps = {
        exact: forceExact ? true : v.routeData.childProps.exact,
        path: v.routeData.childProps.path || v.routeData.childProps.from,
        // component: v.routeData.childProps.component, // TODO removed in v6
        element: v.routeData.childProps.element,
      };
      const myMatch = matchPath(matchProps, pathname);
      if (myMatch) {
        viewItem = v;
        match = myMatch;
        return true;
      }
      return false;
    }

    function matchDefaultRoute(v: ViewItem) {
      // try to find a route that doesn't have a path or from prop, that will be our default route
      if (!v.routeData.childProps.path && !v.routeData.childProps.from) {
        match = {
          pathname,
          params: {},
          // url: pathname,
          // isExact: true,
          // params: {},
        } as any; // TODO @sean review what this is doing
        viewItem = v;
        return true;
      }
      return false;
    }
  }
}

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

function matchComponent(node: React.ReactElement, pathname: string, forceExact?: boolean) {
  const matchProps = {
    exact: forceExact ? true : node.props.exact,
    path: node.props.path || node.props.from,
    element: node.props.element,
  };
  const match = matchPath(matchProps, pathname);

  return match;
}
