import { Attribute, Directive, ElementRef, EventEmitter, Input, NgZone, Optional, Output, Renderer } from '@angular/core';

import { Content } from '../content/content';
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
 * @demo /docs/v2/demos/list/
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
    elementRef: ElementRef,
    private _rendered: Renderer,
    public _gestureCtrl: GestureController) {
    super(elementRef);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._slidingGesture && this._slidingGesture.destroy();
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
}


/**
 * @private
 */
@Directive({
  selector: 'ion-list-header'
})
export class ListHeader {
  constructor(private _renderer: Renderer, private _elementRef: ElementRef, @Attribute('id') private _id: string) { }

  public get id(): string {
    return this._id;
  }

  public set id(val: string) {
    this._id = val;
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'id', val);
  }
}
