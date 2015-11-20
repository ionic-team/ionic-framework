import {bootstrap, provide} from 'angular2/angular2';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {IonicApp} from '../components/app/app';
import {Config} from './config';
import {Platform} from '../platform/platform';
import {OverlayController} from '../components/overlay/overlay-controller';
import {Form} from '../util/form';
import {Keyboard} from '../util/keyboard';
import {ActionSheet} from '../components/action-sheet/action-sheet';
import {Modal} from '../components/modal/modal';
import {Popup} from '../components/popup/popup';
import {Events} from '../util/events';
import {NavRegistry} from '../components/nav/nav-registry';
import {Translate} from '../translation/translate';
import {ClickBlock} from '../util/click-block';
import {FeatureDetect} from '../util/feature-detect';
import {initTapClick} from '../components/tap-click/tap-click';
import * as dom from '../util/dom';


export function ionicProviders(args={}) {
  let platform = new Platform();
  let navRegistry = new NavRegistry(args.pages);

  var config = args.config;

  if (!(config instanceof Config)) {
    config = new Config(config);
  }

  platform.url(window.location.href);
  platform.userAgent(window.navigator.userAgent);
  platform.navigatorPlatform(window.navigator.platform);
  platform.load();
  config.setPlatform(platform);

  let app = new IonicApp(config);

  let events = new Events();
  initTapClick(window, document, app, config);
  let featureDetect = new FeatureDetect();

  setupDom(window, document, config, platform, featureDetect);
  bindEvents(window, document, platform, events);

  // prepare the ready promise to fire....when ready
  platform.prepareReady(config);

  return [
    provide(IonicApp, {useValue: app}),
    provide(Config, {useValue: config}),
    provide(Platform, {useValue: platform}),
    provide(FeatureDetect, {useValue: featureDetect}),
    provide(Events, {useValue: events}),
    provide(NavRegistry, {useValue: navRegistry}),
    Form,
    Keyboard,
    OverlayController,
    ActionSheet,
    Modal,
    Popup,
    Translate,
    ROUTER_PROVIDERS,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    HTTP_PROVIDERS,
  ];
}


function setupDom(window, document, config, platform, featureDetect) {
  let bodyEle = document.body;
  if (!bodyEle) {
    return dom.ready(function() {
      applyBodyCss(document, config, platform);
    });
  }

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

  // set the mode class name
  // ios/md
  bodyEle.classList.add(config.get('mode'));

  // touch devices should not use :hover CSS pseudo
  // enable :hover CSS when the "hoverCSS" setting is not false
  if (config.get('hoverCSS') !== false) {
    bodyEle.classList.add('enable-hover');
  }

  // run feature detection tests
  featureDetect.run(window, document);
}


/**
 * Bind some global events and publish on the 'app' channel
 */
function bindEvents(window, document, platform, events) {
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
    var el = document.elementFromPoint(platform.width() / 2, platform.height() / 2);
    if(!el) { return; }

    var content = dom.closest(el, 'scroll-content');
    if(content) {
      var scrollTo = new ScrollTo(content);
      scrollTo.start(0, 0, 300, 0);
    }
  });

  // start listening for resizes XXms after the app starts
  setTimeout(function() {
    window.addEventListener('resize', function() {
      platform.windowResize();
    });
  }, 2000);
}
