import {Component, View, bootstrap, ElementRef, NgZone, bind, DynamicComponentLoader, Injector} from 'angular2/angular2';

import {IonicRouter} from '../../routing/router';
import {IonicConfig} from '../../config/config';
import {Platform} from '../../platform/platform';
import {Registry} from '../../registry';
import * as util from '../../util/util';

// injectables
import {ActionMenu} from '../action-menu/action-menu';
import {Modal} from '../modal/modal';
import {Popup} from '../popup/popup';
import {FocusHolder} from '../form/focus-holder';


export class IonicApp {

  constructor() {
    this.overlays = [];

    // Our component registry map
    this.components = {};

    this._activeViewId = null;
  }

  load(appRef) {
    this.ref(appRef);
    this._zone = appRef.injector.get(NgZone);
  }

  focusHolder(val) {
    if (arguments.length) {
      this._focusHolder = val;
    }
    return this._focusHolder;
  }

  title(val) {
    document.title = val;
  }

  ref(val) {
    if (arguments.length) {
      this._ref = val;
    }
    return this._ref;
  }

  get injector() {
    return this._ref.injector;
  }

  zoneRun(fn) {
    this._zone.run(fn);
  }

  stateChange(type, activeView) {
    if (this._activeViewId !== activeView.id) {
      this.router.stateChange(type, activeView);
      this._activeViewId = activeView.id;
    }
  }

  stateClear() {
    this.router.stateClear();
  }

  /**
   * Register a known component with a key, for easy lookups later.
   */
  register(key, component) {
    this.components[key] = component;
    // TODO(mlynch): We need to track the lifecycle of this component to remove it onDehydrate
  }

  /**
   * Get the component for the given key.
   */
  getComponent(key) {
    return this.components[key];
  }

  /**
   * Create and append the given component into the root
   * element of the app.
   *
   * @param Component the component to create and insert
   * @return Promise that resolves with the ContainerRef created
   */
  appendComponent(componentType: Type, context=null) {
    return this.rootAnchor.append(componentType);
  }

  applyBodyCss(bodyEle, platform, config) {
    let versions = platform.versions();
    platform.platforms().forEach(platformName => {
      // platform-ios
      let platformClass = 'platform-' + platformName;
      bodyEle.classList.add(platformClass);

      let platformVersion = versions[platformName];
      if (platformVersion) {
        // platform-ios_8
        platformClass += '_' + platformVersion.major;
        bodyEle.classList.add(platformClass);

        // platform-ios_8_3
        bodyEle.classList.add(platformClass + '_' + platformVersion.minor);
      }
    });

    bodyEle.setAttribute('mode', config.setting('mode'));
  }

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

  // on resize be sure to clear out existing window dimensions
  window.addEventListener('resize', Platform.resetDimensions);

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

export function ionicBootstrap(rootComponentType, config, router) {
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

      // setup router
      if (typeof router !== IonicRouter) {
        router = new IonicRouter(router);
      }
      router.app(app);

      // TODO: don't wire these together
      app.router = router;

      // TODO: probs need a better way to inject global injectables
      let actionMenu = new ActionMenu(app, config);
      let modal = new Modal(app, config);
      let popup = new Popup(app, config);

      // add injectables that will be available to all child components
      let appBindings = Injector.resolve([
        bind(IonicApp).toValue(app),
        bind(IonicConfig).toValue(config),
        bind(IonicRouter).toValue(router),
        bind(ActionMenu).toValue(actionMenu),
        bind(Modal).toValue(modal),
        bind(Popup).toValue(popup)
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

        router.load(window, app, config).then(() => {
          // resolve that the app has loaded
          resolve(app);
        });

      }).catch(err => {
        console.error('ionicBootstrap', err);
      });

    } catch (err) {
      console.error(err);
    }
  });
}
