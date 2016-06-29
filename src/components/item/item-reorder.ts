import { Component, Directive, ElementRef, EventEmitter, forwardRef, Input, NgZone, Renderer, Inject, Optional, Output } from '@angular/core';

import { Content } from '../content/content';
import { CSS } from '../../util/dom';
import { Item } from './item';
import { ItemReorderGesture } from '../item/item-reorder-gesture';
import { isTrueProperty } from '../../util/util';


export interface ReorderIndexes {
  from: number;
  to: number;
}

/**
 * @name ItemReorder
 * @description
 * ItemReorder can be used with `ion-list` or `ion-item-group` to provide a visual
 * drap and drop interface for reordering of items in a list.
 *
 * ## Usage
 * It is very important to follow the rules below in order to integrate reordering in your app.
 *
 * ### All items in a reorder list have to be part of the same set
 * You can not have non-reorderable and reorderable items in the same list or item's group.
 *
 *  ```html
 *  <ion-list reorder="true">
 *    <ion-item *ngFor="let item of items">{{item.name}}</ion-item
 *  </ion-list>
 *  ```
 *
 * **GOOD!**
 *
 *  ```html
 *  <ion-list reorder="true">
 *    <ion-list-header>HEADER</ion-list-header>
 *    <ion-item *ngFor="let item of items">{{item.name}}</ion-item>
 *  </ion-list>
 *  ```
 *
 * **BAD!** There is a `ion-list-header` that is not part of the same set.
 *
 * In order to mix different sets of items, `ion-item-group` has to be used:
 *
 *  ```html
 *  <ion-list>
 *    <ion-list-header>HEADER</ion-list-header>
 *    <ion-item-group reorder="true">
 *      <ion-item *ngFor="let item of items">{{item.name}}</ion-item>
 *    </ion-item-group>
 *  </ion-list>
 *  ```
 *
 * **GOOD!** It's important to notice that in this case, the `[reorder]` directive it applied to `ion-item-group` instead of
 * `ion-list`. This way we are able to have a list-header and satisfy the first gold rule at the same time.
 *
 *
 * ### Implement a reorder function
 *
 * Once the user drags an item and drops it in the new position, this directive fires the `(ionItemReorder)`
 * event providing the initial index (from) and the new index (to) of the reordered item.
 * For example, if an user drags the first item to the 5th position, `(ionItemReorder)` would fire
 * `{from:0, to: 4}` (note that the index starts at zero).
 *
 * In order to integrate reordering in your app, it's a MUST to implement your own function that takes this indexes and perform
 * the actual reordering of the data models. Here's is an example of how this can be done:
 *
 * @usage
 *
 *  ```ts
 * class E2EPage {
 *   items = [];
 *
 *   constructor() {
 *     for (let x = 0; x < 5; x++) {
 *       this.items.push(x);
 *     }
 *   }
 *
 *   reorderItem(indexes) {
 *     let element = this.items[indexes.from];
 *     this.items.splice(indexes.from, 1);
 *     this.items.splice(indexes.to, 0, element);
 *
 *     // For maximum convenience, ionic already provides an helper function:
 *     // import { reorderArray } from 'ionic-angular';
 *     // this.item = reorderArray(this.item, indexes);
 *   }
 * }
 *  ```
 *
 *  ```html
 *  <ion-list>
 *    <ion-list-header>HEADER</ion-list-header>
 *    <ion-item-group reorder="true" (ionItemReorder)="reorderItem($event)">
 *      <ion-item *ngFor="let item of items">Number: {{item}}</ion-item>
 *    </ion-item-group>
 *  </ion-list>
 *  ```
 *
 *
 * @demo /docs/v2/demos/item-reorder/
 * @see {@link /docs/v2/components#lists List Component Docs}
 * @see {@link ../../list/List List API Docs}
 * @see {@link ../Item Item API Docs}
 */
@Directive({
  selector: '[reorder]',
  host: {
    '[class.reorder-enabled]': '_enableReorder',
  }
})
export class ItemReorder {
  private _enableReorder: boolean = false;
  private _reorderGesture: ItemReorderGesture;
  private _lastToIndex: number = -1;
  private _element: HTMLElement;

