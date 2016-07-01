import { enableProdMode, PLATFORM_DIRECTIVES, provide } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';

import { ActionSheetController } from '../components/action-sheet/action-sheet';
import { AlertController } from '../components/alert/alert';
import { App } from '../components/app/app';
import { Config } from './config';
import { closest, nativeTimeout } from '../util/dom';
import { Events } from '../util/events';
import { FeatureDetect } from '../util/feature-detect';
import { Form } from '../util/form';
import { IONIC_DIRECTIVES } from './directives';
import { isPresent } from '../util/util';
import { Keyboard } from '../util/keyboard';
import { LoadingController } from '../components/loading/loading';
import { MenuController } from '../components/menu/menu-controller';
import { ModalController } from '../components/modal/modal';
import { PickerController } from '../components/picker/picker';
import { Platform } from '../platform/platform';
import { PopoverController } from '../components/popover/popover';
import { ScrollView } from '../util/scroll-view';
import { TapClick } from '../components/tap-click/tap-click';
import { ToastController } from '../components/toast/toast';
import { Translate } from '../translation/translate';


/**
 * @private
 */
export function ionicProviders(customProviders?: Array<any>, config?: any): any[] {
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
  platform.load();
  config.setPlatform(platform);

  let events = new Events();
  let featureDetect = new FeatureDetect();

  setupDom(window, document, config, platform, featureDetect);
  bindEvents(window, document, platform, events);

  let providers: any[] = [
    ActionSheetController,
    AlertController,
    App,
    provide(Config, {useValue: config}),
    disableDeprecatedForms(),
    provide(Events, {useValue: events}),
    provide(FeatureDetect, {useValue: featureDetect}),
    Form,
    HTTP_PROVIDERS,
    Keyboard,
    LoadingController,
    MenuController,
    ModalController,
    PickerController,
    PopoverController,
    provide(Platform, {useValue: platform}),
    provide(PLATFORM_DIRECTIVES, {useValue: IONIC_DIRECTIVES, multi: true}),
    provideForms(),
    TapClick,
    ToastController,
    Translate,
  ];

  if (isPresent(customProviders)) {
    providers.push(customProviders);
  }

  return providers;
}

function setupDom(window: Window, document: Document, config: Config, platform: Platform, featureDetect: FeatureDetect) {
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
  if (config.getBoolean('hoverCSS', true)) {
    bodyEle.classList.add('enable-hover');
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