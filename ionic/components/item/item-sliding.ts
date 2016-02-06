import {Component, ElementRef, Optional} from 'angular2/core';

import {List} from '../list/list';


/**
 * @name ItemSliding
 *
 * @description
 * Creates a list-item that can easily be swiped, deleted, reordered, edited, and more.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item-sliding *ngFor="#item of items">
 *     <button ion-item (click)="itemTapped(item)">
 *       {{item.title}}
 *     </button>
 *     <ion-item-options>
 *       <button (click)="favorite(item)">Favorite</button>
 *       <button (click)="share(item)">Share</button>
 *     </ion-item-options>
 *   </ion-item-sliding>
 * </ion-list>
 * ```
 * @demo /docs/v2/demos/item-sliding/  
 * @see {@link /docs/v2/components#lists List Component Docs}
 * @see {@link ../../list/List List API Docs}
 */
@Component({
  selector: 'ion-item-sliding',
  template:
    '<ng-content select="ion-item,[ion-item]"></ng-content>' +
    '<ng-content select="ion-item-options"></ng-content>'
})
export class ItemSliding {

  constructor(@Optional() private _list: List, elementRef: ElementRef) {
    _list.enableSlidingItems(true);
    elementRef.nativeElement.$ionSlide = ++slideIds;
  }

  /**
   * @private
   */
  close() {
    this._list.closeSlidingItems();
  }

}

let slideIds = 0;
