import { Directive, ElementRef, EventEmitter, Input, NgZone, Optional, Output, Renderer } from '@angular/core';
import { Content } from '../content/content';
import { DomController } from '../../platform/dom-controller';
import { isTrueProperty, reorderArray } from '../../util/util';
import { ItemReorderGesture } from './item-reorder-gesture';
import { Platform } from '../../platform/platform';
export class ReorderIndexes {
    /**
     * @param {?} from
     * @param {?} to
     */
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    /**
     * @param {?} array
     * @return {?}
     */
    applyTo(array) {
        reorderArray(array, this);
    }
}
function ReorderIndexes_tsickle_Closure_declarations() {
    /** @type {?} */
    ReorderIndexes.prototype.from;
    /** @type {?} */
    ReorderIndexes.prototype.to;
}
/**
 * \@name ItemReorder
 * \@description
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
 * \@usage
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
 * \@demo /docs/demos/src/item-reorder/
 * @see {\@link /docs/components#lists List Component Docs}
 * @see {\@link ../../list/List List API Docs}
 * @see {\@link ../Item Item API Docs}
 */
export class ItemReorder {
    /**
     * @param {?} _plt
     * @param {?} _dom
     * @param {?} elementRef
     * @param {?} _rendered
     * @param {?} _zone
     * @param {?} _content
     */
    constructor(_plt, _dom, elementRef, _rendered, _zone, _content) {
        this._plt = _plt;
        this._dom = _dom;
        this._rendered = _rendered;
        this._zone = _zone;
        this._content = _content;
        this._enableReorder = false;
        this._visibleReorder = false;
        this._isStart = false;
        this._lastToIndex = -1;
        /**
         * \@output {object} Emitted when the item is reordered. Emits an object
         * with `from` and `to` properties.
         */
        this.ionItemReorder = new EventEmitter();
        this._element = elementRef.nativeElement;
    }
    /**
     * \@input {string} Which side of the view the ion-reorder should be placed. Default `"end"`.
     * @param {?} side
     * @return {?}
     */
    set side(side) {
        this._isStart = side === 'start';
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        this._element = null;
        this._reorderGesture && this._reorderGesture.destroy();
    }
    /**
     * @hidden
     * @return {?}
     */
    get reorder() {
        return this._enableReorder;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set reorder(val) {
        let /** @type {?} */ enabled = isTrueProperty(val);
        if (!enabled && this._reorderGesture) {
            this._reorderGesture.destroy();
            this._reorderGesture = null;
            this._visibleReorder = false;
            setTimeout(() => this._enableReorder = false, 400);
        }
        else if (enabled && !this._reorderGesture) {
            (void 0) /* console.debug */;
            this._reorderGesture = new ItemReorderGesture(this._plt, this);
            this._enableReorder = true;
            this._dom.write(() => {
                this._zone.run(() => {
                    this._visibleReorder = true;
                });
            }, 16);
        }
    }
    /**
     * @return {?}
     */
    _reorderPrepare() {
        let /** @type {?} */ ele = this._element;
        let /** @type {?} */ children = ele.children;
        for (let /** @type {?} */ i = 0, /** @type {?} */ ilen = children.length; i < ilen; i++) {
            var /** @type {?} */ child = children[i];
            child.$ionIndex = i;
            child.$ionReorderList = ele;
        }
    }
    /**
     * @return {?}
     */
    _reorderStart() {
        this.setElementClass('reorder-list-active', true);
    }
    /**
     * @param {?} fromIndex
     * @param {?} toIndex
     * @return {?}
     */
    _reorderEmit(fromIndex, toIndex) {
        this._reorderReset();
        if (fromIndex !== toIndex) {
            this._zone.run(() => {
                const /** @type {?} */ indexes = new ReorderIndexes(fromIndex, toIndex);
                this.ionItemReorder.emit(indexes);
            });
        }
    }
    /**
     * @param {?} scroll
     * @return {?}
     */
    _scrollContent(scroll) {
        const /** @type {?} */ scrollTop = this._content.scrollTop + scroll;
        if (scroll !== 0) {
            this._content.scrollTo(0, scrollTop, 0);
        }
        return scrollTop;
    }
    /**
     * @return {?}
     */
    _reorderReset() {
        let /** @type {?} */ children = this._element.children;
        let /** @type {?} */ len = children.length;
        this.setElementClass('reorder-list-active', false);
        let /** @type {?} */ transform = this._plt.Css.transform;
        for (let /** @type {?} */ i = 0; i < len; i++) {
            ((children[i])).style[transform] = '';
        }
        this._lastToIndex = -1;
    }
    /**
     * @param {?} fromIndex
     * @param {?} toIndex
     * @param {?} itemHeight
     * @return {?}
     */
    _reorderMove(fromIndex, toIndex, itemHeight) {
        if (this._lastToIndex === -1) {
            this._lastToIndex = fromIndex;
        }
        let /** @type {?} */ lastToIndex = this._lastToIndex;
        this._lastToIndex = toIndex;
        /**
         * ****** DOM READ **********
         */
        let children = this._element.children;
        /**
         * ****** DOM WRITE *********
         */
        let transform = this._plt.Css.transform;
        if (toIndex >= lastToIndex) {
            for (let /** @type {?} */ i = lastToIndex; i <= toIndex; i++) {
                if (i !== fromIndex) {
                    ((children[i])).style[transform] = (i > fromIndex)
                        ? `translateY(${-itemHeight}px)` : '';
                }
            }
        }
        if (toIndex <= lastToIndex) {
            for (let /** @type {?} */ i = toIndex; i <= lastToIndex; i++) {
                if (i !== fromIndex) {
                    ((children[i])).style[transform] = (i < fromIndex)
                        ? `translateY(${itemHeight}px)` : '';
                }
            }
        }
    }
    /**
     * @hidden
     * @param {?} classname
     * @param {?} add
     * @return {?}
     */
    setElementClass(classname, add) {
        this._rendered.setElementClass(this._element, classname, add);
    }
    /**
     * @hidden
     * @return {?}
     */
    getNativeElement() {
        return this._element;
    }
}
ItemReorder.decorators = [
    { type: Directive, args: [{
                selector: 'ion-list[reorder],ion-item-group[reorder]',
                host: {
                    '[class.reorder-enabled]': '_enableReorder',
                    '[class.reorder-visible]': '_visibleReorder',
                    '[class.reorder-side-start]': '_isStart'
                }
            },] },
];
/**
 * @nocollapse
 */
ItemReorder.ctorParameters = () => [
    { type: Platform, },
    { type: DomController, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: NgZone, },
    { type: Content, decorators: [{ type: Optional },] },
];
ItemReorder.propDecorators = {
    'ionItemReorder': [{ type: Output },],
    'side': [{ type: Input, args: ['side',] },],
    'reorder': [{ type: Input },],
};
function ItemReorder_tsickle_Closure_declarations() {
    /** @type {?} */
    ItemReorder.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ItemReorder.ctorParameters;
    /** @type {?} */
    ItemReorder.propDecorators;
    /** @type {?} */
    ItemReorder.prototype._enableReorder;
    /** @type {?} */
    ItemReorder.prototype._visibleReorder;
    /** @type {?} */
    ItemReorder.prototype._isStart;
    /** @type {?} */
    ItemReorder.prototype._reorderGesture;
    /** @type {?} */
    ItemReorder.prototype._lastToIndex;
    /** @type {?} */
    ItemReorder.prototype._element;
    /**
     * \@output {object} Emitted when the item is reordered. Emits an object
     * with `from` and `to` properties.
     * @type {?}
     */
    ItemReorder.prototype.ionItemReorder;
    /** @type {?} */
    ItemReorder.prototype._plt;
    /** @type {?} */
    ItemReorder.prototype._dom;
    /** @type {?} */
    ItemReorder.prototype._rendered;
    /** @type {?} */
    ItemReorder.prototype._zone;
    /** @type {?} */
    ItemReorder.prototype._content;
}
//# sourceMappingURL=item-reorder.js.map