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
        define(["require", "exports", "../../animations/animation", "../../transitions/transition"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var animation_1 = require("../../animations/animation");
    var transition_1 = require("../../transitions/transition");
    var ToastSlideIn = (function (_super) {
        __extends(ToastSlideIn, _super);
        function ToastSlideIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ToastSlideIn.prototype.init = function () {
            // DOM READS
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ wrapperEle = (ele.querySelector('.toast-wrapper'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, wrapperEle);
            if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_TOP) {
                // top
                // by default, it is -100% hidden (above the screen)
                // so move from that to 10px below top: 0px;
                wrapper.fromTo('translateY', '-100%', 10 + "px");
            }
            else if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_MIDDLE) {
                // Middle
                // just center it and fade it in
                var /** @type {?} */ topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);
                // DOM WRITE
                wrapperEle.style.top = topPosition + "px";
                wrapper.fromTo('opacity', 0.01, 1);
            }
            else {
                // bottom
                // by default, it is 100% hidden (below the screen),
                // so move from that to 10 px above bottom: 0px
                wrapper.fromTo('translateY', '100%', 0 - 10 + "px");
            }
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(wrapper);
        };
        return ToastSlideIn;
    }(transition_1.Transition));
    exports.ToastSlideIn = ToastSlideIn;
    var ToastSlideOut = (function (_super) {
        __extends(ToastSlideOut, _super);
        function ToastSlideOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ToastSlideOut.prototype.init = function () {
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ wrapperEle = (ele.querySelector('.toast-wrapper'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, wrapperEle);
            if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_TOP) {
                // top
                // reverse arguments from enter transition
                wrapper.fromTo('translateY', 10 + "px", '-100%');
            }
            else if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_MIDDLE) {
                // Middle
                // just fade it out
                wrapper.fromTo('opacity', 0.99, 0);
            }
            else {
                // bottom
                // reverse arguments from enter transition
                wrapper.fromTo('translateY', 0 - 10 + "px", '100%');
            }
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add(wrapper);
        };
        return ToastSlideOut;
    }(transition_1.Transition));
    exports.ToastSlideOut = ToastSlideOut;
    var ToastMdSlideIn = (function (_super) {
        __extends(ToastMdSlideIn, _super);
        function ToastMdSlideIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ToastMdSlideIn.prototype.init = function () {
            // DOM reads
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ wrapperEle = ele.querySelector('.toast-wrapper');
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, wrapperEle);
            if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_TOP) {
                // top
                // by default, it is -100% hidden (above the screen)
                // so move from that to top: 0px;
                wrapper.fromTo('translateY', '-100%', "0%");
            }
            else if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_MIDDLE) {
                // Middle
                // just center it and fade it in
                var /** @type {?} */ topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);
                // DOM WRITE
                wrapperEle.style.top = topPosition + "px";
                wrapper.fromTo('opacity', 0.01, 1);
            }
            else {
                // bottom
                // by default, it is 100% hidden (below the screen),
                // so move from that to bottom: 0px
                wrapper.fromTo('translateY', '100%', "0%");
            }
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(wrapper);
        };
        return ToastMdSlideIn;
    }(transition_1.Transition));
    exports.ToastMdSlideIn = ToastMdSlideIn;
    var ToastMdSlideOut = (function (_super) {
        __extends(ToastMdSlideOut, _super);
        function ToastMdSlideOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ToastMdSlideOut.prototype.init = function () {
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ wrapperEle = ele.querySelector('.toast-wrapper');
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, wrapperEle);
            if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_TOP) {
                // top
                // reverse arguments from enter transition
                wrapper.fromTo('translateY', 0 + "%", '-100%');
            }
            else if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_MIDDLE) {
                // Middle
                // just fade it out
                wrapper.fromTo('opacity', 0.99, 0);
            }
            else {
                // bottom
                // reverse arguments from enter transition
                wrapper.fromTo('translateY', 0 + "%", '100%');
            }
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(wrapper);
        };
        return ToastMdSlideOut;
    }(transition_1.Transition));
    exports.ToastMdSlideOut = ToastMdSlideOut;
    var ToastWpPopIn = (function (_super) {
        __extends(ToastWpPopIn, _super);
        function ToastWpPopIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ToastWpPopIn.prototype.init = function () {
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ wrapperEle = ele.querySelector('.toast-wrapper');
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, wrapperEle);
            if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_TOP) {
                // top
                wrapper.fromTo('opacity', 0.01, 1);
                wrapper.fromTo('scale', 1.3, 1);
            }
            else if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_MIDDLE) {
                // Middle
                // just center it and fade it in
                var /** @type {?} */ topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);
                // DOM WRITE
                wrapperEle.style.top = topPosition + "px";
                wrapper.fromTo('opacity', 0.01, 1);
                wrapper.fromTo('scale', 1.3, 1);
            }
            else {
                // bottom
                wrapper.fromTo('opacity', 0.01, 1);
                wrapper.fromTo('scale', 1.3, 1);
            }
            this.easing('cubic-bezier(0,0,0.05,1)').duration(200).add(wrapper);
        };
        return ToastWpPopIn;
    }(transition_1.Transition));
    exports.ToastWpPopIn = ToastWpPopIn;
    var ToastWpPopOut = (function (_super) {
        __extends(ToastWpPopOut, _super);
        function ToastWpPopOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ToastWpPopOut.prototype.init = function () {
            // DOM reads
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ wrapperEle = ele.querySelector('.toast-wrapper');
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, wrapperEle);
            if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_TOP) {
                // top
                // reverse arguments from enter transition
                wrapper.fromTo('opacity', 0.99, 0);
                wrapper.fromTo('scale', 1, 1.3);
            }
            else if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_MIDDLE) {
                // Middle
                // just fade it out
                wrapper.fromTo('opacity', 0.99, 0);
                wrapper.fromTo('scale', 1, 1.3);
            }
            else {
                // bottom
                // reverse arguments from enter transition
                wrapper.fromTo('opacity', 0.99, 0);
                wrapper.fromTo('scale', 1, 1.3);
            }
            // DOM writes
            var /** @type {?} */ EASE = 'ease-out';
            var /** @type {?} */ DURATION = 150;
            this.easing(EASE).duration(DURATION).add(wrapper);
        };
        return ToastWpPopOut;
    }(transition_1.Transition));
    exports.ToastWpPopOut = ToastWpPopOut;
    var /** @type {?} */ TOAST_POSITION_TOP = 'top';
    var /** @type {?} */ TOAST_POSITION_MIDDLE = 'middle';
});
//# sourceMappingURL=toast-transitions.js.map