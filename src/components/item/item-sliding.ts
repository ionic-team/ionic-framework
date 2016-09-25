import { ChangeDetectionStrategy, Component, ContentChildren, ContentChild, Directive, ElementRef, EventEmitter, Input, Optional, Output, QueryList, Renderer, ViewEncapsulation, NgZone } from '@angular/core';

import { CSS, nativeRaf, nativeTimeout, clearNativeTimeout } from '../../util/dom';
import { Item } from './item';
import { isPresent } from '../../util/util';
import { List } from '../list/list';

const SWIPE_MARGIN = 30;
const ELASTIC_FACTOR = 0.55;

export const enum ItemSideFlags {
  None = 0,
  Left = 1 << 0,
  Right = 1 << 1,
  Both = Left | Right
}

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
   * @input {string} the side the option button should be on. Defaults to right
   * If you have multiple `ion-item-options`, a side must be provided for each.
   */
  @Input() side: string;

  /**
   * @output {event} Expression to evaluate when the item has been fully swiped.
   */
  @Output() ionSwipe: EventEmitter<ItemSliding> = new EventEmitter<ItemSliding>();

  constructor(private _elementRef: ElementRef, private _renderer: Renderer) {}

  /**
   * @private
   */
  getSides(): ItemSideFlags {
    if (isPresent(this.side) && this.side === 'left') {
      return ItemSideFlags.Left;
    } else {
      return ItemSideFlags.Right;
    }
  }

  /**
   * @private
   */
  width() {
    return this._elementRef.nativeElement.offsetWidth;
  }

}

export const enum SlidingState {
  Disabled = 1 << 1,
  Enabled = 1 << 2,
  Right = 1 << 3,
  Left = 1 << 4,

  SwipeRight = 1 << 5,
  SwipeLeft = 1 << 6,
}


/**
 * @name ItemSliding
 * @description
 * A sliding item is a list item that can be swiped to reveal buttons. It requires
 * an [Item](../Item) component as a child and a [List](../../list/List) component as
 * a parent. All buttons to reveal can be placed in the `<ion-item-options>` element.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item-sliding #item>
 *     <ion-item>
 *       Item
 *     </ion-item>
 *     <ion-item-options side="left">
 *       <button ion-button (click)="favorite(item)">Favorite</button>
 *       <button ion-button color="danger" (click)="share(item)">Share</button>
 *     </ion-item-options>

 *     <ion-item-options side="right">
 *       <button ion-button (click)="unread(item)">Unread</button>
 *     </ion-item-options>
 *   </ion-item-sliding>
 * </ion-list>
 * ```
 *
 * ### Swipe Direction
 * By default, the buttons are revealed when the sliding item is swiped from right to left,
 * so the buttons are placed in the right side. But it's also possible to reveal them
 * in the right side (sliding from left to right) by setting the `side` attribute
 * on the `ion-item-options` element. Up to 2 `ion-item-options` can used at the same time
 * in order to reveal two different sets of buttons depending the swipping direction.
 *
 * ```html
 * <ion-item-options side="right">
 *   <button ion-button (click)="archive(item)">
 *     <ion-icon name="archive"></ion-icon>
 *     Archive
 *   </button>
 * </ion-item-options>

 * <ion-item-options side="left">
 *   <button ion-button (click)="archive(item)">
 *     <ion-icon name="archive"></ion-icon>
 *     Archive
 *   </button>
 * </ion-item-options>
 * ```
 *
 * ### Listening for events (ionDrag) and (ionSwipe)
 * It's possible to know the current relative position of the sliding item by subscribing
 * to the (ionDrag)` event.
 *
 * ```html
 * <ion-item-sliding (ionDrag)="logDrag($event)">
 *   <ion-item>Item</ion-item>
 *   <ion-item-options>
 *     <button ion-button>Favorite</button>
 *   </ion-item-options>
 * </ion-item-sliding>
 * ```
 *
 * ### Button Layout
 * If an icon is placed with text in the option button, by default it will
 * display the icon on top of the text. This can be changed to display the icon
 * to the left of the text by setting `icon-left` as an attribute on the
 * `<ion-item-options>` element.
 *
 * ```html
 * <ion-item-options icon-left>
 *    <button ion-button (click)="archive(item)">
 *      <ion-icon name="archive"></ion-icon>
 *      Archive
 *    </button>
 *  </ion-item-options>
 *
 * ```
 *
 *
 * @demo /docs/v2/demos/src/item-sliding/
 * @see {@link /docs/v2/components#lists List Component Docs}
 * @see {@link ../Item Item API Docs}
 * @see {@link ../../list/List List API Docs}
 */
