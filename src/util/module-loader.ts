import { ComponentFactoryResolver, Injectable, InjectionToken, Injector, NgModuleFactory, NgZone, Type } from '@angular/core';
import { Config } from '../config/config';
import { DeepLinkConfig } from '../navigation/nav-util';
import { NgModuleLoader } from './ng-module-loader';
import { requestIonicCallback } from './util';

export const LAZY_LOADED_TOKEN = new InjectionToken<any>('LZYCMP');



/**
 * @hidden
 */
@Injectable()
export class ModuleLoader {

  /** @internal */
  _cfrMap = new Map<any, ComponentFactoryResolver>();

  _promiseMap = new Map<string, Promise<NgModuleFactory<any>>>();

  constructor(
    private _ngModuleLoader: NgModuleLoader,
    private _injector: Injector) {}


  load(modulePath: string): Promise<LoadedModule> {
    console.time(`ModuleLoader, load: ${modulePath}'`);

    const splitString = modulePath.split(SPLITTER);

    let promise = this._promiseMap.get(modulePath);
    if (!promise) {
      promise = this._ngModuleLoader.load(splitString[0], splitString[1]);
      this._promiseMap.set(modulePath, promise);
    }

    return promise.then(loadedModule => {
      console.timeEnd(`ModuleLoader, load: ${modulePath}'`);
      const ref = loadedModule.create(this._injector);
      const component = ref.injector.get(LAZY_LOADED_TOKEN);

      this._cfrMap.set(component, ref.componentFactoryResolver);

      return {
        componentFactoryResolver: ref.componentFactoryResolver,
        component: component
      };
    });
  }

  getComponentFactoryResolver(component: Type<any>) {
    return this._cfrMap.get(component);
  }
}

const SPLITTER = '#';


/**
 * @hidden
 */
export function provideModuleLoader(ngModuleLoader: NgModuleLoader, injector: Injector) {
  return new ModuleLoader(ngModuleLoader, injector);
}


export interface LoadedModule {
  componentFactoryResolver: ComponentFactoryResolver;
  component: Type<any>;
}


/**
 * @hidden
 */
export function setupPreloadingImplementation(config: Config, deepLinkConfig: DeepLinkConfig, moduleLoader: ModuleLoader): Promise<any> {
  if (!deepLinkConfig || !deepLinkConfig.links || !config.getBoolean('preloadModules')) {
    return Promise.resolve();
  }
  const linksToLoad = deepLinkConfig.links.filter(link => !!link.loadChildren && link.priority !== 'off');

  // Load the high priority modules first
  const highPriorityPromises = linksToLoad
    .filter(link => link.priority === 'high')
    .map(link => moduleLoader.load(link.loadChildren));

  return Promise.all(highPriorityPromises).then(() => {
    // Load the low priority modules after the high priority are done
    const lowPriorityPromises = linksToLoad
      .filter(link => link.priority === 'low')
      .map(link => moduleLoader.load(link.loadChildren));

    return Promise.all(lowPriorityPromises);
  }).catch(err => {
    console.error(err.message);
  });
}

/**
 * @hidden
 */
export function setupPreloading(config: Config, deepLinkConfig: DeepLinkConfig, moduleLoader: ModuleLoader, ngZone: NgZone) {
  return function() {
    requestIonicCallback(() => {
      ngZone.runOutsideAngular(() => {
        setupPreloadingImplementation(config, deepLinkConfig, moduleLoader);
      });
    });
  };
}
