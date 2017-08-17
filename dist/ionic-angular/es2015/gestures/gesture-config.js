import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
/**
 * @hidden
 * This class overrides the default Angular gesture config.
 */
export class IonicGestureConfig extends HammerGestureConfig {
    /**
     * @param {?} element
     * @return {?}
     */
    buildHammer(element) {
        const /** @type {?} */ mc = new ((window)).Hammer(element);
        for (let /** @type {?} */ eventName in this.overrides) {
            mc.get(eventName).set(this.overrides[eventName]);
        }
        return mc;
    }
}
IonicGestureConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
IonicGestureConfig.ctorParameters = () => [];
function IonicGestureConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    IonicGestureConfig.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    IonicGestureConfig.ctorParameters;
}
//# sourceMappingURL=gesture-config.js.map