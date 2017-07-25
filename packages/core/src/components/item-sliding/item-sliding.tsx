import { Component, Element, Event, EventEmitter, HostElement, Method, State } from '@stencil/core';

import { GestureDetail } from '../../index';
import { swipeShouldReset } from '../../utils/helpers';

// import { ItemOptions } from './item-options';

const SWIPE_MARGIN = 30;
const ELASTIC_FACTOR = 0.55;

const ITEM_SIDE_FLAG_NONE = 0;
const ITEM_SIDE_FLAG_LEFT = 1 << 0;
const ITEM_SIDE_FLAG_RIGHT = 1 << 1;
const ITEM_SIDE_FLAG_BOTH = ITEM_SIDE_FLAG_LEFT | ITEM_SIDE_FLAG_RIGHT;


const enum SlidingState {
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
 *       <ion-button (click)="favorite(item)">Favorite</ion-button>
 *       <ion-button color="danger" (click)="share(item)">Share</ion-button>
 *     </ion-item-options>
 *
 *     <ion-item-options side="right">
 *       <ion-button (click)="unread(item)">Unread</ion-button>
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
 *   <ion-button (click)="archive(item)">
 *     <ion-icon name="archive"></ion-icon>
 *     Archive
 *   </ion-button>
 * </ion-item-options>
 *
 * <ion-item-options side="left">
 *   <ion-button (click)="archive(item)">
 *     <ion-icon name="archive"></ion-icon>
 *     Archive
 *   </ion-button>
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
 *     <ion-button>Favorite</ion-button>
 *   </ion-item-options>
 * </ion-item-sliding>
 * ```
 *
 * ### Button Layout
 * If an icon is placed with text in the option button, by default it will
 * display the icon on top of the text. This can be changed to display the icon
 * to the left of the text by setting `icon-start` as an attribute on the
 * `<ion-item-options>` element.
 *
 * ```html
 * <ion-item-options icon-start>
 *    <ion-button (click)="archive(item)">
 *      <ion-icon name="archive"></ion-icon>
 *      Archive
 *    </ion-button>
 *  </ion-item-options>
 *
 * ```
 *
 * ### Expandable Options
 *
 * Options can be expanded to take up the full width of the item if you swipe past
 * a certain point. This can be combined with the `ionSwipe` event to call methods
 * on the class.
 *
 * ```html
 *
 * <ion-item-sliding (ionSwipe)="delete(item)">
 *   <ion-item>Item</ion-item>
 *   <ion-item-options>
 *     <ion-button expandable (click)="delete(item)">Delete</ion-button>
 *   </ion-item-options>
 * </ion-item-sliding>
 * ```
 *
 * We can call `delete` by either clicking the button, or by doing a full swipe on the item.
 *
 * @demo /docs/demos/src/item-sliding/
 * @see {@link /docs/components#lists List Component Docs}
 * @see {@link ../Item Item API Docs}
 * @see {@link ../../list/List List API Docs}
 */
@Component({
  tag: 'ion-item-sliding',
  styleUrls: {
    ios: 'item-sliding.ios.scss',
    md: 'item-sliding.md.scss',
    wp: 'item-sliding.wp.scss'
  }
})
export class ItemSliding {
  @Element() private el: HTMLElement;

  private item: HostElement;
  private list: HostElement;

  private openAmount: number = 0;
  private startX: number = 0;
  private optsWidthRightSide: number = 0;
  private optsWidthLeftSide: number = 0;
  private sides: number;
  private tmr: any = null;

  // TODO file with item sliding interfaces & item options implement
  // leftOptions: ItemOptions;
  // rightOptions: ItemOptions;
  private leftOptions: any;
  private rightOptions: any;

  private optsDirty: boolean = true;

  @State() state: SlidingState = SlidingState.Disabled;

  private preSelectedContainer: ItemSliding = null;
  private selectedContainer: ItemSliding = null;
  openContainer: ItemSliding = null;
  private firstCoordX: number;
  private firstTimestamp: number;

  /**
   * @output {event} Emitted when the sliding position changes.
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

  ionViewDidLoad() {
    const options = this.el.querySelectorAll('ion-item-options') as NodeListOf<HostElement>;

    let sides = 0;

    // Reset left and right options in case they were removed
    this.leftOptions = this.rightOptions = null;

    for (var i = 0; i < options.length; i++) {
      let option = options[i].$instance;

      if (option.isRightSide()) {
        this.rightOptions = option;
        sides |= ITEM_SIDE_FLAG_RIGHT;
      } else {
        this.leftOptions = option;
        sides |= ITEM_SIDE_FLAG_LEFT;
      }
    }
    this.optsDirty = true;
    this.sides = sides;

    this.item = this.el.querySelector('ion-item') as HostElement;

    // Get the parent list to close open containers
    this.list = this.el.closest('ion-list') as HostElement;
  }

  canStart(gesture: GestureDetail): boolean {
    if (this.selectedContainer) {
      return false;
    }
    // Get swiped sliding container
    let container = this;

    // Close open container if it is not the selected one.
    if (this.list && container !== this.list.$instance.openContainer) {
      this.closeOpened();
    }

    this.preSelectedContainer = container;
    this.firstCoordX = gesture.currentX;
    this.firstTimestamp = Date.now();

    return true;
  }

  onDragStart(gesture: GestureDetail) {
    this.selectedContainer = this.list.$instance.openContainer = this.preSelectedContainer;
    this.selectedContainer.startSliding(gesture.currentX);
  }

  onDragMove(gesture: GestureDetail) {
    this.selectedContainer && this.selectedContainer.moveSliding(gesture.currentX);
  }

  onDragEnd(gesture: GestureDetail) {
    let coordX = gesture.currentX;
    let deltaX = (coordX - this.firstCoordX);
    let deltaT = (Date.now() - this.firstTimestamp);
    this.selectedContainer.endSliding(deltaX / deltaT);
    this.selectedContainer = null;
    this.preSelectedContainer = null;
  }

  closeOpened(): boolean {
    this.selectedContainer = null;

    if (this.list.$instance.openContainer) {
      this.list.$instance.closeSlidingItems();
      return true;
    }
    return false;
  }

  /**
   * @hidden
   */
  getOpenAmount(): number {
    return this.openAmount;
  }

  /**
   * @hidden
   */
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
   * @hidden
   */
  startSliding(startX: number) {
    if (this.tmr) {
      clearTimeout(this.tmr);
      this.tmr = null;
    }
    if (this.openAmount === 0) {
      this.optsDirty = true;
      this.setState(SlidingState.Enabled);
    }
    this.startX = startX + this.openAmount;
    this.item.style.transition = 'none';
  }

  /**
   * @hidden
   */
  moveSliding(x: number): number {
    if (this.optsDirty) {
      this.calculateOptsWidth();
      return 0;
    }

    let openAmount = (this.startX - x);

    switch (this.sides) {
      case ITEM_SIDE_FLAG_RIGHT: openAmount = Math.max(0, openAmount); break;
      case ITEM_SIDE_FLAG_LEFT: openAmount = Math.min(0, openAmount); break;
      case ITEM_SIDE_FLAG_BOTH: break;
      case ITEM_SIDE_FLAG_NONE: return 0;
      default: console.warn('invalid ItemSideFlags value', this.sides); break;
    }

    if (openAmount > this.optsWidthRightSide) {
      var optsWidth = this.optsWidthRightSide;
      openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;

    } else if (openAmount < -this.optsWidthLeftSide) {
      var optsWidth = -this.optsWidthLeftSide;
      openAmount = optsWidth + (openAmount - optsWidth) * ELASTIC_FACTOR;
    }

    this.setOpenAmount(openAmount, false);
    return openAmount;
  }

  /**
   * @hidden
   */
  endSliding(velocity: number): number {
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
    this.fireSwipeEvent();
    return restingPoint;
  }

  /**
   * @hidden
   * Emit the ionSwipe event on the child options
   */
  fireSwipeEvent() {
    if (this.state & SlidingState.SwipeRight) {
      this.rightOptions.ionSwipe(this);
    } else if (this.state & SlidingState.SwipeLeft) {
      this.leftOptions.ionSwipe(this);
    }
  }

  /**
   * @hidden
   */
  calculateOptsWidth() {
    if (!this.optsDirty) {
      return;
    }
    this.optsWidthRightSide = 0;
    if (this.rightOptions) {
      this.optsWidthRightSide = this.rightOptions.width();
      this.optsWidthRightSide == 0 && console.warn('optsWidthRightSide should not be zero');
    }

    this.optsWidthLeftSide = 0;
    if (this.leftOptions) {
      this.optsWidthLeftSide = this.leftOptions.width();
      this.optsWidthLeftSide == 0 && console.warn('optsWidthLeftSide should not be zero');
    }
    this.optsDirty = false;
  }

  setOpenAmount(openAmount: number, isFinal: boolean) {
    if (this.tmr) {
      clearTimeout(this.tmr);
      this.tmr = null;
    }
    this.openAmount = openAmount;

    if (isFinal) {
      this.item.style.transition = '';

    } else {
      if (openAmount > 0) {
        var state = (openAmount >= (this.optsWidthRightSide + SWIPE_MARGIN))
          ? SlidingState.Right | SlidingState.SwipeRight
          : SlidingState.Right;

        this.setState(state);

      } else if (openAmount < 0) {
        var state = (openAmount <= (-this.optsWidthLeftSide - SWIPE_MARGIN))
          ? SlidingState.Left | SlidingState.SwipeLeft
          : SlidingState.Left;

        this.setState(state);
      }
    }
    if (openAmount === 0) {
      this.tmr = setTimeout(() => {
        this.setState(SlidingState.Disabled);
        this.tmr = null;
      }, 600);
      this.item.style.transform = '';
      return;
    }

    this.item.style.transform = `translate3d(${-openAmount}px,0,0)`;
    this.ionDrag.emit();
  }

  private setState(state: SlidingState) {
    if (state === this.state) {
      return;
    }
    this.state = state;
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
    }
  }

  render() {
    return (

    <ion-gesture props={{
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
    }}>
      <slot></slot>
    </ion-gesture>
    );
  }
}
