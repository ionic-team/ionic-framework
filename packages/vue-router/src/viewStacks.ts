import { generateId } from './utils';
import {  RouteInfo,
  ViewItem,
  ViewStacks,
} from './types';

export const createViewStacks = () => {
  let viewStacks: ViewStacks = {};

  const getViewStack = (outletId: number) => {
    return viewStacks[outletId];
  }

  const registerIonPage = (viewItem: ViewItem, ionPage: HTMLElement) => {
    viewItem.ionPageElement = ionPage;
  }

  const findViewItemByRouteInfo = (routeInfo: RouteInfo, outletId?: number) => {
    return findViewItemByPath(routeInfo.pathname, outletId);
  }

  const findLeavingViewItemByRouteInfo = (routeInfo: RouteInfo, outletId?: number) => {
    return findViewItemByPath(routeInfo.lastPathname, outletId);
  }

  const findViewItemByMatchedRoute = (matchedRoute: any, outletId: number): ViewItem | undefined => {
    const stack = viewStacks[outletId];
    if (!stack) return undefined;

    return stack.find((viewItem: ViewItem) => {
      if (viewItem.matchedRoute.path === matchedRoute.path) {
        return viewItem;
      }

      return undefined;
    });
  }

  const findViewItemInStack = (path: string, stack: ViewItem[]): ViewItem | undefined => {
    return stack.find((viewItem: ViewItem) => {
      if (viewItem.pathname === path) {
        return viewItem;
      }

      return undefined;
    })
  }

  const findViewItemByPath = (path: string, outletId?: number): ViewItem | undefined => {
    if (outletId) {
      const stack = viewStacks[outletId];
      if (!stack) return undefined;
      return findViewItemInStack(path, stack);
    }

    for (let outletId in viewStacks) {
      const stack = viewStacks[outletId];
      const viewItem = findViewItemInStack(path, stack);

      if (viewItem) {
        return viewItem;
      }
    }
    return undefined;
  }

  const createViewItem = (outletId: number, vueComponent: any, matchedRoute: any, routeInfo: RouteInfo, ionPage?: HTMLElement): ViewItem => {
    return {
      id: generateId('viewItem'),
      pathname: routeInfo.pathname,
      outletId,
      matchedRoute,
      ionPageElement: ionPage,
      vueComponent,
      ionRoute: false,
      mount: false
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

  return {
    findViewItemByRouteInfo,
    findViewItemByMatchedRoute,
    findLeavingViewItemByRouteInfo,
    createViewItem,
    getChildrenToRender,
    add,
    remove,
    registerIonPage,
    getViewStack
  }
}
