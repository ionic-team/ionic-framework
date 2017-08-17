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
import { Attribute, Directive, NgZone } from '@angular/core';
import { Platform } from '../../platform/platform';
import { DisplayWhen } from './display-when';
/**
 * \@name HideWhen
 * \@description
 * The `hideWhen` attribute takes a string that represents a plaform or screen orientation.
 * The element the attribute is added to will only be hidden when that platform or screen orientation is active.
 *
 * Complements the [showWhen attribute](../ShowWhen). If the `hideWhen` attribute is used on an
 * element that also has the `showWhen` attribute, the element will not show if `hideWhen` evaluates
 * to `true` or `showWhen` evaluates to `false`. If the `hidden` attribute is also added, the element
 * will not show if `hidden` evaluates to `true`.
 *
 * View the [Platform API docs](../../../platform/Platform) for more information on the different
 * platforms you can use.
 *
 * \@usage
 * ```html
 * <div hideWhen="android">
 *  I am hidden on Android!
 * </div>
 *
 * <div hideWhen="ios">
 *  I am hidden on iOS!
 * </div>
 *
 * <div hideWhen="android,ios">
 *  I am hidden on Android and iOS!
 * </div>
 *
 * <div hideWhen="portrait">
 *  I am hidden on Portrait!
 * </div>
 *
 * <div hideWhen="landscape">
 *  I am hidden on Landscape!
 * </div>
 * ```
 *
 * \@demo /docs/demos/src/hide-when/
 * @see {\@link ../ShowWhen ShowWhen API Docs}
 * @see {\@link ../../../platform/Platform Platform API Docs}
 */
var HideWhen = (function (_super) {
    __extends(HideWhen, _super);
    /**
     * @param {?} hideWhen
     * @param {?} plt
     * @param {?} zone
     */
    function HideWhen(hideWhen, plt, zone) {
        return _super.call(this, hideWhen, plt, zone) || this;
    }
    return HideWhen;
}(DisplayWhen));
export { HideWhen };
HideWhen.decorators = [
    { type: Directive, args: [{
                selector: '[hideWhen]',
                host: {
                    '[class.hidden-hide-when]': 'isMatch'
                }
            },] },
];
/**
 * @nocollapse
 */
HideWhen.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Attribute, args: ['hideWhen',] },] },
    { type: Platform, },
    { type: NgZone, },
]; };
function HideWhen_tsickle_Closure_declarations() {
    /** @type {?} */
    HideWhen.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    HideWhen.ctorParameters;
}
//# sourceMappingURL=hide-when.js.map