import { Attribute, Directive, ElementRef, EventEmitter, Input, NgZone, Optional, Output, Renderer } from '@angular/core';

import { Content } from '../content/content';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { ItemSlidingGesture } from '../item/item-sliding-gesture';
import { ItemReorderGesture } from '../item/item-reorder-gesture';
import { nativeTimeout } from '../../util/dom';

/**
 * The List is a widely used interface element in almost any mobile app,
 * and can include content ranging from basic text all the way to
 * buttons, toggles, icons, and thumbnails.
 *
 * Both the list, which contains items, and the list items themselves
 * can be any HTML element.
 *
 * Using the List and Item components make it easy to support various
 * interaction modes such as swipe to edit, drag to reorder, and
 * removing items.
 *
 * @demo /docs/v2/demos/list/
 * @see {@link /docs/v2/components#lists List Component Docs}
 *
 */
@Directive({
  selector: 'ion-list',
  host: {
    '[class.reorder-enabled]': '_enableReorder',
  }
})
export class List extends Ion {
  private _enableReorder: boolean = false;
  private _enableSliding: boolean = false;
  private _slidingGesture: ItemSlidingGesture;
  private _reorderGesture: ItemReorderGesture;
  private _lastToIndex: number = -1;

  @Output() ionItemReorder: EventEmitter<{ from: number, to: number }> = new EventEmitter<{ from: number, to: number }>();

  constructor(elementRef: ElementRef, private _rendered: Renderer, private _zone: NgZone, @Optional() private _content: Content) {
    super(elementRef);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._slidingGesture && this._slidingGesture.destroy();
    this._reorderGesture && this._reorderGesture.destroy();
  }

  /**
   * Enable the sliding items.
   *
   * ```ts
   * import {Component, ViewChild} from '@angular/core';
   * import {List} from 'ionic-angular';
   *
   * @Component({...})
   * export class MyClass {
   *   @ViewChild(List) list: List;
   *
   *   constructor() { }
   *
   *   stopSliding() {
   *     this.list.enableSlidingItems(false);
   *   }
   * }
   * ```
   * @param {boolean} shouldEnable whether the item-sliding should be enabled or not
   */
  enableSlidingItems(shouldEnable: boolean) {
    if (this._enableSliding === shouldEnable) {
      return;
    }

    this._enableSliding = shouldEnable;
    if (shouldEnable) {
      console.debug('enableSlidingItems');
      nativeTimeout(() => this._slidingGesture = new ItemSlidingGesture(this));
    } else {
      this._slidingGesture && this._slidingGesture.unlisten();
    }
  }

  /**
   * Close the open sliding item.
   *
   * ```ts
   * import {Component, ViewChild} from '@angular/core';
   * import {List} from 'ionic-angular';
   *
   * @Component({...})
   * export class MyClass {
   *   @ViewChild(List) list: List;
   *
   *   constructor() { }
   *
   *   closeItems() {
   *     this.list.closeSlidingItems();
   *   }
   * }
   * ```
   */
  closeSlidingItems() {
    this._slidingGesture && this._slidingGesture.closeOpened();
  }

  setCssClass(classname: string, add: boolean) {
    this._rendered.setElementClass(this.getNativeElement(), classname, add);
  }

  reorderStart() {
    this.setCssClass('reorder-active', true);
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
    let children = this.elementRef.nativeElement.children;
    let len = children.length;
    this.setCssClass('reorder-active', false);
    for (let i = 0; i < len; i++) {
      children[i].style.transform = '';
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
    let children = this.elementRef.nativeElement.children;

    /********* DOM WRITE ********* */
    if (toIndex >= lastToIndex) {
      for (var i = lastToIndex; i <= toIndex; i++) {
        if (i !== fromIndex) {
          children[i].style.transform = (i > fromIndex)
            ? `translateY(${-itemHeight}px)` : '';
        }
      }
    }

    if (toIndex <= lastToIndex) {
      for (var i = toIndex; i <= lastToIndex; i++) {
        if (i !== fromIndex) {
          children[i].style.transform = (i < fromIndex)
            ? `translateY(${itemHeight}px)` : '';
        }
      }
    }
  }

  @Input()
  get reorder(): boolean {
    return this._enableReorder;
  }

  set reorder(val: boolean) {
    let enabled = isTrueProperty(val);
    if (this._enableReorder === enabled) {
      return;
    }

    this._enableReorder = enabled;
    if (enabled) {
      console.debug('enableReorderItems');
      nativeTimeout(() => this._reorderGesture = new ItemReorderGesture(this));

    } else {
      this._reorderGesture && this._reorderGesture.destroy();
    }
  }

}


/**
 * @private
 */
@Directive({
  selector: 'ion-list-header'
})
export class ListHeader {
  constructor(private _renderer: Renderer, private _elementRef: ElementRef, @Attribute('id') private _id: string) { }

  public get id(): string {
    return this._id;
  }

  public set id(val: string) {
    this._id = val;
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'id', val);
  }
}
