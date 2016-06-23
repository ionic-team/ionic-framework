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
 * @private
 */
@Directive({
  selector: '[reorder]',
  host: {
    '[class.reorder-enabled]': '_enableReorder',
  }
})
export class Reorder {
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
      children[i].style[transform] = '';
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
          children[i].style[transform] = (i > fromIndex)
            ? `translateY(${-itemHeight}px)` : '';
        }
      }
    }

    if (toIndex <= lastToIndex) {
      for (var i = toIndex; i <= lastToIndex; i++) {
        if (i !== fromIndex) {
          children[i].style[transform] = (i < fromIndex)
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
export class ItemReorder {
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
