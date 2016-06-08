import {bootstrap} from '@angular/platform-browser-dynamic';
import {Directive, ReflectiveInjector, Renderer, enableProdMode, ViewContainerRef, provide, PLATFORM_DIRECTIVES, ComponentRef, NgZone, DynamicComponentLoader} from '@angular/core';
import {ROUTER_PROVIDERS} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HTTP_PROVIDERS} from '@angular/http';

import {App} from '../components/app/app';
import {ClickBlock} from '../util/click-block';
import {Config} from './config';
import {Events} from '../util/events';
import {FeatureDetect} from '../util/feature-detect';
import {Form} from '../util/form';
import {IONIC_DIRECTIVES} from './directives';
import {isPresent} from '../util/util';
import {Keyboard} from '../util/keyboard';
import {MenuController} from '../components/menu/menu-controller';
import {nativeTimeout, closest} from '../util/dom';
import {NavRegistry} from '../components/nav/nav-registry';
import {Platform} from '../platform/platform';
import {ScrollView} from '../util/scroll-view';
import {TapClick} from '../components/tap-click/tap-click';
import {Translate} from '../translation/translate';
const _reflect: any = Reflect;


/**
 * @name ionicBoostrap
 * @description
 * `ionicBootstrap` allows you to bootstrap your entire application. Similar to Angualr's `bootstrap`, `ionicBootstrap`
 * takes a root component in order to start the app. You can pass along any providers that you may want to inject into your
 * app as an array for the second argument. You can also pass a config object as the third argument to configure your app's settings.
 *
 * @usage
 * import {ionicBootstrap} from 'ionic-angular';
 * import {Component} from '@angular/core';
 *
 * @Component({
 *   templateUrl: 'build/app.html',
 * })
 *
 * export class MyClass{}
 *
 * ionicBootstrap(MyClass, null, {tabbarPlacement: 'bottom'})
 */
export function ionicBootstrap(appRootComponent: any, customProviders?: Array<any>, config?: any): Promise<ComponentRef<any>> {
  // get all Ionic Providers
  let providers = ionicProviders(customProviders, config);

  // automatically set "ion-app" selector to users root component
  addSelector(appRootComponent, 'ion-app');

  // call angular bootstrap
  return bootstrap(appRootComponent, providers).then(ngComponentRef => {
    // ionic app has finished bootstrapping
    return ionicPostBootstrap(ngComponentRef);
  });
}


  /**
   * @private
   */
export function ionicPostBootstrap(ngComponentRef: ComponentRef<any>): ComponentRef<any> {
  let app: App = ngComponentRef.injector.get(App);
  app.setAppInjector(ngComponentRef.injector);

  // prepare platform ready
  let platform: Platform = ngComponentRef.injector.get(Platform);
  platform.setZone(ngComponentRef.injector.get(NgZone));
  platform.prepareReady();

  // TODO: Use PLATFORM_INITIALIZER
  ngComponentRef.injector.get(TapClick);

  // TODO: Use Renderer
  ngComponentRef.location.nativeElement.classList.add('app-init');

  return ngComponentRef;
}

  /**
   * @private
   */
export function ionicProviders(customProviders?: Array<any>, config?: any): any[] {
  let directives = IONIC_DIRECTIVES;

  // add custom providers to Ionic's app
  customProviders = isPresent(customProviders) ? customProviders : [];

  // create an instance of Config
  if (!(config instanceof Config)) {
    config = new Config(config);
  }

  // enable production mode if config set to true
  if (config.getBoolean('prodMode')) {
    enableProdMode();
  }

  // create an instance of Platform
  let platform = new Platform();

  // initialize platform
  platform.setUrl(window.location.href);
  platform.setUserAgent(window.navigator.userAgent);
  platform.setNavigatorPlatform(window.navigator.platform);
  platform.load(config);
  config.setPlatform(platform);

  let clickBlock = new ClickBlock();
  let events = new Events();
  let featureDetect = new FeatureDetect();
  let navRegistry = new NavRegistry();

  setupDom(window, document, config, platform, clickBlock, featureDetect);
  bindEvents(window, document, platform, events);

  return [
    App,
    provide(ClickBlock, {useValue: clickBlock}),
    provide(Config, {useValue: config}),
    provide(Events, {useValue: events}),
    provide(FeatureDetect, {useValue: featureDetect}),
    Form,
    Keyboard,
    MenuController,
    provide(NavRegistry, {useValue: navRegistry}),
    provide(Platform, {useValue: platform}),
    Translate,
    TapClick,
    provide(PLATFORM_DIRECTIVES, {useValue: [directives], multi: true}),
    ROUTER_PROVIDERS,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    HTTP_PROVIDERS,
    customProviders
  ];
}


