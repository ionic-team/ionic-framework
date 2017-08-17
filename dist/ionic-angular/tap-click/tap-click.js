import { Injectable } from '@angular/core';
import { Activator } from './activator';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { DomController } from '../platform/dom-controller';
import { GestureController } from '../gestures/gesture-controller';
import { Platform } from '../platform/platform';
import { hasPointerMoved, pointerCoord } from '../util/dom';
import { POINTER_EVENT_TYPE_TOUCH } from '../gestures/pointer-events';
import { RippleActivator } from './ripple';
import { UIEventManager } from '../gestures/ui-event-manager';
/**
 * @hidden
 */
var TapClick = (function () {
    /**
     * @param {?} config
     * @param {?} plt
     * @param {?} dom
     * @param {?} app
     * @param {?} gestureCtrl
     */
    function TapClick(config, plt, dom, app, gestureCtrl) {
        this.plt = plt;
        this.app = app;
        this.gestureCtrl = gestureCtrl;
        this.disableClick = 0;
        this.events = new UIEventManager(plt);
        var activator = config.get('activator');
        if (activator === 'ripple') {
            this.activator = new RippleActivator(app, config, dom);
        }
        else if (activator === 'highlight') {
            this.activator = new Activator(app, config, dom);
        }
        this.usePolyfill = config.getBoolean('tapPolyfill');
        (void 0) /* console.debug */;
        var doc = plt.doc();
        this.events.listen(doc, 'click', this.click.bind(this), { passive: false, capture: true });
        this.pointerEvents = this.events.pointerEvents({
            element: doc,
            pointerDown: this.pointerStart.bind(this),
            pointerMove: this.pointerMove.bind(this),
            pointerUp: this.pointerEnd.bind(this),
            passive: true
        });
        this.pointerEvents.mouseWait = DISABLE_NATIVE_CLICK_AMOUNT;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    TapClick.prototype.pointerStart = function (ev) {
        if (this.startCoord) {
            return false;
        }
        if (!this.app.isEnabled()) {
            return false;
        }
        this.lastTouchEnd = 0;
        this.dispatchClick = true;
        if (this.plt.doc() === ev.target) {
            this.startCoord = pointerCoord(ev);
            return true;
        }
        var /** @type {?} */ activatableEle = getActivatableTarget(ev.target);
        if (!activatableEle) {
            this.startCoord = null;
            return false;
        }
        this.startCoord = pointerCoord(ev);
        this.activator && this.activator.downAction(ev, activatableEle, this.startCoord);
        return true;
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    TapClick.prototype.pointerMove = function (ev) {
        if (this.startCoord && this.shouldCancelEvent(ev)) {
            this.pointerCancel(ev);
        }
    };
    /**
     * @param {?} ev
     * @param {?} pointerEventType
     * @return {?}
     */
    TapClick.prototype.pointerEnd = function (ev, pointerEventType) {
        if (!this.dispatchClick)
            return;
        (void 0) /* runInDev */;
        if (!this.startCoord) {
            return;
        }
        if (this.activator && ev.target !== this.plt.doc()) {
            var /** @type {?} */ activatableEle = getActivatableTarget(ev.target);
            if (activatableEle) {
                this.activator.upAction(ev, activatableEle, this.startCoord);
            }
        }
        if (this.usePolyfill && pointerEventType === POINTER_EVENT_TYPE_TOUCH && this.app.isEnabled()) {
            this.handleTapPolyfill(ev);
        }
        this.startCoord = null;
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    TapClick.prototype.pointerCancel = function (ev) {
        (void 0) /* console.debug */;
        this.startCoord = null;
        this.dispatchClick = false;
        this.activator && this.activator.clearState(false);
        this.pointerEvents.stop();
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    TapClick.prototype.shouldCancelEvent = function (ev) {
        return (this.app.isScrolling() ||
            this.gestureCtrl.isCaptured() ||
            hasPointerMoved(POINTER_TOLERANCE, this.startCoord, pointerCoord(ev)));
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    TapClick.prototype.click = function (ev) {
        if (this.shouldCancelClick(ev)) {
            ev.preventDefault();
            ev.stopPropagation();
            return;
        }
        if (this.activator && this.plt.doc() !== ev.target) {
            // cool, a click is gonna happen, let's tell the activator
            // so the element can get the given "active" style
            var /** @type {?} */ activatableEle = getActivatableTarget(ev.target);
            if (activatableEle) {
                this.activator.clickAction(ev, activatableEle, this.startCoord);
            }
        }
        (void 0) /* runInDev */;
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    TapClick.prototype.shouldCancelClick = function (ev) {
        if (this.usePolyfill) {
            if (!ev.isIonicTap && this.isDisabledNativeClick()) {
                (void 0) /* console.debug */;
                return true;
            }
        }
        else if (!this.dispatchClick) {
            (void 0) /* console.debug */;
            return true;
        }
        if (!this.app.isEnabled()) {
            (void 0) /* console.debug */;
            return true;
        }
        if (this.gestureCtrl.isCaptured()) {
            (void 0) /* console.debug */;
            return true;
        }
        return false;
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    TapClick.prototype.profileClickDelay = function (ev) {
        if (this.lastTouchEnd) {
            var /** @type {?} */ diff = Date.now() - this.lastTouchEnd;
            if (diff < 100) {
                (void 0) /* console.debug */;
            }
            else {
                console.warn("SLOW click dispatched. Delay(ms):", diff, ev);
            }
            this.lastTouchEnd = null;
        }
        else {
            (void 0) /* console.debug */;
        }
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    TapClick.prototype.handleTapPolyfill = function (ev) {
        (void 0) /* assert */;
        // only dispatch mouse click events from a touchend event
        // when tapPolyfill config is true, and the startCoordand endCoord
        // are not too far off from each other
        var /** @type {?} */ endCoord = pointerCoord(ev);
        if (hasPointerMoved(POINTER_TOLERANCE, this.startCoord, endCoord)) {
            (void 0) /* console.debug */;
            return;
        }
        // prevent native mouse click events for XX amount of time
        this.disableClick = Date.now() + DISABLE_NATIVE_CLICK_AMOUNT;
        if (this.app.isScrolling()) {
            // do not fire off a click event while the app was scrolling
            (void 0) /* console.debug */;
        }
        else {
            // dispatch a mouse click event
            (void 0) /* console.debug */;
            var /** @type {?} */ clickEvent = this.plt.doc().createEvent('MouseEvents');
            clickEvent.initMouseEvent('click', true, true, this.plt.win(), 1, 0, 0, endCoord.x, endCoord.y, false, false, false, false, 0, null);
            clickEvent.isIonicTap = true;
            ev.target.dispatchEvent(clickEvent);
        }
    };
    /**
     * @return {?}
     */
    TapClick.prototype.isDisabledNativeClick = function () {
        return this.disableClick > Date.now();
    };
    return TapClick;
}());
export { TapClick };
TapClick.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
TapClick.ctorParameters = function () { return [
    { type: Config, },
    { type: Platform, },
    { type: DomController, },
    { type: App, },
    { type: GestureController, },
]; };
function TapClick_tsickle_Closure_declarations() {
    /** @type {?} */
    TapClick.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    TapClick.ctorParameters;
    /** @type {?} */
    TapClick.prototype.disableClick;
    /** @type {?} */
    TapClick.prototype.usePolyfill;
    /** @type {?} */
    TapClick.prototype.activator;
    /** @type {?} */
    TapClick.prototype.startCoord;
    /** @type {?} */
    TapClick.prototype.events;
    /** @type {?} */
    TapClick.prototype.pointerEvents;
    /** @type {?} */
    TapClick.prototype.lastTouchEnd;
    /** @type {?} */
    TapClick.prototype.dispatchClick;
    /** @type {?} */
    TapClick.prototype.plt;
    /** @type {?} */
    TapClick.prototype.app;
    /** @type {?} */
    TapClick.prototype.gestureCtrl;
}
/**
 * @param {?} ele
 * @return {?}
 */
function getActivatableTarget(ele) {
    var /** @type {?} */ targetEle = ele;
    for (var /** @type {?} */ x = 0; x < 10; x++) {
        if (!targetEle)
            break;
        if (isActivatable(targetEle)) {
            return targetEle;
        }
        targetEle = targetEle.parentElement;
    }
    return null;
}
/**
 * @hidden
 * @param {?} ele
 * @return {?}
 */
export function isActivatable(ele) {
    if (ACTIVATABLE_ELEMENTS.indexOf(ele.tagName) > -1) {
        return true;
    }
    for (var /** @type {?} */ i = 0, /** @type {?} */ l = ACTIVATABLE_ATTRIBUTES.length; i < l; i++) {
        if (ele.hasAttribute && ele.hasAttribute(ACTIVATABLE_ATTRIBUTES[i])) {
            return true;
        }
    }
    return false;
}
var /** @type {?} */ ACTIVATABLE_ELEMENTS = ['A', 'BUTTON'];
var /** @type {?} */ ACTIVATABLE_ATTRIBUTES = ['tappable', 'ion-button'];
var /** @type {?} */ POINTER_TOLERANCE = 100;
var /** @type {?} */ DISABLE_NATIVE_CLICK_AMOUNT = 2500;
/**
 * @hidden
 * @param {?} config
 * @param {?} plt
 * @param {?} dom
 * @param {?} app
 * @param {?} gestureCtrl
 * @return {?}
 */
export function setupTapClick(config, plt, dom, app, gestureCtrl) {
    return function () {
        return new TapClick(config, plt, dom, app, gestureCtrl);
    };
}
//# sourceMappingURL=tap-click.js.map