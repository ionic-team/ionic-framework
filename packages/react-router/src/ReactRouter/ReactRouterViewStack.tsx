import type { RouteInfo, ViewItem } from '@ionic/react';
import { IonRoute, ViewLifeCycleManager, ViewStacks, generateId } from '@ionic/react';
import React from 'react';
// import { matchPath } from 'react-router';

import { matchPath } from './utils/matchPath';

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

    // const matchProps = {
    //   exact: reactElement.props.exact,
    //   path: reactElement.props.path || reactElement.props.from,
    //   component: reactElement.props.component,
    // };

    // const match = matchPath({
    //   pathname: routeInfo.pathname,
    //   componentProps: reactElement.props,
    // });

    // const match = matchPath(routeInfo.pathname, matchProps);

    if (reactElement.type === IonRoute) {
      viewItem.ionRoute = true;
      viewItem.disableIonPageManagement = reactElement.props.disableIonPageManagement;
    }

    viewItem.routeData = {
      match: matchPath({
        pathname: routeInfo.pathname,
        componentProps: reactElement.props,
      }),
      childProps: reactElement.props,
    };

    return viewItem;
  }

  getChildrenToRender(outletId: string, ionRouterOutlet: React.ReactElement, routeInfo: RouteInfo) {
    const viewItems = this.getViewItemsForOutlet(outletId);

    // Sync latest routes with viewItems
    React.Children.forEach(ionRouterOutlet.props.children, (child: React.ReactElement) => {
      const viewItem = viewItems.find((v) => {
        return matchComponent(child, v.routeData.childProps.path || v.routeData.childProps.from);
      });
      if (viewItem) {
        viewItem.reactElement = child;
      }
    });

    const children = viewItems.map((viewItem) => {
      let clonedChild;
      if (viewItem.ionRoute && !viewItem.disableIonPageManagement) {
        clonedChild = (
          <ViewLifeCycleManager
            key={`view-${viewItem.id}`}
            mount={viewItem.mount}
            removeView={() => this.remove(viewItem)}
          >
            {React.cloneElement(viewItem.reactElement, {
              computedMatch: viewItem.routeData.match,
            })}
          </ViewLifeCycleManager>
        );
      } else {
        const match = matchComponent(viewItem.reactElement, routeInfo.pathname);
        clonedChild = (
          <ViewLifeCycleManager
            key={`view-${viewItem.id}`}
            mount={viewItem.mount}
            removeView={() => this.remove(viewItem)}
          >
            {React.cloneElement(viewItem.reactElement, {
              computedMatch: viewItem.routeData.match,
            })}
          </ViewLifeCycleManager>
        );

        if (!match && viewItem.routeData.match) {
          viewItem.routeData.match = undefined;
          viewItem.mount = false;
        }
      }

      return clonedChild;
    });
    return children;
  }

  registerIonPage(routeInfo: RouteInfo, ionPage: HTMLElement) {
    const viewItem = this.findViewItemByRouteInfo(routeInfo);

    if (viewItem) {
      viewItem.ionPageElement = ionPage;
      viewItem.ionRoute = true;
    }

    // TODO Vue has additional vue specific logic for viewItem.matchedRoute
  }

  findViewItemByRouteInfo(routeInfo: RouteInfo, outletId?: string, updateMatch?: boolean) {
    const { viewItem, match } = this.findViewItemByPath(routeInfo.pathname, outletId, false);
    const shouldUpdateMatch = updateMatch === undefined || updateMatch === true;
    if (shouldUpdateMatch && viewItem && match) {
      viewItem.routeData.match = match;
    }
    return viewItem;
  }

  findLeavingViewItemByRouteInfo(routeInfo: RouteInfo, outletId?: string, mustBeIonRoute = true) {
    const { viewItem } = this.findViewItemByPath(routeInfo.lastPathname!, outletId, mustBeIonRoute);
    return viewItem;
  }

  findViewItemByPathname(pathname: string, outletId?: string) {
    const { viewItem } = this.findViewItemByPath(pathname, outletId, false);
    return viewItem;
  }

  private findViewItemByPath(pathname: string, outletId?: string, mustBeIonRoute = false) {
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

      match = matchPath({
        pathname,
        componentProps: v.routeData.childProps,
      });

      if (match) {
        viewItem = v;
        return true;
      }
      return false;
    }

    function matchDefaultRoute(v: ViewItem) {
      // try to find a route that doesn't have a path or from prop, that will be our default route
      if (!v.routeData.childProps.path && !v.routeData.childProps.from) {
        match = {
          path: pathname,
          url: pathname,
          isExact: true,
          params: {},
        };
        viewItem = v;
        return true;
      }
      return false;
    }
  }
}

function matchComponent(node: React.ReactElement, pathname: string) {
  // const matchProps = {
  //   exact: forceExact ? true : node.props.exact,
  //   path: node.props.path || node.props.from,
  //   component: node.props.component,
  // };
  // const match = matchPath(pathname, matchProps);

  return matchPath({
    pathname,
    componentProps: node.props,
  });
}
