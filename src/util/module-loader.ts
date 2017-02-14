import { ComponentFactoryResolver, Injectable, Injector, OpaqueToken, Type } from '@angular/core';
import { NgModuleLoader } from './ng-module-loader';

export const LAZY_LOADED_TOKEN = new OpaqueToken('LZYCMP');


/**
 * @private
 */
@Injectable()
export class ModuleLoader {

  constructor(
    private _ngModuleLoader: NgModuleLoader,
    private _injector: Injector) {}


  load(modulePath: string): Promise<LoadedModule> {
    console.time(`ModuleLoader, load: ${modulePath}'`);

    const splitString = modulePath.split(SPLITTER);

    return this._ngModuleLoader.load(splitString[0], splitString[1])
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
export function provideModuleLoader(ngModuleLoader: NgModuleLoader, injector: Injector) {
  return new ModuleLoader(ngModuleLoader, injector);
}


export interface LoadedModule {
  componentFactoryResolver: ComponentFactoryResolver;
  component: Type<any>;
};
