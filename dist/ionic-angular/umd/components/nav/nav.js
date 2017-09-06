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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../app/app", "../../config/config", "../../navigation/deep-linker", "../../platform/dom-controller", "../../gestures/gesture-controller", "../../navigation/nav-controller", "../../navigation/nav-controller-base", "../../platform/platform", "../../transitions/transition-controller", "../../navigation/view-controller", "../split-pane/split-pane"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var app_1 = require("../app/app");
    var config_1 = require("../../config/config");
    var deep_linker_1 = require("../../navigation/deep-linker");
    var dom_controller_1 = require("../../platform/dom-controller");
    var gesture_controller_1 = require("../../gestures/gesture-controller");
    var nav_controller_1 = require("../../navigation/nav-controller");
    var nav_controller_base_1 = require("../../navigation/nav-controller-base");
    var platform_1 = require("../../platform/platform");
    var transition_controller_1 = require("../../transitions/transition-controller");
    var view_controller_1 = require("../../navigation/view-controller");
    var split_pane_1 = require("../split-pane/split-pane");
    /**
     * \@name Nav
     * \@description
     *
     * `ion-nav` is the declarative component for a [NavController](../../../navigation/NavController/).
     *
     * For more information on using nav controllers like Nav or [Tab](../../Tabs/Tab/),
     * take a look at the [NavController API Docs](../../../navigation/NavController/).
     *
     *
     * \@usage
     * You must set a root page to be loaded initially by any Nav you create, using
     * the 'root' property:
     *
     * ```ts
     * import { Component } from '\@angular/core';
     * import { GettingStartedPage } from './getting-started';
     *
     * \@Component({
     *   template: `<ion-nav [root]="root"></ion-nav>`
     * })
     * class MyApp {
     *   root = GettingStartedPage;
     *
     *   constructor(){
     *   }
     * }
     * ```
     *
     * \@demo /docs/demos/src/navigation/
     * @see {\@link /docs/components#navigation Navigation Component Docs}
     */
    var Nav = (function (_super) {
        __extends(Nav, _super);
        /**
         * @param {?} viewCtrl
         * @param {?} parent
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
         * @param {?} domCtrl
         * @param {?} errHandler
         */
        function Nav(viewCtrl, parent, app, config, plt, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl, errHandler) {
            var _this = _super.call(this, parent, app, config, plt, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl, errHandler) || this;
            _this._hasInit = false;
            if (viewCtrl) {
                // an ion-nav can also act as an ion-page within a parent ion-nav
                // this would happen when an ion-nav nests a child ion-nav.
                viewCtrl._setContent(_this);
            }
            if (parent) {
                // this Nav has a parent Nav
                parent.registerChildNav(_this);
            }
            else if (viewCtrl && viewCtrl.getNav()) {
                // this Nav was opened from a modal
                _this.parent = viewCtrl.getNav();
                _this.parent.registerChildNav(_this);
            }
            else if (app && !app.getRootNavById(_this.id)) {
                // a root nav has not been registered yet with the app
                // this is the root navcontroller for the entire app
                app.registerRootNav(_this);
            }
            return _this;
        }
        Object.defineProperty(Nav.prototype, "_vp", {
            /**
             * @hidden
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this.setViewport(val);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        Nav.prototype.ngAfterViewInit = function () {
            var _this = this;
            this._hasInit = true;
            var /** @type {?} */ segment = this._linker.getSegmentByNavIdOrName(this.id, this.name);
            if (segment && (segment.component || segment.loadChildren)) {
                return this._linker.initViews(segment).then(function (views) {
                    return _this.setPages(views, null, null);
                });
            }
            else if (this._root) {
                // no segment match, so use the root property but don't set the url I guess
                var /** @type {?} */ setUrl = segment ? false : true;
                return this.push(this._root, this.rootParams, {
                    isNavRoot: ((this._app.getRootNavById(this.id)) === this),
                    updateUrl: setUrl
                }, null);
            }
        };
        Object.defineProperty(Nav.prototype, "root", {
            /**
             * \@input {Page} The Page component to load as the root page within this nav.
             * @return {?}
             */
            get: function () {
                return this._root;
            },
            /**
             * @param {?} page
             * @return {?}
             */
            set: function (page) {
                this._root = page;
                if (this._hasInit) {
                    this.setRoot(page);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * @return {?}
         */
        Nav.prototype.ngOnDestroy = function () {
            this.destroy();
        };
        /**
         * @return {?}
         */
        Nav.prototype.initPane = function () {
            var /** @type {?} */ isMain = this._elementRef.nativeElement.hasAttribute('main');
            return isMain;
        };
        /**
         * @param {?} isPane
         * @return {?}
         */
        Nav.prototype.paneChanged = function (isPane) {
            if (isPane) {
                this.resize();
            }
        };
        /**
         * @param {?} opts
         * @return {?}
         */
        Nav.prototype.goToRoot = function (opts) {
            return this.setRoot(this._root, this.rootParams, opts, null);
        };
        /**
         * @return {?}
         */
        Nav.prototype.getType = function () {
            return 'nav';
        };
        /**
         * @return {?}
         */
        Nav.prototype.getSecondaryIdentifier = function () {
            return null;
        };
        return Nav;
    }(nav_controller_base_1.NavControllerBase));
    Nav.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-nav',
                    template: '<div #viewport nav-viewport></div>' +
                        '<div class="nav-decor"></div>',
                    encapsulation: core_1.ViewEncapsulation.None,
                    providers: [{ provide: split_pane_1.RootNode, useExisting: core_1.forwardRef(function () { return Nav; }) }]
                },] },
    ];
    /**
     * @nocollapse
     */
    Nav.ctorParameters = function () { return [
        { type: view_controller_1.ViewController, decorators: [{ type: core_1.Optional },] },
        { type: nav_controller_1.NavController, decorators: [{ type: core_1.Optional },] },
        { type: app_1.App, },
        { type: config_1.Config, },
        { type: platform_1.Platform, },
        { type: core_1.ElementRef, },
        { type: core_1.NgZone, },
        { type: core_1.Renderer, },
        { type: core_1.ComponentFactoryResolver, },
        { type: gesture_controller_1.GestureController, },
        { type: transition_controller_1.TransitionController, },
        { type: deep_linker_1.DeepLinker, decorators: [{ type: core_1.Optional },] },
        { type: dom_controller_1.DomController, },
        { type: core_1.ErrorHandler, },
    ]; };
    Nav.propDecorators = {
        '_vp': [{ type: core_1.ViewChild, args: ['viewport', { read: core_1.ViewContainerRef },] },],
        'root': [{ type: core_1.Input },],
        'rootParams': [{ type: core_1.Input },],
        'name': [{ type: core_1.Input },],
    };
    exports.Nav = Nav;
    function Nav_tsickle_Closure_declarations() {
        /** @type {?} */
        Nav.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Nav.ctorParameters;
        /** @type {?} */
        Nav.propDecorators;
        /** @type {?} */
        Nav.prototype._root;
        /** @type {?} */
        Nav.prototype._hasInit;
        /**
         * \@input {object} Any nav-params to pass to the root page of this nav.
         * @type {?}
         */
        Nav.prototype.rootParams;
        /**
         * \@input {string} a unique name for the nav element
         * @type {?}
         */
        Nav.prototype.name;
    }
});
//# sourceMappingURL=nav.js.map