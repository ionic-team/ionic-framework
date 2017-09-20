import { Component, Method, Prop, State } from '@stencil/core';

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

  @State() openContainer: ItemSliding;
  @Prop() radioGroup: boolean;

  render() {
    if (this.radioGroup) {
      return (
        <ion-radio-group>
          <slot></slot>
        </ion-radio-group>
      );
    }
    return <slot></slot>;
  }

  /**
   * Close any sliding items that are open.
   */
  @Method()
  closeSlidingItems() {
    this.openContainer.close();
    this.openContainer = null;
  }
}
