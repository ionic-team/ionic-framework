import {ElementRef, onInit} from 'angular2/angular2';

import {IonicDirective} from '../../config/annotations';
import {ListVirtualScroll} from './virtual';
import * as util from 'ionic/util';


@IonicDirective({
  selector: 'ion-list',
  properties: [
    'items',
    'virtual',
    'content'
  ]
})
export class List {
  constructor(elementRef: ElementRef) {
    this.ele = elementRef.nativeElement;
  }

  onInit() {
    if(util.isDefined(this.virtual)) {
      console.log('Content', this.content);
      console.log('Virtual?', this.virtual);
      console.log('Items?', this.items.length, 'of \'em');
      this._initVirtualScrolling();
    }
  }

  _initVirtualScrolling() {
    if(!this.content) {
      return;
    }

    this._virtualScrollingManager = new ListVirtualScroll(this);
  }

  setItemTemplate(item) {
    this.itemTemplate = item;
  }
}
