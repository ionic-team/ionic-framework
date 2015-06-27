import {bootstrap} from 'angular2/angular2';
import {AppViewManager} from 'angular2/src/core/compiler/view_manager';
import {Compiler} from 'angular2/angular2';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {bind} from 'angular2/di';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';

import {IonicConfig} from '../../config/config';
import {Platform} from '../../platform/platform';
import {Registry} from '../../registry';
import * as util from '../../util/util';


export class IonicApp {

  constructor() {
    this.overlays = [];

    // Our component registry map
    this.components = {};
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

  config(val) {
    if (arguments.length) {
      this._config = val;
    }
    return this._config;
  }

  /**
   * Create and append the given component into the root
   * element of the app.
   *
   * @param Component the ComponentType to create and insert
   * @return Promise that resolves with the ContainerRef created
   */
  appendComponent(ComponentType: Type) {
    return new Promise((resolve, reject) => {
      let injector = this._ref.injector;
      let compiler = injector.get(Compiler);
      let viewMngr = injector.get(AppViewManager);
      let rootComponentRef = this._ref._hostComponent;
      let viewContainerLocation = rootComponentRef.location;

      compiler.compileInHost(ComponentType).then(protoViewRef => {

        let atIndex = 0;
        let context = null;

        let hostViewRef = viewMngr.createViewInContainer(
                                      viewContainerLocation,
                                      atIndex,
                                      protoViewRef,
                                      context,
                                      injector);

        hostViewRef.elementRef = new ElementRef(hostViewRef, 0);
        hostViewRef.instance = viewMngr.getComponent(hostViewRef.elementRef);

        hostViewRef.dispose = () => {
          viewMngr.destroyViewInContainer(viewContainerLocation, 0, 0, hostViewRef.viewRef);
        };

        resolve(hostViewRef);

      }).catch(err => {
        console.error('IonicApp appendComponent:', err);
        reject(err);
      });
    });
  }

  ref(val) {
    if (arguments.length) {
      this._ref = val;
    }
    return this._ref;
  }

  applyCss(bodyEle, platform, config) {
    let className = bodyEle.className;

    let versions = platform.versions();
    platform.platforms().forEach(platformName => {
      // platform-ios platform-ios_8 platform-ios_8_3
      let platformClass = ' platform-' + platformName;
      className += platformClass;

      let platformVersion = versions[platformName];
      if (platformVersion) {
        platformClass += '_' + platformVersion.major;
        className += platformClass + platformClass + '_' + platformVersion.minor;
      }
    });

    className += ' mode-' + config.setting('mode');
    bodyEle.className = className.trim();
  }

  isRTL(val) {
    if (arguments.length) {
      this._rtl = val;
    }
    return this._rtl;
  }

  lang(val) {
    if (arguments.length) {
      this._lang = val;
    }
    return this._lang;
  }

}

function initApp(window, document) {
  // create the base IonicApp
  let app = new IonicApp();
  app.isRTL(document.documentElement.getAttribute('dir') == 'rtl');
  app.lang(document.documentElement.getAttribute('lang'));

  // load all platform data
  // Platform is a global singleton
  Platform.url(window.location.href);
  Platform.userAgent(window.navigator.userAgent);
  Platform.width(window.innerWidth);
  Platform.height(window.innerHeight);
  Platform.load();

  return app;
}

export function ionicBootstrap(ComponentType, config) {
  return new Promise((resolve, reject) => {
    try {
      // create the base IonicApp
      let app = initApp(window, document)

      // get the user config, or create one if wasn't passed in
      config = config || new IonicConfig();

      // copy default platform settings into the user config platform settings
      // user config platform settings should override default platform settings
      config.setPlatform(Platform);

      // make the config global
      GlobalIonicConfig = config;

      // config and platform settings have been figured out
      // apply the correct CSS to the app
      app.applyCss(document.body, Platform, config);

      // prepare the ready promise to fire....when ready
      Platform.prepareReady(config);

      // add injectables that will be available to all child components
      let injectableBindings = [
        bind(IonicApp).toValue(app),
        bind(IonicConfig).toValue(config)
      ];

      bootstrap(ComponentType, injectableBindings).then(appRef => {
        app.ref(appRef);

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

export function load(app) {
  if (!app) {
    console.error('Invalid app module');

  } else if (!app.main) {
    console.error('App module missing main()');

  } else {
    app.main(ionicBootstrap);
  }
}

export let GlobalIonicConfig = null;
