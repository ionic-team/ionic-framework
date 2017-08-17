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
import { NgZone } from '@angular/core';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { Content } from '../components/content/content';
import { DeepLinker } from '../navigation/deep-linker';
import { DomController } from '../platform/dom-controller';
import { GestureController } from '../gestures/gesture-controller';
import { Haptic } from '../tap-click/haptic';
import { IonicApp } from '../components/app/app-root';
import { Menu } from '../components/menu/menu';
import { NavControllerBase } from '../navigation/nav-controller-base';
import { OverlayPortal } from '../components/app/overlay-portal';
import { PageTransition } from '../transitions/page-transition';
import { Platform } from '../platform/platform';
import { QueryParams } from '../platform/query-params';
import { Tab } from '../components/tabs/tab';
import { Tabs } from '../components/tabs/tabs';
import { TransitionController } from '../transitions/transition-controller';
import { UrlSerializer } from '../navigation/url-serializer';
import { ViewController } from '../navigation/view-controller';
import { ModuleLoader } from './module-loader';
import { NgModuleLoader } from './ng-module-loader';
import { STATE_INITIALIZED } from '../navigation/nav-util';
import { Ion } from '../components/ion';
import { Item } from '../components/item/item';
import { Form } from './form';
/**
 * @param {?=} config
 * @param {?=} _url
 * @param {?=} platform
 * @return {?}
 */
export function mockConfig(config, _url, platform) {
    if (_url === void 0) { _url = '/'; }
    var /** @type {?} */ c = new Config();
    var /** @type {?} */ p = platform || mockPlatform();
    c.init(config, p);
    return c;
}
/**
 * @param {?=} url
 * @return {?}
 */
export function mockQueryParams(url) {
    if (url === void 0) { url = '/'; }
    var /** @type {?} */ qp = new QueryParams();
    qp.parseUrl(url);
    return qp;
}
/**
 * @return {?}
 */
export function mockPlatform() {
    return new MockPlatform();
}
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
}(Platform));
export { MockPlatform };
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
export function mockDomController(platform) {
    platform = platform || mockPlatform();
    return new MockDomController(platform);
}
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
}(DomController));
export { MockDomController };
function MockDomController_tsickle_Closure_declarations() {
    /** @type {?} */
    MockDomController.prototype.mockedPlatform;
}
/**
 * @param {?=} config
 * @param {?=} platform
 * @return {?}
 */
export function mockApp(config, platform) {
    platform = platform || mockPlatform();
    config = config || mockConfig(null, '/', platform);
    var /** @type {?} */ app = new App(config, platform);
    mockIonicApp(app, config, platform);
    return app;
}
/**
 * @param {?} app
 * @param {?} config
 * @param {?} plt
 * @return {?}
 */
export function mockIonicApp(app, config, plt) {
    var /** @type {?} */ appRoot = new IonicApp(null, null, mockElementRef(), mockRenderer(), config, plt, app);
    appRoot._loadingPortal = mockOverlayPortal(app, config, plt);
    appRoot._toastPortal = mockOverlayPortal(app, config, plt);
    appRoot._overlayPortal = mockOverlayPortal(app, config, plt);
    appRoot._modalPortal = mockOverlayPortal(app, config, plt);
    return appRoot;
}
export var /** @type {?} */ mockTrasitionController = function (config) {
    var /** @type {?} */ platform = mockPlatform();
    platform.raf = (function (callback) {
        callback();
    });
    var /** @type {?} */ trnsCtrl = new TransitionController(platform, config);
    trnsCtrl.get = function (trnsId, enteringView, leavingView, opts) {
        var /** @type {?} */ trns = new PageTransition(platform, enteringView, leavingView, opts);
        trns.trnsId = trnsId;
        return trns;
    };
    return trnsCtrl;
};
/**
 * @return {?}
 */
export function mockContent() {
    var /** @type {?} */ platform = mockPlatform();
    return new Content(mockConfig(), platform, mockDomController(platform), mockElementRef(), mockRenderer(), null, null, mockZone(), null, null);
}
/**
 * @return {?}
 */
export function mockZone() {
    return new NgZone({ enableLongStackTrace: false });
}
/**
 * @return {?}
 */
