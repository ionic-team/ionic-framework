import {Component, Directive, View, ElementRef, NgIf, ViewQuery, QueryList} from 'angular2/angular2';

import * as util from 'ionic/util';


/**
 * Creates a list-item that can easily be swiped,
 * deleted, reordered, edited, and more.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item *ng-for="#item of items" (click)="itemTapped($event, item)">
 *     {{item.title}}
 *     <ion-note item-right>
 *       {{item.note}}
 *     </ion-note>
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
    '<ng-content select="ion-item-options"></ng-content>' +
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
