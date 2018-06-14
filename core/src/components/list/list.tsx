import { Component, Method, Prop } from '@stencil/core';
import { Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-list',
  styleUrls: {
    ios: 'list.ios.scss',
    md: 'list.md.scss'
  }
})
export class List {
  private mode!: Mode;
  private openItem?: HTMLIonItemSlidingElement;

  /**
   * How the bottom border should be displayed on all items.
   */
  @Prop() lines?: 'full' | 'inset' | 'none';

  /**
   * How the bottom border should be displayed on all items.
   */
  @Prop() inset = false;

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

  hostData() {
    return {
      class: {
        ...createThemedClasses(this.mode, undefined, 'list'),
        [`list-lines-${this.lines}`]: !!this.lines,
        'list-inset': this.inset,
        [`list-${this.mode}-lines-${this.lines}`]: !!this.lines
      }
    };
  }
}
