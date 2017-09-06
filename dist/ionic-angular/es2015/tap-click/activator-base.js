/**
 * @abstract
 */
export class ActivatorBase {
    /**
     * @abstract
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    clickAction(ev, activatableEle, startCoord) { }
    /**
     * @abstract
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    downAction(ev, activatableEle, startCoord) { }
    /**
     * @abstract
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    upAction(ev, activatableEle, startCoord) { }
    /**
     * @abstract
     * @param {?} animated
     * @return {?}
     */
    clearState(animated) { }
}
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
    let /** @type {?} */ targetEle = ev.target;
    for (let /** @type {?} */ i = 0; i < 4; i++) {
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