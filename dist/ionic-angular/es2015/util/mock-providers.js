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
export function mockConfig(config, _url = '/', platform) {
    const /** @type {?} */ c = new Config();
    const /** @type {?} */ p = platform || mockPlatform();
    c.init(config, p);
    return c;
}
/**
 * @param {?=} url
 * @return {?}
 */
export function mockQueryParams(url = '/') {
    const /** @type {?} */ qp = new QueryParams();
    qp.parseUrl(url);
    return qp;
}
/**
 * @return {?}
 */
export function mockPlatform() {
    return new MockPlatform();
}
export class MockPlatform extends Platform {
    constructor() {
        super();
        this.timeoutIds = 0;
        this.timeouts = [];
        this.rafIds = 0;
        this.timeStamps = 0;
        this.rafs = [];
        const doc = document.implementation.createHTMLDocument('');
        this.setWindow(window);
        this.setDocument(doc);
        this.setCssProps(doc.documentElement);
    }
    /**
     * @param {?} callback
     * @param {?} timeout
     * @return {?}
     */
    timeout(callback, timeout) {
        const /** @type {?} */ timeoutId = ++this.timeoutIds;
        this.timeouts.push({
            callback: callback,
            timeout: timeout,
            timeoutId: timeoutId
        });
        return timeoutId;
    }
    /**
     * @param {?} timeoutId
     * @return {?}
     */
    cancelTimeout(timeoutId) {
        for (var /** @type {?} */ i = 0; i < this.timeouts.length; i++) {
            if (timeoutId === this.timeouts[i].timeoutId) {
                this.timeouts.splice(i, 1);
                break;
            }
        }
    }
    /**
     * @param {?} done
     * @return {?}
     */
    flushTimeouts(done) {
        setTimeout(() => {
            this.timeouts.sort(function (a, b) {
                if (a.timeout < b.timeout)
                    return -1;
                if (a.timeout > b.timeout)
                    return 1;
                return 0;
            }).forEach(t => {
                t.callback();
            });
            this.timeouts.length = 0;
            done();
        });
    }
    /**
     * @param {?} timeout
     * @param {?} done
     * @return {?}
     */
    flushTimeoutsUntil(timeout, done) {
        setTimeout(() => {
            this.timeouts.sort(function (a, b) {
                if (a.timeout < b.timeout)
                    return -1;
                if (a.timeout > b.timeout)
                    return 1;
                return 0;
            });
            const /** @type {?} */ keepers = [];
            this.timeouts.forEach(t => {
                if (t.timeout < timeout) {
                    t.callback();
                }
                else {
                    keepers.push(t);
                }
            });
            this.timeouts = keepers;
            done();
        });
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    raf(callback) {
        const /** @type {?} */ rafId = ++this.rafIds;
        this.rafs.push({
            callback: callback,
            rafId: rafId
        });
        return rafId;
    }
    /**
     * @param {?} rafId
     * @return {?}
     */
    cancelRaf(rafId) {
        for (var /** @type {?} */ i = 0; i < this.rafs.length; i++) {
            if (rafId === this.rafs[i].rafId) {
                this.rafs.splice(i, 1);
                break;
            }
        }
    }
    /**
     * @param {?} done
     * @return {?}
     */
    flushRafs(done) {
        const /** @type {?} */ timestamp = ++this.timeStamps;
        setTimeout(() => {
            this.rafs.forEach(raf => {
                raf.callback(timestamp);
            });
            this.rafs.length = 0;
            done(timestamp);
        });
    }
}
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
export class MockDomController extends DomController {
    /**
     * @param {?} mockedPlatform
     */
    constructor(mockedPlatform) {
        super(mockedPlatform);
        this.mockedPlatform = mockedPlatform;
    }
    /**
     * @param {?} done
     * @return {?}
     */
    flush(done) {
        this.mockedPlatform.flushTimeouts(() => {
            this.mockedPlatform.flushRafs((timeStamp) => {
                done(timeStamp);
            });
        });
    }
    /**
     * @param {?} timeout
     * @param {?} done
     * @return {?}
     */
    flushUntil(timeout, done) {
        this.mockedPlatform.flushTimeoutsUntil(timeout, () => {
            this.mockedPlatform.flushRafs((timeStamp) => {
                done(timeStamp);
            });
        });
    }
}
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
    let /** @type {?} */ app = new App(config, platform);
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
    let /** @type {?} */ appRoot = new IonicApp(null, null, mockElementRef(), mockRenderer(), config, plt, app);
    appRoot._loadingPortal = mockOverlayPortal(app, config, plt);
    appRoot._toastPortal = mockOverlayPortal(app, config, plt);
    appRoot._overlayPortal = mockOverlayPortal(app, config, plt);
    appRoot._modalPortal = mockOverlayPortal(app, config, plt);
    return appRoot;
}
export const /** @type {?} */ mockTrasitionController = function (config) {
    let /** @type {?} */ platform = mockPlatform();
    platform.raf = (function (callback) {
        callback();
    });
    let /** @type {?} */ trnsCtrl = new TransitionController(platform, config);
    trnsCtrl.get = (trnsId, enteringView, leavingView, opts) => {
        let /** @type {?} */ trns = new PageTransition(platform, enteringView, leavingView, opts);
        trns.trnsId = trnsId;
        return trns;
    };
    return trnsCtrl;
};
/**
 * @return {?}
 */
