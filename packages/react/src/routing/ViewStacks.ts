import { RouteInfo } from '../models';

import { ViewItem } from './ViewItem';

export abstract class ViewStacks {
  private viewStacks: { [key: string]: ViewItem[]; } = {};

  constructor() {
    this.add = this.add.bind(this);
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

  getViewItemsForOutlet(outletId: string) {
    return (this.viewStacks[outletId] || []).filter(x => x.mount);
  }

  remove(viewItem: ViewItem) {
    const { outletId } = viewItem;
    const viewStack = this.viewStacks[outletId];
    if (viewStack) {
      const viewItemToRemove = viewStack.find(x => x.id === viewItem.id);
      if (viewItemToRemove) {
        viewItemToRemove.mount = false;
        setTimeout(() => {
          this.viewStacks[outletId] = viewStack.filter(x => x.id !== viewItemToRemove.id);
        }, 10000);
      }
    }
  }

  protected getStackIds() {
    return Object.keys(this.viewStacks);
  }

  protected getAllViewItems() {
    const keys = this.getStackIds();
    const viewItems: ViewItem[] = [];
    keys.forEach(k => {
      viewItems.push(...this.viewStacks[k]);
    });
    return viewItems;
  }

  abstract createViewItem(outletId: string, reactElement: React.ReactElement, routeInfo: RouteInfo, page?: HTMLElement): ViewItem;
  abstract findViewItemByPathname(pathname: string, outletId?: string): ViewItem | undefined;
  abstract findViewItemByRouteInfo(outletId: string, routeInfo: RouteInfo): ViewItem | undefined;
  abstract findLeavingViewItemByRouteInfo(outletId: string, routeInfo: RouteInfo): ViewItem | undefined;
  abstract getChildrenToRender(outletId: string, ionRouterOutlet: React.ReactElement, routeInfo: RouteInfo): React.ReactNode[];
  abstract getViewItemForTransition(pathname: string): ViewItem | undefined;
}
