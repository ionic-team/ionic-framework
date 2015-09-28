import {Component, View, bootstrap, ElementRef, NgZone, bind, DynamicComponentLoader, Injector} from 'angular2/angular2';
import {ROUTER_BINDINGS, HashLocationStrategy, LocationStrategy, Router} from 'angular2/router';

import {IonicConfig} from '../../config/config';
import {IonicPlatform, Platform} from '../../platform/platform';
import {ClickBlock} from '../../util/click-block';
import * as dom from '../../util/dom';

// injectables
import {TapClick} from '../tap-click/tap-click';
import {ActionSheet} from '../action-sheet/action-sheet';
import {Modal} from '../modal/modal';
import {Popup} from '../popup/popup';
import {FocusHolder} from '../form/focus-holder';
import {Events} from '../../util/events';
import {NavRegistry} from '../nav/nav-registry';
import {Translate} from '../../translation/translate';

/**
 * @name IonicApp
 * @description
 * Service exposing the Ionic app level API.
 *
 * @usage
 * ```js
 *  @App({
 *    templateUrl: '/app/app.html',
 *  })
 *  class MyApp {
 *
 *    constructor(app: IonicApp) {
 *      this.app = app;
 *    }
 *  }
 *  ```
 * Note: Ionic sets `ion-app` as the selector for the app. Setting a custom selector will override this and cause CSS problems.
 *
 */
export class IonicApp {

  /**
   * TODO
   */
  constructor() {
    this.overlays = [];
    this._disTime = 0;
    this._trnsTime = 0;

    // Our component registry map
    this.components = {};
  }

  /**
   * Bind some global events and publish on the 'app' channel
   */
  bindEvents(events) {
    window.addEventListener('online', (event) => {
      events.publish('app:online', event);
    }, false);

    window.addEventListener('offline', (event) => {
      events.publish('app:offline', event);
    }, false);

    window.addEventListener('orientationchange', (event) => {
      events.publish('app:rotated', event);
    });
  }

  /**
   * TODO
   * @param {Object} appRef  TODO
   */
  load(appRef) {
    this.ref(appRef);
    this._zone = appRef.injector.get(NgZone);
  }

  /**
   * TODO
   * @param {TODO=} val  TODO
   * @return {TODO} TODO
   */
  focusHolder(val) {
    if (arguments.length) {
      this._fcsHldr = val;
    }
    return this._fcsHldr;
  }

  /**
   * Sets the document title.
   * @param {string} val  Value to set the document title to.
   */
  title(val) {
    // TODO: User angular service
    document.title = val;
  }

  /**
   * Sets if the app is currently enabled or not, meaning if it's
   * available to accept new user commands. For example, this is set to `false`
   * while views transition, a modal slides up, an action-sheet
   * slides up, etc. After the transition completes it is set back to `true`.
   * @param {bool} isEnabled
   * @param {bool} fallback  When `isEnabled` is set to `false`, this argument
   * is used to set the maximum number of milliseconds that app will wait until
   * it will automatically enable the app again. It's basically a fallback incase
   * something goes wrong during a transition and the app wasn't re-enabled correctly.
   */
  setEnabled(isEnabled, fallback=700) {
    this._disTime = (isEnabled ? 0 : Date.now() + fallback);
    ClickBlock(!isEnabled, fallback + 100);
  }

  /**
   * Boolean if the app is actively enabled or not.
   * @return {bool}
   */
  isEnabled() {
    return (this._disTime < Date.now());
  }

  setTransitioning(isTransitioning, fallback=700) {
    this._trnsTime = (isTransitioning ? Date.now() + fallback : 0);
  }

  /**
   * Boolean if the app is actively transitioning or not.
   * @return {bool}
   */
  isTransitioning() {
    return (this._trnsTime > Date.now());
  }

  /**
   * TODO
   * @param {TODO=} val  TODO
   * @return TODO
   */
  ref(val) {
    if (arguments.length) {
      this._ref = val;
    }
    return this._ref;
  }

  /**
   * TODO
   * @return TODO
   */
  get injector() {
    return this._ref.injector;
  }

  /**
   * TODO
   * @param {Function} fn  TODO
   */
  zoneRun(fn) {
    this._zone.run(fn);
  }

  /**
   * TODO
   * @param {Function} fn  TODO
   */
  zoneRunOutside(fn) {
    this._zone.runOutsideAngular(fn);
  }

  /**
   * Register a known component with a key, for easy lookups later.
   * @param {TODO} id  The id to use to register the component
   * @param {TODO} component  The component to register
   */
  register(id, component) {
    if (this.components[id] && this.components[id] !== component) {
      console.error('Component id "' + id + '" already registered.');
    }
    this.components[id] = component;
  }

  /**
   * Unregister a known component with a key.
   * @param {TODO} id  The id to use to unregister
   */
  unregister(id) {
    delete this.components[id];
  }

  /**
   * Get a registered component with the given type (returns the first)
   * @param {Object} cls the type to search for
   * @return the matching component, or undefined if none was found
   */
  getRegisteredComponent(cls) {
    for(let component of this.components) {
      if(component instanceof cls) {
        return component;
      }
    }
  }

  /**
   * Get the component for the given key.
   * @param {TODO} key  TODO
   * @return {TODO} TODO
   */
  getComponent(id) {
    return this.components[id];
  }