export function mockContent() {
    const /** @type {?} */ platform = mockPlatform();
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
    let /** @type {?} */ cd = {
        reattach: () => { },
        detach: () => { },
        detectChanges: () => { }
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
export class MockElementRef {
    /**
     * @param {?} ele
     */
    constructor(ele) {
        this.nativeElement = ele;
    }
}
function MockElementRef_tsickle_Closure_declarations() {
    /** @type {?} */
    MockElementRef.prototype.nativeElement;
}
export class MockElement {
    constructor() {
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
    /**
     * @return {?}
     */
    get className() {
        return this.classList.classes.join(' ');
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set className(val) {
        this.classList.classes = val.split(' ');
    }
    /**
     * @param {?} name
     * @return {?}
     */
    hasAttribute(name) {
        return !!this.attributes[name];
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getAttribute(name) {
        return this.attributes[name];
    }
    /**
     * @param {?} name
     * @param {?} val
     * @return {?}
     */
    setAttribute(name, val) {
        this.attributes[name] = val;
    }
    /**
     * @param {?} _type
     * @param {?} _listener
     * @param {?=} _options
     * @return {?}
     */
    addEventListener(_type, _listener, _options) { }
    /**
     * @param {?} _type
     * @param {?} _listener
     * @param {?=} _options
     * @return {?}
     */
    removeEventListener(_type, _listener, _options) { }
    /**
     * @param {?} name
     * @return {?}
     */
    removeAttribute(name) {
        delete this.attributes[name];
    }
}
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
export class ClassList {
    constructor() {
        this.classes = [];
    }
    /**
     * @param {?} className
     * @return {?}
     */
    add(className) {
        if (!this.contains(className)) {
            this.classes.push(className);
        }
    }
    /**
     * @param {?} className
     * @return {?}
     */
    remove(className) {
        const /** @type {?} */ index = this.classes.indexOf(className);
        if (index > -1) {
            this.classes.splice(index, 1);
        }
    }
    /**
     * @param {?} className
     * @return {?}
     */
    toggle(className) {
        if (this.contains(className)) {
            this.remove(className);
        }
        else {
            this.add(className);
        }
    }
    /**
     * @param {?} className
     * @return {?}
     */
    contains(className) {
        return this.classes.indexOf(className) > -1;
    }
}
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
export class MockRenderer {
    /**
     * @param {?} renderElement
     * @param {?} name
     * @param {?} val
     * @return {?}
     */
    setElementAttribute(renderElement, name, val) {
        if (name === null) {
            renderElement.removeAttribute(name);
        }
        else {
            renderElement.setAttribute(name, val);
        }
    }
    /**
     * @param {?} renderElement
     * @param {?} className
     * @param {?} isAdd
     * @return {?}
     */
    setElementClass(renderElement, className, isAdd) {
        if (isAdd) {
            renderElement.classList.add(className);
        }
        else {
            renderElement.classList.remove(className);
        }
    }
    /**
     * @param {?} renderElement
     * @param {?} styleName
     * @param {?} styleValue
     * @return {?}
     */
    setElementStyle(renderElement, styleName, styleValue) {
        renderElement.style[styleName] = styleValue;
    }
}
/**
 * @return {?}
 */
export function mockRenderer() {
    const /** @type {?} */ renderer = new MockRenderer();
    return renderer;
}
/**
 * @return {?}
 */
export function mockLocation() {
    let /** @type {?} */ location = {
        path: () => { return ''; },
        subscribe: () => { },
        go: () => { },
        back: () => { },
        prepareExternalUrl: () => { }
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
    let /** @type {?} */ view = new ViewController(component, data);
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
    views.forEach(v => {
        v._setNav(nav);
    });
}
/**
 * @return {?}
 */
export function mockComponentRef() {
    let /** @type {?} */ componentRef = {
        location: mockElementRef(),
        changeDetectorRef: mockChangeDetectorRef(),
        destroy: () => { }
    };
    return componentRef;
}
/**
 * @param {?=} linkConfig
 * @param {?=} app
 * @return {?}
 */
export function mockDeepLinker(linkConfig = null, app) {
    app = app || mockApp(mockConfig(), mockPlatform());
    let /** @type {?} */ serializer = new UrlSerializer(app, linkConfig);
    let /** @type {?} */ location = mockLocation();
    return new DeepLinker(app || mockApp(), serializer, location, null, null);
}
/**
 * @return {?}
 */
export function mockNavController() {
    let /** @type {?} */ platform = mockPlatform();
    let /** @type {?} */ config = mockConfig(null, '/', platform);
    let /** @type {?} */ app = mockApp(config, platform);
    let /** @type {?} */ zone = mockZone();
    let /** @type {?} */ dom = mockDomController(platform);
    let /** @type {?} */ elementRef = mockElementRef();
    let /** @type {?} */ renderer = mockRenderer();
    let /** @type {?} */ componentFactoryResolver = null;
    let /** @type {?} */ gestureCtrl = new GestureController(app);
    let /** @type {?} */ linker = mockDeepLinker(null, app);
    let /** @type {?} */ trnsCtrl = mockTrasitionController(config);
    let /** @type {?} */ nav = new NavControllerBase(null, app, config, platform, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, trnsCtrl, linker, dom, null);
    nav._viewInit = function (enteringView) {
        enteringView.init(mockComponentRef());
        enteringView._state = STATE_INITIALIZED;
    };
    ((nav))._orgViewInsert = nav._viewAttachToDOM;
    nav._viewAttachToDOM = function (view, componentRef, _viewport) {
        let /** @type {?} */ mockedViewport = {
            insert: () => { }
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
    let /** @type {?} */ zone = mockZone();
    let /** @type {?} */ dom = mockDomController(plt);
    let /** @type {?} */ elementRef = mockElementRef();
    let /** @type {?} */ renderer = mockRenderer();
    let /** @type {?} */ componentFactoryResolver = null;
    let /** @type {?} */ gestureCtrl = new GestureController(app);
    let /** @type {?} */ serializer = new UrlSerializer(app, null);
    let /** @type {?} */ location = mockLocation();
    let /** @type {?} */ deepLinker = new DeepLinker(app, serializer, location, null, null);
    return new OverlayPortal(app, config, plt, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, null, deepLinker, null, dom, null);
}
/**
 * @param {?} parentTabs
 * @param {?=} overrideLoad
 * @return {?}
 */
export function mockTab(parentTabs, overrideLoad = true) {
    let /** @type {?} */ platform = mockPlatform();
    let /** @type {?} */ config = mockConfig(null, '/', platform);
    let /** @type {?} */ app = ((parentTabs))._app || mockApp(config, platform);
    let /** @type {?} */ zone = mockZone();
    let /** @type {?} */ dom = mockDomController(platform);
    let /** @type {?} */ elementRef = mockElementRef();
    let /** @type {?} */ renderer = mockRenderer();
    let /** @type {?} */ changeDetectorRef = mockChangeDetectorRef();
    let /** @type {?} */ compiler = null;
    let /** @type {?} */ gestureCtrl = new GestureController(app);
    let /** @type {?} */ linker = mockDeepLinker(null, app);
    let /** @type {?} */ tab = new Tab(parentTabs, app, config, platform, elementRef, zone, renderer, compiler, changeDetectorRef, gestureCtrl, null, linker, dom, null);
    if (overrideLoad) {
        tab.load = (_opts, cb) => {
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
    const /** @type {?} */ config = mockConfig();
    const /** @type {?} */ elementRef = mockElementRef();
    const /** @type {?} */ renderer = mockRenderer();
    return new Ion(config, elementRef, renderer, 'ion');
}
/**
 * @return {?}
 */
export function mockItem() {
    const /** @type {?} */ form = mockForm();
    const /** @type {?} */ config = mockConfig();
    const /** @type {?} */ elementRef = mockElementRef();
    const /** @type {?} */ renderer = mockRenderer();
    return new Item(form, config, elementRef, renderer, null);
}
/**
 * @param {?=} app
 * @return {?}
 */
export function mockTabs(app) {
    let /** @type {?} */ platform = mockPlatform();
    let /** @type {?} */ config = mockConfig(null, '/', platform);
    app = app || mockApp(config, platform);
    let /** @type {?} */ elementRef = mockElementRef();
    let /** @type {?} */ renderer = mockRenderer();
    let /** @type {?} */ linker = mockDeepLinker();
    return new Tabs(null, null, app, config, elementRef, platform, renderer, linker);
}
/**
 * @param {?=} platform
 * @return {?}
 */
export function mockMenu(platform = null) {
    let /** @type {?} */ app = mockApp();
    let /** @type {?} */ gestureCtrl = new GestureController(app);
    let /** @type {?} */ dom = mockDomController();
    let /** @type {?} */ elementRef = mockElementRef();
    let /** @type {?} */ renderer = mockRenderer();
    let /** @type {?} */ plt = platform === null ? mockPlatform() : platform;
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
export class MockView {
}
export class MockView1 {
}
export class MockView2 {
}
export class MockView3 {
}
export class MockView4 {
}
export class MockView5 {
}
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
        present: (_opts) => { return Promise.resolve(); },
        dismiss: (_data, _role, _navOptions) => { return Promise.resolve(); },
        onDidDismiss: (_callback) => { },
        onWillDismiss: (_callback) => { }
    };
}
//# sourceMappingURL=mock-providers.js.map