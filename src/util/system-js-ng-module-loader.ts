import { Compiler, Injectable, NgModuleFactory, Optional } from '@angular/core';

const FACTORY_CLASS_SUFFIX = 'NgFactory';

/**
 * Configuration for SystemJsNgModuleLoader.
 * token.
 *
 * @experimental
 */
export abstract class SystemJsNgModuleLoaderConfig {
  /**
   * Prefix to add when computing the name of the factory module for a given module name.
   */
  factoryPathPrefix: string;

  /**
   * Suffix to add when computing the name of the factory module for a given module name.
   */
  factoryPathSuffix: string;
}

const DEFAULT_CONFIG: SystemJsNgModuleLoaderConfig = {
  factoryPathPrefix: '',
  factoryPathSuffix: '.ngfactory',
};

/**
 * NgModuleFactoryLoader that uses SystemJS to load NgModuleFactory
 * @experimental
 */
@Injectable()
export class SystemJsNgModuleLoader {
  private _config: SystemJsNgModuleLoaderConfig;

  constructor(private _compiler: Compiler, @Optional() config?: SystemJsNgModuleLoaderConfig) {
    this._config = config || DEFAULT_CONFIG;
  }

  load(modulePath: string, ngModuleExport: string) {
    const offlineMode = this._compiler instanceof Compiler;
    return offlineMode ? this._loadFactory(modulePath, ngModuleExport) : this._loadAndCompile(modulePath, ngModuleExport);
  }

  private _loadAndCompile(modulePath: string, ngModuleExport: string): Promise<NgModuleFactory<any>> {
    if (!ngModuleExport) {
      ngModuleExport = 'default';
    }

    return System.import(modulePath)
      .then((rawModule: any) => {
        const module = rawModule[ngModuleExport];
        if (!module) {
          throw new Error(`Module ${modulePath} does not export ${ngModuleExport}`);
        }
        return this._compiler.compileModuleAsync(module);
      });
  }

  private _loadFactory(modulePath: string, ngModuleExport: string): Promise<NgModuleFactory<any>> {
    let factoryClassSuffix = FACTORY_CLASS_SUFFIX;
    if (ngModuleExport === undefined) {
      ngModuleExport = 'default';
      factoryClassSuffix = '';
    }

    return System.import(this._config.factoryPathPrefix + modulePath + this._config.factoryPathSuffix)
      .then((rawModule: any) => {
        const ngModuleFactory = rawModule[ngModuleExport + factoryClassSuffix];
        if (!ngModuleFactory) {
          throw new Error(`Module ${modulePath} does not export ${ngModuleExport}`);
        }
        return ngModuleFactory;
      });
  }
}
