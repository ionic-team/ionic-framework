import {bootstrap, Compiler, ElementRef, NgZone, bind, ViewRef} from 'angular2/angular2';
import {AppViewManager} from 'angular2/src/core/compiler/view_manager';
import {NgZone} from 'angular2/src/core/zone/ng_zone';

import {IonicRouter} from '../../routing/router';
import {IonicConfig} from '../../config/config';
import {Platform} from '../../platform/platform';
import {Registry} from '../../registry';
import * as util from '../../util/util';

// injectables
import {ActionMenu} from '../action-menu/action-menu';
import {Modal} from '../modal/modal';


export class IonicApp {

  constructor() {
    this.overlays = [];

    // Our component registry map
    this.components = {};

    this._activeViewId = null;
  }

  load(appRef) {
    this.ref(appRef);
    this.zone(this.injector().get(NgZone));
  }

  ref(val) {
    if (arguments.length) {
      this._ref = val;
    }
    return this._ref;
  }

  injector() {
    return this._ref.injector;
  }

  zone(val) {
    if (arguments.length) {
      this._zone = val;
    }
    return this._zone;
  }

  stateChange(type, activeView) {
    if (this._activeViewId !== activeView.id) {
      this.router.stateChange(type, activeView);
      this._activeViewId = activeView.id;
    }
  }

  /**
   * Register a known component with a key, for easy lookups later.
   */
  register(key, component) {
    this.components[key] = component;
    console.log('App: Registered component', key, component);
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
   * @param Component the cls to create and insert
   * @return Promise that resolves with the ContainerRef created
   */
  appendComponent(cls: Type, context=null) {
    return new Promise((resolve, reject) => {
      let injector = this.injector();
      let compiler = injector.get(Compiler);
      let viewMngr = injector.get(AppViewManager);
      let rootComponentRef = this._ref._hostComponent;
      let viewContainerLocation = rootComponentRef.location;

      compiler.compileInHost(cls).then(protoViewRef => {
        let atIndex = 0;

        let hostViewRef = viewMngr.createViewInContainer(
                                      viewContainerLocation,
                                      atIndex,
                                      protoViewRef,
                                      null,
                                      injector);

        hostViewRef.elementRef = new ElementRef(hostViewRef, 0, viewMngr._renderer);
        hostViewRef.instance = viewMngr.getComponent(hostViewRef.elementRef);
        util.extend(hostViewRef.instance, context);

        hostViewRef.dispose = () => {
          viewMngr.destroyViewInContainer(viewContainerLocation, 0, 0, hostViewRef.viewRef);
        };

        resolve(hostViewRef);

      }).catch(err => {
        console.error('appendComponent:', err);
        reject(err);
      });
    });
  }

  applyBodyCss(bodyClassList, platform, config) {
    let versions = platform.versions();
    platform.platforms().forEach(platformName => {
      // platform-ios
      let platformClass = 'platform-' + platformName;
      bodyClassList.add(platformClass);

      let platformVersion = versions[platformName];
      if (platformVersion) {
        // platform-ios_8
        platformClass += '_' + platformVersion.major;
        bodyClassList.add(platformClass);

        // platform-ios_8_3
        bodyClassList.add(platformClass + '_' + platformVersion.minor);
      }
    });

    bodyClassList.add('mode-' + config.setting('mode'));
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
  Platform.width(window.innerWidth);
  Platform.height(window.innerHeight);
  Platform.load(config);

  return app;
}

export function ionicBootstrap(cls, config, router) {
  return new Promise((resolve, reject) => {
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
      app.applyBodyCss(document.body.classList, Platform, config);

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

      // add injectables that will be available to all child components
      let injectableBindings = [
        bind(IonicApp).toValue(app),
        bind(IonicConfig).toValue(config),
        bind(IonicRouter).toValue(router),
        bind(ActionMenu).toValue(actionMenu),
        bind(Modal).toValue(modal)
      ];

      bootstrap(cls, injectableBindings).then(appRef => {
        app.load(appRef);

        router.load(app, config, window);

        // resolve that the app has loaded
        resolve(app);

      }).catch(err => {
        console.error('ionicBootstrap', err);
        reject(err);
      });

    } catch (err) {
      console.error('ionicBootstrap', err);
      reject(err);
    }
  });
}
