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
 * Item reorder adds the ability to change an item's order in a group.
 * It can be used within an `ion-list` or `ion-item-group` to provide a
 * visual drap and drop interface.
 *
 * ## Grouping Items
 *
 * All reorderable items must be grouped in the same element. If an item
 * should not be reordered, it shouldn't be included in this group. For
 * example, the following code works because the items are grouped in the
 * `<ion-list>`:
 *
 *  ```html
 *  <ion-list reorder="true">
 *    <ion-item *ngFor="let item of items">{% raw %}{{ item }}{% endraw %}</ion-item>
 *  </ion-list>
 *  ```
 *
 * However, the below list includes a header that shouldn't be reordered:
 *
 *  ```html
 *  <ion-list reorder="true">
 *    <ion-list-header>Header</ion-list-header>
 *    <ion-item *ngFor="let item of items">{% raw %}{{ item }}{% endraw %}</ion-item>
 *  </ion-list>
 *  ```
 *
 * In order to mix different sets of items, `ion-item-group` should be used to
 * group the reorderable items:
 *
 *  ```html
 *  <ion-list>
 *    <ion-list-header>Header</ion-list-header>
 *    <ion-item-group reorder="true">
 *      <ion-item *ngFor="let item of items">{% raw %}{{ item }}{% endraw %}</ion-item>
 *    </ion-item-group>
 *  </ion-list>
 *  ```
 *
 * It's important to note that in this example, the `[reorder]` directive is applied to
 * the `<ion-item-group>` instead of the `<ion-list>`. This way makes it possible to
 * mix items that should and shouldn't be reordered.
 *
 *
 * ## Implementing the Reorder Function
 *
 * When the item is dragged and dropped into the new position, the `(ionItemReorder)` event is
 * emitted. This event provides the initial index (from) and the new index (to) of the reordered
 * item. For example, if the first item is dragged to the fifth position, the event will emit
 * `{from: 0, to: 4}`. Note that the index starts at zero.
 *
 * A function should be called when the event is emitted that handles the reordering of the items.
 * See [usage](#usage) below for some examples.
 *
 *
 * @usage
 *
 * ```html
 * <ion-list>
 *   <ion-list-header>Header</ion-list-header>
 *   <ion-item-group reorder="true" (ionItemReorder)="reorderItems($event)">
 *     <ion-item *ngFor="let item of items">{% raw %}{{ item }}{% endraw %}</ion-item>
 *   </ion-item-group>
 * </ion-list>
 * ```
 *
 * ```ts
 * class MyComponent {
 *   items = [];
 *
 *   constructor() {
 *     for (let x = 0; x < 5; x++) {
 *       this.items.push(x);
 *     }
 *   }
 *
 *   reorderItems(indexes) {
 *     let element = this.items[indexes.from];
 *     this.items.splice(indexes.from, 1);
 *     this.items.splice(indexes.to, 0, element);
 *   }
 * }
 * ```
 *
 * Ionic also provides a helper function called `reorderArray` to
 * reorder the array of items. This can be used instead:
 *
 * ```ts
 * import { reorderArray } from 'ionic-angular';
 *
 * class MyComponent {
 *   items = [];
 *
 *   constructor() {
 *     for (let x = 0; x < 5; x++) {
 *       this.items.push(x);
 *     }
 *   }
 *
 *   reorderItems(indexes) {
 *     this.items = reorderArray(this.items, indexes);
 *   }
 * }
 * ```
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

  /**
   * @output {object} The expression to evaluate when the item is reordered. Emits an object
   * with `from` and `to` properties.
   */
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

  /**
   * @private
   */
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
