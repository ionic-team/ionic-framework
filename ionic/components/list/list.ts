import {Directive, ElementRef, NgZone} from 'angular2/core';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {ListVirtualScroll} from './virtual';
import {ItemSlidingGesture} from '../item/item-sliding-gesture';
import * as util from '../../util';

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
 *
 */
@Directive({
  selector: 'ion-list',
  inputs: [
    'items',
    'virtual',
    'content'
  ]
})
export class List extends Ion {

  constructor(elementRef: ElementRef, config: Config, private zone: NgZone) {
    super(elementRef, config);
    this.ele = elementRef.nativeElement;
    this._enableSliding = false;
  }

  /**
   * @private
   */
  ngOnInit() {
    super.ngOnInit();

    if (util.isDefined(this.virtual)) {
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
  setItemTemplate(item) {
    this.itemTemplate = item;
  }

  enableSlidingItems(shouldEnable) {
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

  closeSlidingItems() {
    this.slidingGesture && this.slidingGesture.closeOpened();
  }

}


/**
 * @private
 */
@Directive({
  selector: 'ion-list-header',
  inputs: [
    'id'
  ],
  host: {
    '[attr.id]': 'id'
  }
})
export class ListHeader {}
