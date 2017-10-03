import { ChangeDetectorRef, ComponentRef, ElementRef, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';

import { AnimationOptions } from '../animations/animation';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { Content } from '../components/content/content';
import { DeepLinker } from '../navigation/deep-linker';
import { DomController } from '../platform/dom-controller';
import { GestureController } from '../gestures/gesture-controller';
import { Haptic } from '../tap-click/haptic';
import { IonicApp } from '../components/app/app-root';
import { Menu } from '../components/menu/menu';
import { NavOptions } from '../navigation/nav-util';
import { NavControllerBase } from '../navigation/nav-controller-base';
import { OverlayPortal } from '../components/app/overlay-portal';
import { PageTransition } from '../transitions/page-transition';
import { Platform } from '../platform/platform';
import { QueryParams } from '../platform/query-params';
import { Tab }  from '../components/tabs/tab';
import { Tabs }  from '../components/tabs/tabs';
import { TransitionController } from '../transitions/transition-controller';
import { UrlSerializer } from '../navigation/url-serializer';
import { ViewController } from '../navigation/view-controller';
import { ModuleLoader } from './module-loader';
import { NgModuleLoader } from './ng-module-loader';
import { DeepLinkConfig, STATE_INITIALIZED } from '../navigation/nav-util';
import { Ion } from '../components/ion';
import { Item } from '../components/item/item';
import { Form } from './form';


export function mockConfig(config?: any, _url: string = '/', platform?: Platform) {
  const c = new Config();
  const p = platform || mockPlatform();
  c.init(config, p);
  return c;
}

export function mockQueryParams(url: string = '/') {
  const qp = new QueryParams();
  qp.parseUrl(url);
  return qp;
}

export function mockPlatform() {
  return new MockPlatform();
}


export class MockPlatform extends Platform {
  private timeoutIds = 0;
  private timeouts: {callback: Function, timeout: number, timeoutId: number}[] = [];
  private rafIds = 0;
  private timeStamps = 0;
  private rafs: {callback: Function, rafId: number}[] = [];

  constructor() {
    super();
    const doc = document.implementation.createHTMLDocument('');
    this.setWindow(window);
    this.setDocument(doc);
    this.setCssProps(doc.documentElement);
  }

  timeout(callback: Function, timeout: number) {
    const timeoutId = ++this.timeoutIds;

    this.timeouts.push({
      callback: callback,
      timeout: timeout,
      timeoutId: timeoutId
    });

    return timeoutId;
  }

  cancelTimeout(timeoutId: number) {
    for (var i = 0; i < this.timeouts.length; i++) {
      if (timeoutId === this.timeouts[i].timeoutId) {
        this.timeouts.splice(i, 1);
        break;
      }
    }
  }

  flushTimeouts(done: Function) {
    setTimeout(() => {
      this.timeouts.sort(function(a, b) {
        if (a.timeout < b.timeout) return -1;
        if (a.timeout > b.timeout) return 1;
        return 0;
      }).forEach(t => {
        t.callback();
      });
      this.timeouts.length = 0;
      done();
    });
  }

  flushTimeoutsUntil(timeout: number, done: Function) {
    setTimeout(() => {
      this.timeouts.sort(function(a, b) {
        if (a.timeout < b.timeout) return -1;
        if (a.timeout > b.timeout) return 1;
        return 0;
      });

      const keepers: any[] = [];
      this.timeouts.forEach(t => {
        if (t.timeout < timeout) {
          t.callback();
        } else {
          keepers.push(t);
        }
      });

      this.timeouts = keepers;
      done();
    });
  }

  raf(callback: {(timeStamp?: number): void}|Function): number {
    const rafId = ++this.rafIds;
    this.rafs.push({
      callback: callback,
      rafId: rafId
    });
    return rafId;
  }

  cancelRaf(rafId: number) {
    for (var i = 0; i < this.rafs.length; i++) {
      if (rafId === this.rafs[i].rafId) {
        this.rafs.splice(i, 1);
        break;
      }
    }
  }

  flushRafs(done: Function) {
    const timestamp = ++this.timeStamps;
    setTimeout(() => {
      this.rafs.forEach(raf => {
        raf.callback(timestamp);
      });
      this.rafs.length = 0;
      done(timestamp);
    });
  }

}


export function mockDomController(platform?: MockPlatform) {
  platform = platform || mockPlatform();
  return new MockDomController(platform);
}

export class MockDomController extends DomController {

  constructor(private mockedPlatform: MockPlatform) {
    super(mockedPlatform);
  }

  flush(done: any) {
    this.mockedPlatform.flushTimeouts(() => {
      this.mockedPlatform.flushRafs((timeStamp: number) => {
        done(timeStamp);
      });
    });
  }

  flushUntil(timeout: number, done: any) {
    this.mockedPlatform.flushTimeoutsUntil(timeout, () => {
      this.mockedPlatform.flushRafs((timeStamp: number) => {
        done(timeStamp);
      });
    });
  }
}


export function mockApp(config?: Config, platform?: MockPlatform) {
  platform = platform || mockPlatform();
  config = config || mockConfig(null, '/', platform);
  let app = new App(config, platform);
  mockIonicApp(app, config, platform);
  return app;
}

export function mockIonicApp(app: App, config: Config, plt: MockPlatform): IonicApp {
  let appRoot = new IonicApp(
    null, null, mockElementRef(), mockRenderer(), config, plt, app);

  appRoot._loadingPortal = mockOverlayPortal(app, config, plt);
  appRoot._toastPortal = mockOverlayPortal(app, config, plt);
  appRoot._overlayPortal = mockOverlayPortal(app, config, plt);
  appRoot._modalPortal = mockOverlayPortal(app, config, plt);

  return appRoot;
}

export const mockTrasitionController = function(config: Config) {
  let platform = mockPlatform();
  platform.raf = <any>function(callback: Function) {
    callback();
  };
  let trnsCtrl = new TransitionController(platform, config);
  trnsCtrl.get = (trnsId: number, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions) => {
    let trns = new PageTransition(platform, enteringView, leavingView, opts);
    trns.trnsId = trnsId;
    return trns;
  };
  return trnsCtrl;
};

export function mockContent(): Content {
  const platform = mockPlatform();
  return new Content(mockConfig(), platform, mockDomController(platform), mockElementRef(), mockRenderer(), null, null, mockZone(), null, null);
}

export function mockZone(): NgZone {
  return new NgZone({enableLongStackTrace: false});
}

export function mockChangeDetectorRef(): ChangeDetectorRef {
  let cd: any = {
    reattach: () => {},
    detach: () => {},
    detectChanges: () => {}
  };
  return cd;
}

export function mockGestureController(app?: App): GestureController {
  if (!app) {
    app = mockApp();
  }
  return new GestureController(app);

}

export class MockElementRef implements ElementRef {
  nativeElement: any;
  constructor(ele: any) {
    this.nativeElement = ele;
  }
}

export class MockElement {
  children: any[] = [];
  classList = new ClassList();
  attributes: { [name: string]: any } = {};
  style: { [property: string]: any } = {};
  nodeName: string = 'ION-MOCK';

  clientWidth = 0;
  clientHeight = 0;
  clientTop = 0;
  clientLeft = 0;
  offsetWidth = 0;
  offsetHeight = 0;
  offsetTop = 0;
  offsetLeft = 0;
  scrollTop = 0;
  scrollHeight = 0;

  get className() {
    return this.classList.classes.join(' ');
  }

  set className(val: string) {
    this.classList.classes = val.split(' ');
  }

  hasAttribute(name: string) {
    return !!this.attributes[name];
  }

  getAttribute(name: string) {
    return this.attributes[name];
  }

  setAttribute(name: string, val: any) {
    this.attributes[name] = val;
  }

  addEventListener(_type: string, _listener: Function, _options?: any) { }

  removeEventListener(_type: string, _listener: Function, _options?: any) { }

  removeAttribute(name: string) {
    delete this.attributes[name];
  }
}

export class ClassList {
  classes: string[] = [];
  add(className: string) {
    if (!this.contains(className)) {
      this.classes.push(className);
    }
  }
  remove(className: string) {
    const index = this.classes.indexOf(className);
    if (index > -1) {
      this.classes.splice(index, 1);
    }
  }
  toggle(className: string) {
    if (this.contains(className)) {
      this.remove(className);
    } else {
      this.add(className);
    }
  }
  contains(className: string) {
    return this.classes.indexOf(className) > -1;
  }
}

export function mockElementRef(): ElementRef {
  return new MockElementRef(new MockElement());
}

export function mockElementRefEle(ele: any): ElementRef {
  return new MockElementRef(ele);
}

export class MockRenderer {
  setElementAttribute(renderElement: MockElement, name: string, val: any) {
    if (name === null) {
      renderElement.removeAttribute(name);
    } else {
      renderElement.setAttribute(name, val);
    }
  }
  setElementClass(renderElement: MockElement, className: string, isAdd: boolean) {
    if (isAdd) {
      renderElement.classList.add(className);
    } else {
      renderElement.classList.remove(className);
    }
  }
  setElementStyle(renderElement: MockElement, styleName: string, styleValue: string) {
    renderElement.style[styleName] = styleValue;
  }
}

export function mockRenderer(): Renderer {
  const renderer: any = new MockRenderer();
  return renderer;
}

export function mockLocation(): Location {
  let location: any = {
    path: () => { return ''; },
    subscribe: () => {},
    go: () => {},
    back: () => {},
    prepareExternalUrl: () => {}
  };
  return location;
}

export function mockView(component?: any, data?: any) {
  if (!component) {
    component = MockView;
  }
  let view = new ViewController(component, data);
  view.init(mockComponentRef());
  return view;
}

export function mockViews(nav: NavControllerBase, views: ViewController[]) {
  nav._views = views;
  views.forEach(v => {
    v._setNav(nav);
  });
}

export function mockComponentRef(): ComponentRef<any> {
  let componentRef: any = {
    location: mockElementRef(),
    changeDetectorRef: mockChangeDetectorRef(),
    destroy: () => {}
  };
  return componentRef;
}

export function mockDeepLinker(linkConfig: DeepLinkConfig = null, app?: App) {
  app = app || mockApp(mockConfig(), mockPlatform());
  let serializer = new UrlSerializer(app, linkConfig);
  let location = mockLocation();

  return new DeepLinker(app || mockApp(), serializer, location, null, null);
}

export function mockNavController(): NavControllerBase {
  let platform = mockPlatform();
  let config = mockConfig(null, '/', platform);
  let app = mockApp(config, platform);
  let zone = mockZone();
  let dom = mockDomController(platform);
  let elementRef = mockElementRef();
  let renderer = mockRenderer();
  let componentFactoryResolver: any = null;
  let gestureCtrl = new GestureController(app);
  let linker = mockDeepLinker(null, app);
  let trnsCtrl = mockTrasitionController(config);
  let nav = new NavControllerBase(
    null,
    app,
    config,
    platform,
    elementRef,
    zone,
    renderer,
    componentFactoryResolver,
    gestureCtrl,
    trnsCtrl,
    linker,
    dom,
    null
  );

  nav._viewInit = function(enteringView: ViewController) {
    enteringView.init(mockComponentRef());
    enteringView._state = STATE_INITIALIZED;
  };

  (<any>nav)._orgViewInsert = nav._viewAttachToDOM;

  nav._viewAttachToDOM = function(view: ViewController, componentRef: ComponentRef<any>, _viewport: ViewContainerRef) {
    let mockedViewport: any = {
      insert: () => { }
    };
    (<any>nav)._orgViewInsert(view, componentRef, mockedViewport);
  };

  return nav;
}

export function mockOverlayPortal(app: App, config: Config, plt: MockPlatform): OverlayPortal {
  let zone = mockZone();
  let dom = mockDomController(plt);
  let elementRef = mockElementRef();
  let renderer = mockRenderer();
  let componentFactoryResolver: any = null;
  let gestureCtrl = new GestureController(app);
  let serializer = new UrlSerializer(app, null);
  let location = mockLocation();
  let deepLinker = new DeepLinker(app, serializer, location, null, null);

  return new OverlayPortal(
    app,
    config,
    plt,
    elementRef,
    zone,
    renderer,
    componentFactoryResolver,
    gestureCtrl,
    null,
    deepLinker,
    null,
    dom,
    null
  );
}

export function mockTab(parentTabs: Tabs, overrideLoad: boolean = true): Tab {
  let platform = mockPlatform();
  let config = mockConfig(null, '/', platform);
  let app = (<any>parentTabs)._app || mockApp(config, platform);
  let zone = mockZone();
  let dom = mockDomController(platform);
  let elementRef = mockElementRef();
  let renderer = mockRenderer();
  let changeDetectorRef = mockChangeDetectorRef();
  let compiler: any = null;
  let gestureCtrl = new GestureController(app);
  let linker = mockDeepLinker(null, app);

  let tab = new Tab(
    parentTabs,
    app,
    config,
    platform,
    elementRef,
    zone,
    renderer,
    compiler,
    changeDetectorRef,
    gestureCtrl,
    null,
    linker,
    dom,
    null
  );

  if (overrideLoad) {
    tab.load = (_opts: any) => {
      return Promise.resolve();
    };
  }

  return tab;
}

export function mockForm(): Form {
  return new Form();
}

export function mockIon(): Ion {
  const config = mockConfig();
  const elementRef = mockElementRef();
  const renderer = mockRenderer();
  return new Ion(config, elementRef, renderer, 'ion');
}

export function mockItem(): Item {
  const form = mockForm();
  const config = mockConfig();
  const elementRef = mockElementRef();
  const renderer = mockRenderer();
  return new Item(form, config, elementRef, renderer, null);
}

export function mockTabs(app?: App): Tabs {
  let platform = mockPlatform();
  let config = mockConfig(null, '/', platform);
  app = app || mockApp(config, platform);
  let elementRef = mockElementRef();
  let renderer = mockRenderer();
  let linker: DeepLinker = mockDeepLinker();

  return new Tabs(null, null, app, config, elementRef, platform, renderer, linker);
}

export function mockMenu(platform: MockPlatform = null): Menu {
  let app = mockApp();
  let gestureCtrl = new GestureController(app);
  let dom = mockDomController();
  let elementRef = mockElementRef();
  let renderer = mockRenderer();
  let plt = platform === null ? mockPlatform() : platform;
  return new Menu(null, elementRef, null, plt, renderer, null, gestureCtrl, dom, app);
}

export function mockDeepLinkConfig(links?: any[]): DeepLinkConfig {
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

export function mockHaptic(): Haptic {
  return new Haptic(mockPlatform());
}


export class MockView {}
export class MockView1 {}
export class MockView2 {}
export class MockView3 {}
export class MockView4 {}
export class MockView5 {}

export function noop(): any { return 'noop'; }

export function mockModuleLoader(ngModuleLoader?: NgModuleLoader): ModuleLoader {
  ngModuleLoader = ngModuleLoader || mockNgModuleLoader();
  return new ModuleLoader(ngModuleLoader, null);
}

export function mockNgModuleLoader(): NgModuleLoader {
  return new NgModuleLoader(null);
}

export function mockOverlay() {
  return {
    present: (_opts?: NavOptions) => { return Promise.resolve(); },
    dismiss: (_data?: any, _role?: string, _navOptions?: NavOptions) => { return Promise.resolve(); },
    onDidDismiss: (_callback: Function) => { },
    onWillDismiss: (_callback: Function) => { }
  };
}
