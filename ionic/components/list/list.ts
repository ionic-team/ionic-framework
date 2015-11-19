import {Directive, ElementRef, NgZone} from 'angular2/angular2';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {ListVirtualScroll} from './virtual';
import {ItemSlidingGesture} from '../item/item-sliding-gesture';
import * as util from 'ionic/util';

/**
 * The List is a widely used interface element in almost any mobile app, and can include
 * content ranging from basic text all the way to buttons, toggles, icons, and thumbnails.
 *
 * Both the list, which contains items, and the list items themselves can be any HTML
 * element.
 *
 * Using the List and Item components make it easy to support various
 * interaction modes such as swipe to edit, drag to reorder, and removing items.
 *
 */
@Directive({
  selector: 'ion-list',
  inputs: [
    'items',
    'virtual',
    'content'
  ],
  host: {
    'class': 'list'
  }
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
  onInit() {
    super.onInit();

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
  onDestroy() {
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
    if (this._init) {

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
  }

  closeSlidingItems() {
    this.slidingGesture && this.slidingGesture.closeOpened();
  }

  /**
   * @private
   */
  afterViewInit() {
    this._init = true;
    if (this._enableSliding) {
      this.enableSlidingItems(true);
    }
  }
}


@Directive({
  selector: 'ion-header',
  inputs: [
    'id'
  ],
  host: {
    '[attr.id]': 'id'
  }
})
export class ListHeader {}
