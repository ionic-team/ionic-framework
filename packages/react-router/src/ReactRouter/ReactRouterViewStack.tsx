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

  createViewItem(
    outletId: string,
    reactElement: React.ReactElement,
    routeInfo: RouteInfo,
    ionPage?: HTMLElement
  ): ViewItem {
    const ionRoute = reactElement.type === IonRoute;

    return {
      id: generateId('viewItem'),
      outletId,
      ionPageElement: ionPage,
      reactElement,
      ionRoute,
      disableIonPageManagement: ionRoute && reactElement.props.disableIonPageManagement,
      mount: false,
      routeData: {
        match: matchPath({
          pathname: routeInfo.pathname,
          componentProps: reactElement.props,
        }),
        childProps: reactElement.props,
      },
    };
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
      let clonedChild: React.ReactNode;
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

  /**
   * Registers the `<IonPage>` element reference to
   * the view item with the matching route info.
   */
  registerIonPage(viewItem: ViewItem, ionPage: HTMLElement) {
    if (viewItem) {
      // TODO view doesn't check if it exists
      viewItem.ionPageElement = ionPage;
      viewItem.ionRoute = true;
    }
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

    if (outletId) {
      const viewStack = this.getViewItemsForOutlet(outletId);
      viewStack.some(matchView);
      if (!viewItem) {
        viewStack.some(matchDefaultRoute);
      }
    } else {
      const viewStack = this.getAllViewItems();
      viewStack.some(matchView);
      if (!viewItem) {
        viewStack.some(matchDefaultRoute);
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