  @Output() ionItemReorder: EventEmitter<ReorderIndexes> = new EventEmitter<ReorderIndexes>();

  constructor(
    elementRef: ElementRef,
    private _rendered: Renderer,
    private _zone: NgZone,
    @Optional() private _content: Content) {
    this._element = elementRef.nativeElement;
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._element = null;
    this._reorderGesture && this._reorderGesture.destroy();
  }


  @Input()
  get reorder(): boolean {
    return this._enableReorder;
  }
  set reorder(val: boolean) {
    this._enableReorder = isTrueProperty(val);

    if (!this._enableReorder) {
      this._reorderGesture && this._reorderGesture.destroy();
      this._reorderGesture = null;

    } else if (!this._reorderGesture) {
      console.debug('enableReorderItems');
      this._reorderGesture = new ItemReorderGesture(this);
    }
  }

  /**
   * @private
   */
  reorderStart() {
    let children = this._element.children;
    let len = children.length;
    this.setCssClass('reorder-active', true);
    for (let i = 0; i < len; i++) {
      children[i]['$ionIndex'] = i;
    }
  }

  /**
   * @private
   */
  reorderEmit(fromIndex: number, toIndex: number) {
    this.reorderReset();
    if (fromIndex !== toIndex) {
      this._zone.run(() => {
        this.ionItemReorder.emit({
          from: fromIndex,
          to: toIndex,
        });
      });
    }
  }

  /**
   * @private
   */
  scrollContent(scroll: number) {
    let scrollTop = this._content.getScrollTop() + scroll;
    if (scroll !== 0) {
      this._content.scrollTo(0, scrollTop, 0);
    }
    return scrollTop;
  }

  /**
   * @private
   */
  reorderReset() {
    let children = this._element.children;
    let len = children.length;

    this.setCssClass('reorder-active', false);
    let transform = CSS.transform;
    for (let i = 0; i < len; i++) {
      (<any>children[i]).style[transform] = '';
    }
    this._lastToIndex = -1;
  }

  /**
   * @private
   */
  reorderMove(fromIndex: number, toIndex: number, itemHeight: number) {
    if (this._lastToIndex === -1) {
      this._lastToIndex = fromIndex;
    }
    let lastToIndex = this._lastToIndex;
    this._lastToIndex = toIndex;

    // TODO: I think both loops can be merged into a single one
    // but I had no luck last time I tried

    /********* DOM READ ********** */
    let children = this._element.children;

    /********* DOM WRITE ********* */
    let transform = CSS.transform;
    if (toIndex >= lastToIndex) {
      for (var i = lastToIndex; i <= toIndex; i++) {
        if (i !== fromIndex) {
          (<any>children[i]).style[transform] = (i > fromIndex)
            ? `translateY(${-itemHeight}px)` : '';
        }
      }
    }

    if (toIndex <= lastToIndex) {
      for (var i = toIndex; i <= lastToIndex; i++) {
        if (i !== fromIndex) {
          (<any>children[i]).style[transform] = (i < fromIndex)
            ? `translateY(${itemHeight}px)` : '';
        }
      }
    }
  }

  /**
   * @private
   */
  setCssClass(classname: string, add: boolean) {
    this._rendered.setElementClass(this._element, classname, add);
  }

  /**
   * @private
   */
  getNativeElement(): HTMLElement {
    return this._element;
  }
}

/**
 * @private
 */
@Component({
  selector: 'ion-reorder',
  template: `<ion-icon name="menu"></ion-icon>`
})
export class Reorder {
  constructor(
    @Inject(forwardRef(() => Item)) private item: Item,
    private elementRef: ElementRef) {
  }

  ngAfterContentInit() {
    let item = this.item.getNativeElement();
    if (item.parentNode.nodeName === 'ION-ITEM-SLIDING') {
      this.elementRef.nativeElement['$ionReorderNode'] = item.parentNode;
    } else {
      this.elementRef.nativeElement['$ionReorderNode'] = item;
    }
  }


}
