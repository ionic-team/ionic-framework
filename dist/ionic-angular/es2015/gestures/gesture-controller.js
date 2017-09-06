import { Inject, Injectable, forwardRef } from '@angular/core';
import { App } from '../components/app/app';
/**
 * @hidden
 */
export const GESTURE_GO_BACK_SWIPE = 'goback-swipe';
/**
 * @hidden
 */
export const GESTURE_MENU_SWIPE = 'menu-swipe';
/**
 * @hidden
 */
export const GESTURE_ITEM_SWIPE = 'item-swipe';
/**
 * @hidden
 */
export const GESTURE_REFRESHER = 'refresher';
/**
 * @hidden
 */
export const GESTURE_TOGGLE = 'toggle';
/**
 * @hidden
 */
export const GESTURE_PRIORITY_SLIDING_ITEM = -10;
/**
 * @hidden
 */
export const GESTURE_PRIORITY_REFRESHER = 0;
/**
 * @hidden
 */
export const GESTURE_PRIORITY_MENU_SWIPE = 10;
/**
 * @hidden
 */
export const GESTURE_PRIORITY_GO_BACK_SWIPE = 20;
/**
 * @hidden
 */
export const GESTURE_PRIORITY_TOGGLE = 30;
/**
 * @hidden
 */
export const BLOCK_ALL = {
    disable: [GESTURE_MENU_SWIPE, GESTURE_GO_BACK_SWIPE],
    disableScroll: true
};
/**
 * @hidden
 */
export class GestureController {
    /**
     * @param {?} _app
     */
    constructor(_app) {
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
    createGesture(opts) {
        if (!opts.name) {
            throw new Error('name is undefined');
        }
        return new GestureDelegate(opts.name, this.newID(), this, opts.priority || 0, !!opts.disableScroll);
    }
    /**
     * @param {?=} opts
     * @return {?}
     */
    createBlocker(opts = {}) {
        return new BlockerDelegate(this.newID(), this, opts.disable, !!opts.disableScroll);
    }
    /**
     * @return {?}
     */
    newID() {
        let /** @type {?} */ id = this.id;
        this.id++;
        return id;
    }
    /**
     * @param {?} gestureName
     * @param {?} id
     * @param {?} priority
     * @return {?}
     */
    start(gestureName, id, priority) {
        if (!this.canStart(gestureName)) {
            delete this.requestedStart[id];
            return false;
        }
        this.requestedStart[id] = priority;
        return true;
    }
    /**
     * @param {?} gestureName
     * @param {?} id
     * @param {?} priority
     * @return {?}
     */
    capture(gestureName, id, priority) {
        if (!this.start(gestureName, id, priority)) {
            return false;
        }
        let /** @type {?} */ requestedStart = this.requestedStart;
        let /** @type {?} */ maxPriority = -10000;
        for (let /** @type {?} */ gestureID in requestedStart) {
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
    }
    /**
     * @param {?} id
     * @return {?}
     */
    release(id) {
        delete this.requestedStart[id];
        if (this.capturedID && id === this.capturedID) {
            this.capturedID = null;
        }
    }
    /**
     * @param {?} gestureName
     * @param {?} id
     * @return {?}
     */
    disableGesture(gestureName, id) {
        let /** @type {?} */ set = this.disabledGestures[gestureName];
        if (!set) {
            set = new Set();
            this.disabledGestures[gestureName] = set;
        }
        set.add(id);
    }
    /**
     * @param {?} gestureName
     * @param {?} id
     * @return {?}
     */
    enableGesture(gestureName, id) {
        let /** @type {?} */ set = this.disabledGestures[gestureName];
        if (set) {
            set.delete(id);
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    disableScroll(id) {
        let /** @type {?} */ isEnabled = !this.isScrollDisabled();
        this.disabledScroll.add(id);
        if (this._app && isEnabled && this.isScrollDisabled()) {
            (void 0) /* console.debug */;
            this._app._setDisableScroll(true);
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    enableScroll(id) {
        let /** @type {?} */ isDisabled = this.isScrollDisabled();
        this.disabledScroll.delete(id);
        if (this._app && isDisabled && !this.isScrollDisabled()) {
            (void 0) /* console.debug */;
            this._app._setDisableScroll(false);
        }
    }
    /**
     * @param {?} gestureName
     * @return {?}
     */
    canStart(gestureName) {
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
    }
    /**
     * @return {?}
     */
    isCaptured() {
        return !!this.capturedID;
    }
    /**
     * @return {?}
     */
    isScrollDisabled() {
        return this.disabledScroll.size > 0;
    }
    /**
     * @param {?} gestureName
     * @return {?}
     */
    isDisabled(gestureName) {
        let /** @type {?} */ disabled = this.disabledGestures[gestureName];
        return !!(disabled && disabled.size > 0);
    }
}
GestureController.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
GestureController.ctorParameters = () => [
    { type: App, decorators: [{ type: Inject, args: [forwardRef(() => App),] },] },
];
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
export class GestureDelegate {
    /**
     * @param {?} name
     * @param {?} id
     * @param {?} controller
     * @param {?} priority
     * @param {?} disableScroll
     */
    constructor(name, id, controller, priority, disableScroll) {
        this.name = name;
        this.id = id;
        this.controller = controller;
        this.priority = priority;
        this.disableScroll = disableScroll;
    }
    /**
     * @return {?}
     */
    canStart() {
        if (!this.controller) {
            (void 0) /* assert */;
            return false;
        }
        return this.controller.canStart(this.name);
    }
    /**
     * @return {?}
     */
    start() {
        if (!this.controller) {
            (void 0) /* assert */;
            return false;
        }
        return this.controller.start(this.name, this.id, this.priority);
    }
    /**
     * @return {?}
     */
    capture() {
        if (!this.controller) {
            (void 0) /* assert */;
            return false;
        }
        let /** @type {?} */ captured = this.controller.capture(this.name, this.id, this.priority);
        if (captured && this.disableScroll) {
            this.controller.disableScroll(this.id);
        }
        return captured;
    }
    /**
     * @return {?}
     */
    release() {
        if (!this.controller) {
            (void 0) /* assert */;
            return;
        }
        this.controller.release(this.id);
        if (this.disableScroll) {
            this.controller.enableScroll(this.id);
        }
    }
    /**
     * @return {?}
     */
    destroy() {
        this.release();
        this.controller = null;
    }
}
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
export class BlockerDelegate {
    /**
     * @param {?} id
     * @param {?} controller
     * @param {?} disable
     * @param {?} disableScroll
     */
    constructor(id, controller, disable, disableScroll) {
        this.id = id;
        this.controller = controller;
        this.disable = disable;
        this.disableScroll = disableScroll;
        this.blocked = false;
    }
    /**
     * @return {?}
     */
    block() {
        if (!this.controller) {
            (void 0) /* assert */;
            return;
        }
        if (this.disable) {
            this.disable.forEach(gesture => {
                this.controller.disableGesture(gesture, this.id);
            });
        }
        if (this.disableScroll) {
            this.controller.disableScroll(this.id);
        }
        this.blocked = true;
    }
    /**
     * @return {?}
     */
    unblock() {
        if (!this.controller) {
            (void 0) /* assert */;
            return;
        }
        if (this.disable) {
            this.disable.forEach(gesture => {
                this.controller.enableGesture(gesture, this.id);
            });
        }
        if (this.disableScroll) {
            this.controller.enableScroll(this.id);
        }
        this.blocked = false;
    }
    /**
     * @return {?}
     */
    destroy() {
        this.unblock();
        this.controller = null;
    }
}
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
//# sourceMappingURL=gesture-controller.js.map