import { generateId } from './utils';
import {
  RouteInfo,
  ViewItem,
  ViewStacks,
} from './types';
import { RouteLocationMatched, Router } from 'vue-router';
import { shallowRef } from 'vue';

export const createViewStacks = (router: Router) => {
  let viewStacks: ViewStacks = {};
  /**
   * Used to track which outlet should handle which routes/viewitems
   */
  let rootPaths: Array<any> = [];

  /**
   *
   * @param path
   */
  const getOutletByPath = (path: string) => {
    let bestMatch,
      bestIndex;

    for (let index in rootPaths) {
      let _path = rootPaths[index];
      if (bestIndex === undefined) {
        bestIndex = index;
        bestMatch = _path;
      } else {
        let exists = path.indexOf(_path) !== -1;
        if (exists && _path.length > bestMatch.length) {
          bestMatch = _path;
          bestIndex = index;
        }
      }

      if (path === undefined) {
        return bestIndex;
      }
    }

    return bestIndex;
  }

  const setRootPath = (outletId: number, rootPath: string,) => {
    rootPaths[outletId] = rootPath;
  }

  const clear = (outletId: number) => {
    delete viewStacks[outletId];
  }

  const getViewStack = (outletId: number) => {
    return viewStacks[outletId];
  }

  const registerIonPage = (viewItem: ViewItem, ionPage: HTMLElement) => {
    viewItem.ionPageElement = ionPage;
    viewItem.ionRoute = true;

    /**
     * This is needed otherwise Vue Router
     * will not consider this component mounted
     * and will not run route guards that
     * are written in the component.
     */
    viewItem.matchedRoute.instances = { default: viewItem.vueComponentRef.value };
  }

  const findViewItemByRouteInfo = (routeInfo: RouteInfo, outletId?: number, useDeprecatedRouteSetup: boolean = false) => {
    let viewItem = findViewItemByPath(routeInfo.pathname, outletId, false, useDeprecatedRouteSetup);

    /**
     * Given a route such as /path/:id,
     * going from /page/1 to /home
     * to /page/2 will cause the same
     * view item from /page/1 to match
     * for /page/2 so we need to make
     * sure any params get updated.
     * Not normally an issue for accessing
     * the params via useRouter from vue-router,
     * but when passing params as props not doing
     * this would cause the old props to show up.
     */
    if (viewItem && viewItem.params !== routeInfo.params) {
      /**
       * Clear the props function result
       * as the value may have changed due
       * to different props.
       */
      delete viewItem.vueComponentData.propsFunctionResult;
      viewItem.params = routeInfo.params;
    }

    return viewItem;
  }

  const findLeavingViewItemByRouteInfo = (routeInfo: RouteInfo, outletId?: number, mustBeIonRoute: boolean = true, useDeprecatedRouteSetup: boolean = false) => {
    const hasLeavingView = routeInfo.replacedRoute !== undefined || routeInfo.lastPathname !== undefined;
    if (hasLeavingView === false) {
      return undefined;
    }
    const leavingViewPathname = routeInfo.replacedRoute ? routeInfo.replacedRoute : routeInfo.lastPathname;
    return findViewItemByPath(leavingViewPathname, outletId, mustBeIonRoute, useDeprecatedRouteSetup);
  }

  const findViewItemByPathname = (pathname: string, outletId?: number, useDeprecatedRouteSetup: boolean = false) => {
    return findViewItemByPath(pathname, outletId, false, useDeprecatedRouteSetup);
  }

  const findViewItemInStack = (path: string, stack: ViewItem[]): ViewItem | undefined => {
    return stack.find((viewItem: ViewItem) => {
      if (viewItem.pathname === path) {
        return viewItem;
      }

      return undefined;
    })
  }

  const findViewItemByPath = (path: string, outletId?: number, mustBeIonRoute: boolean = false, useDeprecatedRouteSetup: boolean = false): ViewItem | undefined => {
    const matchView = (viewItem: ViewItem) => {
      if (
        (mustBeIonRoute && !viewItem.ionRoute) ||
        path === ''
      ) {
        return false;
      }

      const resolvedPath = router.resolve(path);
      let findMatchedRoute;
      // TODO: Remove in Ionic Vue v6.0
      if (useDeprecatedRouteSetup) {
        findMatchedRoute = resolvedPath.matched.find((matchedRoute: RouteLocationMatched) => matchedRoute === viewItem.matchedRoute && (path === viewItem.pathname || matchedRoute.path.includes(':')));
      } else {
        findMatchedRoute = resolvedPath.matched.find((matchedRoute: RouteLocationMatched) => matchedRoute === viewItem.matchedRoute);
      }

      let hasMatch = findMatchedRoute !== undefined;
      if (hasMatch) {
        return viewItem;
      }

      return undefined;
    }

    if (outletId) {
      let match;
      const stack = viewStacks[outletId];
      if (stack === undefined) {
        return undefined;
      }

      if (router) {
        if (match === undefined) {
          match = stack.find(matchView);
        }
      } else {
        match = findViewItemInStack(path, stack);
      }

      if (match) {
        return match;
      }
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
    const hasOutlet = viewStacks[outletId] !== undefined;
    if (hasOutlet === false) {
      viewStacks[outletId] = [viewItem];
    } else {
      viewStacks[outletId].push(viewItem);
    }
  }

  const remove = (viewItem: ViewItem, outletId?: number): void => {
    if (!outletId) {
      throw Error('outletId required')
    }

    const viewStack = viewStacks[outletId];
    if (viewStack) {
      viewStacks[outletId] = viewStack.filter(item => item.id !== viewItem.id);
    }
  }

  /**
   * Get the children needed for an outlet, for tabs it could return more than one component (usually the parent with the back button and the inner tab component)
   * @param outletId
   */
  const getChildrenToRender = (outletId: number): ViewItem[] => {
    const viewStack = viewStacks[outletId];

    let components: ViewItem[] = [];
    if (viewStack) {
      components = viewStacks[outletId].filter(v => v.mount);
    }
    return components;
  }

  /**
   * Mount a viewItem
   * @param viewItem
   */
  const mountViewItem = (viewItem: ViewItem) => {
    viewItem.mount = true;
  }

  /**
   * Unmount a viewItem, if it has any matchedRoute instances reset, unmounting occurs only when removing an item from the history stack, usually a replace event
   * @param viewItem
   */
  const unmountViewItem = (viewItem: ViewItem) => {
    viewItem.mount = false;
    viewItem.ionPageElement = undefined;
    viewItem.ionRoute = false;
    if (viewItem.matchedRoute !== undefined) {
      viewItem.matchedRoute.instances = {};
    }
  }

  /**
   * When navigating backwards, we need to clean up and
   * leaving pages so that they are re-created if
   * we ever navigate back to them. This is especially
   * important when using router.go and stepping back
   * multiple pages at a time.
   */
  const unmountLeavingViews = (outletId: number, viewItem: ViewItem, delta: number = 1) => {
    const viewStack = viewStacks[outletId];
    if (!viewStack) {
      return;
    }

    const startIndex = viewStack.findIndex(v => v === viewItem);

    for (let i = startIndex + 1; i < startIndex - delta; i++) {
      const viewItem = viewStack[i];
      if (viewItem === undefined) {
        console.warn('unmountLeavingViews: Undefined viewItem');
        continue;
      }
      unmountViewItem(viewItem);
    }
  }

  /**
   * When navigating forward it is possible for
   * developers to step forward over multiple views.
   * The intermediary views need to be remounted so that
   * swipe to go back works properly.
   * We need to account for the delta value here too because
   * we do not want to remount an unrelated view.
   * Example:
   * /home --> /page2 --> router.back() --> /page3
   * Going to /page3 would remount /page2 since we do
   * not prune /page2 from the stack. However, /page2
   * needs to remain in the stack.
   * Example:
   * /home --> /page2 --> /page3 --> router.go(-2) --> router.go(2)
   * We would end up on /page3, but users need to be able to swipe
   * to go back to /page2 and /home, so we need both pages mounted
   * in the DOM.
   */
  const mountIntermediaryViews = (outletId: number, viewItem: ViewItem, delta: number = 1) => {
    const viewStack = viewStacks[outletId];
    if (!viewStack) {
      return;
    }

    const startIndex = viewStack.findIndex(v => v === viewItem);

    for (let i = startIndex + 1; i < startIndex + delta; i++) {
      let viewItem = viewStack[i];
      mountViewItem(viewItem)
    }
  }

  return {
    mountViewItem,
    unmountViewItem,
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
    getViewStack,
    setRootPath,
    getOutletByPath,
  }
}
