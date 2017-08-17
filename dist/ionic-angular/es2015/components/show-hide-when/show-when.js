import { Attribute, Directive, NgZone } from '@angular/core';
import { DisplayWhen } from './display-when';
import { Platform } from '../../platform/platform';
/**
 *
 * \@name ShowWhen
 * \@description
 * The `showWhen` attribute takes a string that represents a platform or screen orientation.
 * The element the attribute is added to will only be shown when that platform or screen orientation is active.
 *
 * Complements the [hideWhen attribute](../HideWhen). If the `showWhen` attribute is used on an
 * element that also has the `hideWhen` attribute, the element will not show if `hideWhen` evaluates
 * to `true` or `showWhen` evaluates to `false`. If the `hidden` attribute is also added, the element
 * will not show if `hidden` evaluates to `true`.
 *
 * View the [Platform API docs](../../../platform/Platform) for more information on the different
 * platforms you can use.
 *
 * \@usage
 * ```html
 * <div showWhen="android">
 *  I am visible on Android!
 * </div>
 *
 * <div showWhen="ios">
 *  I am visible on iOS!
 * </div>
 *
 * <div showWhen="android,ios">
 *  I am visible on Android and iOS!
 * </div>
 *
 * <div showWhen="portrait">
 *  I am visible on Portrait!
 * </div>
 *
 * <div showWhen="landscape">
 *  I am visible on Landscape!
 * </div>
 * ```
 * \@demo /docs/demos/src/show-when/
 * @see {\@link ../HideWhen HideWhen API Docs}
 * @see {\@link ../../../platform/Platform Platform API Docs}
 */
export class ShowWhen extends DisplayWhen {
    /**
     * @param {?} showWhen
     * @param {?} plt
     * @param {?} zone
     */
    constructor(showWhen, plt, zone) {
        super(showWhen, plt, zone);
    }
}
// ngOnDestroy is implemented in DisplayWhen
ShowWhen.decorators = [
    { type: Directive, args: [{
                selector: '[showWhen]',
                host: {
                    '[class.hidden-show-when]': '!isMatch'
                }
            },] },
];
/**
 * @nocollapse
 */
ShowWhen.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Attribute, args: ['showWhen',] },] },
    { type: Platform, },
    { type: NgZone, },
];
function ShowWhen_tsickle_Closure_declarations() {
    /** @type {?} */
    ShowWhen.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ShowWhen.ctorParameters;
}
//# sourceMappingURL=show-when.js.map