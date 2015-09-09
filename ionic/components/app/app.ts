import {Component, View, bootstrap, ElementRef, NgZone, bind, DynamicComponentLoader, Injector} from 'angular2/angular2';
import {ROUTER_BINDINGS, HashLocationStrategy, LocationStrategy, Router} from 'angular2/router';

import {IonicConfig} from '../../config/config';
import {Platform} from '../../platform/platform';
import * as util from '../../util/util';

// injectables
import {Activator} from '../../util/activator';
import {ActionMenu} from '../action-menu/action-menu';
import {Modal} from '../modal/modal';
import {Popup} from '../popup/popup';
import {FocusHolder} from '../form/focus-holder';

/**
 * @name IonicApp
 * @description
 * The base Ionic class that your app inherits from. By inheriting from this class, you will have access to the Ionic API.
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
    this._isTransitioning = false;

    // Our component registry map
    this.components = {};
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
      this._focusHolder = val;
    }
    return this._focusHolder;
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
   * Sets if the app is currently transitioning or not. For example
   * this is set to `true` while views transition, a modal slides up, an action-menu
   * slides up, etc. After the transition completes it is set back to `false`.
   * @param {bool} isTransitioning
   */
  setTransitioning(isTransitioning) {
    this._isTransitioning = !!isTransitioning;
  }

  /**
   * Boolean if the app is actively transitioning or not.
   * @return {bool}
   */
  isTransitioning() {
    return this._isTransitioning;
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
   * @param {TODO} key  The key to use to register the component
   * @param {TODO} component  The component to register
   */
  register(key, component) {
    this.components[key] = component;
  }

  /**
   * Unregister a known component with a key.
   * @param {TODO} key  The key to use to unregister
   */
  unregister(key) {
    delete this.components[key];
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
  getComponent(key) {
    return this.components[key];
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
   * TODO
   *
   * @param {Element} bodyEle  the body element
   * @param {TODO} platform  TODO
   * @param {TODO} config  TODO
   */
  applyBodyCss(bodyEle, platform, config) {
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

    bodyEle.classList.add(config.setting('mode'));

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

function initApp(window, document, config) {
  // create the base IonicApp
  let app = new IonicApp();
  app.isRTL(document.documentElement.getAttribute('dir') == 'rtl');

  // load all platform data
  // Platform is a global singleton
  Platform.url(window.location.href);
  Platform.userAgent(window.navigator.userAgent);
  Platform.navigatorPlatform(window.navigator.platform);
  Platform.load(config);

  setTimeout(() => {
    // start listening for resizes XXms after the app starts
    window.addEventListener('resize', Platform.winResize);
  }, 2500);

  return app;
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

/**
 * TODO
 *
 * @param {TODO} rootComponentType  TODO
 * @param {TODO} config  TODO
 * @return {Promise} TODO
 */
export function ionicBootstrap(rootComponentType, config) {
  return new Promise(resolve => {
    try {
      // get the user config, or create one if wasn't passed in
      if (typeof config !== IonicConfig) {
        config = new IonicConfig(config);
      }

      // create the base IonicApp
      let app = initApp(window, document, config);

      // copy default platform settings into the user config platform settings
      // user config platform settings should override default platform settings
      config.setPlatform(Platform);

      // config and platform settings have been figured out
      // apply the correct CSS to the app
      app.applyBodyCss(document.body, Platform, config);

      // prepare the ready promise to fire....when ready
      Platform.prepareReady(config);

      // TODO: probs need a better way to inject global injectables
      let activator = new Activator(app, config, window, document);
      let actionMenu = new ActionMenu(app, config);
      let modal = new Modal(app, config);
      let popup = new Popup(app, config);

      // add injectables that will be available to all child components
      let appBindings = Injector.resolve([
        bind(IonicApp).toValue(app),
        bind(IonicConfig).toValue(config),
        bind(Activator).toValue(activator),
        bind(ActionMenu).toValue(actionMenu),
        bind(Modal).toValue(modal),
        bind(Popup).toValue(popup),
        ROUTER_BINDINGS,
        bind(LocationStrategy).toClass(HashLocationStrategy)
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
