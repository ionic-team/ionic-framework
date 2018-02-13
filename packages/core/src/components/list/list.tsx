import { Component, Method } from '@stencil/core';

import { ItemSliding } from '../item-sliding/item-sliding';


@Component({
  tag: 'ion-list',
  styleUrls: {
    ios: 'list.ios.scss',
    md: 'list.md.scss'
  },
  host: {
    theme: 'list'
  }
})
export class List {
  private openedItem: ItemSliding;

  @Method()
  getOpenedItem() {
    return this.openedItem;
  }

  @Method()
  setOpenedItem(itemSliding: ItemSliding) {
    this.openedItem = itemSliding;
  }

  /**
   * Close the sliding items. Items can also be closed from the [Item Sliding](../../item-sliding/ItemSliding).
   */
  @Method()
  closeSlidingItems(): boolean {
    if (this.openedItem) {
      this.openedItem.close();
      this.openedItem = null;
      return true;
    }
    return false;
  }

  render() {
    return <slot></slot>;
  }
}
