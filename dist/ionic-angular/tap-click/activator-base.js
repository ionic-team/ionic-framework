/**
 * @abstract
 */
var ActivatorBase = (function () {
    function ActivatorBase() {
    }
    /**
     * @abstract
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    ActivatorBase.prototype.clickAction = function (ev, activatableEle, startCoord) { };
    /**
     * @abstract
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    ActivatorBase.prototype.downAction = function (ev, activatableEle, startCoord) { };
    /**
     * @abstract
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    ActivatorBase.prototype.upAction = function (ev, activatableEle, startCoord) { };
    /**
     * @abstract
     * @param {?} animated
     * @return {?}
     */
    ActivatorBase.prototype.clearState = function (animated) { };
    return ActivatorBase;
}());
export { ActivatorBase };
/**
 * @param {?} ev
 * @param {?} activatableEle
 * @return {?}
 */
export function isActivatedDisabled(ev, activatableEle) {
    if (!activatableEle || !activatableEle.parentNode) {
        return true;
    }
    if (!ev) {
        return false;
    }
    if (ev.defaultPrevented) {
        return true;
    }
    var /** @type {?} */ targetEle = ev.target;
    for (var /** @type {?} */ i = 0; i < 4; i++) {
        if (!targetEle) {
            break;
        }
        if (targetEle.hasAttribute('disable-activated')) {
            return true;
        }
        targetEle = targetEle.parentElement;
    }
    return false;
}
//# sourceMappingURL=activator-base.js.map