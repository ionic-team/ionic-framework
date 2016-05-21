import {Component, ElementRef, Optional, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';

import {List} from '../list/list';


/**
 * @name ItemSliding
 *
 * @description
 * A sliding item is a list item that can be swiped to reveal buttons. It requires
 * an [Item](../Item) component as a child and a [List](../../list/List) component as
 * a parent. All buttons to reveal can be placed in the `<ion-item-options>` element.
 *
 * ### Button Layout
 * If an icon is placed with text in the option button, by default it will
 * display the icon on top of the text. This can be changed to display the icon
 * to the left of the text by setting `icon-left` as an attribute on the
 * `<ion-item-options>` element.
 *
 * ```html
 * <ion-item-options icon-left>
 *   <button (click)="archive(item)">
 *     <ion-icon name="archive"></ion-icon>
 *     Archive
 *   </button>
 * </ion-item-options>
 * ```
 *
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item-sliding>
 *     <ion-item>
 *       Item
 *     </ion-item>
 *     <ion-item-options>
 *       <button (click)="favorite(item)">Favorite</button>
 *       <button danger (click)="share(item)">Share</button>
 *     </ion-item-options>
 *   </ion-item-sliding>
 * </ion-list>
 * ```
 *
 * @demo /docs/v2/demos/item-sliding/
 * @see {@link /docs/v2/components#lists List Component Docs}
 * @see {@link ../Item Item API Docs}
 * @see {@link ../../list/List List API Docs}
 */
@Component({
  selector: 'ion-item-sliding',
  template:
    '<ng-content select="ion-item,[ion-item]"></ng-content>' +
    '<ng-content select="ion-item-options"></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ItemSliding {

  constructor(@Optional() private _list: List, elementRef: ElementRef) {
    _list.enableSlidingItems(true);
    elementRef.nativeElement.$ionSlide = ++slideIds;
  }

  /**
   * Close the sliding item. Items can also be closed from the [List](../../list/List).
   *
   * The sliding item can be closed by garbbing a reference to `ItemSliding`. In the
   * below example, the template reference variable `slidingItem` is placed on the element
   * and passed to the `share` method.
   *
   * ```html
   * <ion-list>
   *   <ion-item-sliding #slidingItem>
   *     <ion-item>
   *       Item
   *     </ion-item>
   *     <ion-item-options>
   *       <button (click)="share(slidingItem)">Share</button>
   *     </ion-item-options>
   *   </ion-item-sliding>
   * </ion-list>
   * ```
   *
   * ```ts
   * import {Page, ItemSliding} from 'ionic-angular';
   *
   * @Page({})
   * export class MyClass {
   *   constructor() { }
   *
   *   share(slidingItem: ItemSliding) {
   *     slidingItem.close();
   *   }
   * }
   * ```
   */
  close() {
    this._list.closeSlidingItems();
  }

}

let slideIds = 0;
