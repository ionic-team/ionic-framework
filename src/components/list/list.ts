import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { ItemSlidingGesture } from '../item/item-sliding-gesture';
import { GestureController } from '../../gestures/gesture-controller';

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
 * @demo /docs/v2/demos/src/list/
 * @see {@link /docs/v2/components#lists List Component Docs}
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
    public _gestureCtrl: GestureController
  ) {
    super(config, elementRef, renderer);

    this.mode = config.get('mode');
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('list', val);
  }

  /**
   * @input {boolean} shouldEnable whether the item-sliding should be enabled or not
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
   * @private
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
      this._slidingGesture = new ItemSlidingGesture(this);
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
   * @private
   */
  destroy() {
    this._slidingGesture && this._slidingGesture.destroy();
  }
}