@Component({
  selector: 'ion-item-sliding',
  template: `
    <ng-content select="ion-item,[ion-item]"></ng-content>
    <ng-content select="ion-item-options"></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ItemSliding {
  private _openAmount: number = 0;
  private _startX: number = 0;
  private _optsWidthRightSide: number = 0;
  private _optsWidthLeftSide: number = 0;
  private _sides: ItemSideFlags;
  private _timer: number = null;
  private _leftOptions: ItemOptions;
  private _rightOptions: ItemOptions;
  private _optsDirty: boolean = true;
  private _state: SlidingState = SlidingState.Disabled;

  /**
   * @private
   */
  @ContentChild(Item) item: Item;

  /**
   * @output {event} Expression to evaluate when the sliding position changes.
   * It reports the relative position.
   *
   * ```ts
   * ondrag(item) {
   *   let percent = item.getSlidingPercent();
   *   if (percent > 0) {
   *     // positive
   *     console.log('right side');
   *   } else {
   *     // negative
   *     console.log('left side');
   *   }
   *   if (Math.abs(percent) > 1) {
   *     console.log('overscroll');
   *   }
   * }
   * ```
   *
   */
  @Output() ionDrag: EventEmitter<ItemSliding> = new EventEmitter<ItemSliding>();

  constructor(
    @Optional() list: List,
    private _renderer: Renderer,
    private _elementRef: ElementRef,
    private _zone: NgZone) {
    list && list.containsSlidingItem(true);
    _elementRef.nativeElement.$ionComponent = this;
    this.setElementClass('item-wrapper', true);
  }

  @ContentChildren(ItemOptions)
  set _itemOptions(itemOptions: QueryList<ItemOptions>) {
    let sides = 0;
    for (var item of itemOptions.toArray()) {
      var side = item.getSides();
      if (side === ItemSideFlags.Left) {
        this._leftOptions = item;
      } else {
        this._rightOptions = item;
      }
      sides |= item.getSides();
    }
    this._optsDirty = true;
    this._sides = sides;
  }

  /**
   * @private
   */
  getOpenAmount(): number {
    return this._openAmount;
  }

  /**
   * @private
   */
  getSlidingPercent(): number {
    let openAmount = this._openAmount;
    if (openAmount > 0) {
      return openAmount / this._optsWidthRightSide;
    } else if (openAmount < 0) {
      return openAmount / this._optsWidthLeftSide;
    } else {
      return 0;
    }
  }

  /**
   * @private
   */
  startSliding(startX: number) {
    if (this._timer) {
      clearNativeTimeout(this._timer);
      this._timer = null;
    }
    if (this._openAmount === 0) {
      this._optsDirty = true;
      this._setState(SlidingState.Enabled);
    }
    this._startX = startX + this._openAmount;
    this.item.setElementStyle(CSS.transition, 'none');
  }

  /**
   * @private
   */
  moveSliding(x: number): number {
    if (this._optsDirty) {
      this.calculateOptsWidth();
      return;
    }

    let openAmount = (this._startX - x);
    switch (this._sides) {
      case ItemSideFlags.Right: openAmount = Math.max(0, openAmount); break;
      case ItemSideFlags.Left: openAmount = Math.min(0, openAmount); break;
      case ItemSideFlags.Both: break;
      default: return;
    }

    if (openAmount > this._optsWidthRightSide) {
      var optsWidth = this._optsWidthRightSide;
      openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;

    } else if (openAmount < -this._optsWidthLeftSide) {
      var optsWidth = -this._optsWidthLeftSide;
      openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;
    }

    this._setOpenAmount(openAmount, false);
    return openAmount;
  }

  /**
   * @private
   */
  endSliding(velocity: number): number {
    let restingPoint = (this._openAmount > 0)
      ? this._optsWidthRightSide
      : -this._optsWidthLeftSide;

    // Check if the drag didn't clear the buttons mid-point
    // and we aren't moving fast enough to swipe open
    let isCloseDirection = (this._openAmount > 0) === !(velocity < 0);
    let isMovingFast = Math.abs(velocity) > 0.3;
    let isOnCloseZone = Math.abs(this._openAmount) < Math.abs(restingPoint / 2);
    if (shouldClose(isCloseDirection, isMovingFast, isOnCloseZone)) {
      restingPoint = 0;
    }

    this._setOpenAmount(restingPoint, true);
    this.fireSwipeEvent();
    return restingPoint;
  }

  /**
   * @private
   */
  private fireSwipeEvent() {
    if (this._state & SlidingState.SwipeRight) {
      this._zone.run(() => this._rightOptions.ionSwipe.emit(this));
    } else if (this._state & SlidingState.SwipeLeft) {
      this._zone.run(() => this._leftOptions.ionSwipe.emit(this));
    }
  }

  /**
   * @private
   */
  private calculateOptsWidth() {
    nativeRaf(() => {
      if (!this._optsDirty) {
        return;
      }
      this._optsWidthRightSide = 0;
      if (this._rightOptions) {
        this._optsWidthRightSide = this._rightOptions.width();
      }

      this._optsWidthLeftSide = 0;
      if (this._leftOptions) {
        this._optsWidthLeftSide = this._leftOptions.width();
      }
      this._optsDirty = false;
    });
  }

  private _setOpenAmount(openAmount: number, isFinal: boolean) {
    if (this._timer) {
      clearNativeTimeout(this._timer);
      this._timer = null;
    }
    this._openAmount = openAmount;

    if (isFinal) {
      this.item.setElementStyle(CSS.transition, '');

    } else {
      if (openAmount > 0) {
        let state = (openAmount >= (this._optsWidthRightSide + SWIPE_MARGIN))
          ? SlidingState.Right | SlidingState.SwipeRight
          : SlidingState.Right;

        this._setState(state);

      } else if (openAmount < 0) {
        let state = (openAmount <= (-this._optsWidthLeftSide - SWIPE_MARGIN))
          ? SlidingState.Left | SlidingState.SwipeLeft
          : SlidingState.Left;

        this._setState(state);
      }
    }
    if (openAmount === 0) {
      this._timer = nativeTimeout(() => {
        this._setState(SlidingState.Disabled);
        this._timer = null;
      }, 600);
      this.item.setElementStyle(CSS.transform, '');
      return;
    }

    this.item.setElementStyle(CSS.transform, `translate3d(${-openAmount}px,0,0)`);
    this._zone.run(() => this.ionDrag.emit(this));
  }

  private _setState(state: SlidingState) {
    if (state === this._state) {
      return;
    }
    this.setElementClass('active-slide', (state !== SlidingState.Disabled));
    this.setElementClass('active-options-right', !!(state & SlidingState.Right));
    this.setElementClass('active-options-left', !!(state & SlidingState.Left));
    this.setElementClass('active-swipe-right', !!(state & SlidingState.SwipeRight));
    this.setElementClass('active-swipe-left', !!(state & SlidingState.SwipeLeft));
    this._state = state;
  }


  /**
   * Close the sliding item. Items can also be closed from the [List](../../list/List).
   *
   * The sliding item can be closed by grabbing a reference to `ItemSliding`. In the
   * below example, the template reference variable `slidingItem` is placed on the element
   * and passed to the `share` method.
   *
   * ```html
   * <ion-list>
   *   <ion-item-sliding #slidingItem>
   *     <ion-item>
   *       Item
   *     </ion-item>
   *     <ion-item-options>
   *       <button ion-button (click)="share(slidingItem)">Share</button>
   *     </ion-item-options>
   *   </ion-item-sliding>
   * </ion-list>
   * ```
   *
   * ```ts
   * import { Component } from '@angular/core';
   * import { ItemSliding } from 'ionic-angular';
   *
   * @Component({...})
   * export class MyClass {
   *   constructor() { }
   *
   *   share(slidingItem: ItemSliding) {
   *     slidingItem.close();
   *   }
   * }
   * ```
   */
  close() {
    this._setOpenAmount(0, true);
  }

  /**
   * @private
   */
  setElementClass(cssClass: string, shouldAdd: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, cssClass, shouldAdd);
  }
}

function shouldClose(isCloseDirection: boolean, isMovingFast: boolean, isOnCloseZone: boolean): boolean {
  // The logic required to know when the sliding item should close (openAmount=0)
  // depends on three booleans (isCloseDirection, isMovingFast, isOnCloseZone)
  // and it ended up being too complicated to be written manually without errors
  // so the truth table is attached below: (0=false, 1=true)
  // isCloseDirection | isMovingFast | isOnCloseZone || shouldClose
  //         0        |       0      |       0       ||    0
  //         0        |       0      |       1       ||    1
  //         0        |       1      |       0       ||    0
  //         0        |       1      |       1       ||    0
  //         1        |       0      |       0       ||    0
  //         1        |       0      |       1       ||    1
  //         1        |       1      |       0       ||    1
  //         1        |       1      |       1       ||    1
  // The resulting expression was generated by resolving the K-map (Karnaugh map):
  let shouldClose = (!isMovingFast && isOnCloseZone) || (isCloseDirection && isMovingFast);
  return shouldClose;
}
