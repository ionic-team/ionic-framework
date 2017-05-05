import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import { Platform } from '../../platform/platform';
import { Side, isRightSide } from '../../util/util';
import { ItemSliding } from './item-sliding';

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
 *     <button ion-button expandable (click)="saveItem(item)">
 *       <ion-icon name="star"></ion-icon>
 *     </button>
 *   </ion-item-options>
 * </ion-item-sliding>
 *```
 */
@Directive({
  selector: 'ion-item-options',
})
export class ItemOptions {

  /**
   * @input {string} The side the option button should be on. Defaults to `"right"`.
   * If you have multiple `ion-item-options`, a side must be provided for each.
   */
  @Input() side: Side;

  /**
   * @output {event} Emitted when the item has been fully swiped.
   */
  @Output() ionSwipe: EventEmitter<ItemSliding> = new EventEmitter<ItemSliding>();

  constructor(
    private _elementRef: ElementRef,
    private _plt: Platform
  ) { }

  /**
   * @hidden
   */
  isRightSide(): boolean {
    return isRightSide(this.side, this._plt.isRTL, true);
  }

  /**
   * @hidden
   */
  width() {
    return this._elementRef.nativeElement.offsetWidth;
  }
}
