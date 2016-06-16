import {ChangeDetectionStrategy, Component, ContentChildren, ContentChild,  Directive, ElementRef, EventEmitter, HostBinding, Input, Optional, Output, QueryList, Renderer, ViewEncapsulation} from '@angular/core';

import {List} from '../list/list';
import {Item} from './item';
import {isPresent} from '../../util/util';
import {CSS, nativeRaf, nativeTimeout} from '../../util/dom';

const SWIPE_FACTOR = 1.1;
const ELASTIC_FACTOR = 0.55;

export const enum SideFlags {
  None = 0,
  Left = 1 << 0,
  Right = 1 << 1,
  Both = Left | Right
}

/**
 * @private
 */
@Directive({
  selector: 'ion-item-options',
})
export class ItemOptions {
  @Input() side: string;
  @Output() ionSwipe: EventEmitter<ItemSliding> = new EventEmitter();

  constructor(private _elementRef: ElementRef, private _renderer: Renderer) {
  }

  /**
   * @private
   */
  setCssStyle(property: string, value: string) {
    this._renderer.setElementStyle(this._elementRef.nativeElement, property, value);
  }

  /**
   * @private
   */
  getSides(): SideFlags {
    if (isPresent(this.side) && this.side === 'left') {
      return SideFlags.Left;
    } else {
      return SideFlags.Right;
    }
  }

  width() {
    return this._elementRef.nativeElement.offsetWidth;
  }

}

const enum SlidingState {
  Disabled = 0,
  Enabled = 1,
  Right = 2,
  Left = 3
}


/**
 * @name ItemSliding
 *
 * @description
 * A sliding item is a list item that can be swiped to reveal buttons. It requires
 * an [Item](../Item) component as a child and a [List](../../list/List) component as
 * a parent. All buttons to reveal can be placed in the `<ion-item-options>` element.
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
 *   <button (click)="archive(item)">
 *     <ion-icon name="archive"></ion-icon>
 *     Archive
 *   </button>
 * </ion-item-options>

 * <ion-item-options>
 *   <button (click)="archive(item)">
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
 * <ion-item-options side="right">
 *   <button (click)="archive(item)">
 *     <ion-icon name="archive"></ion-icon>
 *     Archive
 *   </button>
 * </ion-item-options>

 * <ion-item-options>
 *   <button (click)="archive(item)">
 *     <ion-icon name="archive"></ion-icon>
 *     Archive
 *   </button>
 * </ion-item-options>
 * ```
 *
 * ### Button Layout
 * If an icon is placed with text in the option button, by default it will
 * display the icon on top of the text. This can be changed to display the icon
 * to the left of the text by setting `icon-left` as an attribute on the
 * `<ion-item-options>` element.
 *
 * ```html
 * <ion-item-sliding (ionDrag)="ondrag($event)">
 *   <ion-item>Item</ion-item>
 *   <ion-item-options>
 *     <button>Favorite</button>
 *   </ion-item-options>
 * </ion-item-sliding>
 * ```
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item-sliding #item>
 *     <ion-item>
 *       Item
 *     </ion-item>
 *     <ion-item-options>
 *       <button (click)="favorite(item)">Favorite</button>
 *       <button danger (click)="share(item)">Share</button>
 *     </ion-item-options>

 *     <ion-item-options side="right">
 *       <button (click)="unread(item)">Unread</button>
 *     </ion-item-options>
 *   </ion-item-sliding>
 * </ion-list>
 * ```
 *
 * @demo /docs/v2/demos/item-sliding/
 * @see {@link /docs/v2/components#lists List Component Docs}
 * @see {@link ../Item Item API Docs}
 * @see {@link ../../list/List List API Docs}
 */
