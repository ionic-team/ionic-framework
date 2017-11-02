import { Component, Method } from '@stencil/core';

import { ItemSliding } from '../item-sliding/item-sliding';


@Component({
  tag: 'ion-list',
  styleUrls: {
    ios: 'list.ios.scss',
    md: 'list.md.scss',
    wp: 'list.wp.scss'
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

  @Method()
  closeSlidingItems(): boolean {
    if (this.openedItem) {
      this.openedItem.close();
      this.openedItem = null;
      return true;
    }
    return false;
  }

  protected render() {
    return <slot></slot>;
  }
}
