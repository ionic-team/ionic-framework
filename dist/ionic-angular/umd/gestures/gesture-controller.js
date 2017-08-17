(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../components/app/app"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var app_1 = require("../components/app/app");
    /**
     * @hidden
     */
    exports.GESTURE_GO_BACK_SWIPE = 'goback-swipe';
    /**
     * @hidden
     */
    exports.GESTURE_MENU_SWIPE = 'menu-swipe';
    /**
     * @hidden
     */
    exports.GESTURE_ITEM_SWIPE = 'item-swipe';
    /**
     * @hidden
     */
    exports.GESTURE_REFRESHER = 'refresher';
    /**
     * @hidden
     */
    exports.GESTURE_TOGGLE = 'toggle';
    /**
     * @hidden
     */
    exports.GESTURE_PRIORITY_SLIDING_ITEM = -10;
    /**
     * @hidden
     */
    exports.GESTURE_PRIORITY_REFRESHER = 0;
    /**
     * @hidden
     */
    exports.GESTURE_PRIORITY_MENU_SWIPE = 10;
    /**
     * @hidden
     */
    exports.GESTURE_PRIORITY_GO_BACK_SWIPE = 20;
    /**
     * @hidden
     */
    exports.GESTURE_PRIORITY_TOGGLE = 30;
    /**
     * @hidden
     */
    exports.BLOCK_ALL = {
        disable: [exports.GESTURE_MENU_SWIPE, exports.GESTURE_GO_BACK_SWIPE],
        disableScroll: true
    };
    /**
     * @hidden
     */
    var GestureController = (function () {
        /**
         * @param {?} _app
         */
        function GestureController(_app) {
            this._app = _app;
            this.id = 1;
            this.requestedStart = {};
            this.disabledGestures = {};
            this.disabledScroll = new Set();
            this.capturedID = null;
        }
        /**
         * @param {?} opts
         * @return {?}
         */
        GestureController.prototype.createGesture = function (opts) {
            if (!opts.name) {
                throw new Error('name is undefined');
            }
            return new GestureDelegate(opts.name, this.newID(), this, opts.priority || 0, !!opts.disableScroll);
        };
        /**
         * @param {?=} opts
         * @return {?}
         */
        GestureController.prototype.createBlocker = function (opts) {
            if (opts === void 0) { opts = {}; }
            return new BlockerDelegate(this.newID(), this, opts.disable, !!opts.disableScroll);
        };
        /**
         * @return {?}
         */
        GestureController.prototype.newID = function () {
            var /** @type {?} */ id = this.id;
            this.id++;
            return id;
        };
        /**
         * @param {?} gestureName
         * @param {?} id
         * @param {?} priority
         * @return {?}
         */
        GestureController.prototype.start = function (gestureName, id, priority) {
            if (!this.canStart(gestureName)) {
                delete this.requestedStart[id];
                return false;
            }
            this.requestedStart[id] = priority;
            return true;
        };
        /**
         * @param {?} gestureName
         * @param {?} id
         * @param {?} priority
         * @return {?}
         */
        GestureController.prototype.capture = function (gestureName, id, priority) {
            if (!this.start(gestureName, id, priority)) {
                return false;
            }
            var /** @type {?} */ requestedStart = this.requestedStart;
            var /** @type {?} */ maxPriority = -10000;
            for (var /** @type {?} */ gestureID in requestedStart) {
                maxPriority = Math.max(maxPriority, requestedStart[gestureID]);
            }
            if (maxPriority === priority) {
                this.capturedID = id;
                this.requestedStart = {};
                (void 0) /* console.debug */;
                return true;
            }
            delete requestedStart[id];
            (void 0) /* console.debug */;
            return false;
        };
        /**
         * @param {?} id
         * @return {?}
         */
        GestureController.prototype.release = function (id) {
            delete this.requestedStart[id];
            if (this.capturedID && id === this.capturedID) {
                this.capturedID = null;
            }
        };
        /**
         * @param {?} gestureName
         * @param {?} id
         * @return {?}
         */
        GestureController.prototype.disableGesture = function (gestureName, id) {
            var /** @type {?} */ set = this.disabledGestures[gestureName];
            if (!set) {
                set = new Set();
                this.disabledGestures[gestureName] = set;
            }
            set.add(id);
        };
        /**
         * @param {?} gestureName
         * @param {?} id
         * @return {?}
         */
        GestureController.prototype.enableGesture = function (gestureName, id) {
            var /** @type {?} */ set = this.disabledGestures[gestureName];
            if (set) {
                set.delete(id);
            }
        };
        /**
         * @param {?} id
         * @return {?}
         */
        GestureController.prototype.disableScroll = function (id) {
            var /** @type {?} */ isEnabled = !this.isScrollDisabled();
            this.disabledScroll.add(id);
            if (this._app && isEnabled && this.isScrollDisabled()) {
                (void 0) /* console.debug */;
                this._app._setDisableScroll(true);
            }
        };
        /**
         * @param {?} id
         * @return {?}
         */
        GestureController.prototype.enableScroll = function (id) {
            var /** @type {?} */ isDisabled = this.isScrollDisabled();
            this.disabledScroll.delete(id);
            if (this._app && isDisabled && !this.isScrollDisabled()) {
                (void 0) /* console.debug */;
                this._app._setDisableScroll(false);
            }
        };
        /**
         * @param {?} gestureName
         * @return {?}
         */
        GestureController.prototype.canStart = function (gestureName) {
            if (this.capturedID) {
                (void 0) /* console.debug */;
                // a gesture already captured
                return false;
            }
            if (this.isDisabled(gestureName)) {
                (void 0) /* console.debug */;
                return false;
            }
            return true;
        };
        /**
         * @return {?}
         */
        GestureController.prototype.isCaptured = function () {
            return !!this.capturedID;
        };
        /**
         * @return {?}
         */
        GestureController.prototype.isScrollDisabled = function () {
            return this.disabledScroll.size > 0;
        };
        /**
         * @param {?} gestureName
         * @return {?}
         */
        GestureController.prototype.isDisabled = function (gestureName) {
            var /** @type {?} */ disabled = this.disabledGestures[gestureName];
            return !!(disabled && disabled.size > 0);
        };
        return GestureController;
    }());
    GestureController.decorators = [
        { type: core_1.Injectable },
    ];
    /**
     * @nocollapse
     */
    GestureController.ctorParameters = function () { return [
        { type: app_1.App, decorators: [{ type: core_1.Inject, args: [core_1.forwardRef(function () { return app_1.App; }),] },] },
    ]; };
    exports.GestureController = GestureController;
    function GestureController_tsickle_Closure_declarations() {
        /** @type {?} */
        GestureController.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        GestureController.ctorParameters;
        /** @type {?} */
        GestureController.prototype.id;
        /** @type {?} */
        GestureController.prototype.requestedStart;
        /** @type {?} */
        GestureController.prototype.disabledGestures;
        /** @type {?} */
        GestureController.prototype.disabledScroll;
        /** @type {?} */
        GestureController.prototype.capturedID;
        /** @type {?} */
        GestureController.prototype._app;
    }
    /**
     * @hidden
     */
    var GestureDelegate = (function () {
        /**
         * @param {?} name
         * @param {?} id
         * @param {?} controller
         * @param {?} priority
         * @param {?} disableScroll
         */
        function GestureDelegate(name, id, controller, priority, disableScroll) {
            this.name = name;
            this.id = id;
            this.controller = controller;
            this.priority = priority;
            this.disableScroll = disableScroll;
        }
        /**
         * @return {?}
         */
        GestureDelegate.prototype.canStart = function () {
            if (!this.controller) {
                (void 0) /* assert */;
                return false;
            }
            return this.controller.canStart(this.name);
        };
        /**
         * @return {?}
         */
        GestureDelegate.prototype.start = function () {
            if (!this.controller) {
                (void 0) /* assert */;
                return false;
            }
            return this.controller.start(this.name, this.id, this.priority);
        };
        /**
         * @return {?}
         */
        GestureDelegate.prototype.capture = function () {
            if (!this.controller) {
                (void 0) /* assert */;
                return false;
            }
            var /** @type {?} */ captured = this.controller.capture(this.name, this.id, this.priority);
            if (captured && this.disableScroll) {
                this.controller.disableScroll(this.id);
            }
            return captured;
        };
        /**
         * @return {?}
         */
        GestureDelegate.prototype.release = function () {
            if (!this.controller) {
                (void 0) /* assert */;
                return;
            }
            this.controller.release(this.id);
            if (this.disableScroll) {
                this.controller.enableScroll(this.id);
            }
        };
        /**
         * @return {?}
         */
        GestureDelegate.prototype.destroy = function () {
            this.release();
            this.controller = null;
        };
        return GestureDelegate;
    }());
    exports.GestureDelegate = GestureDelegate;
    function GestureDelegate_tsickle_Closure_declarations() {
        /** @type {?} */
        GestureDelegate.prototype.name;
        /** @type {?} */
        GestureDelegate.prototype.id;
        /** @type {?} */
        GestureDelegate.prototype.controller;
        /** @type {?} */
        GestureDelegate.prototype.priority;
        /** @type {?} */
        GestureDelegate.prototype.disableScroll;
    }
    /**
     * @hidden
     */
    var BlockerDelegate = (function () {
        /**
         * @param {?} id
         * @param {?} controller
         * @param {?} disable
         * @param {?} disableScroll
         */
        function BlockerDelegate(id, controller, disable, disableScroll) {
            this.id = id;
            this.controller = controller;
            this.disable = disable;
            this.disableScroll = disableScroll;
            this.blocked = false;
        }
        /**
         * @return {?}
         */
        BlockerDelegate.prototype.block = function () {
            var _this = this;
            if (!this.controller) {
                (void 0) /* assert */;
                return;
            }
            if (this.disable) {
                this.disable.forEach(function (gesture) {
                    _this.controller.disableGesture(gesture, _this.id);
                });
            }
            if (this.disableScroll) {
                this.controller.disableScroll(this.id);
            }
            this.blocked = true;
        };
        /**
         * @return {?}
         */
        BlockerDelegate.prototype.unblock = function () {
            var _this = this;
            if (!this.controller) {
                (void 0) /* assert */;
                return;
            }
            if (this.disable) {
                this.disable.forEach(function (gesture) {
                    _this.controller.enableGesture(gesture, _this.id);
                });
            }
            if (this.disableScroll) {
                this.controller.enableScroll(this.id);
            }
            this.blocked = false;
        };
        /**
         * @return {?}
         */
        BlockerDelegate.prototype.destroy = function () {
            this.unblock();
            this.controller = null;
        };
        return BlockerDelegate;
    }());
    exports.BlockerDelegate = BlockerDelegate;
    function BlockerDelegate_tsickle_Closure_declarations() {
        /** @type {?} */
        BlockerDelegate.prototype.blocked;
        /** @type {?} */
        BlockerDelegate.prototype.id;
        /** @type {?} */
        BlockerDelegate.prototype.controller;
        /** @type {?} */
        BlockerDelegate.prototype.disable;
        /** @type {?} */
        BlockerDelegate.prototype.disableScroll;
    }
});
//# sourceMappingURL=gesture-controller.js.map