import { Component, Method } from '@stencil/core';

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

  private openItem?: HTMLIonItemSlidingElement;

  /**
   * Get the [Item Sliding](../../item-sliding/ItemSliding) that is currently opene.
   */
  @Method()
  getOpenItem() {
    return this.openItem;
  }

  /**
   * Set an [Item Sliding](../../item-sliding/ItemSliding) as the open item.
   */
  @Method()
  setOpenItem(itemSliding: HTMLIonItemSlidingElement | undefined) {
    this.openItem = itemSliding;
  }

  /**
   * Close the sliding items. Items can also be closed from the [Item Sliding](../../item-sliding/ItemSliding).
   * Returns a boolean value of whether it closed an item or not.
   */
  @Method()
  closeSlidingItems(): boolean {
    if (this.openItem) {
      this.openItem.close();
      this.openItem = undefined;
      return true;
    }
    return false;
  }

}
