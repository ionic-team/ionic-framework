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
import { Animation } from '../../animations/animation';
import { Transition } from '../../transitions/transition';
/**
 * Animations for alerts
 */
var AlertPopIn = (function (_super) {
    __extends(AlertPopIn, _super);
    function AlertPopIn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    AlertPopIn.prototype.init = function () {
        var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        var /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        var /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
        backdrop.fromTo('opacity', 0.01, 0.3);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    };
    return AlertPopIn;
}(Transition));
export { AlertPopIn };
var AlertPopOut = (function (_super) {
    __extends(AlertPopOut, _super);
    function AlertPopOut() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    AlertPopOut.prototype.init = function () {
        var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        var /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        var /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
        backdrop.fromTo('opacity', 0.3, 0);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    };
    return AlertPopOut;
}(Transition));
export { AlertPopOut };
var AlertMdPopIn = (function (_super) {
    __extends(AlertMdPopIn, _super);
    function AlertMdPopIn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    AlertMdPopIn.prototype.init = function () {
        var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        var /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        var /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
        backdrop.fromTo('opacity', 0.01, 0.5);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    };
    return AlertMdPopIn;
}(Transition));
export { AlertMdPopIn };
var AlertMdPopOut = (function (_super) {
    __extends(AlertMdPopOut, _super);
    function AlertMdPopOut() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    AlertMdPopOut.prototype.init = function () {
        var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        var /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        var /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
        backdrop.fromTo('opacity', 0.5, 0);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    };
    return AlertMdPopOut;
}(Transition));
export { AlertMdPopOut };
var AlertWpPopIn = (function (_super) {
    __extends(AlertWpPopIn, _super);
    function AlertWpPopIn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    AlertWpPopIn.prototype.init = function () {
        var /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        var /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        var /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.3, 1);
        backdrop.fromTo('opacity', 0.01, 0.5);
        this
            .easing('cubic-bezier(0,0,0.05,1)')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    };
    return AlertWpPopIn;
}(Transition));
export { AlertWpPopIn };
var AlertWpPopOut = (function (_super) {
    __extends(AlertWpPopOut, _super);
    function AlertWpPopOut() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    AlertWpPopOut.prototype.init = function () {
        var /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        var /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        var /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 1.3);
        backdrop.fromTo('opacity', 0.5, 0);
        this
            .easing('ease-out')
            .duration(150)
            .add(backdrop)
            .add(wrapper);
    };
    return AlertWpPopOut;
}(Transition));
export { AlertWpPopOut };
//# sourceMappingURL=alert-transitions.js.map