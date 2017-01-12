import { Injectable, Injector, NgModuleFactory } from '@angular/core';
import { DeepLinkConfig, DeepLinkMetadata } from '../navigation/nav-util';
import { SystemJsNgModuleLoader, LoadedModule } from './system-js-ng-module-loader';

@Injectable()
export class ModuleLoader {
  constructor(private _deepLinkConfig: DeepLinkConfig,
    private _systemJsNgModuleLoader: SystemJsNgModuleLoader,
    private _injector: Injector) {
  }

  loadModule(viewName: string): Promise<any>{
    const deepLinkMetadata = this.getModulePath(viewName);
    if (!deepLinkMetadata) {
      throw new Error(`There is not an entry with a key of "${viewName}"  in the app's deeplink config`)
    }

    return this._systemJsNgModuleLoader.load({modulePath: deepLinkMetadata.path, ngModuleExport: deepLinkMetadata.namedExport, viewFactoryFunction: 'getView'})
      .then((loadedModule: LoadedModule) => {
        // TODO - verify we don't need to do anything else here to make everything happy from an angular pov
        return loadedModule;
      });
  }

  getModulePath(viewName: string): DeepLinkMetadata{
    if (this._deepLinkConfig && this._deepLinkConfig.links) {
      for (const deepLink of this._deepLinkConfig.links) {
        if (deepLink.name === viewName) {
          return deepLink;
        }
      }
    }
    return null;
  }
}