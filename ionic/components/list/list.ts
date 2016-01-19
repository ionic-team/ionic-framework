import {Directive, ElementRef, Renderer, Attribute, NgZone, Input} from 'angular2/core';

import {Ion} from '../ion';
import {ListVirtualScroll} from './virtual';
import {ItemSlidingGesture} from '../item/item-sliding-gesture';
import {isDefined} from '../../util';

/**
 * The List is a widely used interface element in almost any mobile app, and can include
 * content ranging from basic text all the way to buttons, toggles, icons, and thumbnails.
 *
 * Both the list, which contains items, and the list items themselves can be any HTML
 * element.
 *
 * Using the List and Item components make it easy to support various
 * interaction modes such as swipe to edit, drag to reorder, and removing items.
 * @demo /docs/v2/demos/list/
 * @see {@link /docs/v2/components#lists List Component Docs}
 *
 */
@Directive({
  selector: 'ion-list'
})
export class List extends Ion {
  private _enableSliding: boolean = false;
  private _virtualScrollingManager: ListVirtualScroll;

  ele: HTMLElement;
  itemTemplate: any;
  slidingGesture: ItemSlidingGesture;

  @Input() items;
  @Input() virtual;
  @Input() content;

  constructor(elementRef: ElementRef, private zone: NgZone) {
    super(elementRef);
    this.ele = elementRef.nativeElement;
  }

  /**
   * @private
   */
  ngOnInit() {
    if (isDefined(this.virtual)) {
      console.log('Content', this.content);
      console.log('Virtual?', this.virtual);
      console.log('Items?', this.items.length, 'of \'em');
      this._initVirtualScrolling();
    }
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this.ele = null;
    this.slidingGesture && this.slidingGesture.unlisten();
  }

  /**
   * @private
   */
  _initVirtualScrolling() {
    if(!this.content) {
      return;
    }

    this._virtualScrollingManager = new ListVirtualScroll(this);
  }

  /**
   * @private
   */
  setItemTemplate(item: any) {
    this.itemTemplate = item;
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
   * @param {Boolean} shouldEnable whether the item-sliding should be enabled or not
   */
  enableSlidingItems(shouldEnable: boolean) {
    if (this._enableSliding !== shouldEnable) {
      this._enableSliding = shouldEnable;

      if (shouldEnable) {
        console.debug('enableSlidingItems');
        this.zone.runOutsideAngular(() => {
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

  constructor(private _renderer: Renderer, private _elementRef: ElementRef, @Attribute('id') id:string) {
    this._id = id;
  }

  public get id(): string {
    return this._id;
  }

  public set id(val: string) {
    this._id = val;
    this._renderer.setElementAttribute(this._elementRef, 'id', val);
  }

}
