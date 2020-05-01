
import { RouteInfo, ViewItem, ViewLifeCycleManager, ViewStacks, generateId } from '@ionic/react';
import React from 'react';
import { matchPath } from 'react-router';

export class ReactRouterViewStack extends ViewStacks {

  constructor() {
    super();
    this.createViewItem = this.createViewItem.bind(this);
    this.findViewItemByRouteInfo = this.findViewItemByRouteInfo.bind(this);
    this.findLeavingViewItemByRouteInfo = this.findLeavingViewItemByRouteInfo.bind(this);
    this.findViewItemByPathname = this.findViewItemByPathname.bind(this);
    this.getChildrenToRender = this.getChildrenToRender.bind(this);
    this.getViewItemForTransition = this.getViewItemForTransition.bind(this);
  }

  createViewItem(outletId: string, reactElement: React.ReactElement, routeInfo: RouteInfo, page?: HTMLElement) {
    const viewItem: ViewItem = {
      id: generateId('viewItem'),
      outletId,
      ionPageElement: page,
      reactElement,
      mount: true,
      ionRoute: false
    };

    const matchProps = {
      exact: reactElement.props.exact,
      path: reactElement.props.path || reactElement.props.from,
      component: reactElement.props.component
    };

    const match = matchPath(routeInfo.pathname, matchProps);

    viewItem.routeData = {
      match,
      childProps: reactElement.props
    };

    return viewItem;
  }

  getChildrenToRender(outletId: string, ionRouterOutlet: React.ReactElement, routeInfo: RouteInfo) {
    const children: React.ReactNode[] = [];
    const viewItems = this.getViewItemsForOutlet(outletId);

    React.Children.forEach(ionRouterOutlet!.props.children, (child: React.ReactElement) => {

      // If child is "Route like"
      if (child.props.path || child.props.from) {
        const foundView = viewItems.find(viewItem => {
          if (child.props.path) {
            return viewItem.reactElement.props.path === child.props.path;
          } else {
            return viewItem.reactElement.props.from === child.props.from;
          }
        });
        if (foundView && foundView.mount) {
          const clonedChild = <ViewLifeCycleManager key={`view-${foundView.id}`}>
            {React.cloneElement(child, {
              computedMatch: foundView.routeData.match
            })}
          </ViewLifeCycleManager>;
          children.push(clonedChild);
        } else {
          const newViewItem = this.createViewItem(outletId, child, routeInfo);
          const clonedChild = <ViewLifeCycleManager key={`view-${newViewItem.id}`}>
            {React.cloneElement(newViewItem.reactElement, {
              computedMatch: newViewItem.routeData.match
            })}
          </ViewLifeCycleManager>;
          this.add(newViewItem);
          children.push(clonedChild);
        }
      } else {
        children.push(child);
      }
    });

    return children;
  }

  findViewItemByRouteInfo(outletId: string, routeInfo: RouteInfo) {
    const { viewItem, match } = this.findViewItemByPath(routeInfo.pathname, outletId);
    if (viewItem && match) {
      viewItem.routeData.match = match;
    }
    return viewItem;
  }

  findLeavingViewItemByRouteInfo(outletId: string, routeInfo: RouteInfo) {
    const { viewItem } = this.findViewItemByPath(routeInfo.lastPathname!, outletId);
    return viewItem;
  }

  findViewItemByPathname(pathname: string, outletId?: string) {
    const { viewItem } = this.findViewItemByPath(pathname, outletId);
    return viewItem;
  }

  getViewItemForTransition(pathname: string) {
    const { viewItem } = this.findViewItemByPath(pathname);
    return viewItem;
  }

  private findViewItemByPath(pathname: string, outletId?: string) {

    let viewItem: ViewItem | undefined;
    let match: ReturnType<typeof matchPath> | undefined;
    let viewStack: ViewItem[];

    if (outletId) {
      viewStack = this.getViewItemsForOutlet(outletId);
      viewStack.some(matchView);
      if (!viewItem) {
        viewStack.some(matchNotFoundView);
      }
    } else {

      const viewItems = this.getAllViewItems();
      viewItems.some(matchView);
      if (!viewItem) {
        viewItems.some(matchNotFoundView);
      }
    }

    return { viewItem, match };

    function matchView(v: ViewItem) {
      const matchProps = {
        exact: true, // v.routeData.childProps.exact,
        path: v.routeData.childProps.path || v.routeData.childProps.from,
        component: v.routeData.childProps.component
      };
      const myMatch = matchPath(pathname, matchProps);
      if (myMatch) {
        viewItem = v;
        match = myMatch;
        return true;
      }
      return false;
    }

    function matchNotFoundView(v: ViewItem) {
      // try to find a route that doesn't have a path or from prop, that will be our not found route
      if (!v.routeData.childProps.path && !v.routeData.childProps.from) {
        match = {
          path: pathname,
          url: pathname,
          isExact: true,
          params: {}
        };
        viewItem = v;
        return true;
      }
      return false;
    }

  }

}
