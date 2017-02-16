import { Compiler, Injectable, NgModuleFactory, Optional } from '@angular/core';

const FACTORY_CLASS_SUFFIX = 'NgFactory';

/**
 * Configuration for NgModuleLoader.
 * token.
 *
 * @experimental
 */
export abstract class NgModuleLoaderConfig {
  /**
   * Prefix to add when computing the name of the factory module for a given module name.
   */
  factoryPathPrefix: string;

  /**
   * Suffix to add when computing the name of the factory module for a given module name.
   */
  factoryPathSuffix: string;
}

const DEFAULT_CONFIG: NgModuleLoaderConfig = {
  factoryPathPrefix: '',
  factoryPathSuffix: '.ngfactory',
};

/**
 * NgModuleFactoryLoader that uses SystemJS to load NgModuleFactory
 */
@Injectable()
export class NgModuleLoader {
  private _config: NgModuleLoaderConfig;

  constructor(private _compiler: Compiler, @Optional() config?: NgModuleLoaderConfig) {
    this._config = config || DEFAULT_CONFIG;
  }

  load(modulePath: string, ngModuleExport: string) {
    const offlineMode = this._compiler instanceof Compiler;
    return offlineMode ? loadPrecompiledFactory(this._config, modulePath, ngModuleExport) : loadAndCompile(this._compiler, modulePath, ngModuleExport);
  }
}


function loadAndCompile(compiler: Compiler, modulePath: string, ngModuleExport: string): Promise<NgModuleFactory<any>> {
  if (!ngModuleExport) {
    ngModuleExport = 'default';
  }

  return System.import(modulePath)
    .then((rawModule: any) => {
      const module = rawModule[ngModuleExport];
      if (!module) {
        throw new Error(`Module ${modulePath} does not export ${ngModuleExport}`);
      }
      return compiler.compileModuleAsync(module);
    });
}


function loadPrecompiledFactory(config: NgModuleLoaderConfig, modulePath: string, ngModuleExport: string): Promise<NgModuleFactory<any>> {
  let factoryClassSuffix = FACTORY_CLASS_SUFFIX;
  if (ngModuleExport === undefined) {
    ngModuleExport = 'default';
    factoryClassSuffix = '';
  }

  return System.import(config.factoryPathPrefix + modulePath + config.factoryPathSuffix)
    .then((rawModule: any) => {
      const ngModuleFactory = rawModule[ngModuleExport + factoryClassSuffix];
      if (!ngModuleFactory) {
        throw new Error(`Module ${modulePath} does not export ${ngModuleExport}`);
      }
      return ngModuleFactory;
    });
}