  /**
   * Create and append the given component into the root
   * element of the app.
   *
   * @param {TODO} componentType the component to create and insert
   * @return {Promise} Promise that resolves with the ContainerRef created
   */
  appendComponent(componentType: Type) {
    return this.rootAnchor.append(componentType);
  }

  /**
   * If val is defined, specifies whether app text is RTL.  If val is undefined
   * returns whether app text is RTL.
   *
   * @param {boolean=} val  Boolean specifying whether text is RTL or not.
   * @returns {boolean} true if app text is RTL, false if otherwise.
   */
  isRTL(val) {
    if (arguments.length) {
      this._rtl = val;
    }
    return this._rtl;
  }

}

@Component({
  selector: 'root-anchor'
})
@View({
  template: ''
})
class RootAnchor {
  constructor(app: IonicApp, elementRef: ElementRef, loader: DynamicComponentLoader) {
    this.elementRef = elementRef;
    this.loader = loader;
    app.rootAnchor = this;
  }

  append(componentType) {
    return this.loader.loadNextToLocation(componentType, this.elementRef).catch(err => {
      console.error(err)
    });
  }
}

function initApp(window, document, config, platform) {
  // create the base IonicApp
  let app = new IonicApp();
  app.isRTL(document.dir == 'rtl');

  // load all platform data
  platform.url(window.location.href);
  platform.userAgent(window.navigator.userAgent);
  platform.navigatorPlatform(window.navigator.platform);
  platform.load(config);

  // copy default platform settings into the user config platform settings
  // user config platform settings should override default platform settings
  config.setPlatform(platform);

  // config and platform settings have been figured out
  // apply the correct CSS to the app
  applyBodyCss(document, config, platform);

  // prepare the ready promise to fire....when ready
  platform.prepareReady(config);

  setTimeout(function() {
    // start listening for resizes XXms after the app starts
    window.addEventListener('resize', function() {
      platform.windowResize();
    });
  }, 2500);

  return app;
}

/**
 * TODO
 *
 * @param {TODO} rootComponentType  TODO
 * @param {TODO} config  TODO
 * @return {Promise} TODO
 */
export function ionicBootstrap(rootComponentType, views, config) {
  return new Promise(resolve => {
    try {
      // get the user config, or create one if wasn't passed in
      if (typeof config !== IonicConfig) {
        config = new IonicConfig(config);
      }

      let platform = new IonicPlatform();

      // create the base IonicApp
      let app = initApp(window, document, config, platform);

      // TODO: probs need a better way to inject global injectables
      let tapClick = new TapClick(app, config, window, document);
      let actionSheet = new ActionSheet(app, config);
      let modal = new Modal(app, config);
      let popup = new Popup(app, config);
      let events = new Events();
      let translate = new Translate();
      let navRegistry = new NavRegistry(views);

      app.bindEvents(events);

      // add injectables that will be available to all child components
      let appBindings = Injector.resolve([
        bind(IonicApp).toValue(app),
        bind(IonicConfig).toValue(config),
        bind(IonicPlatform).toValue(platform),
        bind(TapClick).toValue(tapClick),
        bind(ActionSheet).toValue(actionSheet),
        bind(Modal).toValue(modal),
        bind(Popup).toValue(popup),
        bind(Events).toValue(events),
        ROUTER_BINDINGS,
        bind(LocationStrategy).toClass(HashLocationStrategy),
        bind(Translate).toValue(translate),
        bind(NavRegistry).toValue(navRegistry)
      ]);

      bootstrap(rootComponentType, appBindings).then(appRef => {
        app.load(appRef);

        // Adding a anchor to add overlays off of...huh??
        let elementRefs = appRef._hostComponent.hostView._view.elementRefs;
        let lastElementRef = elementRefs[1];
        let injector = lastElementRef.parentView._view.rootElementInjectors[0]._injector;
        let loader = injector.get(DynamicComponentLoader);
        loader.loadNextToLocation(RootAnchor, lastElementRef).then(() => {
          // append the focus holder if its needed
          if (config.setting('keyboardScrollAssist')) {
            app.appendComponent(FocusHolder).then(ref => {
              app.focusHolder(ref.instance);
            });
          }
        }).catch(err => {
          console.error(err)
        });

        resolve(app);

      }).catch(err => {
        console.error('ionicBootstrap', err);
      });

    } catch (err) {
      console.error(err);
    }
  });
}

function applyBodyCss(document, config, platform) {
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
  // ios
  bodyEle.classList.add(config.setting('mode'));

  // touch devices should not use :hover CSS pseudo
  // enable :hover CSS when the "hoverCSS" setting is not false
  if (config.setting('hoverCSS') !== false) {
    bodyEle.classList.add('enable-hover');
  }

  /**
  * Hairline Shim
  * Add the "hairline" CSS class name to the body tag
  * if the browser supports subpixels.
  */
  if (window.devicePixelRatio >= 2) {
    var hairlineEle = document.createElement('div');
    hairlineEle.style.border = '.5px solid transparent';
    bodyEle.appendChild(hairlineEle);

    if (hairlineEle.offsetHeight === 1) {
      bodyEle.classList.add('hairlines');
    }
    bodyEle.removeChild(hairlineEle);
  }
}
