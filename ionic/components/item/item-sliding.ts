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
 *     <ion-item (click)="itemTapped(item)">
 *       {{item.title}}
 *     </ion-item>
 *     <ion-item-options>
 *       <button (click)="favorite(item)">Favorite</button>
 *       <button (click)="share(item)">Share</button>
 *     </ion-item-options>
 *   </ion-item>
 * </ion-list>
 * ```
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

  constructor(@Optional() private list: List, elementRef: ElementRef) {
    list.enableSlidingItems(true);
    elementRef.nativeElement.$ionSlide = ++slideIds;
  }

/**
 * @private
 */
  close() {
    this.list.closeSlidingItems();
  }

}

let slideIds = 0;
