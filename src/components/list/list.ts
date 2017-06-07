import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { ItemSlidingGesture } from '../item/item-sliding-gesture';
import { Platform } from '../../platform/platform';

/**
 * The List is a widely used interface element in almost any mobile app,
 * and can include content ranging from basic text all the way to
 * buttons, toggles, icons, and thumbnails.
 *
 * Both the list, which contains items, and the list items themselves
 * can be any HTML element.
 *
 * Using the List and Item components make it easy to support various
 * interaction modes such as swipe to edit, drag to reorder, and
 * removing items.
 *
 * @demo /docs/demos/src/list/
 * @see {@link /docs/components#lists List Component Docs}
 * @advanced
 *
 * Enable the sliding items.
 *
 * ```ts
 * import { Component, ViewChild } from '@angular/core';
 * import { List } from 'ionic-angular';
 *
 * @Component({...})
 * export class MyClass {
 *   @ViewChild(List) list: List;
 *
 *   constructor() { }
 *
 *   stopSliding() {
 *     this.list.enableSlidingItems(false);
 *   }
 * }
 * ```
 *
 */
@Directive({
  selector: 'ion-list',
})
export class List extends Ion {
  private _enableSliding: boolean = true;
  private _containsSlidingItems: boolean = false;
  private _slidingGesture: ItemSlidingGesture;

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    private _plt: Platform,
    private _gestureCtrl: GestureController,
    private _domCtrl: DomController,
  ) {
    super(config, elementRef, renderer, 'list');
  }

  /**
   * @input {boolean} If true, the sliding items will be enabled.
   */
  @Input()
  get sliding(): boolean {
    return this._enableSliding;
  }
  set sliding(val: boolean) {
    this._enableSliding = isTrueProperty(val);
    this._updateSlidingState();
  }

  /**
   * @hidden
   */
  containsSlidingItem(contains: boolean) {
    this._containsSlidingItems = contains;
    this._updateSlidingState();
  }


  private _updateSlidingState() {
    let shouldSlide = this._enableSliding && this._containsSlidingItems;
    if (!shouldSlide) {
      this._slidingGesture && this._slidingGesture.destroy();
      this._slidingGesture = null;

    } else if (!this._slidingGesture) {
      console.debug('enableSlidingItems');
      this._slidingGesture = new ItemSlidingGesture(this._plt, this, this._gestureCtrl, this._domCtrl);
      this._slidingGesture.listen();
    }
  }

  /**
   * Close any sliding items that are open.
   */
  closeSlidingItems() {
    this._slidingGesture && this._slidingGesture.closeOpened();
  }

  /**
   * @hidden
   */
  destroy() {
    this._slidingGesture && this._slidingGesture.destroy();
  }
}
