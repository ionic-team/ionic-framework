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
        define(["require", "exports", "@angular/core", "../components/app/app", "../config/config", "../components/content/content", "../navigation/deep-linker", "../platform/dom-controller", "../gestures/gesture-controller", "../tap-click/haptic", "../components/app/app-root", "../components/menu/menu", "../navigation/nav-controller-base", "../components/app/overlay-portal", "../transitions/page-transition", "../platform/platform", "../platform/query-params", "../components/tabs/tab", "../components/tabs/tabs", "../transitions/transition-controller", "../navigation/url-serializer", "../navigation/view-controller", "./module-loader", "./ng-module-loader", "../navigation/nav-util", "../components/ion", "../components/item/item", "./form"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var app_1 = require("../components/app/app");
    var config_1 = require("../config/config");
    var content_1 = require("../components/content/content");
    var deep_linker_1 = require("../navigation/deep-linker");
    var dom_controller_1 = require("../platform/dom-controller");
    var gesture_controller_1 = require("../gestures/gesture-controller");
    var haptic_1 = require("../tap-click/haptic");
    var app_root_1 = require("../components/app/app-root");
    var menu_1 = require("../components/menu/menu");
    var nav_controller_base_1 = require("../navigation/nav-controller-base");
    var overlay_portal_1 = require("../components/app/overlay-portal");
    var page_transition_1 = require("../transitions/page-transition");
    var platform_1 = require("../platform/platform");
    var query_params_1 = require("../platform/query-params");
    var tab_1 = require("../components/tabs/tab");
    var tabs_1 = require("../components/tabs/tabs");
    var transition_controller_1 = require("../transitions/transition-controller");
    var url_serializer_1 = require("../navigation/url-serializer");
    var view_controller_1 = require("../navigation/view-controller");
    var module_loader_1 = require("./module-loader");
    var ng_module_loader_1 = require("./ng-module-loader");
    var nav_util_1 = require("../navigation/nav-util");
    var ion_1 = require("../components/ion");
    var item_1 = require("../components/item/item");
    var form_1 = require("./form");
    /**
     * @param {?=} config
     * @param {?=} _url
     * @param {?=} platform
     * @return {?}
     */
    function mockConfig(config, _url, platform) {
        if (_url === void 0) { _url = '/'; }
        var /** @type {?} */ c = new config_1.Config();
        var /** @type {?} */ p = platform || mockPlatform();
        c.init(config, p);
        return c;
    }
    exports.mockConfig = mockConfig;
    /**
     * @param {?=} url
     * @return {?}
     */
    function mockQueryParams(url) {
        if (url === void 0) { url = '/'; }
        var /** @type {?} */ qp = new query_params_1.QueryParams();
        qp.parseUrl(url);
        return qp;
    }
    exports.mockQueryParams = mockQueryParams;
    /**
     * @return {?}
     */
    function mockPlatform() {
        return new MockPlatform();
    }
    exports.mockPlatform = mockPlatform;
    var MockPlatform = (function (_super) {
        __extends(MockPlatform, _super);
        function MockPlatform() {
            var _this = _super.call(this) || this;
            _this.timeoutIds = 0;
            _this.timeouts = [];
            _this.rafIds = 0;
            _this.timeStamps = 0;
            _this.rafs = [];
            var doc = document.implementation.createHTMLDocument('');
            _this.setWindow(window);
            _this.setDocument(doc);
            _this.setCssProps(doc.documentElement);
            return _this;
        }
        /**
         * @param {?} callback
         * @param {?} timeout
         * @return {?}
         */
        MockPlatform.prototype.timeout = function (callback, timeout) {
            var /** @type {?} */ timeoutId = ++this.timeoutIds;
            this.timeouts.push({
                callback: callback,
                timeout: timeout,
                timeoutId: timeoutId
            });
            return timeoutId;
        };
        /**
         * @param {?} timeoutId
         * @return {?}
         */
        MockPlatform.prototype.cancelTimeout = function (timeoutId) {
            for (var /** @type {?} */ i = 0; i < this.timeouts.length; i++) {
                if (timeoutId === this.timeouts[i].timeoutId) {
                    this.timeouts.splice(i, 1);
                    break;
                }
            }
        };
        /**
         * @param {?} done
         * @return {?}
         */
        MockPlatform.prototype.flushTimeouts = function (done) {
            var _this = this;
            setTimeout(function () {
                _this.timeouts.sort(function (a, b) {
                    if (a.timeout < b.timeout)
                        return -1;
                    if (a.timeout > b.timeout)
                        return 1;
                    return 0;
                }).forEach(function (t) {
                    t.callback();
                });
                _this.timeouts.length = 0;
                done();
            });
        };
        /**
         * @param {?} timeout
         * @param {?} done
         * @return {?}
         */
        MockPlatform.prototype.flushTimeoutsUntil = function (timeout, done) {
            var _this = this;
            setTimeout(function () {
                _this.timeouts.sort(function (a, b) {
                    if (a.timeout < b.timeout)
                        return -1;
                    if (a.timeout > b.timeout)
                        return 1;
                    return 0;
                });
                var /** @type {?} */ keepers = [];
                _this.timeouts.forEach(function (t) {
                    if (t.timeout < timeout) {
                        t.callback();
                    }
                    else {
                        keepers.push(t);
                    }
                });
                _this.timeouts = keepers;
                done();
            });
        };
        /**
         * @param {?} callback
         * @return {?}
         */
        MockPlatform.prototype.raf = function (callback) {
            var /** @type {?} */ rafId = ++this.rafIds;
            this.rafs.push({
                callback: callback,
                rafId: rafId
            });
            return rafId;
        };
        /**
         * @param {?} rafId
         * @return {?}
         */
        MockPlatform.prototype.cancelRaf = function (rafId) {
            for (var /** @type {?} */ i = 0; i < this.rafs.length; i++) {
                if (rafId === this.rafs[i].rafId) {
                    this.rafs.splice(i, 1);
                    break;
                }
            }
        };
        /**
         * @param {?} done
         * @return {?}
         */
        MockPlatform.prototype.flushRafs = function (done) {
            var _this = this;
            var /** @type {?} */ timestamp = ++this.timeStamps;
            setTimeout(function () {
                _this.rafs.forEach(function (raf) {
                    raf.callback(timestamp);
                });
                _this.rafs.length = 0;
                done(timestamp);
            });
        };
        return MockPlatform;
    }(platform_1.Platform));
    exports.MockPlatform = MockPlatform;
    function MockPlatform_tsickle_Closure_declarations() {
        /** @type {?} */
        MockPlatform.prototype.timeoutIds;
        /** @type {?} */
        MockPlatform.prototype.timeouts;
        /** @type {?} */
        MockPlatform.prototype.rafIds;
        /** @type {?} */
        MockPlatform.prototype.timeStamps;
        /** @type {?} */
        MockPlatform.prototype.rafs;
    }
    /**
     * @param {?=} platform
     * @return {?}
     */
    function mockDomController(platform) {
        platform = platform || mockPlatform();
        return new MockDomController(platform);
    }
    exports.mockDomController = mockDomController;
    var MockDomController = (function (_super) {
        __extends(MockDomController, _super);
        /**
         * @param {?} mockedPlatform
         */
        function MockDomController(mockedPlatform) {
            var _this = _super.call(this, mockedPlatform) || this;
            _this.mockedPlatform = mockedPlatform;
            return _this;
        }
        /**
         * @param {?} done
         * @return {?}
         */
        MockDomController.prototype.flush = function (done) {
            var _this = this;
            this.mockedPlatform.flushTimeouts(function () {
                _this.mockedPlatform.flushRafs(function (timeStamp) {
                    done(timeStamp);
                });
            });
        };
        /**
         * @param {?} timeout
         * @param {?} done
         * @return {?}
         */
        MockDomController.prototype.flushUntil = function (timeout, done) {
            var _this = this;
            this.mockedPlatform.flushTimeoutsUntil(timeout, function () {
                _this.mockedPlatform.flushRafs(function (timeStamp) {
                    done(timeStamp);
                });
            });
        };
        return MockDomController;
    }(dom_controller_1.DomController));
    exports.MockDomController = MockDomController;
    function MockDomController_tsickle_Closure_declarations() {
        /** @type {?} */
        MockDomController.prototype.mockedPlatform;
    }
    /**
     * @param {?=} config
     * @param {?=} platform
     * @return {?}
     */
    function mockApp(config, platform) {
        platform = platform || mockPlatform();
        config = config || mockConfig(null, '/', platform);
        var /** @type {?} */ app = new app_1.App(config, platform);
        mockIonicApp(app, config, platform);
        return app;
    }
    exports.mockApp = mockApp;
    /**
     * @param {?} app
     * @param {?} config
     * @param {?} plt
     * @return {?}
     */
    function mockIonicApp(app, config, plt) {
        var /** @type {?} */ appRoot = new app_root_1.IonicApp(null, null, mockElementRef(), mockRenderer(), config, plt, app);
        appRoot._loadingPortal = mockOverlayPortal(app, config, plt);
        appRoot._toastPortal = mockOverlayPortal(app, config, plt);
        appRoot._overlayPortal = mockOverlayPortal(app, config, plt);
        appRoot._modalPortal = mockOverlayPortal(app, config, plt);
        return appRoot;
    }
    exports.mockIonicApp = mockIonicApp;
    exports.mockTrasitionController = function (config) {
        var /** @type {?} */ platform = mockPlatform();
        platform.raf = (function (callback) {
            callback();
        });
        var /** @type {?} */ trnsCtrl = new transition_controller_1.TransitionController(platform, config);
        trnsCtrl.get = function (trnsId, enteringView, leavingView, opts) {
            var /** @type {?} */ trns = new page_transition_1.PageTransition(platform, enteringView, leavingView, opts);
            trns.trnsId = trnsId;
            return trns;
        };
        return trnsCtrl;
    };
    /**
     * @return {?}
     */
    function mockContent() {
        var /** @type {?} */ platform = mockPlatform();
        return new content_1.Content(mockConfig(), platform, mockDomController(platform), mockElementRef(), mockRenderer(), null, null, mockZone(), null, null);
    }
    exports.mockContent = mockContent;
    /**
     * @return {?}
     */
    function mockZone() {
        return new core_1.NgZone({ enableLongStackTrace: false });
    }
    exports.mockZone = mockZone;
    /**
     * @return {?}
     */
    function mockChangeDetectorRef() {
        var /** @type {?} */ cd = {
            reattach: function () { },
            detach: function () { },
            detectChanges: function () { }
        };
        return cd;
    }
    exports.mockChangeDetectorRef = mockChangeDetectorRef;
    /**
     * @param {?=} app
     * @return {?}
     */
    function mockGestureController(app) {
        if (!app) {
            app = mockApp();
        }
        return new gesture_controller_1.GestureController(app);
    }
    exports.mockGestureController = mockGestureController;
    var MockElementRef = (function () {
        /**
         * @param {?} ele
         */
        function MockElementRef(ele) {
            this.nativeElement = ele;
        }
        return MockElementRef;
    }());
    exports.MockElementRef = MockElementRef;
    function MockElementRef_tsickle_Closure_declarations() {
        /** @type {?} */
        MockElementRef.prototype.nativeElement;
    }
    var MockElement = (function () {
        function MockElement() {
            this.children = [];
            this.classList = new ClassList();
            this.attributes = {};
            this.style = {};
            this.nodeName = 'ION-MOCK';
            this.clientWidth = 0;
            this.clientHeight = 0;
            this.clientTop = 0;
            this.clientLeft = 0;
            this.offsetWidth = 0;
            this.offsetHeight = 0;
            this.offsetTop = 0;
            this.offsetLeft = 0;
            this.scrollTop = 0;
            this.scrollHeight = 0;
        }
        Object.defineProperty(MockElement.prototype, "className", {
            /**
             * @return {?}
             */
            get: function () {
                return this.classList.classes.join(' ');
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this.classList.classes = val.split(' ');
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} name
         * @return {?}
         */
        MockElement.prototype.hasAttribute = function (name) {
            return !!this.attributes[name];
        };
        /**
         * @param {?} name
         * @return {?}
         */
        MockElement.prototype.getAttribute = function (name) {
            return this.attributes[name];
        };
        /**
         * @param {?} name
         * @param {?} val
         * @return {?}
         */
        MockElement.prototype.setAttribute = function (name, val) {
            this.attributes[name] = val;
        };
        /**
         * @param {?} _type
         * @param {?} _listener
         * @param {?=} _options
         * @return {?}
         */
        MockElement.prototype.addEventListener = function (_type, _listener, _options) { };
        /**
         * @param {?} _type
         * @param {?} _listener
         * @param {?=} _options
         * @return {?}
         */
        MockElement.prototype.removeEventListener = function (_type, _listener, _options) { };
        /**
         * @param {?} name
         * @return {?}
         */
        MockElement.prototype.removeAttribute = function (name) {
            delete this.attributes[name];
        };
        return MockElement;
    }());
    exports.MockElement = MockElement;
    function MockElement_tsickle_Closure_declarations() {
        /** @type {?} */
        MockElement.prototype.children;
        /** @type {?} */
        MockElement.prototype.classList;
        /** @type {?} */
        MockElement.prototype.attributes;
        /** @type {?} */
        MockElement.prototype.style;
        /** @type {?} */
        MockElement.prototype.nodeName;
        /** @type {?} */
        MockElement.prototype.clientWidth;
        /** @type {?} */
        MockElement.prototype.clientHeight;
        /** @type {?} */
        MockElement.prototype.clientTop;
        /** @type {?} */
        MockElement.prototype.clientLeft;
        /** @type {?} */
        MockElement.prototype.offsetWidth;
        /** @type {?} */
        MockElement.prototype.offsetHeight;
        /** @type {?} */
        MockElement.prototype.offsetTop;
        /** @type {?} */
        MockElement.prototype.offsetLeft;
        /** @type {?} */
        MockElement.prototype.scrollTop;
        /** @type {?} */
        MockElement.prototype.scrollHeight;
    }
    var ClassList = (function () {
        function ClassList() {
            this.classes = [];
        }
        /**
         * @param {?} className
         * @return {?}
         */
        ClassList.prototype.add = function (className) {
            if (!this.contains(className)) {
                this.classes.push(className);
            }
        };
        /**
         * @param {?} className
         * @return {?}
         */
        ClassList.prototype.remove = function (className) {
            var /** @type {?} */ index = this.classes.indexOf(className);
            if (index > -1) {
                this.classes.splice(index, 1);
            }
        };
        /**
         * @param {?} className
         * @return {?}
         */
        ClassList.prototype.toggle = function (className) {
            if (this.contains(className)) {
                this.remove(className);
            }
            else {
                this.add(className);
            }
        };
        /**
         * @param {?} className
         * @return {?}
         */
        ClassList.prototype.contains = function (className) {
            return this.classes.indexOf(className) > -1;
        };
        return ClassList;
    }());
    exports.ClassList = ClassList;
    function ClassList_tsickle_Closure_declarations() {
        /** @type {?} */
        ClassList.prototype.classes;
    }
    /**
     * @return {?}
     */
    function mockElementRef() {
        return new MockElementRef(new MockElement());
    }
    exports.mockElementRef = mockElementRef;
    /**
     * @param {?} ele
     * @return {?}
     */
    function mockElementRefEle(ele) {
        return new MockElementRef(ele);
    }
    exports.mockElementRefEle = mockElementRefEle;
    var MockRenderer = (function () {
        function MockRenderer() {
        }
        /**
         * @param {?} renderElement
         * @param {?} name
         * @param {?} val
         * @return {?}
         */
        MockRenderer.prototype.setElementAttribute = function (renderElement, name, val) {
            if (name === null) {
                renderElement.removeAttribute(name);
            }
            else {
                renderElement.setAttribute(name, val);
            }
        };
        /**
         * @param {?} renderElement
         * @param {?} className
         * @param {?} isAdd
         * @return {?}
         */
        MockRenderer.prototype.setElementClass = function (renderElement, className, isAdd) {
            if (isAdd) {
                renderElement.classList.add(className);
            }
            else {
                renderElement.classList.remove(className);
            }
        };
        /**
         * @param {?} renderElement
         * @param {?} styleName
         * @param {?} styleValue
         * @return {?}
         */
        MockRenderer.prototype.setElementStyle = function (renderElement, styleName, styleValue) {
            renderElement.style[styleName] = styleValue;
        };
        return MockRenderer;
    }());
    exports.MockRenderer = MockRenderer;
    /**
     * @return {?}
     */
    function mockRenderer() {
        var /** @type {?} */ renderer = new MockRenderer();
        return renderer;
    }
    exports.mockRenderer = mockRenderer;
    /**
     * @return {?}
     */
    function mockLocation() {
        var /** @type {?} */ location = {
            path: function () { return ''; },
            subscribe: function () { },
            go: function () { },
            back: function () { },
            prepareExternalUrl: function () { }
        };
        return location;
    }
    exports.mockLocation = mockLocation;
    /**
     * @param {?=} component
     * @param {?=} data
     * @return {?}
     */
    function mockView(component, data) {
        if (!component) {
            component = MockView;
        }
        var /** @type {?} */ view = new view_controller_1.ViewController(component, data);
        view.init(mockComponentRef());
        return view;
    }
    exports.mockView = mockView;
    /**
     * @param {?} nav
     * @param {?} views
     * @return {?}
     */
    function mockViews(nav, views) {
        nav._views = views;
        views.forEach(function (v) {
            v._setNav(nav);
        });
    }
    exports.mockViews = mockViews;
    /**
     * @return {?}
     */
    function mockComponentRef() {
        var /** @type {?} */ componentRef = {
            location: mockElementRef(),
            changeDetectorRef: mockChangeDetectorRef(),
            destroy: function () { }
        };
        return componentRef;
    }
    exports.mockComponentRef = mockComponentRef;
    /**
     * @param {?=} linkConfig
     * @param {?=} app
     * @return {?}
     */
    function mockDeepLinker(linkConfig, app) {
        if (linkConfig === void 0) { linkConfig = null; }
        app = app || mockApp(mockConfig(), mockPlatform());
        var /** @type {?} */ serializer = new url_serializer_1.UrlSerializer(app, linkConfig);
        var /** @type {?} */ location = mockLocation();
        return new deep_linker_1.DeepLinker(app || mockApp(), serializer, location, null, null);
    }
    exports.mockDeepLinker = mockDeepLinker;
    /**
     * @return {?}
     */
    function mockNavController() {
        var /** @type {?} */ platform = mockPlatform();
        var /** @type {?} */ config = mockConfig(null, '/', platform);
        var /** @type {?} */ app = mockApp(config, platform);
        var /** @type {?} */ zone = mockZone();
        var /** @type {?} */ dom = mockDomController(platform);
        var /** @type {?} */ elementRef = mockElementRef();
        var /** @type {?} */ renderer = mockRenderer();
        var /** @type {?} */ componentFactoryResolver = null;
        var /** @type {?} */ gestureCtrl = new gesture_controller_1.GestureController(app);
        var /** @type {?} */ linker = mockDeepLinker(null, app);
        var /** @type {?} */ trnsCtrl = exports.mockTrasitionController(config);
        var /** @type {?} */ nav = new nav_controller_base_1.NavControllerBase(null, app, config, platform, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, trnsCtrl, linker, dom, null);
        nav._viewInit = function (enteringView) {
            enteringView.init(mockComponentRef());
            enteringView._state = nav_util_1.STATE_INITIALIZED;
        };
        ((nav))._orgViewInsert = nav._viewAttachToDOM;
        nav._viewAttachToDOM = function (view, componentRef, _viewport) {
            var /** @type {?} */ mockedViewport = {
                insert: function () { }
            };
            ((nav))._orgViewInsert(view, componentRef, mockedViewport);
        };
        return nav;
    }
    exports.mockNavController = mockNavController;
    /**
     * @param {?} app
     * @param {?} config
     * @param {?} plt
     * @return {?}
     */
    function mockOverlayPortal(app, config, plt) {
        var /** @type {?} */ zone = mockZone();
        var /** @type {?} */ dom = mockDomController(plt);
        var /** @type {?} */ elementRef = mockElementRef();
        var /** @type {?} */ renderer = mockRenderer();
        var /** @type {?} */ componentFactoryResolver = null;
        var /** @type {?} */ gestureCtrl = new gesture_controller_1.GestureController(app);
        var /** @type {?} */ serializer = new url_serializer_1.UrlSerializer(app, null);
        var /** @type {?} */ location = mockLocation();
        var /** @type {?} */ deepLinker = new deep_linker_1.DeepLinker(app, serializer, location, null, null);
        return new overlay_portal_1.OverlayPortal(app, config, plt, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, null, deepLinker, null, dom, null);
    }
    exports.mockOverlayPortal = mockOverlayPortal;
    /**
     * @param {?} parentTabs
     * @param {?=} overrideLoad
     * @return {?}
     */
    function mockTab(parentTabs, overrideLoad) {
        if (overrideLoad === void 0) { overrideLoad = true; }
        var /** @type {?} */ platform = mockPlatform();
        var /** @type {?} */ config = mockConfig(null, '/', platform);
        var /** @type {?} */ app = ((parentTabs))._app || mockApp(config, platform);
        var /** @type {?} */ zone = mockZone();
        var /** @type {?} */ dom = mockDomController(platform);
        var /** @type {?} */ elementRef = mockElementRef();
        var /** @type {?} */ renderer = mockRenderer();
        var /** @type {?} */ changeDetectorRef = mockChangeDetectorRef();
        var /** @type {?} */ compiler = null;
        var /** @type {?} */ gestureCtrl = new gesture_controller_1.GestureController(app);
        var /** @type {?} */ linker = mockDeepLinker(null, app);
        var /** @type {?} */ tab = new tab_1.Tab(parentTabs, app, config, platform, elementRef, zone, renderer, compiler, changeDetectorRef, gestureCtrl, null, linker, dom, null);
        if (overrideLoad) {
            tab.load = function (_opts, cb) {
                cb();
            };
        }
        return tab;
    }
    exports.mockTab = mockTab;
    /**
     * @return {?}
     */
    function mockForm() {
        return new form_1.Form();
    }
    exports.mockForm = mockForm;
    /**
     * @return {?}
     */
    function mockIon() {
        var /** @type {?} */ config = mockConfig();
        var /** @type {?} */ elementRef = mockElementRef();
        var /** @type {?} */ renderer = mockRenderer();
        return new ion_1.Ion(config, elementRef, renderer, 'ion');
    }
    exports.mockIon = mockIon;
    /**
     * @return {?}
     */
    function mockItem() {
        var /** @type {?} */ form = mockForm();
        var /** @type {?} */ config = mockConfig();
        var /** @type {?} */ elementRef = mockElementRef();
        var /** @type {?} */ renderer = mockRenderer();
        return new item_1.Item(form, config, elementRef, renderer, null);
    }
    exports.mockItem = mockItem;
    /**
     * @param {?=} app
     * @return {?}
     */
    function mockTabs(app) {
        var /** @type {?} */ platform = mockPlatform();
        var /** @type {?} */ config = mockConfig(null, '/', platform);
        app = app || mockApp(config, platform);
        var /** @type {?} */ elementRef = mockElementRef();
        var /** @type {?} */ renderer = mockRenderer();
        var /** @type {?} */ linker = mockDeepLinker();
        return new tabs_1.Tabs(null, null, app, config, elementRef, platform, renderer, linker);
    }
    exports.mockTabs = mockTabs;
    /**
     * @param {?=} platform
     * @return {?}
     */
    function mockMenu(platform) {
        if (platform === void 0) { platform = null; }
        var /** @type {?} */ app = mockApp();
        var /** @type {?} */ gestureCtrl = new gesture_controller_1.GestureController(app);
        var /** @type {?} */ dom = mockDomController();
        var /** @type {?} */ elementRef = mockElementRef();
        var /** @type {?} */ renderer = mockRenderer();
        var /** @type {?} */ plt = platform === null ? mockPlatform() : platform;
        return new menu_1.Menu(null, elementRef, null, plt, renderer, null, gestureCtrl, dom, app);
    }
    exports.mockMenu = mockMenu;
    /**
     * @param {?=} links
     * @return {?}
     */
    function mockDeepLinkConfig(links) {
        return {
            links: links || [
                { component: MockView1, name: 'viewone' },
                { component: MockView2, name: 'viewtwo' },
                { component: MockView3, name: 'viewthree' },
                { component: MockView4, name: 'viewfour' },
                { component: MockView5, name: 'viewfive' }
            ]
        };
    }
    exports.mockDeepLinkConfig = mockDeepLinkConfig;
    /**
     * @return {?}
     */
    function mockHaptic() {
        return new haptic_1.Haptic(mockPlatform());
    }
    exports.mockHaptic = mockHaptic;
    var MockView = (function () {
        function MockView() {
        }
        return MockView;
    }());
    exports.MockView = MockView;
    var MockView1 = (function () {
        function MockView1() {
        }
        return MockView1;
    }());
    exports.MockView1 = MockView1;
    var MockView2 = (function () {
        function MockView2() {
        }
        return MockView2;
    }());
    exports.MockView2 = MockView2;
    var MockView3 = (function () {
        function MockView3() {
        }
        return MockView3;
    }());
    exports.MockView3 = MockView3;
    var MockView4 = (function () {
        function MockView4() {
        }
        return MockView4;
    }());
    exports.MockView4 = MockView4;
    var MockView5 = (function () {
        function MockView5() {
        }
        return MockView5;
    }());
    exports.MockView5 = MockView5;
    /**
     * @return {?}
     */
    function noop() { return 'noop'; }
    exports.noop = noop;
    /**
     * @param {?=} ngModuleLoader
     * @return {?}
     */
    function mockModuleLoader(ngModuleLoader) {
        ngModuleLoader = ngModuleLoader || mockNgModuleLoader();
        return new module_loader_1.ModuleLoader(ngModuleLoader, null);
    }
    exports.mockModuleLoader = mockModuleLoader;
    /**
     * @return {?}
     */
    function mockNgModuleLoader() {
        return new ng_module_loader_1.NgModuleLoader(null);
    }
    exports.mockNgModuleLoader = mockNgModuleLoader;
    /**
     * @return {?}
     */
    function mockOverlay() {
        return {
            present: function (_opts) { return Promise.resolve(); },
            dismiss: function (_data, _role, _navOptions) { return Promise.resolve(); },
            onDidDismiss: function (_callback) { },
            onWillDismiss: function (_callback) { }
        };
    }
    exports.mockOverlay = mockOverlay;
});
//# sourceMappingURL=mock-providers.js.map