function setupDom(window: Window, document: Document, config: Config, platform: Platform, clickBlock: ClickBlock, featureDetect: FeatureDetect) {
  let bodyEle = document.body;
  let mode = config.get('mode');

  // if dynamic mode links have been added the fire up the correct one
  let modeLinkAttr = mode + '-href';
  let linkEle = <HTMLLinkElement>document.head.querySelector('link[' + modeLinkAttr + ']');
  if (linkEle) {
    let href = linkEle.getAttribute(modeLinkAttr);
    linkEle.removeAttribute(modeLinkAttr);
    linkEle.href = href;
  }

  let headStyle = document.createElement('style');
  headStyle.innerHTML = 'ion-app{display:none}';
  document.head.appendChild(headStyle);

  // set the mode class name
  // ios/md/wp
  bodyEle.classList.add(mode);

  // language and direction
  platform.setDir(document.documentElement.dir, false);
  platform.setLang(document.documentElement.lang, false);

  let versions = platform.versions();
  platform.platforms().forEach(platformName => {
    // platform-ios
    let platformClass = 'platform-' + platformName;
    bodyEle.classList.add(platformClass);

    let platformVersion = versions[platformName];
    if (platformVersion) {
      // platform-ios9
      platformClass += platformVersion.major;
      bodyEle.classList.add(platformClass);

      // platform-ios9_3
      bodyEle.classList.add(platformClass + '_' + platformVersion.minor);
    }
  });

  // touch devices should not use :hover CSS pseudo
  // enable :hover CSS when the "hoverCSS" setting is not false
  if (config.get('hoverCSS') !== false) {
    bodyEle.classList.add('enable-hover');
  }

  if (config.get('clickBlock')) {
    clickBlock.enable();
  }

  // run feature detection tests
  featureDetect.run(window, document);
}


/**
 * Bind some global events and publish on the 'app' channel
 */
function bindEvents(window: Window, document: Document, platform: Platform, events: Events) {
  window.addEventListener('online', (ev) => {
    events.publish('app:online', ev);
  }, false);

  window.addEventListener('offline', (ev) => {
    events.publish('app:offline', ev);
  }, false);

  window.addEventListener('orientationchange', (ev) => {
    events.publish('app:rotated', ev);
  });

  // When that status taps, we respond
  window.addEventListener('statusTap', (ev) => {
    // TODO: Make this more better
    let el = <HTMLElement>document.elementFromPoint(platform.width() / 2, platform.height() / 2);
    if (!el) { return; }

    let content = closest(el, 'scroll-content');
    if (content) {
      var scroll = new ScrollView(content);
      scroll.scrollTo(0, 0, 300);
    }
  });

  // start listening for resizes XXms after the app starts
  nativeTimeout(() => {
    window.addEventListener('resize', () => {
      platform.windowResize();
    });
  }, 2000);
}

/**
 * @private
 */
export function addSelector(type: any, selector: string) {
  if (type) {
    let annotations = _reflect.getMetadata('annotations', type);
    if (annotations && !annotations[0].selector) {
      annotations[0].selector = selector;
      _reflect.defineMetadata('annotations', annotations, type);
    }
  }
}
