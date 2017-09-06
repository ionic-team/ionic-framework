import { Component, ElementRef, HostListener, Renderer, ViewEncapsulation } from '@angular/core';
import { Config } from '../../config/config';
import { BLOCK_ALL, GestureController } from '../../gestures/gesture-controller';
import { isDefined, isUndefined } from '../../util/util';
import { KEY_ESCAPE } from '../../platform/key';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class LoadingCmp {
    /**
     * @param {?} _viewCtrl
     * @param {?} _config
     * @param {?} _elementRef
     * @param {?} gestureCtrl
     * @param {?} params
     * @param {?} renderer
     */
    constructor(_viewCtrl, _config, _elementRef, gestureCtrl, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._config = _config;
        (void 0) /* assert */;
        this.gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
        this.d = params.data;
        renderer.setElementClass(_elementRef.nativeElement, `loading-${_config.get('mode')}`, true);
        if (this.d.cssClass) {
            this.d.cssClass.split(' ').forEach(cssClass => {
                // Make sure the class isn't whitespace, otherwise it throws exceptions
                if (cssClass.trim() !== '')
                    renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
            });
        }
        this.id = (++loadingIds);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // If no spinner was passed in loading options we need to fall back
        // to the loadingSpinner in the app's config, then the mode spinner
        if (isUndefined(this.d.spinner)) {
            this.d.spinner = this._config.get('loadingSpinner', this._config.get('spinner', 'ios'));
        }
        // If the user passed hide to the spinner we don't want to show it
        this.showSpinner = isDefined(this.d.spinner) && this.d.spinner !== 'hide';
    }
    /**
     * @return {?}
     */
    ionViewWillEnter() {
        this.gestureBlocker.block();
    }
    /**
     * @return {?}
     */
    ionViewDidLeave() {
        this.gestureBlocker.unblock();
    }
    /**
     * @return {?}
     */
    ionViewDidEnter() {
        // If there is a duration, dismiss after that amount of time
        if (this.d && this.d.duration) {
            this.durationTimeout = setTimeout(() => this.dismiss('backdrop'), this.d.duration);
        }
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    keyUp(ev) {
        if (this._viewCtrl.isLast() && ev.keyCode === KEY_ESCAPE) {
            this.bdClick();
        }
    }
    /**
     * @return {?}
     */
    bdClick() {
        if (this.d.enableBackdropDismiss) {
            this.dismiss('backdrop');
        }
    }
    /**
     * @param {?} role
     * @return {?}
     */
    dismiss(role) {
        if (this.durationTimeout) {
            clearTimeout(this.durationTimeout);
        }
        return this._viewCtrl.dismiss(null, role);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        (void 0) /* assert */;
        this.gestureBlocker.destroy();
    }
}
LoadingCmp.decorators = [
    { type: Component, args: [{
                selector: 'ion-loading',
                template: '<ion-backdrop [hidden]="!d.showBackdrop" (click)="bdClick()" [class.backdrop-no-tappable]="!d.enableBackdropDismiss"></ion-backdrop>' +
                    '<div class="loading-wrapper">' +
                    '<div *ngIf="showSpinner" class="loading-spinner">' +
                    '<ion-spinner [name]="d.spinner"></ion-spinner>' +
                    '</div>' +
                    '<div *ngIf="d.content" [innerHTML]="d.content" class="loading-content"></div>' +
                    '</div>',
                host: {
                    'role': 'dialog'
                },
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
LoadingCmp.ctorParameters = () => [
    { type: ViewController, },
    { type: Config, },
    { type: ElementRef, },
    { type: GestureController, },
    { type: NavParams, },
    { type: Renderer, },
];
LoadingCmp.propDecorators = {
    'keyUp': [{ type: HostListener, args: ['body:keyup', ['$event'],] },],
};
function LoadingCmp_tsickle_Closure_declarations() {
    /** @type {?} */
    LoadingCmp.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    LoadingCmp.ctorParameters;
    /** @type {?} */
    LoadingCmp.propDecorators;
    /** @type {?} */
    LoadingCmp.prototype.d;
    /** @type {?} */
    LoadingCmp.prototype.id;
    /** @type {?} */
    LoadingCmp.prototype.showSpinner;
    /** @type {?} */
    LoadingCmp.prototype.durationTimeout;
    /** @type {?} */
    LoadingCmp.prototype.gestureBlocker;
    /** @type {?} */
    LoadingCmp.prototype._viewCtrl;
    /** @type {?} */
    LoadingCmp.prototype._config;
}
let /** @type {?} */ loadingIds = -1;
//# sourceMappingURL=loading-component.js.map