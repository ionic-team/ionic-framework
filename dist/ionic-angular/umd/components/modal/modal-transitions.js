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
        define(["require", "exports", "../../animations/animation", "../../transitions/page-transition"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var animation_1 = require("../../animations/animation");
    var page_transition_1 = require("../../transitions/page-transition");
    /**
     * Animations for modals
     */
    var ModalSlideIn = (function (_super) {
        __extends(ModalSlideIn, _super);
        function ModalSlideIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ModalSlideIn.prototype.init = function () {
            _super.prototype.init.call(this);
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ backdropEle = ele.querySelector('ion-backdrop');
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, backdropEle);
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.modal-wrapper'));
            wrapper.beforeStyles({ 'opacity': 1 });
            wrapper.fromTo('translateY', '100%', '0%');
            backdrop.fromTo('opacity', 0.01, 0.4);
            this
                .element(this.enteringView.pageRef())
                .easing('cubic-bezier(0.36,0.66,0.04,1)')
                .duration(400)
                .add(backdrop)
                .add(wrapper);
        };
        return ModalSlideIn;
    }(page_transition_1.PageTransition));
    exports.ModalSlideIn = ModalSlideIn;
    var ModalSlideOut = (function (_super) {
        __extends(ModalSlideOut, _super);
        function ModalSlideOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ModalSlideOut.prototype.init = function () {
            _super.prototype.init.call(this);
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapperEle = (ele.querySelector('.modal-wrapper'));
            var /** @type {?} */ wrapperEleRect = wrapperEle.getBoundingClientRect();
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, wrapperEle);
            // height of the screen - top of the container tells us how much to scoot it down
            // so it's off-screen
            wrapper.fromTo('translateY', '0px', this.plt.height() - wrapperEleRect.top + "px");
            backdrop.fromTo('opacity', 0.4, 0.0);
            this
                .element(this.leavingView.pageRef())
                .easing('ease-out')
                .duration(250)
                .add(backdrop)
                .add(wrapper);
        };
        return ModalSlideOut;
    }(page_transition_1.PageTransition));
    exports.ModalSlideOut = ModalSlideOut;
    var ModalMDSlideIn = (function (_super) {
        __extends(ModalMDSlideIn, _super);
        function ModalMDSlideIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ModalMDSlideIn.prototype.init = function () {
            _super.prototype.init.call(this);
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.modal-wrapper'));
            backdrop.fromTo('opacity', 0.01, 0.4);
            wrapper.fromTo('translateY', '40px', '0px');
            wrapper.fromTo('opacity', 0.01, 1);
            var /** @type {?} */ DURATION = 280;
            var /** @type {?} */ EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
            this.element(this.enteringView.pageRef()).easing(EASING).duration(DURATION)
                .add(backdrop)
                .add(wrapper);
        };
        return ModalMDSlideIn;
    }(page_transition_1.PageTransition));
    exports.ModalMDSlideIn = ModalMDSlideIn;
    var ModalMDSlideOut = (function (_super) {
        __extends(ModalMDSlideOut, _super);
        function ModalMDSlideOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ModalMDSlideOut.prototype.init = function () {
            _super.prototype.init.call(this);
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.modal-wrapper'));
            backdrop.fromTo('opacity', 0.4, 0.0);
            wrapper.fromTo('translateY', '0px', '40px');
            wrapper.fromTo('opacity', 0.99, 0);
            this
                .element(this.leavingView.pageRef())
                .duration(200)
                .easing('cubic-bezier(0.47,0,0.745,0.715)')
                .add(wrapper)
                .add(backdrop);
        };
        return ModalMDSlideOut;
    }(page_transition_1.PageTransition));
    exports.ModalMDSlideOut = ModalMDSlideOut;
});
//# sourceMappingURL=modal-transitions.js.map