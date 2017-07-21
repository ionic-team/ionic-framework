import { Component } from '@stencil/core';


/**
  * @name Note
  * @module ionic
  * @description
  * A note is detailed item in an ion-item. It creates greyed out element that can be on
  * the left or right side of an item.
  *
  * @usage
  *
  * ```html
  * <ion-content>
  *   <ion-list>
  *     <ion-item>
  *       <ion-note slot="start">
  *         Left Note
  *       </ion-note>
  *       My Item
  *       <ion-note slot="end">
  *         Right Note
  *       </ion-note>
  *     </ion-item>
  *   </ion-list>
  * </ion-content>
  * ```
  *
  * {@link /docs/api/components/api/components/item/item ion-item}
  */
@Component({
  tag: 'ion-note',
  styleUrls: {
    ios: 'note.ios.scss',
    md: 'note.md.scss',
    wp: 'note.wp.scss'
  },
  host: {
    theme: 'note'
  }
})
export class Note {
  render() {
    return <slot></slot>;
  }
}
