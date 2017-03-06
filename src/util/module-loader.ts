import { ComponentFactoryResolver, Injectable, Injector, NgModuleFactory, OpaqueToken, Type } from '@angular/core';
import { DeepLinkConfig } from '../navigation/nav-util';
import { NgModuleLoader } from './ng-module-loader';

export const LAZY_LOADED_TOKEN = new OpaqueToken('LZYCMP');



/**
 * @private
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
      // clear it from the cache
      this._promiseMap.delete(modulePath);
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
 * @private
 */
export function provideModuleLoader(ngModuleLoader: NgModuleLoader, injector: Injector) {
  return new ModuleLoader(ngModuleLoader, injector);
}


export interface LoadedModule {
  componentFactoryResolver: ComponentFactoryResolver;
  component: Type<any>;
};


/**
 * @private
 */
export function setupPreloading(deepLinkConfig: DeepLinkConfig, moduleLoader: ModuleLoader) {
  return function() {
    const linksToLoad = deepLinkConfig.links.filter(link => !!link.loadChildren);
    for (const link of linksToLoad) {
      moduleLoader.load(link.loadChildren);
    }
  };
}
