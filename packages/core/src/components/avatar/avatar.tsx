import { Component } from '@stencil/core';


/**
  * @name Avatar
  * @module ionic
  * @description
  * An Avatar is a component that creates a circular image for an item.
  * Avatars can be placed on the left or right side of an item with the `item-start` or `item-end` directive.
  * @see {@link /docs/components/#avatar-list Avatar Component Docs}
 */
@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss',
    wp: 'avatar.wp.scss'
  },
  host: {
    theme: 'avatar'
  }
})
export class Avatar {
  render() {
    return <slot></slot>;
  }
}
