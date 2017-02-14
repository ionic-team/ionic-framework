import { ComponentFactoryResolver, Injectable, Injector, OpaqueToken, Type } from '@angular/core';
import { SystemJsNgModuleLoader } from './system-js-ng-module-loader';

export const LAZY_LOADED_TOKEN = new OpaqueToken('LZYCMP');


/**
 * @private
 */
@Injectable()
export class ModuleLoader {

  constructor(
    private _systemJsNgModuleLoader: SystemJsNgModuleLoader,
    private _injector: Injector) {}


  loadModule(modulePath: string): Promise<LoadedModule> {
    console.time(`ModuleLoader, load: ${modulePath}'`);

    const splitString = modulePath.split(SPLITTER);
    modulePath = splitString[0];
    const ngModuleExport = splitString[1];

    return this._systemJsNgModuleLoader.load(modulePath, ngModuleExport)
      .then(loadedModule => {
        console.timeEnd(`ModuleLoader, load: ${modulePath}'`);
        const ref = loadedModule.create(this._injector);

        return {
          componentFactoryResolver: ref.componentFactoryResolver,
          component: ref.injector.get(LAZY_LOADED_TOKEN)
        };
      });
  }
}

const SPLITTER = '#';


/**
 * @private
 */
export function provideModuleLoader(systemJsNgModuleLoader: SystemJsNgModuleLoader, injector: Injector) {
  return new ModuleLoader(systemJsNgModuleLoader, injector);
}


export interface LoadedModule {
  componentFactoryResolver: ComponentFactoryResolver;
  component: Type<any>;
};
