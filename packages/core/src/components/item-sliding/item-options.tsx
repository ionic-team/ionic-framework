import { Component, Element, Event, EventEmitter, Method, Prop } from '@stencil/core';
import { Side, isRightSide } from '../../utils/helpers';


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
  @Element() private el: HTMLElement;

  /**
   * @input {string} The side the option button should be on. Defaults to `"right"`.
   * If you have multiple `ion-item-options`, a side must be provided for each.
   */
  @Prop() side: Side = 'right';

  /**
   * @output {Event} Emitted when the item has been fully swiped.
   */
  @Event() ionSwipe: EventEmitter;

  @Method()
  isRightSide() {
    return isRightSide(this.side, true);
  }

  @Method()
  width(): number {
    return this.el.offsetWidth;
  }

  @Method()
  fireSwipeEvent(value: any) {
    this.ionSwipe.emit(value);
  }

  hostData(){
    return {
      class:{
        'ion-options-left': !this.isRightSide(),
        'ion-options-right': this.isRightSide()
      }
    }
  }

  render() {
    return <slot></slot>;
  }
}
