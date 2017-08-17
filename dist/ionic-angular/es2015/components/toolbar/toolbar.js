import { ChangeDetectionStrategy, Component, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { ToolbarBase } from './toolbar-base';
/**
 * \@name Toolbar
 * \@description
 * A Toolbar is a generic bar that is positioned above or below content.
 * Unlike a [Navbar](../Navbar/), a toolbar can be used as a subheader.
 * When toolbars are placed within an `<ion-header>` or `<ion-footer>`,
 * the toolbars stay fixed in their respective location. When placed within
 * `<ion-content>`, toolbars will scroll with the content.
 *
 *
 * ### Buttons in a Toolbar
 * Buttons placed in a toolbar should be placed inside of the `<ion-buttons>`
 * element. An exception to this is a [menuToggle](../../menu/MenuToggle) button.
 * It should not be placed inside of the `<ion-buttons>` element. Both the
 * `<ion-buttons>` element and the `menuToggle` can be positioned inside of the
 * toolbar using different properties. The below chart has a description of each
 * property.
 *
 * | Property    | Description                                                                                                           |
 * |-------------|-----------------------------------------------------------------------------------------------------------------------|
 * | `start`     | Positions element to the left of the content in `ios` mode, and directly to the right in `md` and `wp` mode.    |
 * | `end`       | Positions element to the right of the content in `ios` mode, and to the far right in `md` and `wp` mode.        |
 * | `left`      | Positions element to the left of all other elements.                                                            |
 * | `right`     | Positions element to the right of all other elements.                                                           |
 *
 *
 * ### Header / Footer Box Shadow and Border
 * In `md` mode, the `<ion-header>` will receive a box-shadow on the bottom, and the
 * `<ion-footer>` will receive a box-shadow on the top.  In `ios` mode, the `<ion-header>`
 * will receive a border on the bottom, and the `<ion-footer>` will receive a border on the
 * top. Both the `md` box-shadow and the `ios` border can be removed by adding the `no-border`
 * attribute to the element.
 *
 * ```html
 * <ion-header no-border>
 *   <ion-toolbar>
 *     <ion-title>Header</ion-title>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content>
 * </ion-content>
 *
 * <ion-footer no-border>
 *   <ion-toolbar>
 *     <ion-title>Footer</ion-title>
 *   </ion-toolbar>
 * </ion-footer>
 * ```
 *
 * \@usage
 *
 * ```html
 *
 * <ion-header no-border>
 *
 *   <ion-toolbar>
 *     <ion-title>My Toolbar Title</ion-title>
 *   </ion-toolbar>
 *
 *   <ion-toolbar>
 *     <ion-title>I'm a subheader</ion-title>
 *   </ion-toolbar>
 *
 * <ion-header>
 *
 *
 * <ion-content>
 *
 *   <ion-toolbar>
 *     <ion-title>Scrolls with the content</ion-title>
 *   </ion-toolbar>
 *
 * </ion-content>
 *
 *
 * <ion-footer no-border>
 *
 *   <ion-toolbar>
 *     <ion-title>I'm a footer</ion-title>
 *   </ion-toolbar>
 *
 * </ion-footer>
 *  ```
 *
 * \@demo /docs/demos/src/toolbar/
 * @see {\@link ../Navbar/ Navbar API Docs}
 */
export class Toolbar extends ToolbarBase {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer);
        this._sbPadding = config.getBoolean('statusbarPadding');
    }
}
Toolbar.decorators = [
    { type: Component, args: [{
                selector: 'ion-toolbar',
                template: '<div class="toolbar-background" [ngClass]="\'toolbar-background-\' + _mode"></div>' +
                    '<ng-content select="[menuToggle],ion-buttons[left]"></ng-content>' +
                    '<ng-content select="ion-buttons[start]"></ng-content>' +
                    '<ng-content select="ion-buttons[end],ion-buttons[right]"></ng-content>' +
                    '<div class="toolbar-content" [ngClass]="\'toolbar-content-\' + _mode">' +
                    '<ng-content></ng-content>' +
                    '</div>',
                host: {
                    'class': 'toolbar',
                    '[class.statusbar-padding]': '_sbPadding'
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
Toolbar.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
function Toolbar_tsickle_Closure_declarations() {
    /** @type {?} */
    Toolbar.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Toolbar.ctorParameters;
    /**
     * @hidden
     * @type {?}
     */
    Toolbar.prototype._sbPadding;
}
//# sourceMappingURL=toolbar.js.map