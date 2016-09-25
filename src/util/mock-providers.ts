import { ChangeDetectorRef, ComponentRef, ElementRef, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';

import { AnimationOptions } from '../animations/animation';
import { App } from '../components/app/app';
import { IonicApp } from '../components/app/app-root';
import { Config } from '../config/config';
import { DeepLinker } from '../navigation/deep-linker';
import { Form } from './form';
import { GestureController } from '../gestures/gesture-controller';
import { Keyboard } from './keyboard';
import { Menu } from '../components/menu/menu';
import { NavOptions, ViewState, DeepLinkConfig } from '../navigation/nav-util';
import { OverlayPortal } from '../components/nav/overlay-portal';
import { PageTransition } from '../transitions/page-transition';
import { Platform } from '../platform/platform';
import { QueryParams } from '../platform/query-params';
import { Tab }  from '../components/tabs/tab';
import { Tabs }  from '../components/tabs/tabs';
import { Transition } from '../transitions/transition';
import { TransitionController } from '../transitions/transition-controller';
import { UrlSerializer } from '../navigation/url-serializer';
import { ViewController } from '../navigation/view-controller';

import { NavControllerBase } from '../navigation/nav-controller-base';

export const mockConfig = function(config?: any, url: string = '/', platform?: Platform) {
  const c = new Config();
  const q = mockQueryParams();
  const p = platform || mockPlatform();
  c.init(config, q, p);
  return c;
};

export const mockQueryParams = function(url: string = '/') {
  return new QueryParams(url);
};

export const mockPlatform = function() {
  return new Platform();
};

export const mockApp = function(config?: Config, platform?: Platform) {
  platform = platform || mockPlatform();
  config = config || mockConfig(null, '/', platform);
  let app = new App(config, platform);
  mockIonicApp(app, config, platform);
  return app;
};

export const mockIonicApp = function(app: App, config: Config, platform: Platform): IonicApp {
  let appRoot = new IonicApp(
    null, null, mockElementRef(), mockRenderer(), config, platform, app);

  appRoot._loadingPortal = mockOverlayPortal(app, config, platform);
  appRoot._toastPortal = mockOverlayPortal(app, config, platform);
  appRoot._overlayPortal = mockOverlayPortal(app, config, platform);

  return appRoot;
};

export const mockTrasitionController = function(config: Config) {
  let trnsCtrl = new TransitionController(config);
  trnsCtrl.get = (trnsId: number, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions) => {
    let trns = new PageTransition(enteringView, leavingView, opts, (callback: Function) => {
      callback();
    });
    trns.trnsId = trnsId;
    return trns;
  };
  return trnsCtrl;
};

export const mockZone = function(): NgZone {
  let zone: any = {
    run: function(cb: any) {
      cb();
    },
    runOutsideAngular: function(cb: any) {
      cb();
    }
  };
  return zone;
};

export const mockChangeDetectorRef = function(): ChangeDetectorRef {
  let cd: any = {
    reattach: () => {},
    detach: () => {},
    detectChanges: () => {}
  };
  return cd;
};

export class MockElementRef implements ElementRef {
  nativeElement: any = new MockElement();
}

export class MockElement {
  children: any[] = [];
  classList = new ClassList();
  attributes: { [name: string]: any } = {};
  style: {[property: string]: any} = {};

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

export const mockElementRef = function(): ElementRef {
  return new MockElementRef();
};

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

export const mockRenderer = function(): Renderer {
  const renderer: any = new MockRenderer();
  return renderer;
};

export const mockLocation = function(): Location {
  let location: any = {
    path: () => { return ''; },
    subscribe: () => {},
    go: () => {},
    back: () => {}
  };
  return location;
};

export const mockView = function(component?: any, data?: any) {
  if (!component) {
    component = MockView;
  }
  let view = new ViewController(component, data);
  view.init(mockComponentRef());
  return view;
};

export const mockViews = function(nav: NavControllerBase, views: ViewController[]) {
  nav._views = views;
  views.forEach(v => v._setNav(nav));
};

export const mockComponentRef = function(): ComponentRef<any> {
  let componentRef: any = {
    location: mockElementRef(),
    changeDetectorRef: mockChangeDetectorRef(),
    destroy: () => {}
  };
  return componentRef;
};

export const mockDeepLinker = function(linkConfig: DeepLinkConfig = null, app?: App) {
  let serializer = new UrlSerializer(linkConfig);

  let location = mockLocation();

  return new DeepLinker(app || mockApp(), serializer, location);
};

export const mockNavController = function(): NavControllerBase {
  let platform = mockPlatform();

  let config = mockConfig(null, '/', platform);

  let app = mockApp(config, platform);

  let form = new Form();

  let zone = mockZone();

  let keyboard = new Keyboard(config, form, zone);

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
    keyboard,
    elementRef,
    zone,
    renderer,
    componentFactoryResolver,
    gestureCtrl,
    trnsCtrl,
    linker
  );

  nav._viewInit = function(trns: Transition, enteringView: ViewController, opts: NavOptions) {
    enteringView.init(mockComponentRef());
    enteringView._state = ViewState.INITIALIZED;
  };

  (<any>nav)._orgViewInsert = nav._viewInsert;

  nav._viewInsert = function(view: ViewController, componentRef: ComponentRef<any>, viewport: ViewContainerRef) {
    let mockedViewport: any = {
      insert: () => { }
    };
    (<any>nav)._orgViewInsert(view, componentRef, mockedViewport);
  };

  return nav;
};

export const mockOverlayPortal = function(app: App, config: Config, platform: Platform): OverlayPortal {
  let form = new Form();

  let zone = mockZone();

  let keyboard = new Keyboard(config, form, zone);

  let elementRef = mockElementRef();

  let renderer = mockRenderer();

  let componentFactoryResolver: any = null;

  let gestureCtrl = new GestureController(app);

  let serializer = new UrlSerializer(null);

  let location = mockLocation();

  let deepLinker = new DeepLinker(app, serializer, location);

  return new OverlayPortal(
    app,
    config,
    keyboard,
    elementRef,
    zone,
    renderer,
    componentFactoryResolver,
    gestureCtrl,
    null,
    deepLinker,
    null
  );
};

export const mockTab = function(parentTabs: Tabs): Tab {
  let platform = mockPlatform();

  let config = mockConfig(null, '/', platform);

  let app = (<any>parentTabs)._app || mockApp(config, platform);

  let form = new Form();

  let zone = mockZone();

  let keyboard = new Keyboard(config, form, zone);

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
    keyboard,
    elementRef,
    zone,
    renderer,
    compiler,
    changeDetectorRef,
    gestureCtrl,
    null,
    linker
  );

  tab.load = (opts: any, cb: Function) => {
    cb();
  };

  return tab;
};

export const mockTabs = function(app?: App): Tabs {
  let platform = mockPlatform();
  let config = mockConfig(null, '/', platform);
  app = app || mockApp(config, platform);
  let elementRef = mockElementRef();
  let renderer = mockRenderer();
  let linker: DeepLinker = mockDeepLinker();

  return new Tabs(null, null, app, config, elementRef, platform, renderer, linker);
};

export const mockMenu = function(): Menu {
  return new Menu(null, null, null, null, null, null, null, null);
};

export const mockDeepLinkConfig = function(links?: any[]): DeepLinkConfig {
  return {
    links: links || [
      { component: MockView1, name: 'viewone' },
      { component: MockView2, name: 'viewtwo' },
      { component: MockView3, name: 'viewthree' },
      { component: MockView4, name: 'viewfour' },
      { component: MockView5, name: 'viewfive' }
    ]
  };
};

export class MockView {}
export class MockView1 {}
export class MockView2 {}
export class MockView3 {}
export class MockView4 {}
export class MockView5 {}

export function noop(): any { return 'noop'; };
