(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../content/content", "../../platform/dom-controller", "../../util/util", "./item-reorder-gesture", "../../platform/platform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var content_1 = require("../content/content");
    var dom_controller_1 = require("../../platform/dom-controller");
    var util_1 = require("../../util/util");
    var item_reorder_gesture_1 = require("./item-reorder-gesture");
    var platform_1 = require("../../platform/platform");
    var ReorderIndexes = (function () {
        /**
         * @param {?} from
         * @param {?} to
         */
        function ReorderIndexes(from, to) {
            this.from = from;
            this.to = to;
        }
        /**
         * @param {?} array
         * @return {?}
         */
        ReorderIndexes.prototype.applyTo = function (array) {
            util_1.reorderArray(array, this);
        };
        return ReorderIndexes;
    }());
    exports.ReorderIndexes = ReorderIndexes;
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
    var ItemReorder = (function () {
        /**
         * @param {?} _plt
         * @param {?} _dom
         * @param {?} elementRef
         * @param {?} _rendered
         * @param {?} _zone
         * @param {?} _content
         */
        function ItemReorder(_plt, _dom, elementRef, _rendered, _zone, _content) {
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
            this.ionItemReorder = new core_1.EventEmitter();
            this._element = elementRef.nativeElement;
        }
        Object.defineProperty(ItemReorder.prototype, "side", {
            /**
             * \@input {string} Which side of the view the ion-reorder should be placed. Default `"end"`.
             * @param {?} side
             * @return {?}
             */
            set: function (side) {
                this._isStart = side === 'start';
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * @return {?}
         */
        ItemReorder.prototype.ngOnDestroy = function () {
            this._element = null;
            this._reorderGesture && this._reorderGesture.destroy();
        };
        Object.defineProperty(ItemReorder.prototype, "reorder", {
            /**
             * @hidden
             * @return {?}
             */
            get: function () {
                return this._enableReorder;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                var _this = this;
                var /** @type {?} */ enabled = util_1.isTrueProperty(val);
                if (!enabled && this._reorderGesture) {
                    this._reorderGesture.destroy();
                    this._reorderGesture = null;
                    this._visibleReorder = false;
                    setTimeout(function () { return _this._enableReorder = false; }, 400);
                }
                else if (enabled && !this._reorderGesture) {
                    (void 0) /* console.debug */;
                    this._reorderGesture = new item_reorder_gesture_1.ItemReorderGesture(this._plt, this);
                    this._enableReorder = true;
                    this._dom.write(function () {
                        _this._zone.run(function () {
                            _this._visibleReorder = true;
                        });
                    }, 16);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        ItemReorder.prototype._reorderPrepare = function () {
            var /** @type {?} */ ele = this._element;
            var /** @type {?} */ children = ele.children;
            for (var /** @type {?} */ i = 0, /** @type {?} */ ilen = children.length; i < ilen; i++) {
                var /** @type {?} */ child = children[i];
                child.$ionIndex = i;
                child.$ionReorderList = ele;
            }
        };
        /**
         * @return {?}
         */
        ItemReorder.prototype._reorderStart = function () {
            this.setElementClass('reorder-list-active', true);
        };
        /**
         * @param {?} fromIndex
         * @param {?} toIndex
         * @return {?}
         */
        ItemReorder.prototype._reorderEmit = function (fromIndex, toIndex) {
            var _this = this;
            this._reorderReset();
            if (fromIndex !== toIndex) {
                this._zone.run(function () {
                    var /** @type {?} */ indexes = new ReorderIndexes(fromIndex, toIndex);
                    _this.ionItemReorder.emit(indexes);
                });
            }
        };
        /**
         * @param {?} scroll
         * @return {?}
         */
        ItemReorder.prototype._scrollContent = function (scroll) {
            var /** @type {?} */ scrollTop = this._content.scrollTop + scroll;
            if (scroll !== 0) {
                this._content.scrollTo(0, scrollTop, 0);
            }
            return scrollTop;
        };
        /**
         * @return {?}
         */
        ItemReorder.prototype._reorderReset = function () {
            var /** @type {?} */ children = this._element.children;
            var /** @type {?} */ len = children.length;
            this.setElementClass('reorder-list-active', false);
            var /** @type {?} */ transform = this._plt.Css.transform;
            for (var /** @type {?} */ i = 0; i < len; i++) {
                ((children[i])).style[transform] = '';
            }
            this._lastToIndex = -1;
        };
        /**
         * @param {?} fromIndex
         * @param {?} toIndex
         * @param {?} itemHeight
         * @return {?}
         */
        ItemReorder.prototype._reorderMove = function (fromIndex, toIndex, itemHeight) {
            if (this._lastToIndex === -1) {
                this._lastToIndex = fromIndex;
            }
            var /** @type {?} */ lastToIndex = this._lastToIndex;
            this._lastToIndex = toIndex;
            /**
             * ****** DOM READ **********
             */
            var children = this._element.children;
            /**
             * ****** DOM WRITE *********
             */
            var transform = this._plt.Css.transform;
            if (toIndex >= lastToIndex) {
                for (var /** @type {?} */ i = lastToIndex; i <= toIndex; i++) {
                    if (i !== fromIndex) {
                        ((children[i])).style[transform] = (i > fromIndex)
                            ? "translateY(" + -itemHeight + "px)" : '';
                    }
                }
            }
            if (toIndex <= lastToIndex) {
                for (var /** @type {?} */ i = toIndex; i <= lastToIndex; i++) {
                    if (i !== fromIndex) {
                        ((children[i])).style[transform] = (i < fromIndex)
                            ? "translateY(" + itemHeight + "px)" : '';
                    }
                }
            }
        };
        /**
         * @hidden
         * @param {?} classname
         * @param {?} add
         * @return {?}
         */
        ItemReorder.prototype.setElementClass = function (classname, add) {
            this._rendered.setElementClass(this._element, classname, add);
        };
        /**
         * @hidden
         * @return {?}
         */
        ItemReorder.prototype.getNativeElement = function () {
            return this._element;
        };
        return ItemReorder;
    }());
    ItemReorder.decorators = [
        { type: core_1.Directive, args: [{
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
    ItemReorder.ctorParameters = function () { return [
        { type: platform_1.Platform, },
        { type: dom_controller_1.DomController, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: core_1.NgZone, },
        { type: content_1.Content, decorators: [{ type: core_1.Optional },] },
    ]; };
    ItemReorder.propDecorators = {
        'ionItemReorder': [{ type: core_1.Output },],
        'side': [{ type: core_1.Input, args: ['side',] },],
        'reorder': [{ type: core_1.Input },],
    };
    exports.ItemReorder = ItemReorder;
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
});
//# sourceMappingURL=item-reorder.js.map