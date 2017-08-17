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
    /**
     * Animations for pickers
     */
    var PickerSlideIn = (function (_super) {
        __extends(PickerSlideIn, _super);
        function PickerSlideIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        PickerSlideIn.prototype.init = function () {
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.picker-wrapper'));
            backdrop.fromTo('opacity', 0.01, 0.26);
            wrapper.fromTo('translateY', '100%', '0%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
        };
        return PickerSlideIn;
    }(transition_1.Transition));
    exports.PickerSlideIn = PickerSlideIn;
    var PickerSlideOut = (function (_super) {
        __extends(PickerSlideOut, _super);
        function PickerSlideOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        PickerSlideOut.prototype.init = function () {
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.picker-wrapper'));
            backdrop.fromTo('opacity', 0.26, 0);
            wrapper.fromTo('translateY', '0%', '100%');
            this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
        };
        return PickerSlideOut;
    }(transition_1.Transition));
    exports.PickerSlideOut = PickerSlideOut;
});
//# sourceMappingURL=picker-transitions.js.map