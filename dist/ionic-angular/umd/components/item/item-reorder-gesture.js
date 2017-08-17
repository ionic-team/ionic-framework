(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./item-reorder-util", "../../util/dom", "../../gestures/ui-event-manager"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var item_reorder_util_1 = require("./item-reorder-util");
    var dom_1 = require("../../util/dom");
    var ui_event_manager_1 = require("../../gestures/ui-event-manager");
    /**
     * @hidden
     */
    var ItemReorderGesture = (function () {
        /**
         * @param {?} plt
         * @param {?} reorderList
         */
        function ItemReorderGesture(plt, reorderList) {
            this.plt = plt;
            this.reorderList = reorderList;
            this.selectedItemEle = null;
            this.events = new ui_event_manager_1.UIEventManager(plt);
            this.events.pointerEvents({
                element: this.reorderList.getNativeElement(),
                pointerDown: this.onDragStart.bind(this),
                pointerMove: this.onDragMove.bind(this),
                pointerUp: this.onDragEnd.bind(this),
                zone: false
            });
        }
        /**
         * @param {?} ev
         * @return {?}
         */
        ItemReorderGesture.prototype.onDragStart = function (ev) {
            if (this.selectedItemEle) {
                return false;
            }
            var /** @type {?} */ reorderElement = ev.target;
            if (reorderElement.nodeName !== 'ION-REORDER') {
                return false;
            }
            var /** @type {?} */ reorderMark = reorderElement['$ionComponent'];
            if (!reorderMark) {
                console.error('ion-reorder does not contain $ionComponent');
                return false;
            }
            this.reorderList._reorderPrepare();
            var /** @type {?} */ item = reorderMark.getReorderNode();
            if (!item) {
                console.error('reorder node not found');
                return false;
            }
            ev.preventDefault();
            // Preparing state
            this.selectedItemEle = item;
            this.selectedItemHeight = item.offsetHeight;
            this.lastYcoord = -100;
            this.lastToIndex = item_reorder_util_1.indexForItem(item);
            this.windowHeight = this.plt.height() - AUTO_SCROLL_MARGIN;
            this.lastScrollPosition = this.reorderList._scrollContent(0);
            this.offset = dom_1.pointerCoord(ev);
            this.offset.y += this.lastScrollPosition;
            item.classList.add(ITEM_REORDER_ACTIVE);
            this.reorderList._reorderStart();
            return true;
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        ItemReorderGesture.prototype.onDragMove = function (ev) {
            var /** @type {?} */ selectedItem = this.selectedItemEle;
            if (!selectedItem) {
                return;
            }
            ev.preventDefault();
            // Get coordinate
            var /** @type {?} */ coord = dom_1.pointerCoord(ev);
            var /** @type {?} */ posY = coord.y;
            // Scroll if we reach the scroll margins
            var /** @type {?} */ scrollPosition = this.scroll(posY);
            // Only perform hit test if we moved at least 30px from previous position
            if (Math.abs(posY - this.lastYcoord) > 30) {
                var /** @type {?} */ overItem = this.itemForCoord(coord);
                if (overItem) {
                    var /** @type {?} */ toIndex = item_reorder_util_1.indexForItem(overItem);
                    if (toIndex !== undefined && (toIndex !== this.lastToIndex || this.emptyZone)) {
                        var /** @type {?} */ fromIndex = item_reorder_util_1.indexForItem(selectedItem);
                        this.lastToIndex = toIndex;
                        this.lastYcoord = posY;
                        this.emptyZone = false;
                        this.reorderList._reorderMove(fromIndex, toIndex, this.selectedItemHeight);
                    }
                }
                else {
                    this.emptyZone = true;
                }
            }
            // Update selected item position
            var /** @type {?} */ ydiff = Math.round(posY - this.offset.y + scrollPosition);
            ((selectedItem.style))[this.plt.Css.transform] = "translateY(" + ydiff + "px)";
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        ItemReorderGesture.prototype.onDragEnd = function (ev) {
            var _this = this;
            var /** @type {?} */ selectedItem = this.selectedItemEle;
            if (!selectedItem) {
                return;
            }
            if (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            var /** @type {?} */ toIndex = this.lastToIndex;
            var /** @type {?} */ fromIndex = item_reorder_util_1.indexForItem(selectedItem);
            var /** @type {?} */ reorderInactive = function () {
                _this.selectedItemEle.style.transition = '';
                _this.selectedItemEle.classList.remove(ITEM_REORDER_ACTIVE);
                _this.selectedItemEle = null;
            };
            if (toIndex === fromIndex) {
                selectedItem.style.transition = 'transform 200ms ease-in-out';
                setTimeout(reorderInactive, 200);
            }
            else {
                reorderInactive();
            }
            this.reorderList._reorderEmit(fromIndex, toIndex);
        };
        /**
         * @param {?} coord
         * @return {?}
         */
        ItemReorderGesture.prototype.itemForCoord = function (coord) {
            var /** @type {?} */ sideOffset = this.reorderList._isStart === this.plt.isRTL ? -100 : 100;
            var /** @type {?} */ x = this.offset.x + sideOffset;
            var /** @type {?} */ y = coord.y;
            var /** @type {?} */ element = this.plt.getElementFromPoint(x, y);
            return item_reorder_util_1.findReorderItem(element, this.reorderList.getNativeElement());
        };
        /**
         * @param {?} posY
         * @return {?}
         */
        ItemReorderGesture.prototype.scroll = function (posY) {
            if (posY < AUTO_SCROLL_MARGIN) {
                this.lastScrollPosition = this.reorderList._scrollContent(-SCROLL_JUMP);
            }
            else if (posY > this.windowHeight) {
                this.lastScrollPosition = this.reorderList._scrollContent(SCROLL_JUMP);
            }
            return this.lastScrollPosition;
        };
        /**
         * @hidden
         * @return {?}
         */
        ItemReorderGesture.prototype.destroy = function () {
            this.onDragEnd(null);
            this.events.destroy();
            this.events = null;
            this.reorderList = null;
        };
        return ItemReorderGesture;
    }());
    exports.ItemReorderGesture = ItemReorderGesture;
    function ItemReorderGesture_tsickle_Closure_declarations() {
        /** @type {?} */
        ItemReorderGesture.prototype.selectedItemEle;
        /** @type {?} */
        ItemReorderGesture.prototype.selectedItemHeight;
        /** @type {?} */
        ItemReorderGesture.prototype.offset;
        /** @type {?} */
        ItemReorderGesture.prototype.lastToIndex;
        /** @type {?} */
        ItemReorderGesture.prototype.lastYcoord;
        /** @type {?} */
        ItemReorderGesture.prototype.lastScrollPosition;
        /** @type {?} */
        ItemReorderGesture.prototype.emptyZone;
        /** @type {?} */
        ItemReorderGesture.prototype.windowHeight;
        /** @type {?} */
        ItemReorderGesture.prototype.events;
        /** @type {?} */
        ItemReorderGesture.prototype.plt;
        /** @type {?} */
        ItemReorderGesture.prototype.reorderList;
    }
    var /** @type {?} */ AUTO_SCROLL_MARGIN = 60;
    var /** @type {?} */ SCROLL_JUMP = 10;
    var /** @type {?} */ ITEM_REORDER_ACTIVE = 'reorder-active';
});
//# sourceMappingURL=item-reorder-gesture.js.map