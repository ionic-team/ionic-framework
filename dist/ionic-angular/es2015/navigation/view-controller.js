import { EventEmitter, Output } from '@angular/core';
import { isPresent } from '../util/util';
import { STATE_DESTROYED, STATE_NEW } from './nav-util';
import { NavParams } from './nav-params';
/**
 * \@name ViewController
 * \@description
 * Access various features and information about the current view.
 * \@usage
 *  ```ts
 * import { Component } from '\@angular/core';
 * import { ViewController } from 'ionic-angular';
 *
 * \@Component({...})
 * export class MyPage{
 *
 *   constructor(public viewCtrl: ViewController) {}
 *
 * }
 * ```
 */
export class ViewController {
    /**
     * @param {?=} component
     * @param {?=} data
     * @param {?=} rootCssClass
     */
    constructor(component, data, rootCssClass = DEFAULT_CSS_CLASS) {
        this.component = component;
        this._isHidden = false;
        this._state = STATE_NEW;
        /**
         * Observable to be subscribed to when the current component will become active
         */
        this.willEnter = new EventEmitter();
        /**
         * Observable to be subscribed to when the current component has become active
         */
        this.didEnter = new EventEmitter();
        /**
         * Observable to be subscribed to when the current component will no longer be active
         */
        this.willLeave = new EventEmitter();
        /**
         * Observable to be subscribed to when the current component is no long active
         */
        this.didLeave = new EventEmitter();
        /**
         * Observable to be subscribed to when the current component has been destroyed
         */
        this.willUnload = new EventEmitter();
        /**
         * @hidden
         */
        this.readReady = new EventEmitter();
        /**
         * @hidden
         */
        this.writeReady = new EventEmitter();
        /**
         * @hidden
         */
        this.isOverlay = false;
        /**
         * @hidden
         */
        this._emitter = new EventEmitter();
        // passed in data could be NavParams, but all we care about is its data object
        this.data = (data instanceof NavParams ? data.data : (isPresent(data) ? data : {}));
        this._cssClass = rootCssClass;
        this._ts = Date.now();
    }
    /**
     * @hidden
     * @param {?} componentRef
     * @return {?}
     */
    init(componentRef) {
        (void 0) /* assert */;
        this._ts = Date.now();
        this._cmp = componentRef;
        this.instance = this.instance || componentRef.instance;
        this._detached = false;
    }
    /**
     * @param {?} navCtrl
     * @return {?}
     */
    _setNav(navCtrl) {
        this._nav = navCtrl;
    }
    /**
     * @param {?} instance
     * @return {?}
     */
    _setInstance(instance) {
        this.instance = instance;
    }
    /**
     * @hidden
     * @param {?=} generatorOrNext
     * @return {?}
     */
    subscribe(generatorOrNext) {
        return this._emitter.subscribe(generatorOrNext);
    }
    /**
     * @hidden
     * @param {?=} data
     * @return {?}
     */
    emit(data) {
        this._emitter.emit(data);
    }
    /**
     * Called when the current viewController has be successfully dismissed
     * @param {?} callback
     * @return {?}
     */
    onDidDismiss(callback) {
        this._onDidDismiss = callback;
    }
    /**
     * Called when the current viewController will be dismissed
     * @param {?} callback
     * @return {?}
     */
    onWillDismiss(callback) {
        this._onWillDismiss = callback;
    }
    /**
     * Dismiss the current viewController
     * @param {?=} data
     * @param {?=} role
     * @param {?=} navOptions
     * @return {?}
     */
    dismiss(data, role, navOptions = {}) {
        if (!this._nav) {
            (void 0) /* assert */;
            return Promise.resolve(false);
        }
        if (this.isOverlay && !navOptions.minClickBlockDuration) {
            // This is a Modal being dismissed so we need
            // to add the minClickBlockDuration option
            // for UIWebView
            navOptions.minClickBlockDuration = 400;
        }
        this._dismissData = data;
        this._dismissRole = role;
        const /** @type {?} */ options = Object.assign({}, this._leavingOpts, navOptions);
        return this._nav.removeView(this, options).then(() => data);
    }
    /**
     * @hidden
     * @return {?}
     */
    getNav() {
        return this._nav;
    }
    /**
     * @hidden
     * @param {?} _direction
     * @return {?}
     */
    getTransitionName(_direction) {
        return this._nav && this._nav.config.get('pageTransition');
    }
    /**
     * @hidden
     * @return {?}
     */
    getNavParams() {
        return new NavParams(this.data);
    }
    /**
     * @hidden
     * @param {?} opts
     * @return {?}
     */
    setLeavingOpts(opts) {
        this._leavingOpts = opts;
    }
    /**
     * Check to see if you can go back in the navigation stack.
     * @return {?}
     */
    enableBack() {
        // update if it's possible to go back from this nav item
        if (!this._nav) {
            return false;
        }
        // the previous view may exist, but if it's about to be destroyed
        // it shouldn't be able to go back to
        const /** @type {?} */ previousItem = this._nav.getPrevious(this);
        return !!(previousItem);
    }
    /**
     * @hidden
     * @return {?}
     */
    get name() {
        return (this.component ? this.component.name : '');
    }
    /**
     * Get the index of the current component in the current navigation stack.
     * @return {?}
     */
    get index() {
        return (this._nav ? this._nav.indexOf(this) : -1);
    }
    /**
     * @return {?}
     */
    isFirst() {
        return (this._nav ? this._nav.first() === this : false);
    }
    /**
     * @return {?}
     */
    isLast() {
        return (this._nav ? this._nav.last() === this : false);
    }
    /**
     * @hidden
     * DOM WRITE
     * @param {?} shouldShow
     * @param {?} renderer
     * @return {?}
     */
    _domShow(shouldShow, renderer) {
        // using hidden element attribute to display:none and not render views
        // _hidden value of '' means the hidden attribute will be added
        // _hidden value of null means the hidden attribute will be removed
        // doing checks to make sure we only update the DOM when actually needed
        // if it should render, then the hidden attribute should not be on the element
        if (this._cmp && shouldShow === this._isHidden) {
            this._isHidden = !shouldShow;
            let /** @type {?} */ value = (shouldShow ? null : '');
            // ******** DOM WRITE ****************
            renderer.setElementAttribute(this.pageRef().nativeElement, 'hidden', value);
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    getZIndex() {
        return this._zIndex;
    }
    /**
     * @hidden
     * DOM WRITE
     * @param {?} zIndex
     * @param {?} renderer
     * @return {?}
     */
    _setZIndex(zIndex, renderer) {
        if (zIndex !== this._zIndex) {
            this._zIndex = zIndex;
            const /** @type {?} */ pageRef = this.pageRef();
            if (pageRef) {
                // ******** DOM WRITE ****************
                renderer.setElementStyle(pageRef.nativeElement, 'z-index', ((zIndex)));
            }
        }
    }
    /**
     * @return {?}
     */
    pageRef() {
        return this._cmp && this._cmp.location;
    }
    /**
     * @param {?} directive
     * @return {?}
     */
    _setContent(directive) {
        this._cntDir = directive;
    }
    /**
     * @return {?}
     */
    getContent() {
        return this._cntDir;
    }
    /**
     * @param {?} elementRef
     * @return {?}
     */
    _setContentRef(elementRef) {
        this._cntRef = elementRef;
    }
    /**
     * @return {?}
     */
    contentRef() {
        return this._cntRef;
    }
    /**
     * @param {?} content
     * @return {?}
     */
    _setIONContent(content) {
        this._setContent(content);
        this._ionCntDir = content;
    }
    /**
     * @hidden
     * @return {?}
     */
    getIONContent() {
        return this._ionCntDir;
    }
    /**
     * @param {?} elementRef
     * @return {?}
     */
    _setIONContentRef(elementRef) {
        this._setContentRef(elementRef);
        this._ionCntRef = elementRef;
    }
    /**
     * @hidden
     * @return {?}
     */
    getIONContentRef() {
        return this._ionCntRef;
    }
    /**
     * @param {?} directive
     * @return {?}
     */
    _setHeader(directive) {
        this._hdrDir = directive;
    }
    /**
     * @hidden
     * @return {?}
     */
    getHeader() {
        return this._hdrDir;
    }
    /**
     * @param {?} directive
     * @return {?}
     */
    _setFooter(directive) {
        this._ftrDir = directive;
    }
    /**
     * @hidden
     * @return {?}
     */
    getFooter() {
        return this._ftrDir;
    }
    /**
     * @param {?} directive
     * @return {?}
     */
    _setNavbar(directive) {
        this._nb = directive;
    }
    /**
     * @hidden
     * @return {?}
     */
    getNavbar() {
        return this._nb;
    }
    /**
     * Find out if the current component has a NavBar or not. Be sure
     * to wrap this in an `ionViewWillEnter` method in order to make sure
     * the view has rendered fully.
     * @return {?}
     */
    hasNavbar() {
        return !!this._nb;
    }
    /**
     * Change the title of the back-button. Be sure to call this
     * after `ionViewWillEnter` to make sure the  DOM has been rendered.
     * @param {?} val
     * @return {?}
     */
    setBackButtonText(val) {
        this._nb && this._nb.setBackButtonText(val);
    }
    /**
     * Set if the back button for the current view is visible or not. Be sure to call this
     * after `ionViewWillEnter` to make sure the  DOM has been rendered.
     * @param {?} shouldShow
     * @return {?}
     */
    showBackButton(shouldShow) {
        if (this._nb) {
            this._nb.hideBackButton = !shouldShow;
        }
    }
    /**
     * @return {?}
     */
    _preLoad() {
        (void 0) /* assert */;
        this._lifecycle('PreLoad');
    }
    /**
     * @hidden
     * The view has loaded. This event only happens once per view will be created.
     * This event is fired before the component and his children have been initialized.
     * @return {?}
     */
    _willLoad() {
        (void 0) /* assert */;
        this._lifecycle('WillLoad');
    }
    /**
     * @hidden
     * The view has loaded. This event only happens once per view being
     * created. If a view leaves but is cached, then this will not
     * fire again on a subsequent viewing. This method is a good place
     * to put your setup code for the view; however, it is not the
     * recommended method to use when a view becomes active.
     * @return {?}
     */
    _didLoad() {
        (void 0) /* assert */;
        this._lifecycle('DidLoad');
    }
    /**
     * @hidden
     * The view is about to enter and become the active view.
     * @return {?}
     */
    _willEnter() {
        (void 0) /* assert */;
        if (this._detached && this._cmp) {
            // ensure this has been re-attached to the change detector
            this._cmp.changeDetectorRef.reattach();
            this._detached = false;
        }
        this.willEnter.emit(null);
        this._lifecycle('WillEnter');
    }
    /**
     * @hidden
     * The view has fully entered and is now the active view. This
     * will fire, whether it was the first load or loaded from the cache.
     * @return {?}
     */
    _didEnter() {
        (void 0) /* assert */;
        this._nb && this._nb.didEnter();
        this.didEnter.emit(null);
        this._lifecycle('DidEnter');
    }
    /**
     * @hidden
     * The view is about to leave and no longer be the active view.
     * @param {?} willUnload
     * @return {?}
     */
    _willLeave(willUnload) {
        this.willLeave.emit(null);
        this._lifecycle('WillLeave');
        if (willUnload && this._onWillDismiss) {
            this._onWillDismiss(this._dismissData, this._dismissRole);
            this._onWillDismiss = null;
        }
    }
    /**
     * @hidden
     * The view has finished leaving and is no longer the active view. This
     * will fire, whether it is cached or unloaded.
     * @return {?}
     */
    _didLeave() {
        this.didLeave.emit(null);
        this._lifecycle('DidLeave');
        // when this is not the active page
        // we no longer need to detect changes
        if (!this._detached && this._cmp) {
            this._cmp.changeDetectorRef.detach();
            this._detached = true;
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    _willUnload() {
        this.willUnload.emit(null);
        this._lifecycle('WillUnload');
        this._onDidDismiss && this._onDidDismiss(this._dismissData, this._dismissRole);
        this._onDidDismiss = null;
        this._dismissData = null;
        this._dismissRole = null;
    }
    /**
     * @hidden
     * DOM WRITE
     * @param {?} renderer
     * @return {?}
     */
    _destroy(renderer) {
        (void 0) /* assert */;
        if (this._cmp) {
            if (renderer) {
                // ensure the element is cleaned up for when the view pool reuses this element
                // ******** DOM WRITE ****************
                var /** @type {?} */ cmpEle = this._cmp.location.nativeElement;
                renderer.setElementAttribute(cmpEle, 'class', null);
                renderer.setElementAttribute(cmpEle, 'style', null);
            }
            // completely destroy this component. boom.
            this._cmp.destroy();
        }
        this._nav = this._cmp = this.instance = this._cntDir = this._cntRef = this._leavingOpts = this._hdrDir = this._ftrDir = this._nb = this._onDidDismiss = this._onWillDismiss = null;
        this._state = STATE_DESTROYED;
    }
    /**
     * @hidden
     * @param {?} lifecycle
     * @return {?}
     */
    _lifecycleTest(lifecycle) {
        const /** @type {?} */ instance = this.instance;
        const /** @type {?} */ methodName = 'ionViewCan' + lifecycle;
        if (instance && instance[methodName]) {
            try {
                var /** @type {?} */ result = instance[methodName]();
                if (result instanceof Promise) {
                    return result;
                }
                else {
                    // Any value but explitic false, should be true
                    return Promise.resolve(result !== false);
                }
            }
            catch (e) {
                return Promise.reject(`${this.name} ${methodName} error: ${e.message}`);
            }
        }
        return Promise.resolve(true);
    }
    /**
     * @hidden
     * @param {?} lifecycle
     * @return {?}
     */
    _lifecycle(lifecycle) {
        const /** @type {?} */ instance = this.instance;
        const /** @type {?} */ methodName = 'ionView' + lifecycle;
        if (instance && instance[methodName]) {
            instance[methodName]();
        }
    }
}
ViewController.propDecorators = {
    '_emitter': [{ type: Output },],
};
function ViewController_tsickle_Closure_declarations() {
    /** @type {?} */
    ViewController.propDecorators;
    /** @type {?} */
    ViewController.prototype._cntDir;
    /** @type {?} */
    ViewController.prototype._cntRef;
    /** @type {?} */
    ViewController.prototype._ionCntDir;
    /** @type {?} */
    ViewController.prototype._ionCntRef;
    /** @type {?} */
    ViewController.prototype._hdrDir;
    /** @type {?} */
    ViewController.prototype._ftrDir;
    /** @type {?} */
    ViewController.prototype._isHidden;
    /** @type {?} */
    ViewController.prototype._leavingOpts;
    /** @type {?} */
    ViewController.prototype._nb;
    /** @type {?} */
    ViewController.prototype._onDidDismiss;
    /** @type {?} */
    ViewController.prototype._onWillDismiss;
    /** @type {?} */
    ViewController.prototype._dismissData;
    /** @type {?} */
    ViewController.prototype._dismissRole;
    /** @type {?} */
    ViewController.prototype._detached;
    /** @type {?} */
    ViewController.prototype._cmp;
    /** @type {?} */
    ViewController.prototype._nav;
    /** @type {?} */
    ViewController.prototype._zIndex;
    /** @type {?} */
    ViewController.prototype._state;
    /** @type {?} */
    ViewController.prototype._cssClass;
    /** @type {?} */
    ViewController.prototype._ts;
    /**
     * Observable to be subscribed to when the current component will become active
     * @type {?}
     */
    ViewController.prototype.willEnter;
    /**
     * Observable to be subscribed to when the current component has become active
     * @type {?}
     */
    ViewController.prototype.didEnter;
    /**
     * Observable to be subscribed to when the current component will no longer be active
     * @type {?}
     */
    ViewController.prototype.willLeave;
    /**
     * Observable to be subscribed to when the current component is no long active
     * @type {?}
     */
    ViewController.prototype.didLeave;
    /**
     * Observable to be subscribed to when the current component has been destroyed
     * @type {?}
     */
    ViewController.prototype.willUnload;
    /**
     * @hidden
     * @type {?}
     */
    ViewController.prototype.readReady;
    /**
     * @hidden
     * @type {?}
     */
    ViewController.prototype.writeReady;
    /**
     * @hidden
     * @type {?}
     */
    ViewController.prototype.data;
    /**
     * @hidden
     * @type {?}
     */
    ViewController.prototype.instance;
    /**
     * @hidden
     * @type {?}
     */
    ViewController.prototype.id;
    /**
     * @hidden
     * @type {?}
     */
    ViewController.prototype.isOverlay;
    /**
     * @hidden
     * @type {?}
     */
    ViewController.prototype._emitter;
    /** @type {?} */
    ViewController.prototype.component;
}
/**
 * @param {?} viewCtrl
 * @return {?}
 */
export function isViewController(viewCtrl) {
    return !!(viewCtrl && ((viewCtrl))._didLoad && ((viewCtrl))._willUnload);
}
const /** @type {?} */ DEFAULT_CSS_CLASS = 'ion-page';
//# sourceMappingURL=view-controller.js.map