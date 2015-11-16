import {Component, ElementRef, Optional} from 'angular2/angular2';

import {List} from '../list/list';


/**
 * @description
 * Creates a list-item that can easily be swiped,
 * deleted, reordered, edited, and more.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item-sliding *ng-for="#item of items">
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

  close() {
    this.list.closeSlidingItems();
  }

}

let slideIds = 0;
