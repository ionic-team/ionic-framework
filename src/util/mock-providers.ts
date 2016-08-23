import { ChangeDetectorRef, ElementRef, NgZone, Renderer } from '@angular/core';
import { Location } from '@angular/common';

import { App } from '../components/app/app';
import { IonicApp } from '../components/app/app-root';
import { Config } from '../config/config';
import { DeepLinker } from '../navigation/deep-linker';
import { Form } from './form';
import { GestureController } from '../gestures/gesture-controller';
import { Keyboard } from './keyboard';
import { OverlayPortal } from '../components/nav/overlay-portal';
import { Platform } from '../platform/platform';
import { QueryParams } from '../platform/query-params';
import { Tab }  from '../components/tabs/tab';
import { Tabs }  from '../components/tabs/tabs';
import { Transition } from '../transitions/transition';
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

export const mockPlatform = function(platforms?: string[]) {
  return new Platform();
};

export const mockApp = function(config?: Config, platform?: Platform) {
  platform = platform || mockPlatform();
  config = config || mockConfig(null, '/', platform);
  return new App(config, platform);
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
    detach: () => {}
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

export const mockTransition = function(playCallback: Function, duration: number) {
  return function _createTrans(enteringView: ViewController, leavingView: ViewController, transitionOpts: any): Transition {
    let transition: any = {
      play: () => {
        playCallback();
      },
      getDuration: () => { return duration; },
      onFinish: () => {}
    };
    return transition;
  };
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

  let compiler: any = null;

  let gestureCtrl = new GestureController(app);

  // let navLikConfig = new NavLinkConfig([]);

  let serializer = new UrlSerializer(null);

  let location = mockLocation();

  let deepLinker = new DeepLinker(app, serializer, location);

  return new NavControllerBase(
    null,
    app,
    config,
    keyboard,
    elementRef,
    zone,
    renderer,
    compiler,
    gestureCtrl,
    null,
    deepLinker
  );
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

  // let navLikConfig = new NavLinkConfig([]);

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
}

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

  // let navLikConfig = new NavLinkConfig([]);

  let serializer = new UrlSerializer(null);

  let location = mockLocation();

  let linker = new DeepLinker(app, serializer, location);

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
}