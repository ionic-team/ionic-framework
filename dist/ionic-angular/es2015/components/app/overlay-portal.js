import { ComponentFactoryResolver, Directive, ElementRef, ErrorHandler, Inject, Input, NgZone, Optional, Renderer, ViewContainerRef, forwardRef } from '@angular/core';
import { App } from './app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { Platform } from '../../platform/platform';
import { TransitionController } from '../../transitions/transition-controller';
/**
 * @hidden
 */
export class OverlayPortal extends NavControllerBase {
    /**
     * @param {?} app
     * @param {?} config
     * @param {?} plt
     * @param {?} elementRef
     * @param {?} zone
     * @param {?} renderer
     * @param {?} cfr
     * @param {?} gestureCtrl
     * @param {?} transCtrl
     * @param {?} linker
     * @param {?} viewPort
     * @param {?} domCtrl
     * @param {?} errHandler
     */
    constructor(app, config, plt, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, viewPort, domCtrl, errHandler) {
        super(null, app, config, plt, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl, errHandler);
        this._isPortal = true;
        this._init = true;
        this.setViewport(viewPort);
        // on every page change make sure the portal has
        // dismissed any views that should be auto dismissed on page change
        app.viewDidLeave.subscribe((view) => {
            if (!view.isOverlay) {
                this.dismissPageChangeViews();
            }
        });
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set _overlayPortal(val) {
        this._zIndexOffset = (val || 0);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.destroy();
    }
    /**
     * @return {?}
     */
    getType() {
        return 'portal';
    }
    /**
     * @return {?}
     */
    getSecondaryIdentifier() {
        return null;
    }
}
OverlayPortal.decorators = [
    { type: Directive, args: [{
                selector: '[overlay-portal]',
            },] },
];
/**
 * @nocollapse
 */
OverlayPortal.ctorParameters = () => [
    { type: App, decorators: [{ type: Inject, args: [forwardRef(() => App),] },] },
    { type: Config, },
    { type: Platform, },
    { type: ElementRef, },
    { type: NgZone, },
    { type: Renderer, },
    { type: ComponentFactoryResolver, },
    { type: GestureController, },
    { type: TransitionController, },
    { type: DeepLinker, decorators: [{ type: Optional },] },
    { type: ViewContainerRef, },
    { type: DomController, },
    { type: ErrorHandler, },
];
OverlayPortal.propDecorators = {
    '_overlayPortal': [{ type: Input, args: ['overlay-portal',] },],
};
function OverlayPortal_tsickle_Closure_declarations() {
    /** @type {?} */
    OverlayPortal.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    OverlayPortal.ctorParameters;
    /** @type {?} */
    OverlayPortal.propDecorators;
}
//# sourceMappingURL=overlay-portal.js.map