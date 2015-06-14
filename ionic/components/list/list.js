import {Renderer, ElementRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {IonicComponent} from 'ionic/config/component'
import {ListVirtualScroll} from './virtual'

import * as util from 'ionic/util';


@Component({
  selector: 'ion-list',
  properties: [
    'items',
    'virtual',
    'content'
  ]
})
@View({
  template: `<content></content>`
})
export class List {
  constructor(
    elementRef: ElementRef
  ) {
    this.domElement = elementRef.domElement;
    this.config = List.config.invoke(this);

    setTimeout(() => {
      console.log('Content', this.content);
      console.log('Virtual?', this.virtual);
      console.log('Items?', this.items.length, 'of \'em');

      if(util.isDefined(this.virtual)) {
        this._initVirtualScrolling();
      }
    })
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
new IonicComponent(List, {
  propClasses: ['inset']
})
