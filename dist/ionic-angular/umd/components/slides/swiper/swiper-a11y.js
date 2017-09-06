(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./swiper-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var swiper_utils_1 = require("./swiper-utils");
    /**
     * @param {?} s
     * @param {?} plt
     * @return {?}
     */
    function initA11y(s, plt) {
        var /** @type {?} */ unregs = [];
        s._liveRegion = plt.doc().createElement('span');
        s._liveRegion.className = swiper_utils_1.CLS.notification;
        s._liveRegion.setAttribute('aria-live', 'assertive');
        s._liveRegion.setAttribute('aria-atomic', 'true');
        s.container.appendChild(s._liveRegion);
        // Setup accessibility
        if (s.nextButton) {
            makeFocusable(s.nextButton);
            addRole(s.nextButton, 'button');
            addLabel(s.nextButton, s.nextSlideMessage);
            plt.registerListener(s.nextButton, 'keydown', function (ev) {
                onEnterKey(s, ev);
            }, { zone: false }, unregs);
        }
        if (s.prevButton) {
            makeFocusable(s.prevButton);
            addRole(s.prevButton, 'button');
            addLabel(s.prevButton, s.prevSlideMessage);
            plt.registerListener(s.prevButton, 'keydown', function (ev) {
                onEnterKey(s, ev);
            }, { zone: false }, unregs);
        }
        return function () {
            unregs.forEach(function (unreg) {
                unreg();
            });
            unregs = null;
            if (s._liveRegion) {
                s._liveRegion.parentElement.removeChild(s._liveRegion);
            }
        };
    }
    exports.initA11y = initA11y;
    /**
     * @param {?} ele
     * @return {?}
     */
    function makeFocusable(ele) {
        ele.setAttribute('tabIndex', '0');
    }
    exports.makeFocusable = makeFocusable;
    /**
     * @param {?} ele
     * @param {?} role
     * @return {?}
     */
    function addRole(ele, role) {
        ele.setAttribute('role', role);
    }
    exports.addRole = addRole;
    /**
     * @param {?} ele
     * @param {?} label
     * @return {?}
     */
    function addLabel(ele, label) {
        ele.setAttribute('aria-label', label);
    }
    exports.addLabel = addLabel;
    /**
     * @param {?} ele
     * @param {?} isDisabled
     * @return {?}
     */
    function ariaDisable(ele, isDisabled) {
        if (isDisabled) {
            ele.setAttribute('aria-disabled', 'true');
        }
        else if (ele.hasAttribute('aria-disabled')) {
            ele.removeAttribute('aria-disabled');
        }
    }
    exports.ariaDisable = ariaDisable;
    /**
     * @param {?} ele
     * @param {?} isHidden
     * @return {?}
     */
    function ariaHidden(ele, isHidden) {
        if (isHidden) {
            ele.setAttribute('aria-hidden', 'true');
        }
        else if (ele.hasAttribute('aria-hidden')) {
            ele.removeAttribute('aria-hidden');
        }
    }
    exports.ariaHidden = ariaHidden;
    /**
     * @param {?} _
     * @param {?} __
     * @return {?}
     */
    function onEnterKey(_, __) {
        // if (event.keyCode !== 13) return;
        // const target: HTMLElement = <any>event.target;
        // if (target.classList.contains(PARAMS.nextButtonClass)) {
        //   if (s.isEnd) {
        //     notify(s, PARAMS.lastSlideMessage);
        //   } else {
        //     notify(s, PARAMS.nextSlideMessage);
        //   }
        // } else if (target.classList.contains(PARAMS.prevButtonClass)) {
        //   if (s.isBeginning) {
        //     notify(s, PARAMS.firstSlideMessage);
        //   } else {
        //     notify(s, PARAMS.prevSlideMessage);
        //   }
        // }
    }
});
// function notify(s: Slides, message: string) {
//   var notification = s._liveRegion;
//   if (notification) {
//     notification.innerHTML = message || '';
//   }
// }
//# sourceMappingURL=swiper-a11y.js.map