import { ComponentFactoryResolver, Injectable, Injector, NgModuleFactory, Type } from '@angular/core';
import { DeepLinkConfig, DeepLinkMetadata } from '../navigation/nav-util';
import { SystemJsNgModuleLoader, SystemJsLoadedModule } from './system-js-ng-module-loader';

const DEFAULT_VIEW_FACTORY_FUNCTION_NAME = 'getView';

@Injectable()
export class ModuleLoader {
  constructor(private _deepLinkConfig: DeepLinkConfig,
    private _systemJsNgModuleLoader: SystemJsNgModuleLoader,
    private _injector: Injector) {
  }

  loadModule(viewName: string): Promise<LoadedModule>{
    const deepLinkMetadata = getModulePath(this._deepLinkConfig, viewName);
    if (!deepLinkMetadata) {
      throw new Error(`There is not an entry with a key of "${viewName}"  in the app's deeplink config`)
    }

    let viewFactoryFunction = DEFAULT_VIEW_FACTORY_FUNCTION_NAME;
    if (deepLinkMetadata.viewFactoryFunction) {
      viewFactoryFunction = deepLinkMetadata.viewFactoryFunction;
    }
    return this._systemJsNgModuleLoader.load({modulePath: deepLinkMetadata.path, ngModuleExport: deepLinkMetadata.namedExport, viewFactoryFunction: viewFactoryFunction})
      .then((loadedModule: SystemJsLoadedModule) => {

        const ref = loadedModule.ngModuleFactory.create(this._injector);
        const injectorFactory = (parent: Injector) => loadedModule.ngModuleFactory.create(parent).injector;
        return {
          componentFactoryResolver: ref.componentFactoryResolver,
          component: loadedModule.component,
          injector: ref.injector,
          injectorFactory: injectorFactory,
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
  injector: Injector;
  injectorFactory: (parent: Injector) => Injector;
  component: Type<any>;
};
