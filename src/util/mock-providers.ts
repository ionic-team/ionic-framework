import { ChangeDetectorRef, ElementRef, NgZone, Renderer } from '@angular/core';
import { Location } from '@angular/common';

import { App, Config, Form, GestureController, Keyboard, MenuController, NavOptions, Platform, Tab, Tabs, Transition, ViewController } from '../../src';
import { NavControllerBase } from '../../src/components/nav/nav-controller-base';


export const mockConfig = function(config?: any) {
  return new Config(config);
};

export const mockPlatform = function(platforms?: string[]) {
  return new Platform(platforms);
};

export const mockApp = function(config?: Config, platform?: Platform) {
  config = config || mockConfig();
  platform = platform || mockPlatform();
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

  let config = mockConfig();
  config.setPlatform(platform);

  let app = mockApp(config, platform);

  let form = new Form();

  let zone = mockZone();

  let keyboard = new Keyboard(config, form, zone);

  let elementRef = mockElementRef();

  let renderer = mockRenderer();

  let compiler: any = null;

  let gestureCtrl = new GestureController(app);

  let location = mockLocation();

  return new NavControllerBase(
    null,
    app,
    config,
    keyboard,
    elementRef,
    zone,
    renderer,
    compiler,
    gestureCtrl
  );
};

export const mockTab = function(parentTabs: Tabs): Tab {
  let platform = mockPlatform();

  let config = mockConfig();
  config.setPlatform(platform);

  let app = (<any>parentTabs)._app || mockApp(config, platform);

  let form = new Form();

  let zone = mockZone();

  let keyboard = new Keyboard(config, form, zone);

  let elementRef = mockElementRef();

  let renderer = mockRenderer();

  let changeDetectorRef = mockChangeDetectorRef();

  let compiler: any = null;

  let gestureCtrl = new GestureController(app);

  let location = mockLocation();

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
    gestureCtrl
  );

  tab.load = (opts: any, cb: Function) => {
    cb();
  };

  return tab;
};

export const mockTabs = function(app?: App): Tabs {
  let config = mockConfig();
  let platform = mockPlatform();
  app = app || mockApp(config, platform);
  let elementRef = mockElementRef();
  let renderer = mockRenderer();

  return new Tabs(null, null, app, config, elementRef, platform, renderer);
};
