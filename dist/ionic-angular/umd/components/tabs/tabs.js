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
        define(["require", "exports", "@angular/core", "rxjs/Subject", "rxjs/add/operator/takeUntil", "../app/app", "../../config/config", "../../navigation/deep-linker", "../ion", "../../util/util", "../../platform/keyboard", "../../navigation/nav-controller", "../../navigation/nav-util", "../../navigation/url-serializer", "../split-pane/split-pane", "../../platform/platform", "./tab-highlight", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var Subject_1 = require("rxjs/Subject");
    require("rxjs/add/operator/takeUntil");
    var app_1 = require("../app/app");
    var config_1 = require("../../config/config");
    var deep_linker_1 = require("../../navigation/deep-linker");
    var ion_1 = require("../ion");
    var util_1 = require("../../util/util");
    var keyboard_1 = require("../../platform/keyboard");
    var nav_controller_1 = require("../../navigation/nav-controller");
    var nav_util_1 = require("../../navigation/nav-util");
    var url_serializer_1 = require("../../navigation/url-serializer");
    var split_pane_1 = require("../split-pane/split-pane");
    var platform_1 = require("../../platform/platform");
    var tab_highlight_1 = require("./tab-highlight");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * \@name Tabs
     * \@description
     * Tabs make it easy to navigate between different pages or functional
     * aspects of an app. The Tabs component, written as `<ion-tabs>`, is
     * a container of individual [Tab](../Tab/) components. Each individual `ion-tab`
     * is a declarative component for a [NavController](../../../navigation/NavController/)
     *
     * For more information on using nav controllers like Tab or [Nav](../../nav/Nav/),
     * take a look at the [NavController API Docs](../../../navigation/NavController/).
     *
     * ### Placement
     *
     * The position of the tabs relative to the content varies based on
     * the mode. The tabs are placed at the bottom of the screen
     * for iOS and Android, and at the top for Windows by default. The position can
     * be configured using the `tabsPlacement` attribute on the `<ion-tabs>` component,
     * or in an app's [config](../../config/Config/).
     * See the [Input Properties](#input-properties) below for the available
     * values of `tabsPlacement`.
     *
     * ### Layout
     *
     * The layout for all of the tabs can be defined using the `tabsLayout`
     * property. If the individual tab has a title and icon, the icons will
     * show on top of the title by default. All tabs can be changed by setting
     * the value of `tabsLayout` on the `<ion-tabs>` element, or in your
     * app's [config](../../config/Config/). For example, this is useful if
     * you want to show tabs with a title only on Android, but show icons
     * and a title for iOS. See the [Input Properties](#input-properties)
     * below for the available values of `tabsLayout`.
     *
     * ### Selecting a Tab
     *
     * There are different ways you can select a specific tab from the tabs
     * component. You can use the `selectedIndex` property to set the index
     * on the `<ion-tabs>` element, or you can call `select()` from the `Tabs`
     * instance after creation. See [usage](#usage) below for more information.
     *
     * \@usage
     *
     * You can add a basic tabs template to a `\@Component` using the following
     * template:
     *
     * ```html
     * <ion-tabs>
     *   <ion-tab [root]="tab1Root"></ion-tab>
     *   <ion-tab [root]="tab2Root"></ion-tab>
     *   <ion-tab [root]="tab3Root"></ion-tab>
     * </ion-tabs>
     * ```
     *
     * Where `tab1Root`, `tab2Root`, and `tab3Root` are each a page:
     *
     * ```ts
     * \@Component({
     *   templateUrl: 'build/pages/tabs/tabs.html'
     * })
     * export class TabsPage {
     *   // this tells the tabs component which Pages
     *   // should be each tab's root Page
     *   tab1Root = Page1;
     *   tab2Root = Page2;
     *   tab3Root = Page3;
     *
     *   constructor() {
     *
     *   }
     * }
     * ```
     *
     * By default, the first tab will be selected upon navigation to the
     * Tabs page. We can change the selected tab by using `selectedIndex`
     * on the `<ion-tabs>` element:
     *
     * ```html
     * <ion-tabs selectedIndex="2">
     *   <ion-tab [root]="tab1Root"></ion-tab>
     *   <ion-tab [root]="tab2Root"></ion-tab>
     *   <ion-tab [root]="tab3Root"></ion-tab>
     * </ion-tabs>
     * ```
     *
     * Since the index starts at `0`, this will select the 3rd tab which has
     * root set to `tab3Root`. If you wanted to change it dynamically from
     * your class, you could use [property binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#property-binding).
     *
     * Alternatively, you can grab the `Tabs` instance and call the `select()`
     * method. This requires the `<ion-tabs>` element to have an `id`. For
     * example, set the value of `id` to `myTabs`:
     *
     * ```html
     * <ion-tabs #myTabs>
     *   <ion-tab [root]="tab1Root"></ion-tab>
     *   <ion-tab [root]="tab2Root"></ion-tab>
     *   <ion-tab [root]="tab3Root"></ion-tab>
     * </ion-tabs>
     * ```
     *
     * Then in your class you can grab the `Tabs` instance and call `select()`,
     * passing the index of the tab as the argument. Here we're grabbing the tabs
     * by using ViewChild.
     *
     * ```ts
     * export class TabsPage {
     *
     * \@ViewChild('myTabs') tabRef: Tabs;
     *
     * ionViewDidEnter() {
     *   this.tabRef.select(2);
     *  }
     *
     * }
     * ```
     *
     * You can also switch tabs from a child component by calling `select()` on the
     * parent view using the `NavController` instance. For example, assuming you have
     * a `TabsPage` component, you could call the following from any of the child
     * components to switch to `TabsRoot3`:
     *
     * ```ts
     * switchTabs() {
     *   this.navCtrl.parent.select(2);
     * }
     * ```
     * \@demo /docs/demos/src/tabs/
     *
     * @see {\@link /docs/components#tabs Tabs Component Docs}
     * @see {\@link ../Tab Tab API Docs}
     * @see {\@link ../../config/Config Config API Docs}
     *
     */
    var Tabs = (function (_super) {
        __extends(Tabs, _super);
        /**
         * @param {?} parent
         * @param {?} viewCtrl
         * @param {?} _app
         * @param {?} config
         * @param {?} elementRef
         * @param {?} _plt
         * @param {?} renderer
         * @param {?} _linker
         * @param {?=} keyboard
         */
        function Tabs(parent, viewCtrl, _app, config, elementRef, _plt, renderer, _linker, keyboard) {
            var _this = _super.call(this, config, elementRef, renderer, 'tabs') || this;
            _this.viewCtrl = viewCtrl;
            _this._app = _app;
            _this._plt = _plt;
            _this._linker = _linker;
            /**
             * \@internal
             */
            _this._ids = -1;
            /**
             * \@internal
             */
            _this._tabs = [];
            /**
             * \@internal
             */
            _this._selectHistory = [];
            /**
             * \@internal
             */
            _this._onDestroy = new Subject_1.Subject();
            /**
             * \@output {any} Emitted when the tab changes.
             */
            _this.ionChange = new core_1.EventEmitter();
            _this.parent = parent;
            _this.id = 't' + (++tabIds);
            _this._sbPadding = config.getBoolean('statusbarPadding');
            _this.tabsHighlight = config.getBoolean('tabsHighlight');
            if (_this.parent) {
                // this Tabs has a parent Nav
                _this.parent.registerChildNav(_this);
            }
            else if (viewCtrl && viewCtrl.getNav()) {
                // this Nav was opened from a modal
                _this.parent = viewCtrl.getNav();
                _this.parent.registerChildNav(_this);
            }
            else if (_this._app) {
                // this is the root navcontroller for the entire app
                _this._app.registerRootNav(_this);
            }
            // Tabs may also be an actual ViewController which was navigated to
            // if Tabs is static and not navigated to within a NavController
            // then skip this and don't treat it as it's own ViewController
            if (viewCtrl) {
                viewCtrl._setContent(_this);
                viewCtrl._setContentRef(elementRef);
            }
            var keyboardResizes = config.getBoolean('keyboardResizes', false);
            if (keyboard && keyboardResizes) {
                keyboard.willHide
                    .takeUntil(_this._onDestroy)
                    .subscribe(function () {
                    _this._plt.timeout(function () { return _this.setTabbarHidden(false); }, 50);
                });
                keyboard.willShow
                    .takeUntil(_this._onDestroy)
                    .subscribe(function () { return _this.setTabbarHidden(true); });
            }
            return _this;
        }
        /**
         * \@internal
         * @param {?} tabbarHidden
         * @return {?}
         */
        Tabs.prototype.setTabbarHidden = function (tabbarHidden) {
            this.setElementClass('tabbar-hidden', tabbarHidden);
            this.resize();
        };
        /**
         * \@internal
         * @return {?}
         */
        Tabs.prototype.ngOnDestroy = function () {
            this._onDestroy.next();
            this.parent.unregisterChildNav(this);
        };
        /**
         * \@internal
         * @return {?}
         */
        Tabs.prototype.ngAfterViewInit = function () {
            var _this = this;
            this._setConfig('tabsPlacement', 'bottom');
            this._setConfig('tabsLayout', 'icon-top');
            this._setConfig('tabsHighlight', this.tabsHighlight);
            if (this.tabsHighlight) {
                this._plt.resize
                    .takeUntil(this._onDestroy)
                    .subscribe(function () { return _this._highlight.select(_this.getSelected()); });
            }
            this.initTabs();
        };
        /**
         * \@internal
         * @return {?}
         */
        Tabs.prototype.initTabs = function () {
            // get the selected index from the input
            // otherwise default it to use the first index
            var /** @type {?} */ selectedIndex = (util_1.isBlank(this.selectedIndex) ? 0 : parseInt(/** @type {?} */ (this.selectedIndex), 10));
            // now see if the deep linker can find a tab index
            var /** @type {?} */ tabsSegment = this._linker.getSegmentByNavIdOrName(this.id, this.name);
            if (tabsSegment) {
                // we found a segment which probably represents which tab to select
                selectedIndex = this._getSelectedTabIndex(tabsSegment.secondaryId, selectedIndex);
            }
            // get the selectedIndex and ensure it isn't hidden or disabled
            var /** @type {?} */ selectedTab = this._tabs.find(function (t, i) { return i === selectedIndex && t.enabled && t.show; });
            if (!selectedTab) {
                // wasn't able to select the tab they wanted
                // try to find the first tab that's available
                selectedTab = this._tabs.find(function (t) { return t.enabled && t.show; });
            }
            if (selectedTab) {
                if (tabsSegment) {
                    selectedTab._lazyRootFromUrl = tabsSegment.name;
                    selectedTab._lazyRootFromUrlData = tabsSegment.data;
                }
                this.select(selectedTab);
            }
            // set the initial href attribute values for each tab
            this._tabs.forEach(function (t) {
                t.updateHref(t.root, t.rootParams);
            });
        };
        /**
         * \@internal
         * @param {?} attrKey
         * @param {?} fallback
         * @return {?}
         */
        Tabs.prototype._setConfig = function (attrKey, fallback) {
            var /** @type {?} */ val = ((this))[attrKey];
            if (util_1.isBlank(val)) {
                val = this._config.get(attrKey, fallback);
            }
            this.setElementAttribute(attrKey, val);
        };
        /**
         * @hidden
         * @param {?} tab
         * @return {?}
         */
        Tabs.prototype.add = function (tab) {
            this._tabs.push(tab);
            return this.id + '-' + (++this._ids);
        };
        /**
         * @param {?} tabOrIndex
         * @param {?=} opts
         * @param {?=} fromUrl
         * @return {?}
         */
        Tabs.prototype.select = function (tabOrIndex, opts, fromUrl) {
            var _this = this;
            if (opts === void 0) { opts = {}; }
            if (fromUrl === void 0) { fromUrl = false; }
            var /** @type {?} */ selectedTab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
            if (util_1.isBlank(selectedTab)) {
                return;
            }
            // If the selected tab is the current selected tab, we do not switch
            var /** @type {?} */ currentTab = this.getSelected();
            if (selectedTab === currentTab && currentTab.getActive()) {
                return this._updateCurrentTab(selectedTab, fromUrl);
            }
            // If the selected tab does not have a root, we do not switch (#9392)
            // it's possible the tab is only for opening modal's or signing out
            // and doesn't actually have content. In the case there's no content
            // for a tab then do nothing and leave the current view as is
            if (selectedTab.root) {
                // At this point we are going to perform a page switch
                // Let's fire willLeave in the current tab page
                var /** @type {?} */ currentPage;
                if (currentTab) {
                    currentPage = currentTab.getActive();
                    currentPage && currentPage._willLeave(false);
                }
                // Fire willEnter in the new selected tab
                var /** @type {?} */ selectedPage_1 = selectedTab.getActive();
                selectedPage_1 && selectedPage_1._willEnter();
                // Let's start the transition
                opts.animate = false;
                selectedTab.load(opts, function () {
                    _this._tabSwitchEnd(selectedTab, selectedPage_1, currentPage);
                    if (opts.updateUrl !== false) {
                        _this._linker.navChange(nav_util_1.DIRECTION_SWITCH);
                    }
                    (void 0) /* assert */;
                    _this._fireChangeEvent(selectedTab);
                });
            }
            else {
                this._fireChangeEvent(selectedTab);
            }
        };
        /**
         * @param {?} selectedTab
         * @return {?}
         */
        Tabs.prototype._fireChangeEvent = function (selectedTab) {
            selectedTab.ionSelect.emit(selectedTab);
            this.ionChange.emit(selectedTab);
        };
        /**
         * @param {?} selectedTab
         * @param {?} selectedPage
         * @param {?} currentPage
         * @return {?}
         */
        Tabs.prototype._tabSwitchEnd = function (selectedTab, selectedPage, currentPage) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            // Update tabs selection state
            var /** @type {?} */ tabs = this._tabs;
            var /** @type {?} */ tab;
            for (var /** @type {?} */ i = 0; i < tabs.length; i++) {
                tab = tabs[i];
                tab.setSelected(tab === selectedTab);
            }
            if (this.tabsHighlight) {
                this._highlight.select(selectedTab);
            }
            // Fire didEnter/didLeave lifecycle events
            selectedPage && selectedPage._didEnter();
            currentPage && currentPage._didLeave();
            // track the order of which tabs have been selected, by their index
            // do not track if the tab index is the same as the previous
            if (this._selectHistory[this._selectHistory.length - 1] !== selectedTab.id) {
                this._selectHistory.push(selectedTab.id);
            }
        };
        /**
         * Get the previously selected Tab which is currently not disabled or hidden.
         * @param {?=} trimHistory
         * @return {?}
         */
        Tabs.prototype.previousTab = function (trimHistory) {
            var _this = this;
            if (trimHistory === void 0) { trimHistory = true; }
            // walk backwards through the tab selection history
            // and find the first previous tab that is enabled and shown
            (void 0) /* console.debug */;
            for (var /** @type {?} */ i = this._selectHistory.length - 2; i >= 0; i--) {
                var /** @type {?} */ tab = this._tabs.find(function (t) { return t.id === _this._selectHistory[i]; });
                if (tab && tab.enabled && tab.show) {
                    if (trimHistory) {
                        this._selectHistory.splice(i + 1);
                    }
                    return tab;
                }
            }
            return null;
        };
        /**
         * @param {?} index
         * @return {?}
         */
        Tabs.prototype.getByIndex = function (index) {
            return this._tabs[index];
        };
        /**
         * @return {?}
         */
        Tabs.prototype.getSelected = function () {
            var /** @type {?} */ tabs = this._tabs;
            for (var /** @type {?} */ i = 0; i < tabs.length; i++) {
                if (tabs[i].isSelected) {
                    return tabs[i];
                }
            }
            return null;
        };
        /**
         * \@internal
         * @return {?}
         */
        Tabs.prototype.getActiveChildNavs = function () {
            var /** @type {?} */ selected = this.getSelected();
            return selected ? [selected] : [];
        };
        /**
         * \@internal
         * @return {?}
         */
        Tabs.prototype.getAllChildNavs = function () {
            return this._tabs;
        };
        /**
         * \@internal
         * @param {?} tab
         * @return {?}
         */
        Tabs.prototype.getIndex = function (tab) {
            return this._tabs.indexOf(tab);
        };
        /**
         * \@internal
         * @return {?}
         */
        Tabs.prototype.length = function () {
            return this._tabs.length;
        };
        /**
         * "Touch" the active tab, going back to the root view of the tab
         * or optionally letting the tab handle the event
         * @param {?} tab
         * @param {?} fromUrl
         * @return {?}
         */
        Tabs.prototype._updateCurrentTab = function (tab, fromUrl) {
            var /** @type {?} */ active = tab.getActive();
            if (active) {
                if (fromUrl && tab._lazyRootFromUrl) {
                    // see if the view controller exists
                    var /** @type {?} */ vc = tab.getViewById(tab._lazyRootFromUrl);
                    if (vc) {
                        // the view is already in the stack
                        tab.popTo(vc, {
                            animate: false,
                            updateUrl: false,
                        });
                    }
                    else {
                        tab.setRoot(tab._lazyRootFromUrl, tab._lazyRootFromUrlData, {
                            animate: false, updateUrl: false
                        });
                        tab._lazyRootFromUrl = null;
                        tab._lazyRootFromUrlData = null;
                    }
                }
                else if (active._cmp && active._cmp.instance.ionSelected) {
                    // if they have a custom tab selected handler, call it
                    active._cmp.instance.ionSelected();
                }
                else if (tab.length() > 1) {
                    // if we're a few pages deep, pop to root
                    tab.popToRoot();
                }
                else {
                    nav_util_1.getComponent(this._linker, tab.root).then(function (viewController) {
                        if (viewController.component !== active.component) {
                            // Otherwise, if the page we're on is not our real root
                            // reset it to our default root type
                            return tab.setRoot(tab.root);
                        }
                    }).catch(function () {
                        (void 0) /* console.debug */;
                    });
                }
            }
        };
        /**
         * \@internal
         * DOM WRITE
         * @param {?} top
         * @param {?} bottom
         * @return {?}
         */
        Tabs.prototype.setTabbarPosition = function (top, bottom) {
            if (this._top !== top || this._bottom !== bottom) {
                var /** @type {?} */ tabbarEle = (this._tabbar.nativeElement);
                tabbarEle.style.top = (top > -1 ? top + 'px' : '');
                tabbarEle.style.bottom = (bottom > -1 ? bottom + 'px' : '');
                tabbarEle.classList.add('show-tabbar');
                this._top = top;
                this._bottom = bottom;
            }
        };
        /**
         * \@internal
         * @return {?}
         */
        Tabs.prototype.resize = function () {
            var /** @type {?} */ tab = this.getSelected();
            tab && tab.resize();
        };
        /**
         * \@internal
         * @return {?}
         */
        Tabs.prototype.initPane = function () {
            var /** @type {?} */ isMain = this._elementRef.nativeElement.hasAttribute('main');
            return isMain;
        };
        /**
         * \@internal
         * @param {?} isPane
         * @return {?}
         */
        Tabs.prototype.paneChanged = function (isPane) {
            if (isPane) {
                this.resize();
            }
        };
        /**
         * @param {?} opts
         * @return {?}
         */
        Tabs.prototype.goToRoot = function (opts) {
            if (this._tabs.length) {
                return this.select(this._tabs[0], opts);
            }
        };
        /**
         * @return {?}
         */
        Tabs.prototype.getType = function () {
            return 'tabs';
        };
        /**
         * @return {?}
         */
        Tabs.prototype.getSecondaryIdentifier = function () {
            var /** @type {?} */ tabs = this.getActiveChildNavs();
            if (tabs && tabs.length) {
                return this._linker._getTabSelector(tabs[0]);
            }
            return '';
        };
        /**
         * @param {?} secondaryId
         * @param {?=} fallbackIndex
         * @return {?}
         */
        Tabs.prototype._getSelectedTabIndex = function (secondaryId, fallbackIndex) {
            if (fallbackIndex === void 0) { fallbackIndex = 0; }
            // we found a segment which probably represents which tab to select
            var /** @type {?} */ indexMatch = secondaryId.match(/tab-(\d+)/);
            if (indexMatch) {
                // awesome, the segment name was something "tab-0", and
                // the numbe represents which tab to select
                return parseInt(indexMatch[1], 10);
            }
            // wasn't in the "tab-0" format so maybe it's using a word
            var /** @type {?} */ tab = this._tabs.find(function (t) {
                return (util_1.isPresent(t.tabUrlPath) && t.tabUrlPath === secondaryId) ||
                    (util_1.isPresent(t.tabTitle) && url_serializer_1.formatUrlPart(t.tabTitle) === secondaryId);
            });
            return util_1.isPresent(tab) ? tab.index : fallbackIndex;
        };
        return Tabs;
    }(ion_1.Ion));
    Tabs.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-tabs',
                    template: '<div class="tabbar" role="tablist" #tabbar>' +
                        '<a *ngFor="let t of _tabs" [tab]="t" class="tab-button" role="tab" href="#" (ionSelect)="select(t)"></a>' +
                        '<div class="tab-highlight"></div>' +
                        '</div>' +
                        '<ng-content></ng-content>' +
                        '<div #portal tab-portal></div>',
                    encapsulation: core_1.ViewEncapsulation.None,
                    providers: [{ provide: split_pane_1.RootNode, useExisting: core_1.forwardRef(function () { return Tabs; }) }]
                },] },
    ];
    /**
     * @nocollapse
     */
    Tabs.ctorParameters = function () { return [
        { type: nav_controller_1.NavController, decorators: [{ type: core_1.Optional },] },
        { type: view_controller_1.ViewController, decorators: [{ type: core_1.Optional },] },
        { type: app_1.App, },
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: platform_1.Platform, },
        { type: core_1.Renderer, },
        { type: deep_linker_1.DeepLinker, },
        { type: keyboard_1.Keyboard, },
    ]; };
    Tabs.propDecorators = {
        'name': [{ type: core_1.Input },],
        'selectedIndex': [{ type: core_1.Input },],
        'tabsLayout': [{ type: core_1.Input },],
        'tabsPlacement': [{ type: core_1.Input },],
        'tabsHighlight': [{ type: core_1.Input },],
        'ionChange': [{ type: core_1.Output },],
        '_highlight': [{ type: core_1.ViewChild, args: [tab_highlight_1.TabHighlight,] },],
        '_tabbar': [{ type: core_1.ViewChild, args: ['tabbar',] },],
        'portal': [{ type: core_1.ViewChild, args: ['portal', { read: core_1.ViewContainerRef },] },],
    };
    exports.Tabs = Tabs;
    function Tabs_tsickle_Closure_declarations() {
        /** @type {?} */
        Tabs.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Tabs.ctorParameters;
        /** @type {?} */
        Tabs.propDecorators;
        /**
         * \@internal
         * @type {?}
         */
        Tabs.prototype._ids;
        /**
         * \@internal
         * @type {?}
         */
        Tabs.prototype._tabs;
        /**
         * \@internal
         * @type {?}
         */
        Tabs.prototype._sbPadding;
        /**
         * \@internal
         * @type {?}
         */
        Tabs.prototype._top;
        /**
         * \@internal
         * @type {?}
         */
        Tabs.prototype._bottom;
        /**
         * \@internal
         * @type {?}
         */
        Tabs.prototype.id;
        /**
         * \@internal
         * @type {?}
         */
        Tabs.prototype._selectHistory;
        /**
         * \@internal
         * @type {?}
         */
        Tabs.prototype._onDestroy;
        /**
         * \@input {string} A unique name for the tabs
         * @type {?}
         */
        Tabs.prototype.name;
        /**
         * \@input {number} The default selected tab index when first loaded. If a selected index isn't provided then it will use `0`, the first tab.
         * @type {?}
         */
        Tabs.prototype.selectedIndex;
        /**
         * \@input {string} Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.
         * @type {?}
         */
        Tabs.prototype.tabsLayout;
        /**
         * \@input {string} Set position of the tabbar: `top`, `bottom`.
         * @type {?}
         */
        Tabs.prototype.tabsPlacement;
        /**
         * \@input {boolean} If true, show the tab highlight bar under the selected tab.
         * @type {?}
         */
        Tabs.prototype.tabsHighlight;
        /**
         * \@output {any} Emitted when the tab changes.
         * @type {?}
         */
        Tabs.prototype.ionChange;
        /**
         * \@internal
         * @type {?}
         */
        Tabs.prototype._highlight;
        /**
         * \@internal
         * @type {?}
         */
        Tabs.prototype._tabbar;
        /**
         * \@internal
         * @type {?}
         */
        Tabs.prototype.portal;
        /**
         * @hidden
         * @type {?}
         */
        Tabs.prototype.parent;
        /** @type {?} */
        Tabs.prototype.viewCtrl;
        /** @type {?} */
        Tabs.prototype._app;
        /** @type {?} */
        Tabs.prototype._plt;
        /** @type {?} */
        Tabs.prototype._linker;
    }
    var /** @type {?} */ tabIds = -1;
});
//# sourceMappingURL=tabs.js.map