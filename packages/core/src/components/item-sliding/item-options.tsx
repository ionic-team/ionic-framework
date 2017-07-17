import { Component, h, Ionic, Prop } from '@stencil/core';

import { isRightSide, Side } from '../../utils/helpers';


/**
 * @name ItemOptions
 * @description
 * The option buttons for an `ion-item-sliding`. These buttons can be placed either on the left or right side.
 * You can combine the `(ionSwipe)` event plus the `expandable` directive to create a full swipe action for the item.
 *
 * @usage
 *
 * ```html
 * <ion-item-sliding>
 *   <ion-item>
 *     Item 1
 *   </ion-item>
 *   <ion-item-options side="right" (ionSwipe)="saveItem(item)">
 *     <ion-item-option expandable (click)="saveItem(item)">
 *       <ion-icon name="star"></ion-icon>
 *     </ion-item-option>
 *   </ion-item-options>
 * </ion-item-sliding>
 *```
 */
@Component({
  tag: 'ion-item-options'
})
export class ItemOptions {
  $el: HTMLElement;

  /**
   * @input {string} The side the option button should be on. Defaults to `"right"`.
   * If you have multiple `ion-item-options`, a side must be provided for each.
   */
  @Prop() side: Side = 'right';

  /**
   * @output {event} Emitted when the item has been fully swiped.
   */
  // @Output() ionSwipe: EventEmitter<ItemSliding> = new EventEmitter<ItemSliding>();

  /**
   * @hidden
   */
  isRightSide(): boolean {
    const isRTL = document.dir === 'rtl';
    return isRightSide(this.side, isRTL, true);
  }

  /**
   * @output {event} Emitted when the item has been fully swiped.
   */
  ionSwipe(itemSliding: any) {
    Ionic.emit(itemSliding, 'ionSwipe');
  }

  /**
   * @hidden
   */
  width(): number {
    return this.$el.offsetWidth;
  }

  render() {
    return <slot></slot>;
  }
}
