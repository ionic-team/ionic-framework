import { ChangeDetectionStrategy, Component, ElementRef, Inject, Optional, Renderer, ViewEncapsulation, forwardRef, } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Navbar } from './navbar';
import { Toolbar } from './toolbar';
/**
 * \@name Title
 * \@description
 * `ion-title` is a component that sets the title of the `Toolbar` or `Navbar`
 *
 * \@usage
 *
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <ion-title>Settings</ion-title>
 *   </ion-navbar>
 *
 * </ion-header>
 * ```
 *
 * Or to create a navbar with a toolbar as a subheader:
 *
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <ion-title>Main Header</ion-title>
 *   </ion-navbar>
 *
 *   <ion-toolbar>
 *     <ion-title>Subheader</ion-title>
 *   </ion-toolbar>
 *
 * </ion-header>
 * ```
 *
 * \@demo /docs/demos/src/title/
 */
export class ToolbarTitle extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} toolbar
     * @param {?} navbar
     */
    constructor(config, elementRef, renderer, toolbar, navbar) {
        super(config, elementRef, renderer, 'title');
        toolbar && toolbar._setTitle(this);
        navbar && navbar._setTitle(this);
    }
    /**
     * @hidden
     * @return {?}
     */
    getTitleText() {
        return this._elementRef.nativeElement.textContent;
    }
}
ToolbarTitle.decorators = [
    { type: Component, args: [{
                selector: 'ion-title',
                template: '<div class="toolbar-title" [ngClass]="\'toolbar-title-\' + _mode">' +
                    '<ng-content></ng-content>' +
                    '</div>',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
ToolbarTitle.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Toolbar, decorators: [{ type: Optional },] },
    { type: Navbar, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => Navbar),] },] },
];
function ToolbarTitle_tsickle_Closure_declarations() {
    /** @type {?} */
    ToolbarTitle.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ToolbarTitle.ctorParameters;
}
//# sourceMappingURL=toolbar-title.js.map