export function mockChangeDetectorRef() {
    var /** @type {?} */ cd = {
        reattach: function () { },
        detach: function () { },
        detectChanges: function () { }
    };
    return cd;
}
/**
 * @param {?=} app
 * @return {?}
 */
export function mockGestureController(app) {
    if (!app) {
        app = mockApp();
    }
    return new GestureController(app);
}
var MockElementRef = (function () {
    /**
     * @param {?} ele
     */
    function MockElementRef(ele) {
        this.nativeElement = ele;
    }
    return MockElementRef;
}());
export { MockElementRef };
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
export { MockElement };
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
export { ClassList };
function ClassList_tsickle_Closure_declarations() {
    /** @type {?} */
    ClassList.prototype.classes;
}
/**
 * @return {?}
 */
export function mockElementRef() {
    return new MockElementRef(new MockElement());
}
/**
 * @param {?} ele
 * @return {?}
 */
export function mockElementRefEle(ele) {
    return new MockElementRef(ele);
}
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
export { MockRenderer };
/**
 * @return {?}
 */
export function mockRenderer() {
    var /** @type {?} */ renderer = new MockRenderer();
    return renderer;
}
/**
 * @return {?}
 */
export function mockLocation() {
    var /** @type {?} */ location = {
        path: function () { return ''; },
        subscribe: function () { },
        go: function () { },
        back: function () { },
        prepareExternalUrl: function () { }
    };
    return location;
}
/**
 * @param {?=} component
 * @param {?=} data
 * @return {?}
 */
export function mockView(component, data) {
    if (!component) {
        component = MockView;
    }
    var /** @type {?} */ view = new ViewController(component, data);
    view.init(mockComponentRef());
    return view;
}
/**
 * @param {?} nav
 * @param {?} views
 * @return {?}
 */
export function mockViews(nav, views) {
    nav._views = views;
    views.forEach(function (v) {
        v._setNav(nav);
    });
}
/**
 * @return {?}
 */
export function mockComponentRef() {
    var /** @type {?} */ componentRef = {
        location: mockElementRef(),
        changeDetectorRef: mockChangeDetectorRef(),
        destroy: function () { }
    };
    return componentRef;
}
/**
 * @param {?=} linkConfig
 * @param {?=} app
 * @return {?}
 */
export function mockDeepLinker(linkConfig, app) {
    if (linkConfig === void 0) { linkConfig = null; }
    app = app || mockApp(mockConfig(), mockPlatform());
    var /** @type {?} */ serializer = new UrlSerializer(app, linkConfig);
    var /** @type {?} */ location = mockLocation();
    return new DeepLinker(app || mockApp(), serializer, location, null, null);
}
/**
 * @return {?}
 */
