import { Component, h, Method } from '@stencil/core';

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
  render() {
    return <slot></slot>;
  }

  /**
   * Close any sliding items that are open.
   */
  @Method()
  closeSlidingItems() {
    // TODO implement this
    console.log('in list method closeSlidingItems');
    // this._slidingGesture && this._slidingGesture.closeOpened();
  }
}
