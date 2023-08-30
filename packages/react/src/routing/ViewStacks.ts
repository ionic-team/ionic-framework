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
