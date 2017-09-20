import { Component, Element, Prop, PropDidChange, State } from '@stencil/core';
import { GestureDetail } from '../../index';
import { reorderArray } from '../../utils/helpers';
import { CSS_PROP } from '../animation-controller/constants';

// const AUTO_SCROLL_MARGIN = 60;
//  const SCROLL_JUMP = 10;
const ITEM_REORDER_ACTIVE = 'reorder-active';


export class ReorderIndexes {
  constructor(public from: number, public to: number) {}

  applyTo(array: any) {
    reorderArray(array, this);
  }
}

/**
 * @name ReorderGroup
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
@Component({
  tag: 'ion-reorder-group',
  styleUrl: 'reorder.scss'
})
export class ReorderGroup {

  private selectedItemEle: HTMLElement = null;
  private selectedItemHeight: number;
  private lastToIndex: number;
  private lastYcoord: number;
  private topOfList: number;
  private cachedHeights: number[] = [];
  private containerEle: HTMLElement;

  @State() _enabled: boolean = false;
  @State() _iconVisible: boolean = false;
  @State() _actived: boolean = false;

  @Element() ele: HTMLElement;

  @Prop() enabled: boolean = false;

  /**
   * @input {string} Which side of the view the ion-reorder should be placed. Default `"end"`.
   */
  @PropDidChange('enabled')
  enabledChanged(enabled: boolean) {
    if (enabled) {
      this._enabled = true;
      Context.dom.raf(() => {
        this._iconVisible = true;
      });
    } else {
      this._iconVisible = false;
      setTimeout(() => this._enabled = false, 400);
    }
  }

  ionViewDidLoad() {
    this.containerEle = this.ele.querySelector('ion-gesture') as HTMLElement;
  }

  ionViewDidUnload() {
    this.onDragEnd();
  }

  private canStart(ev: GestureDetail): boolean {
    if (this.selectedItemEle) {
      return false;
    }
    const target = ev.event.target as HTMLElement;
    const reorderEle = target.closest('[reorderAnchor]') as HTMLElement;
    if (!reorderEle) {
      return false;
    }
    const item = findReorderItem(reorderEle, this.containerEle);
    if (!item) {
      console.error('reorder node not found');
      return false;
    }
    ev.data = item;
    return true;
  }

  private onDragStart(ev: GestureDetail) {
    const item = this.selectedItemEle = ev.data;
    const heights = this.cachedHeights;
    heights.length = 0;
    const ele = this.containerEle;
    const children: any = ele.children;
    if (!children || children.length === 0) {
      return;
    }

    let sum = 0;
    for (let i = 0, ilen = children.length; i < ilen; i++) {
      var child = children[i];
      sum += child.offsetHeight;
      heights.push(sum);
      child.$ionIndex = i;
    }

    this.topOfList = item.getBoundingClientRect().top;
    this._actived = true;
    this.lastYcoord = -100;
    this.lastToIndex = indexForItem(item);
    this.selectedItemHeight = item.offsetHeight;

    item.classList.add(ITEM_REORDER_ACTIVE);
  }

  private onDragMove(ev: GestureDetail) {
    const selectedItem = this.selectedItemEle;
    if (!selectedItem) {
      return;
    }
    // ev.event.preventDefault();

    // // Get coordinate
    const posY = ev.deltaY;

    // Scroll if we reach the scroll margins
    // const scrollPosition = this.scroll(posY);
    // Only perform hit test if we moved at least 30px from previous position
    if (Math.abs(posY - this.lastYcoord) > 30) {
      let toIndex = this.itemIndexForDelta(posY);
      if (toIndex !== undefined && (toIndex !== this.lastToIndex)) {
        let fromIndex = indexForItem(selectedItem);
        this.lastToIndex = toIndex;
        this.lastYcoord = posY;
        this._reorderMove(fromIndex, toIndex, this.selectedItemHeight);
      }
    }

    // Update selected item position
    (selectedItem.style as any)[CSS_PROP.transformProp] = `translateY(${posY}px)`;
  }

  private onDragEnd() {
    this._actived = false;
    const selectedItem = this.selectedItemEle;
    if (!selectedItem) {
      return;
    }
    // if (ev.event) {
    //   ev.event.preventDefault();
    //   ev.event.stopPropagation();
    // }

    const toIndex = this.lastToIndex;
    const fromIndex = indexForItem(selectedItem);

    const ref = (fromIndex < toIndex)
      ? this.containerEle.children[toIndex + 1]
      : this.containerEle.children[toIndex];

    this.containerEle.insertBefore(this.selectedItemEle, ref);

    const children = this.containerEle.children;
    const len = children.length;
    const transform = CSS_PROP.transformProp;
    for (let i = 0; i < len; i++) {
      (children[i] as any).style[transform] = '';
    }

    const reorderInactive = () => {
      this.selectedItemEle.style.transition = '';
      this.selectedItemEle.classList.remove(ITEM_REORDER_ACTIVE);
      this.selectedItemEle = null;
    };
    if (toIndex === fromIndex) {
      selectedItem.style.transition = 'transform 200ms ease-in-out';
      setTimeout(reorderInactive, 200);
    } else {
      reorderInactive();
    }
  }

  private itemIndexForDelta(deltaY: number): number {
    const heights = this.cachedHeights;
    let sum = deltaY + this.topOfList - (this.selectedItemHeight / 2);
    for (var i = 0; i < heights.length; i++) {
      if (heights[i] > sum) {
        return i;
      }
    }
    return null;
  }

  private _reorderMove(fromIndex: number, toIndex: number, itemHeight: number) {
    /********* DOM WRITE ********* */
    const children = this.containerEle.children;
    const transform = CSS_PROP.transformProp;
    for (var i = 0; i < children.length; i++) {
      const style = (children[i] as any).style;
      let value = '';
      if (i > fromIndex && i <= toIndex) {
        value = `translateY(${-itemHeight}px)`;
      } else if (i < fromIndex && i >= toIndex) {
        value = `translateY(${itemHeight}px)`;
      }
      style[transform] = value;
    }
  }

  hostData() {
    return {
      class: {
        'reorder-enabled': this._enabled,
        'reorder-list-active': this._actived,
        'reorder-visible': this._iconVisible
      }
    };
  }

  render() {
    return (
      <ion-gesture props={{
        disableScroll: true,
        canStart: this.canStart.bind(this),
        onStart: this.onDragStart.bind(this),
        onMove: this.onDragMove.bind(this),
        onEnd: this.onDragEnd.bind(this),
        enabled: this.enabled,
        gestureName: 'reorder',
        gesturePriority: 30,
        type: 'pan',
        direction: 'y',
        threshold: 0,
        attachTo: 'parent'
      }}>
        <slot></slot>
      </ion-gesture>
    );
  }
}

/**
 * @hidden
 */
function indexForItem(element: any): number {
  return element['$ionIndex'];
}

/**
 * @hidden
 */
function findReorderItem(node: HTMLElement, container: HTMLElement): HTMLElement {
  let nested = 0;
  let parent;
  while (node && nested < 6) {
    parent = node.parentNode as HTMLElement;
    if (parent === container) {
      return node;
    }
    node = parent;
    nested++;
  }
  return null;
}
