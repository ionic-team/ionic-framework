import {Directive, ElementRef, Renderer, Attribute, NgZone} from 'angular2/core';

import {Ion} from '../ion';
import {ItemSlidingGesture} from '../item/item-sliding-gesture';

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
 *
 */
@Directive({
  selector: 'ion-list'
})
export class List extends Ion {
  private _enableSliding: boolean = false;

  /**
   * @private
   */
  ele: HTMLElement;

  /**
   * @private
   */
  slidingGesture: ItemSlidingGesture;

  constructor(elementRef: ElementRef, private _zone: NgZone) {
    super(elementRef);
    this.ele = elementRef.nativeElement;
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this.slidingGesture && this.slidingGesture.destroy();
    this.ele = this.slidingGesture = null;
  }

  /**
   * Enable sliding items if your page has them
   *
   * ```ts
   * export class MyClass {
   *    constructor(app: IonicApp){
   *      this.app = app;
   *      this.list = this.app.getComponent('my-list');
   *    }
   *    stopSliding(){
   *      this.list.enableSlidingItems(false);
   *    }
   * }
   * ```
   * @param {boolean} shouldEnable whether the item-sliding should be enabled or not
   */
  enableSlidingItems(shouldEnable: boolean) {
    if (this._enableSliding !== shouldEnable) {
      this._enableSliding = shouldEnable;

      if (shouldEnable) {
        console.debug('enableSlidingItems');
        this._zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.slidingGesture = new ItemSlidingGesture(this, this.ele);
          });
        });

      } else {
        this.slidingGesture && this.slidingGesture.unlisten();
      }
    }
  }

  /**
   * Enable sliding items if your page has
   *
   * ```ts
   * export class MyClass {
   *    constructor(app: IonicApp){
   *      this.app = app;
   *      this.list = this.app.getComponent('my-list');
   *    }
   *    // Here we have some method that will close the items
   *    // when called
   *    closeItmes(){
   *      this.list.closeSlidingItems();
   *    }
   * }
   * ```
   */
  closeSlidingItems() {
    this.slidingGesture && this.slidingGesture.closeOpened();
  }

}


/**
 * @private
 */
@Directive({
  selector: 'ion-list-header'
})
export class ListHeader {
  private _id: string;

  constructor(private _renderer: Renderer, private _elementRef: ElementRef, @Attribute('id') id: string) {
    this._id = id;
  }

  public get id(): string {
    return this._id;
  }

  public set id(val: string) {
    this._id = val;
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'id', val);
  }

}
