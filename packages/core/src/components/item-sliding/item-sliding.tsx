import { Component, Element, Event, EventEmitter, Method, State } from '@stencil/core';

import { GestureDetail } from '../../index';
import { swipeShouldReset } from '../../utils/helpers';
import { ItemOptions } from '../item-options/item-options';


const SWIPE_MARGIN = 30;
const ELASTIC_FACTOR = 0.55;

export const enum ItemSide {
  None = 0,
  Left = 1 << 0,
  Right = 1 << 1,
  Both = Left | Right
}

export const enum SlidingState {
  Disabled = 1 << 1,
  Enabled = 1 << 2,
  Right = 1 << 3,
  Left = 1 << 4,

  SwipeRight = 1 << 5,
  SwipeLeft = 1 << 6,
}


@Component({
  tag: 'ion-item-sliding',
  styleUrls: {
    ios: 'item-sliding.ios.scss',
    md: 'item-sliding.md.scss'
  }
})
export class ItemSliding {

  private item: HTMLIonItemElement;
  private list: HTMLIonListElement;
  private openAmount = 0;
  private initialOpenAmount = 0;
  private optsWidthRightSide = 0;
  private optsWidthLeftSide = 0;
  private sides: ItemSide;
  private tmr: any = null;
  private leftOptions: ItemOptions;
  private rightOptions: ItemOptions;
  private optsDirty = true;
  private gestureOptions: any;

  @Element() private el: HTMLElement;
  @State() state: SlidingState = SlidingState.Disabled;


