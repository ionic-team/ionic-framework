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
import { ChangeDetectionStrategy, Component, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * \@name FabButton
 * \@module ionic
 *
 * \@description
 * FABs (Floating Action Buttons) are standard material design components. They are shaped as a circle that represents a promoted action. When pressed, it may contain more related actions.
 * FABs as its name suggests are floating over the content in a fixed position. This is not achieved exclusively with `<button ion-fab>Button</button>` but it has to wrapped with the `<ion-fab>` component, like this:
 *
 * ```html
 * <ion-content>
 *  <!-- Real floating action button, fixed. It will not scroll with the content -->
 *  <ion-fab>
 *    <button ion-fab>Button</button>
 *  </ion-fab>
 *
 *  <!-- Button shaped as a circle that just like a normal button scrolls with the content -->
 *  <button ion-fab>Button</button>
 * </ion-content>
 *
 * ```
 *
 * In case the button is not wrapped with `<ion-fab>`, the fab button will behave like a normal button, scrolling with the content.
 *
 * See [ion-fab] to learn more information about how to position the fab button.
 *
 * \@property [mini] - Makes a fab button with a reduced size.
 *
 * \@usage
 *
 * ```html
 *
 * <!-- Colors -->
 * <ion-fab>
 *   <button ion-fab color="primary">Button</button>
 * </ion-fab>
 *
 * <!-- Mini -->
 * <ion-fab>
 *   <button ion-fab mini>Small</button>
 * </ion-fab>
 * ```
 *
 * \@demo /docs/demos/src/fab/
 * @see {\@link /docs/components#fabs FAB Component Docs}
 */
var FabButton = (function (_super) {
    __extends(FabButton, _super);
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    function FabButton(config, elementRef, renderer) {
        return _super.call(this, config, elementRef, renderer, 'fab') || this;
    }
    /**
     * @hidden
     * @param {?} closeVisible
     * @return {?}
     */
    FabButton.prototype.setActiveClose = function (closeVisible) {
        this.setElementClass('fab-close-active', closeVisible);
    };
    return FabButton;
}(Ion));
export { FabButton };
FabButton.decorators = [
    { type: Component, args: [{
                selector: '[ion-fab]',
                template: '<ion-icon name="close" class="fab-close-icon"></ion-icon>' +
                    '<span class="button-inner">' +
                    '<ng-content></ng-content>' +
                    '</span>' +
                    '<div class="button-effect"></div>',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
FabButton.ctorParameters = function () { return [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
]; };
function FabButton_tsickle_Closure_declarations() {
    /** @type {?} */
    FabButton.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    FabButton.ctorParameters;
}
//# sourceMappingURL=fab.js.map