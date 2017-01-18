import { ComponentFactoryResolver, Injectable, Injector, NgModuleFactory, OpaqueToken, Type } from '@angular/core';
import { DeepLinkConfig, DeepLinkMetadata } from '../navigation/nav-util';
import { SystemJsNgModuleLoader, SystemJsLoadedModule } from './system-js-ng-module-loader';


const DEFAULT_VIEW_FACTORY_FUNCTION_NAME = 'getView';

export const LAZY_LOADED_TOKEN = new OpaqueToken('LZYCMP');

const SPLITTER = '#';

@Injectable()
export class ModuleLoader {

  constructor(private _deepLinkConfig: DeepLinkConfig,
    private _systemJsNgModuleLoader: SystemJsNgModuleLoader,
    private _injector: Injector) {
  }

  loadModule(componentName: string): Promise<LoadedModule>{
    const deepLinkMetadata = getModulePath(this._deepLinkConfig, componentName);
    if (!deepLinkMetadata) {
      throw new Error(`There is not an entry with a key of "${componentName}"  in the app's deeplink config`)
    }

    if (!deepLinkMetadata.loadChildren) {
      throw new Error(`"loadChildren" not found for ${componentName} in the app's deeplink config`);
    }

    const splitString = deepLinkMetadata.loadChildren.split(SPLITTER);
    const modulePath = splitString[0];
    const namedExport = splitString[1];

    // let viewFactoryFunction = DEFAULT_VIEW_FACTORY_FUNCTION_NAME;
    // if (deepLinkMetadata.viewFactoryFunction) {
    //   viewFactoryFunction = deepLinkMetadata.viewFactoryFunction;
    // }
    return this._systemJsNgModuleLoader.load({modulePath: modulePath, ngModuleExport: namedExport, viewFactoryFunction: ''})
      .then((loadedModule: SystemJsLoadedModule) => {

        debugger;

        const ref = loadedModule.ngModuleFactory.create(this._injector);


        let coponent =  ref.injector.get(LAZY_LOADED_TOKEN);

        const injectorFactory = (parent: Injector) => loadedModule.ngModuleFactory.create(parent).injector;
        return {
          componentFactoryResolver: ref.componentFactoryResolver,
          component: ref.injector.get(LAZY_LOADED_TOKEN)
        };
      });
    }
}

export function getModulePath(deepLinkConfig: DeepLinkConfig, viewName: string): DeepLinkMetadata {
  if (deepLinkConfig && deepLinkConfig.links) {
    for (const deepLink of deepLinkConfig.links) {
      if (deepLink.name === viewName) {
        return deepLink;
      }
    }
  }
  return null;
}

export interface LoadedModule {
  componentFactoryResolver: ComponentFactoryResolver;
  component: Type<any>;
};
