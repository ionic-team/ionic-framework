import {Directive, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicDirective} from '../../config/annotations';
import {ListVirtualScroll} from './virtual';
import * as util from 'ionic/util';

/**
 * TODO
 */
@IonicDirective({
  selector: 'ion-list',
  properties: [
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
  onIonInit() {
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
}

/**
 * TODO
 */
@Directive({
  selector: 'ion-header',
  properties: [
    'id'
  ],
  host: {
    '[attr.id]': 'id'
  }
})
export class ListHeader {

}
