import { Component, ComponentFactoryResolver, ElementRef, HostListener, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Config } from '../../config/config';
import { KEY_ESCAPE } from '../../platform/key';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
import { BLOCK_ALL, GestureController } from '../../gestures/gesture-controller';
import { ModuleLoader } from '../../util/module-loader';
/**
 * @hidden
 */
export class PopoverCmp {
    /**
     * @param {?} _cfr
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} _config
     * @param {?} _navParams
     * @param {?} _viewCtrl
     * @param {?} gestureCtrl
     * @param {?} moduleLoader
     */
    constructor(_cfr, _elementRef, _renderer, _config, _navParams, _viewCtrl, gestureCtrl, moduleLoader) {
        this._cfr = _cfr;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._config = _config;
        this._navParams = _navParams;
        this._viewCtrl = _viewCtrl;
        this.moduleLoader = moduleLoader;
        this._gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
        this.d = _navParams.data.opts;
        _renderer.setElementClass(_elementRef.nativeElement, `popover-${_config.get('mode')}`, true);
        if (this.d.cssClass) {
            this.d.cssClass.split(' ').forEach(cssClass => {
                // Make sure the class isn't whitespace, otherwise it throws exceptions
                if (cssClass.trim() !== '')
                    _renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
            });
        }
        this.id = (++popoverIds);
    }
    /**
     * @return {?}
     */
    ionViewPreLoad() {
        this._load(this._navParams.data.component);
    }
    /**
     * @param {?} component
     * @return {?}
     */
    _load(component) {
        if (component) {
            let /** @type {?} */ cfr = this.moduleLoader.getComponentFactoryResolver(component);
            if (!cfr) {
                cfr = this._cfr;
            }
            const /** @type {?} */ componentFactory = cfr.resolveComponentFactory(component);
            // ******** DOM WRITE ****************
            const /** @type {?} */ componentRef = this._viewport.createComponent(componentFactory, this._viewport.length, this._viewport.parentInjector, []);
            this._viewCtrl._setInstance(componentRef.instance);
            this._enabled = true;
            // Subscribe to events in order to block gestures
            // TODO, should we unsubscribe? memory leak?
            this._viewCtrl.willEnter.subscribe(this._viewWillEnter.bind(this));
            this._viewCtrl.didLeave.subscribe(this._viewDidLeave.bind(this));
        }
    }
    /**
     * @return {?}
     */
    _viewWillEnter() {
        this._gestureBlocker.block();
    }
    /**
     * @return {?}
     */
    _viewDidLeave() {
        this._gestureBlocker.unblock();
    }
    /**
     * @param {?} componentRef
     * @param {?} className
     * @return {?}
     */
    _setCssClass(componentRef, className) {
        this._renderer.setElementClass(componentRef.location.nativeElement, className, true);
    }
    /**
     * @return {?}
     */
    _bdClick() {
        if (this._enabled && this.d.enableBackdropDismiss) {
            return this._viewCtrl.dismiss(null, 'backdrop');
        }
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    _keyUp(ev) {
        if (this._enabled && ev.keyCode === KEY_ESCAPE && this._viewCtrl.isLast()) {
            this._bdClick();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        (void 0) /* assert */;
        this._gestureBlocker.destroy();
    }
}
PopoverCmp.decorators = [
    { type: Component, args: [{
                selector: 'ion-popover',
                template: '<ion-backdrop (click)="_bdClick()" [hidden]="!d.showBackdrop"></ion-backdrop>' +
                    '<div class="popover-wrapper">' +
                    '<div class="popover-arrow"></div>' +
                    '<div class="popover-content">' +
                    '<div class="popover-viewport">' +
                    '<div #viewport nav-viewport></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            },] },
];
/**
 * @nocollapse
 */
PopoverCmp.ctorParameters = () => [
    { type: ComponentFactoryResolver, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Config, },
    { type: NavParams, },
    { type: ViewController, },
    { type: GestureController, },
    { type: ModuleLoader, },
];
PopoverCmp.propDecorators = {
    '_viewport': [{ type: ViewChild, args: ['viewport', { read: ViewContainerRef },] },],
    '_keyUp': [{ type: HostListener, args: ['body:keyup', ['$event'],] },],
};
function PopoverCmp_tsickle_Closure_declarations() {
    /** @type {?} */
    PopoverCmp.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    PopoverCmp.ctorParameters;
    /** @type {?} */
    PopoverCmp.propDecorators;
    /** @type {?} */
    PopoverCmp.prototype._viewport;
    /** @type {?} */
    PopoverCmp.prototype.d;
    /** @type {?} */
    PopoverCmp.prototype._enabled;
    /** @type {?} */
    PopoverCmp.prototype._gestureBlocker;
    /** @type {?} */
    PopoverCmp.prototype.id;
    /** @type {?} */
    PopoverCmp.prototype._cfr;
    /** @type {?} */
    PopoverCmp.prototype._elementRef;
    /** @type {?} */
    PopoverCmp.prototype._renderer;
    /** @type {?} */
    PopoverCmp.prototype._config;
    /** @type {?} */
    PopoverCmp.prototype._navParams;
    /** @type {?} */
    PopoverCmp.prototype._viewCtrl;
    /** @type {?} */
    PopoverCmp.prototype.moduleLoader;
}
let /** @type {?} */ popoverIds = -1;
//# sourceMappingURL=popover-component.js.map