  /**
   * Emitted when the sliding position changes.
   * It reports the relative position.
   *
   * ```ts
   * onDrag(slidingItem) {
   *   let percent = slidingItem.getSlidingPercent();
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
  @Event() ionDrag: EventEmitter;

  constructor() {
    this.gestureOptions = {
      'canStart': this.canStart.bind(this),
      'onStart': this.onDragStart.bind(this),
      'onMove': this.onDragMove.bind(this),
      'onEnd': this.onDragEnd.bind(this),
      'gestureName': 'item-swipe',
      'gesturePriority': -10,
      'type': 'pan',
      'direction': 'x',
      'maxAngle': 20,
      'threshold': 5,
      'attachTo': 'parent'
    };
  }

  componentDidLoad() {
    this.item = this.el.querySelector('ion-item');
    this.list = this.el.closest('ion-list') as HTMLIonListElement;

    this.updateOptions();
  }

  componentDidUnload() {
    this.item = this.list = this.leftOptions = this.rightOptions = null;
  }

  @Method()
  getOpenAmount(): number {
    return this.openAmount;
  }

  @Method()
  getSlidingPercent(): number {
    const openAmount = this.openAmount;
    if (openAmount > 0) {
      return openAmount / this.optsWidthRightSide;
    } else if (openAmount < 0) {
      return openAmount / this.optsWidthLeftSide;
    } else {
      return 0;
    }
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
   *       <ion-button (click)="share(slidingItem)">Share</ion-button>
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
  @Method()
  close() {
    this.setOpenAmount(0, true);
  }

  @Method()
  closeOpened(): boolean {
    return this.list && this.list.closeSlidingItems();
  }

  private updateOptions() {
    const options = this.el.querySelectorAll('ion-item-options');

    let sides = 0;

    // Reset left and right options in case they were removed
    this.leftOptions = this.rightOptions = null;

    for (let i = 0; i < options.length; i++) {
      const option = options.item(i);

      if (option.isRightSide()) {
        this.rightOptions = option;
        sides |= ItemSide.Right;
      } else {
        this.leftOptions = option;
        sides |= ItemSide.Left;
      }
    }
    this.optsDirty = true;
    this.sides = sides;
  }

  private canStart(): boolean {
    const selected = this.list && this.list.getOpenedItem();
    if (selected && selected !== this) {
      this.closeOpened();
      return false;
    }
    return true;
  }

  private onDragStart() {
    this.list && this.list.setOpenedItem(this);

    if (this.tmr) {
      clearTimeout(this.tmr);
      this.tmr = null;
    }
    if (this.openAmount === 0) {
      this.optsDirty = true;
      this.state = SlidingState.Enabled;
    }
    this.initialOpenAmount = this.openAmount;
    this.item.style.transition = 'none';
  }

  private onDragMove(gesture: GestureDetail) {
    if (this.optsDirty) {
      this.calculateOptsWidth();
    }
    let openAmount = this.initialOpenAmount - gesture.deltaX;

    switch (this.sides) {
      case ItemSide.Right: openAmount = Math.max(0, openAmount); break;
      case ItemSide.Left: openAmount = Math.min(0, openAmount); break;
      case ItemSide.Both: break;
      case ItemSide.None: return;
      default: console.warn('invalid ItemSideFlags value', this.sides); break;
    }

    let optsWidth;
    if (openAmount > this.optsWidthRightSide) {
      optsWidth = this.optsWidthRightSide;
      openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;

    } else if (openAmount < -this.optsWidthLeftSide) {
      optsWidth = -this.optsWidthLeftSide;
      openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;
    }

    this.setOpenAmount(openAmount, false);
  }

  private onDragEnd(gesture: GestureDetail) {
    const velocity = gesture.velocityX;

    let restingPoint = (this.openAmount > 0)
      ? this.optsWidthRightSide
      : -this.optsWidthLeftSide;

    // Check if the drag didn't clear the buttons mid-point
    // and we aren't moving fast enough to swipe open
    const isResetDirection = (this.openAmount > 0) === !(velocity < 0);
    const isMovingFast = Math.abs(velocity) > 0.3;
    const isOnCloseZone = Math.abs(this.openAmount) < Math.abs(restingPoint / 2);
    if (swipeShouldReset(isResetDirection, isMovingFast, isOnCloseZone)) {
      restingPoint = 0;
    }

    this.setOpenAmount(restingPoint, true);

    if (this.state & SlidingState.SwipeRight) {
      this.rightOptions.fireSwipeEvent(this);
    } else if (this.state & SlidingState.SwipeLeft) {
      this.leftOptions.fireSwipeEvent(this);
    }
  }

  private calculateOptsWidth() {
    this.optsWidthRightSide = 0;
    if (this.rightOptions) {
      this.optsWidthRightSide = this.rightOptions.width();
    }

    this.optsWidthLeftSide = 0;
    if (this.leftOptions) {
      this.optsWidthLeftSide = this.leftOptions.width();
    }
    this.optsDirty = false;
  }

  private setOpenAmount(openAmount: number, isFinal: boolean) {
    if (this.tmr) {
      clearTimeout(this.tmr);
      this.tmr = null;
    }
    const style = this.item.style;
    this.openAmount = openAmount;

    if (isFinal) {
      style.transition = '';

    } else if (openAmount > 0) {
      this.state = (openAmount >= (this.optsWidthRightSide + SWIPE_MARGIN))
        ? SlidingState.Right | SlidingState.SwipeRight
        : SlidingState.Right;

    } else if (openAmount < 0) {
      this.state = (openAmount <= (-this.optsWidthLeftSide - SWIPE_MARGIN))
        ? SlidingState.Left | SlidingState.SwipeLeft
        : SlidingState.Left;
    }

    if (openAmount === 0) {
      this.tmr = setTimeout(() => {
        this.state = SlidingState.Disabled;
        this.tmr = null;
      }, 600);
      this.list && this.list.setOpenedItem(null);
      style.transform = '';
      return;
    }

    style.transform = `translate3d(${-openAmount}px,0,0)`;
    this.ionDrag.emit(this);
  }

  hostData() {
    return {
      class: {
        'item-wrapper': true,
        'active-slide': (this.state !== SlidingState.Disabled),
        'active-options-right': !!(this.state & SlidingState.Right),
        'active-options-left': !!(this.state & SlidingState.Left),
        'active-swipe-right': !!(this.state & SlidingState.SwipeRight),
        'active-swipe-left': !!(this.state & SlidingState.SwipeLeft)
      }
    };
  }

  render() {
    return (
      <ion-gesture {...this.gestureOptions}>
        <slot></slot>
      </ion-gesture>
    );
  }
}
