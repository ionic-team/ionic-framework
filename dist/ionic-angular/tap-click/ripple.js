import { isActivatedDisabled } from './activator-base';
import { Activator } from './activator';
import { hasPointerMoved, pointerCoord } from '../util/dom';
/**
 * @hidden
 */
var RippleActivator = (function () {
    /**
     * @param {?} app
     * @param {?} config
     * @param {?} dom
     */
    function RippleActivator(app, config, dom) {
        this.dom = dom;
        this.highlight = new Activator(app, config, dom);
    }
    /**
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    RippleActivator.prototype.clickAction = function (ev, activatableEle, startCoord) {
        // Highlight
        this.highlight && this.highlight.clickAction(ev, activatableEle, startCoord);
        // Ripple
        this._clickAction(ev, activatableEle, startCoord);
    };
    /**
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    RippleActivator.prototype.downAction = function (ev, activatableEle, startCoord) {
        // Highlight
        this.highlight && this.highlight.downAction(ev, activatableEle, startCoord);
        // Ripple
        this._downAction(ev, activatableEle, startCoord);
    };
    /**
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    RippleActivator.prototype.upAction = function (ev, activatableEle, startCoord) {
        // Highlight
        this.highlight && this.highlight.upAction(ev, activatableEle, startCoord);
        // Ripple
        this._upAction(ev, activatableEle, startCoord);
    };
    /**
     * @param {?} animated
     * @return {?}
     */
    RippleActivator.prototype.clearState = function (animated) {
        // Highlight
        this.highlight && this.highlight.clearState(animated);
    };
    /**
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} _startCoord
     * @return {?}
     */
    RippleActivator.prototype._downAction = function (ev, activatableEle, _startCoord) {
        if (isActivatedDisabled(ev, activatableEle)) {
            return;
        }
        var /** @type {?} */ j = activatableEle.childElementCount;
        while (j--) {
            var /** @type {?} */ rippleEle = activatableEle.children[j];
            if (rippleEle.classList.contains('button-effect')) {
                // DOM READ
                var /** @type {?} */ clientRect = activatableEle.getBoundingClientRect();
                rippleEle.$top = clientRect.top;
                rippleEle.$left = clientRect.left;
                rippleEle.$width = clientRect.width;
                rippleEle.$height = clientRect.height;
                break;
            }
        }
    };
    /**
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    RippleActivator.prototype._upAction = function (ev, activatableEle, startCoord) {
        if (!hasPointerMoved(6, startCoord, pointerCoord(ev))) {
            var /** @type {?} */ i = activatableEle.childElementCount;
            while (i--) {
                var /** @type {?} */ rippleEle = activatableEle.children[i];
                if (rippleEle.classList.contains('button-effect')) {
                    // DOM WRITE
                    this.startRippleEffect(rippleEle, activatableEle, startCoord);
                    break;
                }
            }
        }
    };
    /**
     * @param {?} _ev
     * @param {?} _activatableEle
     * @param {?} _startCoord
     * @return {?}
     */
    RippleActivator.prototype._clickAction = function (_ev, _activatableEle, _startCoord) {
        // NOTHING
    };
    /**
     * @param {?} rippleEle
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    RippleActivator.prototype.startRippleEffect = function (rippleEle, activatableEle, startCoord) {
        if (!startCoord) {
            return;
        }
        var /** @type {?} */ clientPointerX = (startCoord.x - rippleEle.$left);
        var /** @type {?} */ clientPointerY = (startCoord.y - rippleEle.$top);
        var /** @type {?} */ x = Math.max(Math.abs(rippleEle.$width - clientPointerX), clientPointerX) * 2;
        var /** @type {?} */ y = Math.max(Math.abs(rippleEle.$height - clientPointerY), clientPointerY) * 2;
        var /** @type {?} */ diameter = Math.min(Math.max(Math.hypot(x, y), 64), 240);
        if (activatableEle.hasAttribute('ion-item')) {
            diameter = Math.min(diameter, 140);
        }
        clientPointerX -= diameter / 2;
        clientPointerY -= diameter / 2;
        clientPointerX = Math.round(clientPointerX);
        clientPointerY = Math.round(clientPointerY);
        diameter = Math.round(diameter);
        // Reset ripple
        // DOM WRITE
        var /** @type {?} */ Css = this.dom.plt.Css;
        rippleEle.style.opacity = '';
        rippleEle.style[Css.transform] = "translate3d(" + clientPointerX + "px, " + clientPointerY + "px, 0px) scale(0.001)";
        rippleEle.style[Css.transition] = '';
        // Start ripple animation
        var /** @type {?} */ radius = Math.sqrt(rippleEle.$width + rippleEle.$height);
        var /** @type {?} */ scaleTransitionDuration = Math.max(1600 * Math.sqrt(radius / TOUCH_DOWN_ACCEL) + 0.5, 260);
        var /** @type {?} */ opacityTransitionDuration = Math.round(scaleTransitionDuration * 0.7);
        var /** @type {?} */ opacityTransitionDelay = Math.round(scaleTransitionDuration - opacityTransitionDuration);
        scaleTransitionDuration = Math.round(scaleTransitionDuration);
        var /** @type {?} */ transform = "translate3d(" + clientPointerX + "px, " + clientPointerY + "px, 0px) scale(1)";
        var /** @type {?} */ transition = "transform " + scaleTransitionDuration + "ms,opacity " + opacityTransitionDuration + "ms " + opacityTransitionDelay + "ms";
        this.dom.write(function () {
            // DOM WRITE
            rippleEle.style.width = rippleEle.style.height = diameter + 'px';
            rippleEle.style.opacity = '0';
            rippleEle.style[Css.transform] = transform;
            rippleEle.style[Css.transition] = transition;
        }, 16);
    };
    return RippleActivator;
}());
export { RippleActivator };
function RippleActivator_tsickle_Closure_declarations() {
    /** @type {?} */
    RippleActivator.prototype.highlight;
    /** @type {?} */
    RippleActivator.prototype.dom;
}
var /** @type {?} */ TOUCH_DOWN_ACCEL = 300;
//# sourceMappingURL=ripple.js.map