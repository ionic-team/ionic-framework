import {Directive, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
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
  constructor(elementRef: ElementRef, ionicConfig: IonicConfig) {
    super(elementRef, ionicConfig);
    this.ele = elementRef.nativeElement;
  }

  onIonInit() {
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


@Directive({
  selector: 'ion-list-header',
  properties: [
    'id'
  ],
  host: {
    '[attr.id]': 'id'
  }
})
export class ListHeader {

}
