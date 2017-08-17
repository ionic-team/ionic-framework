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
import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
/**
 * @hidden
 * This class overrides the default Angular gesture config.
 */
var IonicGestureConfig = (function (_super) {
    __extends(IonicGestureConfig, _super);
    function IonicGestureConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    IonicGestureConfig.prototype.buildHammer = function (element) {
        var /** @type {?} */ mc = new ((window)).Hammer(element);
        for (var /** @type {?} */ eventName in this.overrides) {
            mc.get(eventName).set(this.overrides[eventName]);
        }
        return mc;
    };
    return IonicGestureConfig;
}(HammerGestureConfig));
export { IonicGestureConfig };
IonicGestureConfig.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
IonicGestureConfig.ctorParameters = function () { return []; };
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