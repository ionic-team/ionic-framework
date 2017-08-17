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
     * Animations for loading
     */
    var LoadingPopIn = (function (_super) {
        __extends(LoadingPopIn, _super);
        function LoadingPopIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        LoadingPopIn.prototype.init = function () {
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.loading-wrapper'));
            wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
            backdrop.fromTo('opacity', 0.01, 0.3);
            this
                .easing('ease-in-out')
                .duration(200)
                .add(backdrop)
                .add(wrapper);
        };
        return LoadingPopIn;
    }(transition_1.Transition));
    exports.LoadingPopIn = LoadingPopIn;
    var LoadingPopOut = (function (_super) {
        __extends(LoadingPopOut, _super);
        function LoadingPopOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        LoadingPopOut.prototype.init = function () {
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.loading-wrapper'));
            wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
            backdrop.fromTo('opacity', 0.3, 0);
            this
                .easing('ease-in-out')
                .duration(200)
                .add(backdrop)
                .add(wrapper);
        };
        return LoadingPopOut;
    }(transition_1.Transition));
    exports.LoadingPopOut = LoadingPopOut;
    var LoadingMdPopIn = (function (_super) {
        __extends(LoadingMdPopIn, _super);
        function LoadingMdPopIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        LoadingMdPopIn.prototype.init = function () {
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.loading-wrapper'));
            wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
            backdrop.fromTo('opacity', 0.01, 0.5);
            this
                .easing('ease-in-out')
                .duration(200)
                .add(backdrop)
                .add(wrapper);
        };
        return LoadingMdPopIn;
    }(transition_1.Transition));
    exports.LoadingMdPopIn = LoadingMdPopIn;
    var LoadingMdPopOut = (function (_super) {
        __extends(LoadingMdPopOut, _super);
        function LoadingMdPopOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        LoadingMdPopOut.prototype.init = function () {
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.loading-wrapper'));
            wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
            backdrop.fromTo('opacity', 0.5, 0);
            this
                .easing('ease-in-out')
                .duration(200)
                .add(backdrop)
                .add(wrapper);
        };
        return LoadingMdPopOut;
    }(transition_1.Transition));
    exports.LoadingMdPopOut = LoadingMdPopOut;
    var LoadingWpPopIn = (function (_super) {
        __extends(LoadingWpPopIn, _super);
        function LoadingWpPopIn() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        LoadingWpPopIn.prototype.init = function () {
            var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.loading-wrapper'));
            wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.3, 1);
            backdrop.fromTo('opacity', 0.01, 0.16);
            this
                .easing('cubic-bezier(0,0,0.05,1)')
                .duration(200)
                .add(backdrop)
                .add(wrapper);
        };
        return LoadingWpPopIn;
    }(transition_1.Transition));
    exports.LoadingWpPopIn = LoadingWpPopIn;
    var LoadingWpPopOut = (function (_super) {
        __extends(LoadingWpPopOut, _super);
        function LoadingWpPopOut() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @return {?}
         */
        LoadingWpPopOut.prototype.init = function () {
            var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
            var /** @type {?} */ backdrop = new animation_1.Animation(this.plt, ele.querySelector('ion-backdrop'));
            var /** @type {?} */ wrapper = new animation_1.Animation(this.plt, ele.querySelector('.loading-wrapper'));
            wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 1.3);
            backdrop.fromTo('opacity', 0.16, 0);
            this
                .easing('ease-out')
                .duration(150)
                .add(backdrop)
                .add(wrapper);
        };
        return LoadingWpPopOut;
    }(transition_1.Transition));
    exports.LoadingWpPopOut = LoadingWpPopOut;
});
//# sourceMappingURL=loading-transitions.js.map