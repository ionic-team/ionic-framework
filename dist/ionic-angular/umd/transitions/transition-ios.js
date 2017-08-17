var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../animations/animation", "../util/util", "./page-transition"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var animation_1 = require("../animations/animation");
    var util_1 = require("../util/util");
    var page_transition_1 = require("./page-transition");
    var /** @type {?} */ DURATION = 500;
    var /** @type {?} */ EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
    var /** @type {?} */ OPACITY = 'opacity';
    var /** @type {?} */ TRANSFORM = 'transform';
    var /** @type {?} */ TRANSLATEX = 'translateX';
    var /** @type {?} */ CENTER = '0%';
    var /** @type {?} */ OFF_OPACITY = 0.8;
    var /** @type {?} */ SHOW_BACK_BTN_CSS = 'show-back-button';
    var IOSTransition = (function (_super) {
        __extends(IOSTransition, _super);
        function IOSTransition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        IOSTransition.prototype.init = function () {
            _super.prototype.init.call(this);
            var /** @type {?} */ plt = this.plt;
            var /** @type {?} */ OFF_RIGHT = plt.isRTL ? '-99.5%' : '99.5%';
            var /** @type {?} */ OFF_LEFT = plt.isRTL ? '33%' : '-33%';
            var /** @type {?} */ enteringView = this.enteringView;
            var /** @type {?} */ leavingView = this.leavingView;
            var /** @type {?} */ opts = this.opts;
            this.duration(util_1.isPresent(opts.duration) ? opts.duration : DURATION);
            this.easing(util_1.isPresent(opts.easing) ? opts.easing : EASING);
            var /** @type {?} */ backDirection = (opts.direction === 'back');
            var /** @type {?} */ enteringHasNavbar = (enteringView && enteringView.hasNavbar());
            var /** @type {?} */ leavingHasNavbar = (leavingView && leavingView.hasNavbar());
            if (enteringView) {
                // get the native element for the entering page
                var /** @type {?} */ enteringPageEle = enteringView.pageRef().nativeElement;
                // entering content
                var /** @type {?} */ enteringContent = new animation_1.Animation(plt, enteringView.contentRef());
                enteringContent.element(enteringPageEle.querySelectorAll('ion-header > *:not(ion-navbar),ion-footer > *'));
                this.add(enteringContent);
                if (backDirection) {
                    // entering content, back direction
                    enteringContent
                        .fromTo(TRANSLATEX, OFF_LEFT, CENTER, true)
                        .fromTo(OPACITY, OFF_OPACITY, 1, true);
                }
                else {
                    // entering content, forward direction
                    enteringContent
                        .beforeClearStyles([OPACITY])
                        .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
                }
                if (enteringHasNavbar) {
                    // entering page has a navbar
                    var /** @type {?} */ enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');
                    var /** @type {?} */ enteringNavBar = new animation_1.Animation(plt, enteringNavbarEle);
                    this.add(enteringNavBar);
                    var /** @type {?} */ enteringTitle = new animation_1.Animation(plt, enteringNavbarEle.querySelector('ion-title'));
                    var /** @type {?} */ enteringNavbarItems = new animation_1.Animation(plt, enteringNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));
                    var /** @type {?} */ enteringNavbarBg = new animation_1.Animation(plt, enteringNavbarEle.querySelector('.toolbar-background'));
                    var /** @type {?} */ enteringBackButton = new animation_1.Animation(plt, enteringNavbarEle.querySelector('.back-button'));
                    enteringNavBar
                        .add(enteringTitle)
                        .add(enteringNavbarItems)
                        .add(enteringNavbarBg)
                        .add(enteringBackButton);
                    enteringTitle.fromTo(OPACITY, 0.01, 1, true);
                    enteringNavbarItems.fromTo(OPACITY, 0.01, 1, true);
                    // set properties depending on direction
                    if (backDirection) {
                        // entering navbar, back direction
                        enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);
                        if (enteringView.enableBack()) {
                            // back direction, entering page has a back button
                            enteringBackButton
                                .beforeAddClass(SHOW_BACK_BTN_CSS)
                                .fromTo(OPACITY, 0.01, 1, true);
                        }
                    }
                    else {
                        // entering navbar, forward direction
                        enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
                        enteringNavbarBg
                            .beforeClearStyles([OPACITY])
                            .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
                        if (enteringView.enableBack()) {
                            // forward direction, entering page has a back button
                            enteringBackButton
                                .beforeAddClass(SHOW_BACK_BTN_CSS)
                                .fromTo(OPACITY, 0.01, 1, true);
                            var /** @type {?} */ enteringBackBtnText = new animation_1.Animation(plt, enteringNavbarEle.querySelector('.back-button-text'));
                            enteringBackBtnText.fromTo(TRANSLATEX, (plt.isRTL ? '-100px' : '100px'), '0px');
                            enteringNavBar.add(enteringBackBtnText);
                        }
                        else {
                            enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
                        }
                    }
                }
            }
            // setup leaving view
            if (leavingView && leavingView.pageRef()) {
                // leaving content
                var /** @type {?} */ leavingPageEle = leavingView.pageRef().nativeElement;
                var /** @type {?} */ leavingContent = new animation_1.Animation(plt, leavingView.contentRef());
                leavingContent.element(leavingPageEle.querySelectorAll('ion-header > *:not(ion-navbar),ion-footer > *'));
                this.add(leavingContent);
                if (backDirection) {
                    // leaving content, back direction
                    leavingContent
                        .beforeClearStyles([OPACITY])
                        .fromTo(TRANSLATEX, CENTER, (plt.isRTL ? '-100%' : '100%'));
                }
                else {
                    // leaving content, forward direction
                    leavingContent
                        .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
                        .fromTo(OPACITY, 1, OFF_OPACITY)
                        .afterClearStyles([TRANSFORM, OPACITY]);
                }
                if (leavingHasNavbar) {
                    // leaving page has a navbar
                    var /** @type {?} */ leavingNavbarEle = leavingPageEle.querySelector('ion-navbar');
                    var /** @type {?} */ leavingNavBar = new animation_1.Animation(plt, leavingNavbarEle);
                    var /** @type {?} */ leavingTitle = new animation_1.Animation(plt, leavingNavbarEle.querySelector('ion-title'));
                    var /** @type {?} */ leavingNavbarItems = new animation_1.Animation(plt, leavingNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));
                    var /** @type {?} */ leavingNavbarBg = new animation_1.Animation(plt, leavingNavbarEle.querySelector('.toolbar-background'));
                    var /** @type {?} */ leavingBackButton = new animation_1.Animation(plt, leavingNavbarEle.querySelector('.back-button'));
                    leavingNavBar
                        .add(leavingTitle)
                        .add(leavingNavbarItems)
                        .add(leavingBackButton)
                        .add(leavingNavbarBg);
                    this.add(leavingNavBar);
                    // fade out leaving navbar items
                    leavingBackButton.fromTo(OPACITY, 0.99, 0);
                    leavingTitle.fromTo(OPACITY, 0.99, 0);
                    leavingNavbarItems.fromTo(OPACITY, 0.99, 0);
                    if (backDirection) {
                        // leaving navbar, back direction
                        leavingTitle.fromTo(TRANSLATEX, CENTER, (plt.isRTL ? '-100%' : '100%'));
                        // leaving navbar, back direction, and there's no entering navbar
                        // should just slide out, no fading out
                        leavingNavbarBg
                            .beforeClearStyles([OPACITY])
                            .fromTo(TRANSLATEX, CENTER, (plt.isRTL ? '-100%' : '100%'));
                        var /** @type {?} */ leavingBackBtnText = new animation_1.Animation(plt, leavingNavbarEle.querySelector('.back-button-text'));
                        leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (plt.isRTL ? -300 : 300) + 'px');
                        leavingNavBar.add(leavingBackBtnText);
                    }
                    else {
                        // leaving navbar, forward direction
                        leavingTitle
                            .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
                            .afterClearStyles([TRANSFORM]);
                        leavingBackButton.afterClearStyles([OPACITY]);
                        leavingTitle.afterClearStyles([OPACITY]);
                        leavingNavbarItems.afterClearStyles([OPACITY]);
                    }
                }
            }
        };
        return IOSTransition;
    }(page_transition_1.PageTransition));
    exports.IOSTransition = IOSTransition;
});
//# sourceMappingURL=transition-ios.js.map