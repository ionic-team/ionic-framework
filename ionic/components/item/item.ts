import {Component, Directive, View, ElementRef, NgIf, ViewQuery, QueryList} from 'angular2/angular2';

import {dom} from 'ionic/util';


/**
 * @name ionItem
 * @description
 * Creates a list-item that can easily be swiped,
 * deleted, reordered, edited, and more.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item *ng-for="#item of items" (click)="itemTapped($event, item)">
 *     {{item.title}}
 *     <div class="item-note" item-right>
 *       {{item.note}}
 *     </div>
 *   </ion-item>
 * </ion-list>
 *  ```
 */
@Component({
  selector: 'ion-item,[ion-item]',
  host: {
    'class': 'item'
  }
})
@View({
  template:
    '<ng-content select="[item-left]"></ng-content>' +
    '<ion-item-content>' +
      '<ng-content></ng-content>'+
    '</ion-item-content>' +
    '<ng-content select="[item-right]"></ng-content>',
  directives: [NgIf]
})
export class Item {
  /**
   * TODO
   * @param {ElementRef} elementRef  A reference to the component's DOM element.
   */
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
