import { Directive, ElementRef, EventEmitter, Input, NgZone, Optional, Output, Renderer } from '@angular/core';

import { Content } from '../content/content';
import { DomController } from '../../platform/dom-controller';
import { isTrueProperty, reorderArray } from '../../util/util';
import { ItemReorderGesture, ItemReorderGestureDelegate } from './item-reorder-gesture';
import { Platform } from '../../platform/platform';


export class ReorderIndexes {
  constructor(public from: number, public to: number) {}

  applyTo(array: any) {
    reorderArray(array, this);
  }
}

/**
 * @name ItemReorder
 * @description
 * Item reorder adds the ability to change an item's order in a group.
 * It can be used within an `ion-list` or `ion-item-group` to provide a
 * visual drag and drop interface.
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
 * Alternatevely you can execute helper function inside template:
 *
 * ```html
 * <ion-list>
 *   <ion-list-header>Header</ion-list-header>
 *   <ion-item-group reorder="true" (ionItemReorder)="$event.applyTo(items)">
 *     <ion-item *ngFor="let item of items">{% raw %}{{ item }}{% endraw %}</ion-item>
 *   </ion-item-group>
 * </ion-list>
 * ```
 *
 * @demo /docs/demos/src/item-reorder/
 * @see {@link /docs/components#lists List Component Docs}
 * @see {@link ../../list/List List API Docs}
 * @see {@link ../Item Item API Docs}
 */
@Directive({
  selector: 'ion-list[reorder],ion-item-group[reorder]',
  host: {
    '[class.reorder-enabled]': '_enableReorder',
    '[class.reorder-visible]': '_visibleReorder',
    '[class.reorder-side-start]': '_isStart'
  }
})
export class ItemReorder implements ItemReorderGestureDelegate {

  _enableReorder: boolean = false;
  _visibleReorder: boolean = false;
  _isStart: boolean = false;
  _reorderGesture: ItemReorderGesture;
  _lastToIndex: number = -1;
  _element: HTMLElement;

  /**
   * @output {object} Emitted when the item is reordered. Emits an object
   * with `from` and `to` properties.
   */
  @Output() ionItemReorder: EventEmitter<ReorderIndexes> = new EventEmitter<ReorderIndexes>();

  /**
   * @input {string} Which side of the view the ion-reorder should be placed. Default `"end"`.
   */
  @Input('side')
  set side(side: 'start' | 'end') {
    this._isStart = side === 'start';
  }

  constructor(
    private _plt: Platform,
    private _dom: DomController,
    elementRef: ElementRef,
    private _rendered: Renderer,
    private _zone: NgZone,
    @Optional() private _content: Content
  ) {
    this._element = elementRef.nativeElement;
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    this._element = null;
    this._reorderGesture && this._reorderGesture.destroy();
  }

  /**
   * @hidden
   */
  @Input()
  get reorder(): boolean {
    return this._enableReorder;
  }
  set reorder(val: boolean) {
    let enabled = isTrueProperty(val);

    if (!enabled && this._reorderGesture) {
      this._reorderGesture.destroy();
      this._reorderGesture = null;

      this._visibleReorder = false;
      setTimeout(() => this._enableReorder = false, 400);

    } else if (enabled && !this._reorderGesture) {
      console.debug('enableReorderItems');
      this._reorderGesture = new ItemReorderGesture(this._plt, this);

      this._enableReorder = true;

      this._dom.write(() => {
        this._zone.run(() => {
          this._visibleReorder = true;
        });
      }, 16);
    }
  }

  _reorderPrepare() {
    let ele = this._element;
    let children: any = ele.children;
    for (let i = 0, ilen = children.length; i < ilen; i++) {
      var child = children[i];
      child.$ionIndex = i;
      child.$ionReorderList = ele;
    }
  }

  _reorderStart() {
    this.setElementClass('reorder-list-active', true);
  }

  _reorderEmit(fromIndex: number, toIndex: number) {
    this._reorderReset();
    if (fromIndex !== toIndex) {
      this._zone.run(() => {
        const indexes = new ReorderIndexes(fromIndex, toIndex);
        this.ionItemReorder.emit(indexes);
      });
    }
  }

  _scrollContent(scroll: number) {
    const scrollTop = this._content.scrollTop + scroll;
    if (scroll !== 0) {
      this._content.scrollTo(0, scrollTop, 0);
    }
    return scrollTop;
  }

  _reorderReset() {
    let children = this._element.children;
    let len = children.length;

    this.setElementClass('reorder-list-active', false);
    let transform = this._plt.Css.transform;
    for (let i = 0; i < len; i++) {
      (<any>children[i]).style[transform] = '';
    }
    this._lastToIndex = -1;
  }

  _reorderMove(fromIndex: number, toIndex: number, itemHeight: number) {
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
    let transform = this._plt.Css.transform;
    if (toIndex >= lastToIndex) {
      for (let i = lastToIndex; i <= toIndex; i++) {
        if (i !== fromIndex) {
          (<any>children[i]).style[transform] = (i > fromIndex)
            ? `translateY(${-itemHeight}px)` : '';
        }
      }
    }

    if (toIndex <= lastToIndex) {
      for (let i = toIndex; i <= lastToIndex; i++) {
        if (i !== fromIndex) {
          (<any>children[i]).style[transform] = (i < fromIndex)
            ? `translateY(${itemHeight}px)` : '';
        }
      }
    }
  }

  /**
   * @hidden
   */
  setElementClass(classname: string, add: boolean) {
    this._rendered.setElementClass(this._element, classname, add);
  }

  /**
   * @hidden
   */
  getNativeElement(): HTMLElement {
    return this._element;
  }
}
