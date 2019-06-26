import { Component, ComponentInterface, Element, Method, Prop } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-list',
  styleUrls: {
    ios: 'list.ios.scss',
    md: 'list.md.scss'
  }
})
export class List implements ComponentInterface {

  @Element() el!: HTMLElement;

  /**
   * How the bottom border should be displayed on all items.
   */
  @Prop() lines?: 'full' | 'inset' | 'none';

  /**
   * If `true`, the list will have margin around it and rounded corners.
   */
  @Prop() inset = false;

  /**
   * If `ion-item-sliding` are used inside the list, this method closes
   * any open sliding item.
   *
   * Returns `true` if an actual `ion-item-sliding` is closed.
   */
  @Method()
  async closeSlidingItems(): Promise<boolean> {
    const item = this.el.querySelector('ion-item-sliding');
    if (item && item.closeOpened) {
      return item.closeOpened();
    }
    return false;
  }

  hostData() {
    const mode = getIonMode(this);
    return {
      class: {
        [mode]: true,

        // Used internally for styling
        [`list-${mode}`]: true,

        'list-inset': this.inset,
        [`list-lines-${this.lines}`]: this.lines !== undefined,
        [`list-${mode}-lines-${this.lines}`]: this.lines !== undefined
      }
    };
  }
}
