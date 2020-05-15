import { ViewItem, ViewLifeCycleManager, ViewStacks, generateId } from '@ionic/react';
import React, { ReactElement } from 'react';

import { IonRedirect } from './IonRedirect';
import { IonRoute, matchIonRoute } from './IonRoute';
import { NextRouteInfo } from './NextRouteInfo';

export class NextRouterViewStack extends ViewStacks {

  constructor() {
    super();
    this.createViewItem = this.createViewItem.bind(this);
    this.findViewItemByRouteInfo = this.findViewItemByRouteInfo.bind(this);
    this.findLeavingViewItemByRouteInfo = this.findLeavingViewItemByRouteInfo.bind(this);
    this.findViewItemByPathname = this.findViewItemByPathname.bind(this);
    this.getChildrenToRender = this.getChildrenToRender.bind(this);
    this.getViewItemForTransition = this.getViewItemForTransition.bind(this);
  }

  createViewItem(outletId: string, reactElement: React.ReactElement, routeInfo: NextRouteInfo, page?: HTMLElement) {
    const viewItem: ViewItem = {
      id: generateId('viewItem'),
      outletId,
      ionPageElement: page,
      reactElement,
      mount: true,
      ionRoute: false,
      routeData: {
        route: routeInfo.routeOptions?.routePath
      }
    };
    return viewItem;
  }

  getChildrenToRender(outletId: string, ionRouterOutlet: React.ReactElement, routeInfo: NextRouteInfo) {
    const viewItems = this.getViewItemsForOutlet(outletId);

    // Sync latest routes with viewItems
    const enteringViewItem = this.findViewItemByRouteInfo(routeInfo, outletId);
    if (enteringViewItem) {
      // const count = React.Children.count(ionRouterOutlet?.props.children);
      // if (count === 1) {
      //   const child = React.Children.only(ionRouterOutlet?.props.children);
      //   if (child.type === IonRoute) {
      //     enteringViewItem.reactElement = child;
      //   } else {
      //     // TODO what to do here?
      //   }
      // } else {
      let matchedNode: React.ReactNode;
      React.Children.forEach(ionRouterOutlet?.props.children as React.ReactElement, (child: React.ReactElement) => {
        if (child) {
          if (!matchedNode) {
            if (child.type === IonRoute || child.type === IonRedirect) {
              const match = matchIonRoute(child.props.path, routeInfo.pathname, child.props.exact);
              if (match) {
                matchedNode = child;
              }
            } else {
              // matchedNode = (
              //   <IonRoute
              //     path={routeInfo.routeOptions!.routePath!}
              //     key={`ir-${routeInfo.routeOptions?.routePath}`}
              //     render={() => child} />
              // );
            }
          }
        }
      });
      if (matchedNode) {
        enteringViewItem.reactElement = matchedNode as ReactElement;
      }
      // }
    }

    const children = viewItems.map(viewItem => {
      let clonedChild;
      if (viewItem.ionRoute) {
        clonedChild = (
          <ViewLifeCycleManager key={`view-${viewItem.id}`} mount={viewItem.mount} removeView={() => this.remove(viewItem)}>
            {React.cloneElement(viewItem.reactElement, {
              show: true
            })}
          </ViewLifeCycleManager>
        );
      } else {
        clonedChild = (
          <ViewLifeCycleManager key={`view-${viewItem.id}`} mount={viewItem.mount} removeView={() => this.remove(viewItem)}>
            {viewItem.reactElement}
          </ViewLifeCycleManager>
        );
      }
      return clonedChild;
    });
    return children;
  }

  findViewItemByRouteInfo(routeInfo: NextRouteInfo, outletId?: string) {
    const viewItem = this.findViewItemByPath(routeInfo.pathname, outletId);
    return viewItem;
  }

  findLeavingViewItemByRouteInfo(routeInfo: NextRouteInfo, outletId?: string) {
    if (!routeInfo.lastPathname) {
      return;
    }
    const viewItem = this.findViewItemByPath(routeInfo.lastPathname, outletId, true, true);
    return viewItem;
  }

  private findViewItemByPath(pathname: string, outletId?: string, forceExact?: boolean, mustBeIonRoute?: boolean) {
    let viewItem: ViewItem | undefined;
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

    return viewItem;

    function matchView(v: ViewItem) {
      if (mustBeIonRoute && !v.ionRoute) {
        return false;
      }
      if (v.reactElement.type === IonRoute) {
        const match = matchIonRoute(
          v.reactElement.props.path,
          pathname,
          forceExact ? true : v.reactElement.props.exact);
        if (match) {
          viewItem = v;
        }
        return match;
      } else {
        const match = matchIonRoute(v.routeData.route, pathname, v.ionRoute);
        if (match) {
          viewItem = v;
        }
        return match;
      }
    }

    function matchDefaultRoute(v: ViewItem) {
      // try to find a route that doesn't have a path or from prop, that will be our default route
      if (!v.reactElement.props.path) {
        viewItem = v;
        return true;
      }
      return false;
    }
  }

  findViewItemByPathname(pathname: string, outletId?: string) {
    const viewItem = this.findViewItemByPath(pathname, outletId);
    return viewItem;
  }

  getViewItemForTransition(pathname: string) {
    const viewItem = this.findViewItemByPath(pathname, undefined, true, true);
    return viewItem;
  }

}
