import {ElementRef, onInit} from 'angular2/angular2';

import {Ion} from '../ion';
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
export class List extends Ion {
  constructor(elementRef: ElementRef) {
    super(elementRef);
    this.ele = elementRef.nativeElement;
  }

  onInit() {
    List.applyConfig(this);
    if (util.isDefined(this.virtual)) {
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
