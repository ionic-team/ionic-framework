(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../util/util", "./nav-util", "./nav-params"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("../util/util");
    var nav_util_1 = require("./nav-util");
    var nav_params_1 = require("./nav-params");
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
    var ViewController = (function () {
        /**
         * @param {?=} component
         * @param {?=} data
         * @param {?=} rootCssClass
         */
        function ViewController(component, data, rootCssClass) {
            if (rootCssClass === void 0) { rootCssClass = DEFAULT_CSS_CLASS; }
            this.component = component;
            this._isHidden = false;
            this._state = nav_util_1.STATE_NEW;
            /**
             * Observable to be subscribed to when the current component will become active
             */
            this.willEnter = new core_1.EventEmitter();
            /**
             * Observable to be subscribed to when the current component has become active
             */
            this.didEnter = new core_1.EventEmitter();
            /**
             * Observable to be subscribed to when the current component will no longer be active
             */
            this.willLeave = new core_1.EventEmitter();
            /**
             * Observable to be subscribed to when the current component is no long active
             */
            this.didLeave = new core_1.EventEmitter();
            /**
             * Observable to be subscribed to when the current component has been destroyed
             */
            this.willUnload = new core_1.EventEmitter();
            /**
             * @hidden
             */
            this.readReady = new core_1.EventEmitter();
            /**
             * @hidden
             */
            this.writeReady = new core_1.EventEmitter();
            /**
             * @hidden
             */
            this.isOverlay = false;
            /**
             * @hidden
             */
            this._emitter = new core_1.EventEmitter();
            // passed in data could be NavParams, but all we care about is its data object
            this.data = (data instanceof nav_params_1.NavParams ? data.data : (util_1.isPresent(data) ? data : {}));
            this._cssClass = rootCssClass;
            this._ts = Date.now();
        }
        /**
         * @hidden
         * @param {?} componentRef
         * @return {?}
         */
        ViewController.prototype.init = function (componentRef) {
            (void 0) /* assert */;
            this._ts = Date.now();
            this._cmp = componentRef;
            this.instance = this.instance || componentRef.instance;
            this._detached = false;
        };
        /**
         * @param {?} navCtrl
         * @return {?}
         */
        ViewController.prototype._setNav = function (navCtrl) {
            this._nav = navCtrl;
        };
        /**
         * @param {?} instance
         * @return {?}
         */
        ViewController.prototype._setInstance = function (instance) {
            this.instance = instance;
        };
        /**
         * @hidden
         * @param {?=} generatorOrNext
         * @return {?}
         */
        ViewController.prototype.subscribe = function (generatorOrNext) {
            return this._emitter.subscribe(generatorOrNext);
        };
        /**
         * @hidden
         * @param {?=} data
         * @return {?}
         */
        ViewController.prototype.emit = function (data) {
            this._emitter.emit(data);
        };
        /**
         * Called when the current viewController has be successfully dismissed
         * @param {?} callback
         * @return {?}
         */
        ViewController.prototype.onDidDismiss = function (callback) {
            this._onDidDismiss = callback;
        };
        /**
         * Called when the current viewController will be dismissed
         * @param {?} callback
         * @return {?}
         */
        ViewController.prototype.onWillDismiss = function (callback) {
            this._onWillDismiss = callback;
        };
        /**
         * Dismiss the current viewController
         * @param {?=} data
         * @param {?=} role
         * @param {?=} navOptions
         * @return {?}
         */
        ViewController.prototype.dismiss = function (data, role, navOptions) {
            if (navOptions === void 0) { navOptions = {}; }
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
            var /** @type {?} */ options = Object.assign({}, this._leavingOpts, navOptions);
            return this._nav.removeView(this, options).then(function () { return data; });
        };
        /**
         * @hidden
         * @return {?}
         */
        ViewController.prototype.getNav = function () {
            return this._nav;
        };
        /**
         * @hidden
         * @param {?} _direction
         * @return {?}
         */
        ViewController.prototype.getTransitionName = function (_direction) {
            return this._nav && this._nav.config.get('pageTransition');
        };
        /**
         * @hidden
         * @return {?}
         */
        ViewController.prototype.getNavParams = function () {
            return new nav_params_1.NavParams(this.data);
        };
        /**
         * @hidden
         * @param {?} opts
         * @return {?}
         */
        ViewController.prototype.setLeavingOpts = function (opts) {
            this._leavingOpts = opts;
        };
        /**
         * Check to see if you can go back in the navigation stack.
         * @return {?}
         */
        ViewController.prototype.enableBack = function () {
            // update if it's possible to go back from this nav item
            if (!this._nav) {
                return false;
            }
            // the previous view may exist, but if it's about to be destroyed
            // it shouldn't be able to go back to
            var /** @type {?} */ previousItem = this._nav.getPrevious(this);
            return !!(previousItem);
        };
        Object.defineProperty(ViewController.prototype, "name", {
            /**
             * @hidden
             * @return {?}
             */
            get: function () {
                return (this.component ? this.component.name : '');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewController.prototype, "index", {
            /**
             * Get the index of the current component in the current navigation stack.
             * @return {?}
             */
            get: function () {
                return (this._nav ? this._nav.indexOf(this) : -1);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        ViewController.prototype.isFirst = function () {
            return (this._nav ? this._nav.first() === this : false);
        };
        /**
         * @return {?}
         */
        ViewController.prototype.isLast = function () {
            return (this._nav ? this._nav.last() === this : false);
        };
        /**
         * @hidden
         * DOM WRITE
         * @param {?} shouldShow
         * @param {?} renderer
         * @return {?}
         */
        ViewController.prototype._domShow = function (shouldShow, renderer) {
            // using hidden element attribute to display:none and not render views
            // _hidden value of '' means the hidden attribute will be added
            // _hidden value of null means the hidden attribute will be removed
            // doing checks to make sure we only update the DOM when actually needed
            // if it should render, then the hidden attribute should not be on the element
            if (this._cmp && shouldShow === this._isHidden) {
                this._isHidden = !shouldShow;
                var /** @type {?} */ value = (shouldShow ? null : '');
                // ******** DOM WRITE ****************
                renderer.setElementAttribute(this.pageRef().nativeElement, 'hidden', value);
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        ViewController.prototype.getZIndex = function () {
            return this._zIndex;
        };
        /**
         * @hidden
         * DOM WRITE
         * @param {?} zIndex
         * @param {?} renderer
         * @return {?}
         */
        ViewController.prototype._setZIndex = function (zIndex, renderer) {
            if (zIndex !== this._zIndex) {
                this._zIndex = zIndex;
                var /** @type {?} */ pageRef = this.pageRef();
                if (pageRef) {
                    // ******** DOM WRITE ****************
                    renderer.setElementStyle(pageRef.nativeElement, 'z-index', ((zIndex)));
                }
            }
        };
        /**
         * @return {?}
         */
        ViewController.prototype.pageRef = function () {
            return this._cmp && this._cmp.location;
        };
        /**
         * @param {?} directive
         * @return {?}
         */
        ViewController.prototype._setContent = function (directive) {
            this._cntDir = directive;
        };
        /**
         * @return {?}
         */
        ViewController.prototype.getContent = function () {
            return this._cntDir;
        };
        /**
         * @param {?} elementRef
         * @return {?}
         */
        ViewController.prototype._setContentRef = function (elementRef) {
            this._cntRef = elementRef;
        };
        /**
         * @return {?}
         */
        ViewController.prototype.contentRef = function () {
            return this._cntRef;
        };
        /**
         * @param {?} content
         * @return {?}
         */
        ViewController.prototype._setIONContent = function (content) {
            this._setContent(content);
            this._ionCntDir = content;
        };
        /**
         * @hidden
         * @return {?}
         */
        ViewController.prototype.getIONContent = function () {
            return this._ionCntDir;
        };
        /**
         * @param {?} elementRef
         * @return {?}
         */
        ViewController.prototype._setIONContentRef = function (elementRef) {
            this._setContentRef(elementRef);
            this._ionCntRef = elementRef;
        };
        /**
         * @hidden
         * @return {?}
         */
        ViewController.prototype.getIONContentRef = function () {
            return this._ionCntRef;
        };
        /**
         * @param {?} directive
         * @return {?}
         */
        ViewController.prototype._setHeader = function (directive) {
            this._hdrDir = directive;
        };
        /**
         * @hidden
         * @return {?}
         */
        ViewController.prototype.getHeader = function () {
            return this._hdrDir;
        };
        /**
         * @param {?} directive
         * @return {?}
         */
        ViewController.prototype._setFooter = function (directive) {
            this._ftrDir = directive;
        };
        /**
         * @hidden
         * @return {?}
         */
        ViewController.prototype.getFooter = function () {
            return this._ftrDir;
        };
        /**
         * @param {?} directive
         * @return {?}
         */
        ViewController.prototype._setNavbar = function (directive) {
            this._nb = directive;
        };
        /**
         * @hidden
         * @return {?}
         */
        ViewController.prototype.getNavbar = function () {
            return this._nb;
        };
        /**
         * Find out if the current component has a NavBar or not. Be sure
         * to wrap this in an `ionViewWillEnter` method in order to make sure
         * the view has rendered fully.
         * @return {?}
         */
        ViewController.prototype.hasNavbar = function () {
            return !!this._nb;
        };
        /**
         * Change the title of the back-button. Be sure to call this
         * after `ionViewWillEnter` to make sure the  DOM has been rendered.
         * @param {?} val
         * @return {?}
         */
        ViewController.prototype.setBackButtonText = function (val) {
            this._nb && this._nb.setBackButtonText(val);
        };
        /**
         * Set if the back button for the current view is visible or not. Be sure to call this
         * after `ionViewWillEnter` to make sure the  DOM has been rendered.
         * @param {?} shouldShow
         * @return {?}
         */
        ViewController.prototype.showBackButton = function (shouldShow) {
            if (this._nb) {
                this._nb.hideBackButton = !shouldShow;
            }
        };
        /**
         * @return {?}
         */
        ViewController.prototype._preLoad = function () {
            (void 0) /* assert */;
            this._lifecycle('PreLoad');
        };
        /**
         * @hidden
         * The view has loaded. This event only happens once per view will be created.
         * This event is fired before the component and his children have been initialized.
         * @return {?}
         */
        ViewController.prototype._willLoad = function () {
            (void 0) /* assert */;
            this._lifecycle('WillLoad');
        };
        /**
         * @hidden
         * The view has loaded. This event only happens once per view being
         * created. If a view leaves but is cached, then this will not
         * fire again on a subsequent viewing. This method is a good place
         * to put your setup code for the view; however, it is not the
         * recommended method to use when a view becomes active.
         * @return {?}
         */
        ViewController.prototype._didLoad = function () {
            (void 0) /* assert */;
            this._lifecycle('DidLoad');
        };
        /**
         * @hidden
         * The view is about to enter and become the active view.
         * @return {?}
         */
        ViewController.prototype._willEnter = function () {
            (void 0) /* assert */;
            if (this._detached && this._cmp) {
                // ensure this has been re-attached to the change detector
                this._cmp.changeDetectorRef.reattach();
                this._detached = false;
            }
            this.willEnter.emit(null);
            this._lifecycle('WillEnter');
        };
        /**
         * @hidden
         * The view has fully entered and is now the active view. This
         * will fire, whether it was the first load or loaded from the cache.
         * @return {?}
         */
        ViewController.prototype._didEnter = function () {
            (void 0) /* assert */;
            this._nb && this._nb.didEnter();
            this.didEnter.emit(null);
            this._lifecycle('DidEnter');
        };
        /**
         * @hidden
         * The view is about to leave and no longer be the active view.
         * @param {?} willUnload
         * @return {?}
         */
        ViewController.prototype._willLeave = function (willUnload) {
            this.willLeave.emit(null);
            this._lifecycle('WillLeave');
            if (willUnload && this._onWillDismiss) {
                this._onWillDismiss(this._dismissData, this._dismissRole);
                this._onWillDismiss = null;
            }
        };
        /**
         * @hidden
         * The view has finished leaving and is no longer the active view. This
         * will fire, whether it is cached or unloaded.
         * @return {?}
         */
        ViewController.prototype._didLeave = function () {
            this.didLeave.emit(null);
            this._lifecycle('DidLeave');
            // when this is not the active page
            // we no longer need to detect changes
            if (!this._detached && this._cmp) {
                this._cmp.changeDetectorRef.detach();
                this._detached = true;
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        ViewController.prototype._willUnload = function () {
            this.willUnload.emit(null);
            this._lifecycle('WillUnload');
            this._onDidDismiss && this._onDidDismiss(this._dismissData, this._dismissRole);
            this._onDidDismiss = null;
            this._dismissData = null;
            this._dismissRole = null;
        };
        /**
         * @hidden
         * DOM WRITE
         * @param {?} renderer
         * @return {?}
         */
        ViewController.prototype._destroy = function (renderer) {
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
            this._state = nav_util_1.STATE_DESTROYED;
        };
        /**
         * @hidden
         * @param {?} lifecycle
         * @return {?}
         */
        ViewController.prototype._lifecycleTest = function (lifecycle) {
            var /** @type {?} */ instance = this.instance;
            var /** @type {?} */ methodName = 'ionViewCan' + lifecycle;
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
                    return Promise.reject(this.name + " " + methodName + " error: " + e.message);
                }
            }
            return Promise.resolve(true);
        };
        /**
         * @hidden
         * @param {?} lifecycle
         * @return {?}
         */
        ViewController.prototype._lifecycle = function (lifecycle) {
            var /** @type {?} */ instance = this.instance;
            var /** @type {?} */ methodName = 'ionView' + lifecycle;
            if (instance && instance[methodName]) {
                instance[methodName]();
            }
        };
        return ViewController;
    }());
    ViewController.propDecorators = {
        '_emitter': [{ type: core_1.Output },],
    };
    exports.ViewController = ViewController;
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
    function isViewController(viewCtrl) {
        return !!(viewCtrl && ((viewCtrl))._didLoad && ((viewCtrl))._willUnload);
    }
    exports.isViewController = isViewController;
    var /** @type {?} */ DEFAULT_CSS_CLASS = 'ion-page';
});
//# sourceMappingURL=view-controller.js.map