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
export class HideWhen extends DisplayWhen {
    /**
     * @param {?} hideWhen
     * @param {?} plt
     * @param {?} zone
     */
    constructor(hideWhen, plt, zone) {
        super(hideWhen, plt, zone);
    }
}
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
HideWhen.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Attribute, args: ['hideWhen',] },] },
    { type: Platform, },
    { type: NgZone, },
];
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