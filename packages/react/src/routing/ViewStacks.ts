import type { RouteInfo } from '../models/RouteInfo';

import type { ViewItem } from './ViewItem';

export abstract class ViewStacks {
  private viewStacks: { [key: string]: ViewItem[] } = {};

  constructor() {
    this.add = this.add.bind(this);
    this.clear = this.clear.bind(this);
    this.getViewItemsForOutlet = this.getViewItemsForOutlet.bind(this);
    this.remove = this.remove.bind(this);
  }

  add(viewItem: ViewItem) {
    const { outletId } = viewItem;
    if (!this.viewStacks[outletId]) {
      this.viewStacks[outletId] = [viewItem];
    } else {
      this.viewStacks[outletId].push(viewItem);
    }
  }

  clear(outletId: string) {
    // Give some time for the leaving views to transition before removing
    return setTimeout(() => {
      delete this.viewStacks[outletId];
    }, 500);
  }

  getViewItemsForOutlet(outletId: string) {
    return this.viewStacks[outletId] || [];
  }

  remove(viewItem: ViewItem) {
    const { outletId } = viewItem;
    const viewStack = this.viewStacks[outletId];
    if (viewStack) {
      const viewItemToRemove = viewStack.find((x) => x.id === viewItem.id);
      if (viewItemToRemove) {
        viewItemToRemove.mount = false;
        this.viewStacks[outletId] = viewStack.filter((x) => x.id !== viewItemToRemove.id);
      }
    }
  }

  /**
   * When navigating backwards, we need to clean up and
   * leaving pages so that they are re-created if
   * we ever navigate back to them. This is especially
   * important when using router.go and stepping back
   * multiple pages at a time.
   */
  unmountLeavingViews(outletId: string, viewItem: ViewItem, delta = 1) {
    const viewStack = this.viewStacks[outletId];
    if (!viewStack) return;

    const startIndex = viewStack.findIndex(v => v === viewItem);

    for (let i = startIndex + 1; i < startIndex - delta; i++) {
      const viewItem = viewStack[1];
      viewItem.mount = false;
      viewItem.ionPageElement = undefined;
      viewItem.ionRoute = false;
      // This is Vue specific - TODO find if there is a React equivalent needed
      // viewItem.matchedRoute.instances = {};
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
  mountIntermediaryViews(outletId: string, viewItem: ViewItem, delta = 1) {
    const viewStack = this.viewStacks[outletId];
    if (!viewStack) return;

    const startIndex = viewStack.findIndex(v => v === viewItem);

    for (let i = startIndex + 1; i < startIndex + delta; i++) {
      viewStack[i].mount = true;
    }
  }

  /**
   * Returns the number of active stacks.
   * This is useful for determining if an app
   * is using linear navigation only or non-linear
   * navigation. Multiple stacks indicate an app
   * is using non-linear navigation.
   */
  size() {
    return Object.keys(this.viewStacks || {}).length;
  }

  protected getStackIds() {
    return Object.keys(this.viewStacks);
  }

  protected getAllViewItems() {
    const keys = this.getStackIds();
    const viewItems: ViewItem[] = [];
    keys.forEach((k) => {
      viewItems.push(...this.viewStacks[k]);
    });
    return viewItems;
  }

  abstract createViewItem(
    outletId: string,
    reactElement: React.ReactElement,
    routeInfo: RouteInfo,
    page?: HTMLElement
  ): ViewItem;
  abstract findViewItemByPathname(pathname: string, outletId?: string, forceExact?: boolean): ViewItem | undefined;
  abstract findViewItemByRouteInfo(
    routeInfo: RouteInfo,
    outletId?: string,
    updateMatch?: boolean
  ): ViewItem | undefined;
  abstract findLeavingViewItemByRouteInfo(routeInfo: RouteInfo, outletId?: string): ViewItem | undefined;
  abstract getChildrenToRender(
    outletId: string,
    ionRouterOutlet: React.ReactElement,
    routeInfo: RouteInfo,
  ): React.ReactNode[];
}
