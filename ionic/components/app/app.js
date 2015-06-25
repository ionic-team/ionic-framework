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

  url(val) {
    if (arguments.length) {
      this._url = val;
      this._qs = util.getQuerystring(val);
    }
    return this._url;
  }

  query(key) {
    return (this._qs || {})[key];
  }

  userAgent(val) {
    if (arguments.length) {
      this._ua = val;
    }
    return this._ua;
  }

  matchQuery(queryValue) {
    let val = this.query('ionicplatform');
    if (val) {
      let valueSplit = val.toLowerCase().split(';');
      for (let i = 0; i < valueSplit.length; i++) {
        if (valueSplit[i] == queryValue) {
          return true;
        }
      }
    }
    return false;
  }

  matchUserAgent(userAgentExpression) {
    if (this._ua) {
      let rx = new RegExp(userAgentExpression, 'i');
      return rx.exec(this._ua);
    }
  }

  isPlatform(queryValue, userAgentExpression) {
    if (!userAgentExpression) {
      userAgentExpression = queryValue;
    }
    return (this.matchQuery(queryValue)) ||
           (this.matchUserAgent(userAgentExpression) !== null);
  }

  width(val) {
    if (arguments.length) {
      this._w = val;
    }
    return this._w || 0;
  }

  height(val) {
    if (arguments.length) {
      this._h = val;
    }
    return this._h || 0;
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

}

export function ionicBootstrap(ComponentType, config) {
  return new Promise((resolve, reject) => {
    try {
      let app = new IonicApp();
      app.url(window.location.href);
      app.userAgent(window.navigator.userAgent);
      app.width(window.innerWidth);
      app.height(window.innerHeight);

      let platform = Platform.load(app);

      config = config || new IonicConfig();

      // copy default platform settings into the user config platform settings
      // user config platform settings should override default platform settings
      config.setPlatform(platform);


      GlobalIonicConfig = config;

      let injectableBindings = [
        bind(IonicApp).toValue(app),
        bind(IonicConfig).toValue(config)
      ];

      bootstrap(ComponentType, injectableBindings).then(appRef => {
        app.ref(appRef);

        platform.run();

        resolve({
          app,
          config,
          platform
        });

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

export let GlobalIonicConfig = null;

export function load(app) {
  if (!app) {
    console.error('Invalid app module');

  } else if (!app.main) {
    console.error('App module missing main()');

  } else {
    app.main(ionicBootstrap);
  }
}