export function mockNavController() {
    var /** @type {?} */ platform = mockPlatform();
    var /** @type {?} */ config = mockConfig(null, '/', platform);
    var /** @type {?} */ app = mockApp(config, platform);
    var /** @type {?} */ zone = mockZone();
    var /** @type {?} */ dom = mockDomController(platform);
    var /** @type {?} */ elementRef = mockElementRef();
    var /** @type {?} */ renderer = mockRenderer();
    var /** @type {?} */ componentFactoryResolver = null;
    var /** @type {?} */ gestureCtrl = new GestureController(app);
    var /** @type {?} */ linker = mockDeepLinker(null, app);
    var /** @type {?} */ trnsCtrl = mockTrasitionController(config);
    var /** @type {?} */ nav = new NavControllerBase(null, app, config, platform, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, trnsCtrl, linker, dom, null);
    nav._viewInit = function (enteringView) {
        enteringView.init(mockComponentRef());
        enteringView._state = STATE_INITIALIZED;
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
/**
 * @param {?} app
 * @param {?} config
 * @param {?} plt
 * @return {?}
 */
export function mockOverlayPortal(app, config, plt) {
    var /** @type {?} */ zone = mockZone();
    var /** @type {?} */ dom = mockDomController(plt);
    var /** @type {?} */ elementRef = mockElementRef();
    var /** @type {?} */ renderer = mockRenderer();
    var /** @type {?} */ componentFactoryResolver = null;
    var /** @type {?} */ gestureCtrl = new GestureController(app);
    var /** @type {?} */ serializer = new UrlSerializer(app, null);
    var /** @type {?} */ location = mockLocation();
    var /** @type {?} */ deepLinker = new DeepLinker(app, serializer, location, null, null);
    return new OverlayPortal(app, config, plt, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, null, deepLinker, null, dom, null);
}
/**
 * @param {?} parentTabs
 * @param {?=} overrideLoad
 * @return {?}
 */
export function mockTab(parentTabs, overrideLoad) {
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
    var /** @type {?} */ gestureCtrl = new GestureController(app);
    var /** @type {?} */ linker = mockDeepLinker(null, app);
    var /** @type {?} */ tab = new Tab(parentTabs, app, config, platform, elementRef, zone, renderer, compiler, changeDetectorRef, gestureCtrl, null, linker, dom, null);
    if (overrideLoad) {
        tab.load = function (_opts, cb) {
            cb();
        };
    }
    return tab;
}
/**
 * @return {?}
 */
export function mockForm() {
    return new Form();
}
/**
 * @return {?}
 */
export function mockIon() {
    var /** @type {?} */ config = mockConfig();
    var /** @type {?} */ elementRef = mockElementRef();
    var /** @type {?} */ renderer = mockRenderer();
    return new Ion(config, elementRef, renderer, 'ion');
}
/**
 * @return {?}
 */
export function mockItem() {
    var /** @type {?} */ form = mockForm();
    var /** @type {?} */ config = mockConfig();
    var /** @type {?} */ elementRef = mockElementRef();
    var /** @type {?} */ renderer = mockRenderer();
    return new Item(form, config, elementRef, renderer, null);
}
/**
 * @param {?=} app
 * @return {?}
 */
export function mockTabs(app) {
    var /** @type {?} */ platform = mockPlatform();
    var /** @type {?} */ config = mockConfig(null, '/', platform);
    app = app || mockApp(config, platform);
    var /** @type {?} */ elementRef = mockElementRef();
    var /** @type {?} */ renderer = mockRenderer();
    var /** @type {?} */ linker = mockDeepLinker();
    return new Tabs(null, null, app, config, elementRef, platform, renderer, linker);
}
/**
 * @param {?=} platform
 * @return {?}
 */
export function mockMenu(platform) {
    if (platform === void 0) { platform = null; }
    var /** @type {?} */ app = mockApp();
    var /** @type {?} */ gestureCtrl = new GestureController(app);
    var /** @type {?} */ dom = mockDomController();
    var /** @type {?} */ elementRef = mockElementRef();
    var /** @type {?} */ renderer = mockRenderer();
    var /** @type {?} */ plt = platform === null ? mockPlatform() : platform;
    return new Menu(null, elementRef, null, plt, renderer, null, gestureCtrl, dom, app);
}
/**
 * @param {?=} links
 * @return {?}
 */
export function mockDeepLinkConfig(links) {
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
/**
 * @return {?}
 */
export function mockHaptic() {
    return new Haptic(mockPlatform());
}
var MockView = (function () {
    function MockView() {
    }
    return MockView;
}());
export { MockView };
var MockView1 = (function () {
    function MockView1() {
    }
    return MockView1;
}());
export { MockView1 };
var MockView2 = (function () {
    function MockView2() {
    }
    return MockView2;
}());
export { MockView2 };
var MockView3 = (function () {
    function MockView3() {
    }
    return MockView3;
}());
export { MockView3 };
var MockView4 = (function () {
    function MockView4() {
    }
    return MockView4;
}());
export { MockView4 };
var MockView5 = (function () {
    function MockView5() {
    }
    return MockView5;
}());
export { MockView5 };
/**
 * @return {?}
 */
export function noop() { return 'noop'; }
/**
 * @param {?=} ngModuleLoader
 * @return {?}
 */
export function mockModuleLoader(ngModuleLoader) {
    ngModuleLoader = ngModuleLoader || mockNgModuleLoader();
    return new ModuleLoader(ngModuleLoader, null);
}
/**
 * @return {?}
 */
export function mockNgModuleLoader() {
    return new NgModuleLoader(null);
}
/**
 * @return {?}
 */
export function mockOverlay() {
    return {
        present: function (_opts) { return Promise.resolve(); },
        dismiss: function (_data, _role, _navOptions) { return Promise.resolve(); },
        onDidDismiss: function (_callback) { },
        onWillDismiss: function (_callback) { }
    };
}
//# sourceMappingURL=mock-providers.js.map