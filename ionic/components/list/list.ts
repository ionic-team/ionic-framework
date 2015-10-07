import {Directive, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicDirective} from '../../config/decorators';
import {ListVirtualScroll} from './virtual';
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
@IonicDirective({
  selector: 'ion-list',
  inputs: [
    'items',
    'virtual',
    'content'
  ]
})
export class List extends Ion {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   */
  constructor(elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);
    this.ele = elementRef.nativeElement;
  }
  /**
   * TODO
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
   * TODO
   */
  _initVirtualScrolling() {
    if(!this.content) {
      return;
    }

    this._virtualScrollingManager = new ListVirtualScroll(this);
  }

  /**
   * TODO
   * @param {TODO} item  TODO
   */
  setItemTemplate(item) {
    this.itemTemplate = item;
  }

  /**
   * Keeps track of any open item (a sliding item, for example), to close it later
   */
  setOpenItem(item) {
    this.openItem = item;
  }
  closeOpenItem() {
    if(this.openItem) {
      this.openItem.close(true);
      this.openItem = null;
    }
  }
  getOpenItem() {
    return this.openItem;
  }
}

/**
 * TODO
 */
@Directive({
  selector: 'ion-header',
  inputs: [
    'id'
  ],
  host: {
    '[attr.id]': 'id'
  }
})
export class ListHeader {

}
