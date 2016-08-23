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
  return new App(config, platform);
};

export const mockTrasitionController = function() {
  let trnsCtrl = new TransitionController();
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

export const mockElementRef = function(): ElementRef {
  return {
    nativeElement: document.createElement('div')
  };
};

export const mockRenderer = function(): Renderer {
  let renderer: any = {
    setElementAttribute: () => {},
    setElementClass: () => {},
    setElementStyle: () => {}
  };
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

export class MockPage {}

export const mockView = function(componentType?: any, data?: any) {
  if (!componentType) {
    componentType = MockPage;
  }
  let view = new ViewController(componentType, data);
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

  let trnsCtrl = mockTrasitionController();

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

export const mockOverlayPortal = function(): OverlayPortal {
  let platform = mockPlatform();

  let config = mockConfig(null, '/', platform);

  let app = mockApp(config, platform);

  let form = new Form();

  let zone = mockZone();

  let keyboard = new Keyboard(config, form, zone);

  let elementRef = mockElementRef();

  let renderer = mockRenderer();

  let compiler: any = null;

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
    compiler,
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
  let linker: DeepLinker = null;

  return new Tabs(null, null, app, config, elementRef, platform, renderer, linker);
};

export const mockIonicApp = function(): IonicApp {
  let mockIonicAppObj = <any> { };

  mockIonicAppObj._loadingPortal = mockOverlayPortal();
  mockIonicAppObj._toastPortal = mockOverlayPortal();
  mockIonicAppObj._overlayPortal = mockOverlayPortal();

  mockIonicAppObj._renderer = {
    setElementClass: () => {}
  };

  return <IonicApp> mockIonicAppObj;
};
