(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @param {?} docEle
     * @return {?}
     */
    function getCss(docEle) {
        var /** @type {?} */ css = {};
        // transform
        var /** @type {?} */ i;
        var /** @type {?} */ keys = ['webkitTransform', '-webkit-transform', 'webkit-transform', 'transform'];
        for (i = 0; i < keys.length; i++) {
            if (((docEle.style))[keys[i]] !== undefined) {
                css.transform = keys[i];
                break;
            }
        }
        // transition
        keys = ['webkitTransition', 'transition'];
        for (i = 0; i < keys.length; i++) {
            if (((docEle.style))[keys[i]] !== undefined) {
                css.transition = keys[i];
                break;
            }
        }
        // The only prefix we care about is webkit for transitions.
        var /** @type {?} */ isWebkit = css.transition.indexOf('webkit') > -1;
        // transition duration
        css.transitionDuration = (isWebkit ? '-webkit-' : '') + 'transition-duration';
        // transition timing function
        css.transitionTimingFn = (isWebkit ? '-webkit-' : '') + 'transition-timing-function';
        // transition delay
        css.transitionDelay = (isWebkit ? '-webkit-' : '') + 'transition-delay';
        // To be sure transitionend works everywhere, include *both* the webkit and non-webkit events
        css.transitionEnd = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';
        // transform origin
        css.transformOrigin = (isWebkit ? '-webkit-' : '') + 'transform-origin';
        // animation delay
        css.animationDelay = (isWebkit ? 'webkitAnimationDelay' : 'animationDelay');
        return css;
    }
    exports.getCss = getCss;
    /**
     * @param {?} ev
     * @return {?}
     */
    function pointerCoord(ev) {
        // get coordinates for either a mouse click
        // or a touch depending on the given event
        if (ev) {
            var /** @type {?} */ changedTouches = ev.changedTouches;
            if (changedTouches && changedTouches.length > 0) {
                var /** @type {?} */ touch = changedTouches[0];
                return { x: touch.clientX, y: touch.clientY };
            }
            var /** @type {?} */ pageX = ev.pageX;
            if (pageX !== undefined) {
                return { x: pageX, y: ev.pageY };
            }
        }
        return { x: 0, y: 0 };
    }
    exports.pointerCoord = pointerCoord;
    /**
     * @param {?} threshold
     * @param {?} startCoord
     * @param {?} endCoord
     * @return {?}
     */
    function hasPointerMoved(threshold, startCoord, endCoord) {
        if (startCoord && endCoord) {
            var /** @type {?} */ deltaX = (startCoord.x - endCoord.x);
            var /** @type {?} */ deltaY = (startCoord.y - endCoord.y);
            var /** @type {?} */ distance = deltaX * deltaX + deltaY * deltaY;
            return distance > (threshold * threshold);
        }
        return false;
    }
    exports.hasPointerMoved = hasPointerMoved;
    /**
     * @param {?} ele
     * @return {?}
     */
    function isTextInput(ele) {
        return !!ele &&
            (ele.tagName === 'TEXTAREA' ||
                ele.contentEditable === 'true' ||
                (ele.tagName === 'INPUT' && !(exports.NON_TEXT_INPUT_REGEX.test(ele.type))));
    }
    exports.isTextInput = isTextInput;
    exports.NON_TEXT_INPUT_REGEX = /^(radio|checkbox|range|file|submit|reset|color|image|button)$/i;
    var /** @type {?} */ SKIP_INPUT_ATTR = ['value', 'checked', 'disabled', 'readonly', 'placeholder', 'type', 'class', 'style', 'id', 'autofocus', 'autocomplete', 'autocorrect'];
    /**
     * @param {?} srcElement
     * @param {?} destElement
     * @return {?}
     */
    function copyInputAttributes(srcElement, destElement) {
        // copy attributes from one element to another
        // however, skip over a few of them as they're already
        // handled in the angular world
        var /** @type {?} */ attrs = srcElement.attributes;
        for (var /** @type {?} */ i = 0; i < attrs.length; i++) {
            var /** @type {?} */ attr = attrs[i];
            if (SKIP_INPUT_ATTR.indexOf(attr.name) === -1) {
                destElement.setAttribute(attr.name, attr.value);
            }
        }
    }
    exports.copyInputAttributes = copyInputAttributes;
});
//# sourceMappingURL=dom.js.map