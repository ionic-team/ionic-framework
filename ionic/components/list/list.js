import {ElementRef} from 'angular2/angular2'
import {onInit} from 'angular2/src/core/annotations_impl/annotations';

import {IonicDirective} from 'ionic/config/component'
import {ListVirtualScroll} from './virtual'

import * as util from 'ionic/util';


@IonicDirective(List)
export class List {

  static get config() {
    return {
      selector: 'ion-list',
      properties: [
        'items',
        'virtual',
        'content'
      ]
    }
  }

  constructor(elementRef: ElementRef) {
    this.domElement = elementRef.domElement;
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