@Component({
  selector: 'ion-item-sliding',
  template:
    '<ng-content select="ion-item,[ion-item]"></ng-content>' +
    '<ng-content select="ion-item-options"></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ItemSliding {
  private _openAmount: number = 0;
  private _startX: number = 0;
  private _optsWidthRightSide: number = 0;
  private _optsWidthLeftSide: number = 0;
  private _sides: SideFlags;
  private _timer: number = null;
  private _leftOptions: ItemOptions;
  private _rightOptions: ItemOptions;
  private _optsDirty: boolean = true;
  private _state: SlidingState = SlidingState.Disabled;
  slidingPercent: number = 0;

  @ContentChild(Item) private item: Item;


  /**
   * @output {event} Expression to evaluate when the sliding position changes.
   * It reports the relative position.
   *
   * ```ts
   * ondrag(percent) {
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
  @Output() ionDrag: EventEmitter<number> = new EventEmitter();

  constructor(@Optional() private _list: List, private _renderer: Renderer, private _elementRef: ElementRef) {
    _list.enableSlidingItems(true);
    _elementRef.nativeElement.$ionComponent = this;
    _renderer.setElementClass(_elementRef.nativeElement, 'item-wrapper', true);
  }


  /**
   * @private
   */
  @ContentChildren(ItemOptions)
  set _itemOptions(itemOptions: QueryList<ItemOptions>) {
    let sides = 0;
    for (var item of itemOptions.toArray()) {
      var side = item.getSides();
      if (side === SideFlags.Left) {
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
  startSliding(startX: number) {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    if (this._openAmount === 0) {
      this._optsDirty = true;
      this._setState(SlidingState.Enabled);
    }
    this._startX = startX + this._openAmount;
    this.item.setCssStyle(CSS.transition, 'none');
  }

  /**
   * @private
   */
  moveSliding(x: number): number {
    if (this._optsDirty) {
      this.calculateOptsWidth();
      return;
    }

    let openAmount = this._startX - x;
    switch (this._sides) {
      case SideFlags.Right: openAmount = Math.max(0, openAmount); break;
      case SideFlags.Left: openAmount = Math.min(0, openAmount); break;
      case SideFlags.Both: break;
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

    this.fireSwipeEvent();
    this._setOpenAmount(restingPoint, true);
    return restingPoint;
  }

  fireSwipeEvent() {
    if (this.slidingPercent > SWIPE_FACTOR) {
      this._rightOptions.ionSwipe.emit(this);
    } else if (this.slidingPercent < -SWIPE_FACTOR) {
      this._leftOptions.ionSwipe.emit(this);
    }
  }

  calculateOptsWidth() {
    nativeRaf(() => {
      if (this._optsDirty) {
        this._optsWidthRightSide = 0;
        if (this._rightOptions) {
          this._optsWidthRightSide = this._rightOptions.width();
        }

        this._optsWidthLeftSide = 0;
        if (this._leftOptions) {
          this._optsWidthLeftSide = this._leftOptions.width();
        }
        this._optsDirty = false;
      }
    });
  }

  /**
   * @private
   */
  private _setOpenAmount(openAmount: number, isFinal: boolean) {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    this._openAmount = openAmount;

    let didEnd = openAmount === 0;
    if (didEnd) {
      // TODO: refactor. there must exist a better way
      // if sliding ended, we wait 400ms until animation finishes
      this._timer = nativeTimeout(() => {
        this._setState(SlidingState.Disabled);
        this._timer = null;
      }, 400);
      this.slidingPercent = 0;

    } else if (openAmount > 0) {
      this._setState(SlidingState.Right);
      this.slidingPercent = openAmount / this._optsWidthRightSide;
    } else if (openAmount < 0) {
      this._setState(SlidingState.Left);
      this.slidingPercent = openAmount / this._optsWidthLeftSide;
    }
    if (!isFinal) {
      this.setClass('active-swipe-right', this.slidingPercent > SWIPE_FACTOR);
      this.setClass('active-swipe-left', this.slidingPercent < -SWIPE_FACTOR);
    } else {
      this.item.setCssStyle(CSS.transition, '');
    }

    this.ionDrag.emit(this.slidingPercent);
    this.item.setCssStyle(CSS.transform, (didEnd ? '' : 'translate3d(' + -openAmount + 'px,0,0)'));
  }

  private _setState(state: SlidingState) {
    if (state !== this._state) {
      this._state = state;
      this.setClass('active-slide', state !== SlidingState.Disabled);
      this.setClass('active-options-right', state === SlidingState.Right);
      this.setClass('active-options-left', state === SlidingState.Left);
      if (state === SlidingState.Disabled || state === SlidingState.Enabled) {
        this.setClass('active-swipe-right', false);
        this.setClass('active-swipe-left', false);
      }
    }
  }

  /**
   * @private
   */
  setClass(className: string, add: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
  }
  /**
   * @private
   */
  getOpenAmount(): number {
    return this._openAmount;
  }

  /**
   * Close the sliding item. Items can also be closed from the [List](../../list/List).
   *
   * The sliding item can be closed by garbbing a reference to `ItemSliding`. In the
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
   *       <button (click)="share(slidingItem)">Share</button>
   *     </ion-item-options>
   *   </ion-item-sliding>
   * </ion-list>
   * ```
   *
   * ```ts
   * import {Component} from '@angular/core';
   * import {ItemSliding} from 'ionic-angular';
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
 