import {Component, View, ElementRef} from 'angular2/angular2';

import {ItemPrimaryOptions, ItemSecondaryOptions} from './item-options';
import {ItemPrimarySwipeButtons, ItemSecondarySwipeButtons} from './item-swipe-buttons';
import {dom} from 'ionic/util';


@Component({
  selector: 'ion-item',
  host: {
    'class': 'item'
  }
})
@View({
  template: `
    <!--
    <ng-content select="ion-primary-options"></ng-content>
    <ng-content select="ion-primary-swipe-buttons"></ng-content>
    -->
    <div class="item-content">
      <div class="item-media">
      </div>
      <div class="item-accessory">
        <!--<ng-content select="ion-item-accessory"></ng-content>-->
      </div>
      <div class="item-label">
        <ng-content></ng-content>
      </div>
    </div>
    <!--
    <ng-content select="ion-secondary-options"></ng-content>
    <ng-content select="ion-secondary-swipe-buttons"></ng-content>
    -->
  `
  /*
  directives: [
    ItemPrimarySwipeButtons,
    // ItemSecondarySwipeButtons,
    // ItemPrimaryOptions,
    // ItemSecondaryOptions
  ]
  */
})
export class Item {
  constructor(elementRef: ElementRef) {
    this._isOpen = false;
    this._isSlideActive = false;
    this._isTransitioning = false;
    this._transform = '';

    this.ele = elementRef.nativeElement;
    this.swipeButtons = {};
    this.optionButtons = {};
  }
}


class Slideable {
  constructor(slideElement: Element) {
  }

  // override
  onTransform(str: String) {}
  // override
  onTransitionActive(active: Boolean) {}
  //override
  onSlideActive(active: boolean) {}

  transform(str: String) {
    if (arguments.length && str !== this._transform) {
      this.onTransform()
    }
  }

  isTransitionActive(active: Boolean) {
    if (arguments.length && active !== this._isTransitionActive) {
      this._isTransitionActive = active
      this.onSetTransitionActive(active)
    }
    return this._isTransitioning
  }

  isSlideActive(active: Boolean) {
    if (arguments.length && active !== this._isSlideActive) {
      this._isSlideActive = active
      this.onSetDragActive(active)
    }
    return this._isSlideActive
  }

  isOpen(open: Boolean) {
    if (arguments.length && open !== this._isOpen) {
      this.isTransitionActive(true)
      dom.raf(() => {
        this.isOpen = isOpen
        this.onSetIsOpen(open)
      })
    }
  }

}

class ItemSlideGesture {
}
