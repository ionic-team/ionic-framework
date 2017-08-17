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
        define(["require", "exports", "@angular/core", "../app/app", "../../config/config", "../../navigation/deep-linker", "../../platform/dom-controller", "../../gestures/gesture-controller", "../../util/util", "../../navigation/nav-controller-base", "../../platform/platform", "./tabs", "../../transitions/transition-controller"], factory);
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
    var util_1 = require("../../util/util");
    var nav_controller_base_1 = require("../../navigation/nav-controller-base");
    var platform_1 = require("../../platform/platform");
    var tabs_1 = require("./tabs");
    var transition_controller_1 = require("../../transitions/transition-controller");
    /**
     * \@name Tab
     * \@description
     * The Tab component, written `<ion-tab>`, is styled based on the mode and should
     * be used in conjunction with the [Tabs](../Tabs/) component.
     *
     * Each `ion-tab` is a declarative component for a [NavController](../../../navigation/NavController/).
     * Basically, each tab is a `NavController`. For more information on using
     * navigation controllers take a look at the [NavController API Docs](../../../navigation/NavController/).
     *
     * See the [Tabs API Docs](../Tabs/) for more details on configuring Tabs.
     *
     * \@usage
     *
     * To add a basic tab, you can use the following markup where the `root` property
     * is the page you want to load for that tab, `tabTitle` is the optional text to
     * display on the tab, and `tabIcon` is the optional [icon](../../icon/Icon/).
     *
     * ```html
     * <ion-tabs>
     *  <ion-tab [root]="chatRoot" tabTitle="Chat" tabIcon="chat"></ion-tab>
     * </ion-tabs>
     * ```
     *
     * Then, in your class you can set `chatRoot` to an imported class:
     *
     * ```ts
     * import { ChatPage } from '../chat/chat';
     *
     * export class Tabs {
     *   // here we'll set the property of chatRoot to
     *   // the imported class of ChatPage
     *   chatRoot = ChatPage;
     *
     *   constructor() {
     *
     *   }
     * }
     * ```
     *
     * You can also pass some parameters to the root page of the tab through
     * `rootParams`. Below we pass `chatParams` to the Chat tab:
     *
     * ```html
     * <ion-tabs>
     *  <ion-tab [root]="chatRoot" [rootParams]="chatParams" tabTitle="Chat" tabIcon="chat"></ion-tab>
     * </ion-tabs>
     * ```
     *
     * ```ts
     * export class Tabs {
     *   chatRoot = ChatPage;
     *
     *   // set some user information on chatParams
     *   chatParams = {
     *     user1: 'admin',
     *     user2: 'ionic'
     *   };
     *
     *   constructor() {
     *
     *   }
     * }
     * ```
     *
     * And in `ChatPage` you can get the data from `NavParams`:
     *
     * ```ts
     * export class ChatPage {
     *   constructor(navParams: NavParams) {
     *     console.log('Passed params', navParams.data);
     *   }
     * }
     * ```
     *
     * Sometimes you may want to call a method instead of navigating to a new
     * page. You can use the `(ionSelect)` event to call a method on your class when
     * the tab is selected. Below is an example of presenting a modal from one of
     * the tabs.
     *
     * ```html
     * <ion-tabs>
     *   <ion-tab (ionSelect)="chat()" tabTitle="Show Modal"></ion-tab>
     * </ion-tabs>
     * ```
     *
     * ```ts
     * export class Tabs {
     *   constructor(public modalCtrl: ModalController) {
     *
     *   }
     *
     *   chat() {
     *     let modal = this.modalCtrl.create(ChatPage);
     *     modal.present();
     *   }
     * }
     * ```
     *
     *
     * \@demo /docs/demos/src/tabs/
     * @see {\@link /docs/components#tabs Tabs Component Docs}
     * @see {\@link ../../tabs/Tabs Tabs API Docs}
     * @see {\@link ../../nav/Nav Nav API Docs}
     * @see {\@link ../../nav/NavController NavController API Docs}
     */
    var Tab = (function (_super) {
        __extends(Tab, _super);
        /**
         * @param {?} parent
         * @param {?} app
         * @param {?} config
         * @param {?} plt
         * @param {?} elementRef
         * @param {?} zone
         * @param {?} renderer
         * @param {?} cfr
         * @param {?} _cd
         * @param {?} gestureCtrl
         * @param {?} transCtrl
         * @param {?} linker
         * @param {?} _dom
         * @param {?} errHandler
         */
        function Tab(parent, app, config, plt, elementRef, zone, renderer, cfr, _cd, gestureCtrl, transCtrl, linker, _dom, errHandler) {
            var _this = 
            // A Tab is a NavController for its child pages
            _super.call(this, parent, app, config, plt, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, _dom, errHandler) || this;
            _this._cd = _cd;
            _this.linker = linker;
            _this._dom = _dom;
            /**
             * @hidden
             */
            _this._isEnabled = true;
            /**
             * @hidden
             */
            _this._isShown = true;
            /**
             * \@output {Tab} Emitted when the current tab is selected.
             */
            _this.ionSelect = new core_1.EventEmitter();
            _this.id = parent.add(_this);
            _this._tabsHideOnSubPages = config.getBoolean('tabsHideOnSubPages');
            _this._tabId = 'tabpanel-' + _this.id;
            _this._btnId = 'tab-' + _this.id;
            return _this;
        }
        Object.defineProperty(Tab.prototype, "enabled", {
            /**
             * \@input {boolean} If true, enable the tab. If false,
             * the user cannot interact with this element.
             * Default: `true`.
             * @return {?}
             */
            get: function () {
                return this._isEnabled;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._isEnabled = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tab.prototype, "show", {
            /**
             * \@input {boolean} If true, the tab button is visible within the
             * tabbar. Default: `true`.
             * @return {?}
             */
            get: function () {
                return this._isShown;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._isShown = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tab.prototype, "tabsHideOnSubPages", {
            /**
             * \@input {boolean} If true, hide the tabs on child pages.
             * @return {?}
             */
            get: function () {
                return this._tabsHideOnSubPages;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._tabsHideOnSubPages = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tab.prototype, "_vp", {
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
         * @hidden
         * @return {?}
         */
        Tab.prototype.ngOnInit = function () {
            this.tabBadgeStyle = this.tabBadgeStyle ? this.tabBadgeStyle : 'default';
        };
        /**
         * @hidden
         * @param {?} opts
         * @param {?=} done
         * @return {?}
         */
        Tab.prototype.load = function (opts, done) {
            var _this = this;
            if (this._lazyRootFromUrl || (!this._loaded && this.root)) {
                this.setElementClass('show-tab', true);
                // okay, first thing we need to do if check if the view already exists
                var /** @type {?} */ nameToUse = this._lazyRootFromUrl ? this._lazyRootFromUrl : this.root;
                var /** @type {?} */ dataToUse = this._lazyRootFromUrlData ? this._lazyRootFromUrlData : this.rootParams;
                var /** @type {?} */ numViews = this.length() - 1;
                for (var /** @type {?} */ i = numViews; i >= 0; i--) {
                    var /** @type {?} */ viewController = this.getByIndex(i);
                    if (viewController && (viewController.id === nameToUse || viewController.component === nameToUse)) {
                        if (i === numViews) {
                            // this is the last view in the stack and it's the same
                            // as the segment so there's no change needed
                            return done();
                        }
                        else {
                            // it's not the exact view as the end
                            // let's have this nav go back to this exact view
                            return this.popTo(viewController, {
                                animate: false,
                                updateUrl: false,
                            }, done);
                        }
                    }
                }
                this.push(nameToUse, dataToUse, opts, done);
                this._lazyRootFromUrl = null;
                this._lazyRootFromUrlData = null;
                this._loaded = true;
            }
            else {
                // if this is not the Tab's initial load then we need
                // to refresh the tabbar and content dimensions to be sure
                // they're lined up correctly
                this._dom.read(function () {
                    _this.resize();
                });
                return done();
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        Tab.prototype.resize = function () {
            var /** @type {?} */ active = this.getActive();
            if (!active) {
                return;
            }
            var /** @type {?} */ content = active.getIONContent();
            content && content.resize();
        };
        /**
         * @hidden
         * @param {?} viewCtrl
         * @param {?} componentRef
         * @param {?} viewport
         * @return {?}
         */
        Tab.prototype._viewAttachToDOM = function (viewCtrl, componentRef, viewport) {
            var /** @type {?} */ isTabSubPage = (this._tabsHideOnSubPages && viewCtrl.index > 0);
            if (isTabSubPage) {
                viewport = this.parent.portal;
            }
            _super.prototype._viewAttachToDOM.call(this, viewCtrl, componentRef, viewport);
            if (isTabSubPage) {
                // add the .tab-subpage css class to tabs pages that should act like subpages
                var /** @type {?} */ pageEleRef = viewCtrl.pageRef();
                if (pageEleRef) {
                    this._renderer.setElementClass(pageEleRef.nativeElement, 'tab-subpage', true);
                }
            }
        };
        /**
         * @hidden
         * @param {?} isSelected
         * @return {?}
         */
        Tab.prototype.setSelected = function (isSelected) {
            this.isSelected = isSelected;
            this.setElementClass('show-tab', isSelected);
            this.setElementAttribute('aria-hidden', (!isSelected).toString());
            if (isSelected) {
                // this is the selected tab, detect changes
                this._cd.reattach();
            }
            else {
                // this tab is not selected, do not detect changes
                this._cd.detach();
            }
        };
        Object.defineProperty(Tab.prototype, "index", {
            /**
             * @hidden
             * @return {?}
             */
            get: function () {
                return this.parent.getIndex(this);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * @param {?} component
         * @param {?} data
         * @return {?}
         */
        Tab.prototype.updateHref = function (component, data) {
            if (this.btn && this.linker) {
                var /** @type {?} */ href = this.linker.createUrl(this.parent, component, data) || '#';
                this.btn.updateHref(href);
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        Tab.prototype.ngOnDestroy = function () {
            this.destroy();
        };
        /**
         * @hidden
         * @return {?}
         */
        Tab.prototype.getType = function () {
            return 'tab';
        };
        /**
         * @param {?} opts
         * @return {?}
         */
        Tab.prototype.goToRoot = function (opts) {
            return this.setRoot(this.root, this.rootParams, opts, null);
        };
        return Tab;
    }(nav_controller_base_1.NavControllerBase));
    Tab.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-tab',
                    template: '<div #viewport></div><div class="nav-decor"></div>',
                    host: {
                        '[attr.id]': '_tabId',
                        '[attr.aria-labelledby]': '_btnId',
                        'role': 'tabpanel'
                    },
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    Tab.ctorParameters = function () { return [
        { type: tabs_1.Tabs, },
        { type: app_1.App, },
        { type: config_1.Config, },
        { type: platform_1.Platform, },
        { type: core_1.ElementRef, },
        { type: core_1.NgZone, },
        { type: core_1.Renderer, },
        { type: core_1.ComponentFactoryResolver, },
        { type: core_1.ChangeDetectorRef, },
        { type: gesture_controller_1.GestureController, },
        { type: transition_controller_1.TransitionController, },
        { type: deep_linker_1.DeepLinker, decorators: [{ type: core_1.Optional },] },
        { type: dom_controller_1.DomController, },
        { type: core_1.ErrorHandler, },
    ]; };
    Tab.propDecorators = {
        'root': [{ type: core_1.Input },],
        'rootParams': [{ type: core_1.Input },],
        'tabUrlPath': [{ type: core_1.Input },],
        'tabTitle': [{ type: core_1.Input },],
        'tabIcon': [{ type: core_1.Input },],
        'tabBadge': [{ type: core_1.Input },],
        'tabBadgeStyle': [{ type: core_1.Input },],
        'enabled': [{ type: core_1.Input },],
        'show': [{ type: core_1.Input },],
        'tabsHideOnSubPages': [{ type: core_1.Input },],
        'ionSelect': [{ type: core_1.Output },],
        '_vp': [{ type: core_1.ViewChild, args: ['viewport', { read: core_1.ViewContainerRef },] },],
    };
    exports.Tab = Tab;
    function Tab_tsickle_Closure_declarations() {
        /** @type {?} */
        Tab.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Tab.ctorParameters;
        /** @type {?} */
        Tab.propDecorators;
        /**
         * @hidden
         * @type {?}
         */
        Tab.prototype._isInitial;
        /**
         * @hidden
         * @type {?}
         */
        Tab.prototype._isEnabled;
        /**
         * @hidden
         * @type {?}
         */
        Tab.prototype._isShown;
        /**
         * @hidden
         * @type {?}
         */
        Tab.prototype._tabId;
        /**
         * @hidden
         * @type {?}
         */
        Tab.prototype._btnId;
        /**
         * @hidden
         * @type {?}
         */
        Tab.prototype._loaded;
        /**
         * @hidden
         * @type {?}
         */
        Tab.prototype.isSelected;
        /**
         * @hidden
         * @type {?}
         */
        Tab.prototype.btn;
        /**
         * @hidden
         * @type {?}
         */
        Tab.prototype._tabsHideOnSubPages;
        /**
         * @hidden
         * @type {?}
         */
        Tab.prototype._lazyRootFromUrl;
        /**
         * @hidden
         * @type {?}
         */
        Tab.prototype._lazyRootFromUrlData;
        /**
         * \@input {Page} Set the root page for this tab.
         * @type {?}
         */
        Tab.prototype.root;
        /**
         * \@input {object} Any nav-params to pass to the root page of this tab.
         * @type {?}
         */
        Tab.prototype.rootParams;
        /**
         * \@input {string} The URL path name to represent this tab within the URL.
         * @type {?}
         */
        Tab.prototype.tabUrlPath;
        /**
         * \@input {string} The title of the tab button.
         * @type {?}
         */
        Tab.prototype.tabTitle;
        /**
         * \@input {string} The icon for the tab button.
         * @type {?}
         */
        Tab.prototype.tabIcon;
        /**
         * \@input {string} The badge for the tab button.
         * @type {?}
         */
        Tab.prototype.tabBadge;
        /**
         * \@input {string} The badge color for the tab button.
         * @type {?}
         */
        Tab.prototype.tabBadgeStyle;
        /**
         * \@output {Tab} Emitted when the current tab is selected.
         * @type {?}
         */
        Tab.prototype.ionSelect;
        /** @type {?} */
        Tab.prototype._cd;
        /** @type {?} */
        Tab.prototype.linker;
        /** @type {?} */
        Tab.prototype._dom;
    }
});
//# sourceMappingURL=tab.js.map