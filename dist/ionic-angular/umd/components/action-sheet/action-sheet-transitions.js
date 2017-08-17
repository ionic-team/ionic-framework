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
    var ActionSheetSlideIn = (function (_super) {
        __extends(ActionSheetSlideIn, _super);
        function ActionSheetSlideIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ActionSheetSlideIn.prototype.init = function () {
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.01, 0.4);
            wrapper.fromTo('translateY', '100%', '0%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
        };
        return ActionSheetSlideIn;
    }(transition_1.Transition));
    exports.ActionSheetSlideIn = ActionSheetSlideIn;
    var ActionSheetSlideOut = (function (_super) {
        __extends(ActionSheetSlideOut, _super);
        function ActionSheetSlideOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ActionSheetSlideOut.prototype.init = function () {
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.4, 0);
            wrapper.fromTo('translateY', '0%', '100%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add(backdrop).add(wrapper);
        };
        return ActionSheetSlideOut;
    }(transition_1.Transition));
    exports.ActionSheetSlideOut = ActionSheetSlideOut;
    var ActionSheetMdSlideIn = (function (_super) {
        __extends(ActionSheetMdSlideIn, _super);
        function ActionSheetMdSlideIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ActionSheetMdSlideIn.prototype.init = function () {
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.01, 0.26);
            wrapper.fromTo('translateY', '100%', '0%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
        };
        return ActionSheetMdSlideIn;
    }(transition_1.Transition));
    exports.ActionSheetMdSlideIn = ActionSheetMdSlideIn;
    var ActionSheetMdSlideOut = (function (_super) {
        __extends(ActionSheetMdSlideOut, _super);
        function ActionSheetMdSlideOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ActionSheetMdSlideOut.prototype.init = function () {
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.26, 0);
            wrapper.fromTo('translateY', '0%', '100%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
        };
        return ActionSheetMdSlideOut;
    }(transition_1.Transition));
    exports.ActionSheetMdSlideOut = ActionSheetMdSlideOut;
    var ActionSheetWpSlideIn = (function (_super) {
        __extends(ActionSheetWpSlideIn, _super);
        function ActionSheetWpSlideIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ActionSheetWpSlideIn.prototype.init = function () {
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.01, 0.16);
            wrapper.fromTo('translateY', '100%', '0%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
        };
        return ActionSheetWpSlideIn;
    }(transition_1.Transition));
    exports.ActionSheetWpSlideIn = ActionSheetWpSlideIn;
    var ActionSheetWpSlideOut = (function (_super) {
        __extends(ActionSheetWpSlideOut, _super);
        function ActionSheetWpSlideOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        ActionSheetWpSlideOut.prototype.init = function () {
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
            backdrop.fromTo('opacity', 0.1, 0);
            wrapper.fromTo('translateY', '0%', '100%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
        };
        return ActionSheetWpSlideOut;
    }(transition_1.Transition));
    exports.ActionSheetWpSlideOut = ActionSheetWpSlideOut;
});
//# sourceMappingURL=action-sheet-transitions.js.map