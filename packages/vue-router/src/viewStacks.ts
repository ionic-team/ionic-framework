import { generateId } from './utils';
import {  RouteInfo,
  ViewItem,
  ViewStacks,
} from './types';
import { RouteLocationMatched, Router } from 'vue-router';
import { shallowRef } from 'vue';

export const createViewStacks = (router: Router) => {
  let viewStacks: ViewStacks = {};

  const clear = (outletId: number) => {
    delete viewStacks[outletId];
  }

  const getViewStack = (outletId: number) => {
    return viewStacks[outletId];
  }

  const registerIonPage = (viewItem: ViewItem, ionPage: HTMLElement) => {
    viewItem.ionPageElement = ionPage;
    viewItem.ionRoute = true;
  }

  const findViewItemByRouteInfo = (routeInfo: RouteInfo, outletId?: number) => {
    return findViewItemByPath(routeInfo.pathname, outletId, false);
  }

  const findLeavingViewItemByRouteInfo = (routeInfo: RouteInfo, outletId?: number, mustBeIonRoute: boolean = true) => {
    return findViewItemByPath(routeInfo.lastPathname, outletId, mustBeIonRoute);
  }

  const findViewItemByPathname = (pathname: string, outletId?: number) => {
    return findViewItemByPath(pathname, outletId, false);
  }

  const findViewItemInStack = (path: string, stack: ViewItem[]): ViewItem | undefined => {
    return stack.find((viewItem: ViewItem) => {
      if (viewItem.pathname === path) {
        return viewItem;
      }

      return undefined;
    })
  }

  const findViewItemByPath = (path: string, outletId?: number, mustBeIonRoute: boolean = false): ViewItem | undefined => {
    const matchView = (viewItem: ViewItem) => {
      if (
        (mustBeIonRoute && !viewItem.ionRoute) ||
        path === ''
      ) {
        return false;
      }

      const resolvedPath = router.resolve(path);
      const findMatchedRoute = resolvedPath.matched.find((matchedRoute: RouteLocationMatched) => matchedRoute === viewItem.matchedRoute);

      if (findMatchedRoute) {

        /**
         * /page/1 and /page/2 should not match
         * to the same view item otherwise there will
         * be not page transition and we will need to
         * explicitly clear out parameters from page 1
         * so the page 2 params are properly passed
         * to the developer's app.
         */
        const hasParameter = findMatchedRoute.path.includes(':');
        if (hasParameter && path !== viewItem.pathname) {
          return false;
        }

        return viewItem;
      }

      return undefined;
    }

    if (outletId) {
      const stack = viewStacks[outletId];
      if (!stack) return undefined;

      const match = (router) ? stack.find(matchView) : findViewItemInStack(path, stack)
      if (match) return match;
    } else {
      for (let outletId in viewStacks) {
        const stack = viewStacks[outletId];
        const viewItem = findViewItemInStack(path, stack);
        if (viewItem) {
            return viewItem;
        }
      }
    }

    return undefined;
  }

  const createViewItem = (outletId: number, vueComponent: any, matchedRoute: RouteLocationMatched, routeInfo: RouteInfo, ionPage?: HTMLElement): ViewItem => {
    return {
      id: generateId('viewItem'),
      pathname: routeInfo.pathname,
      outletId,
      matchedRoute,
      ionPageElement: ionPage,
      vueComponent,
      vueComponentRef: shallowRef(),
      ionRoute: false,
      mount: false,
      exact: routeInfo.pathname === matchedRoute.path,
      params: routeInfo.params,
      vueComponentData: {}
    };
  }

  const add = (viewItem: ViewItem): void => {
    const { outletId } = viewItem;
    if (!viewStacks[outletId]) {
      viewStacks[outletId] = [viewItem];
    } else {
      viewStacks[outletId].push(viewItem);
    }
  }

  const remove = (viewItem: ViewItem, outletId?: number): void => {
    if (!outletId) { throw Error('outletId required') }

    const viewStack = viewStacks[outletId];
    if (viewStack) {
      viewStacks[outletId] = viewStack.filter(item => item.id !== viewItem.id);
    }
  }

  const getChildrenToRender = (outletId: number): ViewItem[] => {
    const viewStack = viewStacks[outletId];
    if (viewStack) {
      const components = viewStacks[outletId].filter(v => v.mount);
      return components;
    }
    return [];
  }

  /**
   * Given a view stack and entering/leaving views,
   * determine the position of each item in the stack.
   * This is useful for removing/adding views in between
   * the view items when navigating using router.go.
   * Use this method instead of doing an `Array.findIndex`
   * for both view items.
   */
  const findViewIndex = (viewStack: ViewItem[], enteringViewItem: ViewItem, leavingViewItem: ViewItem) => {
    let enteringIndex = -1;
    let leavingIndex = -1;

    for (let i = 0; i <= viewStack.length - 1; i++) {
      const viewItem = viewStack[i];
      if (viewItem === enteringViewItem) {
        enteringIndex = i;
      } else if (viewItem === leavingViewItem) {
        leavingIndex = i;
      }

      if (enteringIndex > -1 && leavingIndex > -1) {
        break;
      }
    }

    return { enteringIndex, leavingIndex };
  }

  /**
   * When navigating backwards, we need to clean up and
   * leaving pages so that they are re-created if
   * we ever navigate back to them. This is especially
   * important when using router.go and stepping back
   * multiple pages at a time.
   */
  const unmountLeavingViews = (outletId: number, enteringViewItem: ViewItem, leavingViewItem: ViewItem) => {
    const viewStack = viewStacks[outletId];
    if (!viewStack) return;

    const { enteringIndex: startIndex, leavingIndex: endIndex } = findViewIndex(viewStack, enteringViewItem, leavingViewItem);

    for (let i = startIndex + 1; i < endIndex; i++) {
      const viewItem = viewStack[i];
      viewItem.mount = false;
      viewItem.ionPageElement = undefined;
      viewItem.ionRoute = false;
    }
  }

  /**
   * When navigating forward it is possible for
   * developers to step forward over multiple views.
   * The intermediary views need to be remounted so that
   * swipe to go back works properly.
   */
  const mountIntermediaryViews = (outletId: number, enteringViewItem: ViewItem, leavingViewItem: ViewItem) => {
    const viewStack = viewStacks[outletId];
    if (!viewStack) return;

    const { enteringIndex: endIndex, leavingIndex: startIndex } = findViewIndex(viewStack, enteringViewItem, leavingViewItem);

    for (let i = startIndex + 1; i < endIndex; i++) {
      viewStack[i].mount = true;
    }
  }

  return {
    unmountLeavingViews,
    mountIntermediaryViews,
    clear,
    findViewItemByRouteInfo,
    findLeavingViewItemByRouteInfo,
    findViewItemByPathname,
    createViewItem,
    getChildrenToRender,
    add,
    remove,
    registerIonPage,
    getViewStack
  }
}
