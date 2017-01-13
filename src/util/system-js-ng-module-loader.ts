import { Compiler, Injectable, NgModuleFactory, NgModuleFactoryLoader, Optional, Type } from '@angular/core';

const _SEPARATOR = '#';

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

  load(toLoad: DataToLoad): Promise<SystemJsLoadedModule> {
    const offlineMode = this._compiler instanceof Compiler;
    return offlineMode ? this.loadFactory(toLoad) : this.loadAndCompile(toLoad);
  }

  private loadAndCompile(toLoad: DataToLoad) {
    console.log('LoadAndCompile executed');
    if (!toLoad.ngModuleExport) {
      toLoad.ngModuleExport = 'default'
    }

    let _module: any;
    return System.import(toLoad.modulePath)
      .then((module: any) => {
        _module = module;
        return module[toLoad.ngModuleExport];
      }).then((type: any) => {
        if (!type) {
          throw new Error(`Module ${toLoad.modulePath} does not export ${toLoad.ngModuleExport}`);
        }
        return type;
      }).then((type: any) => {
        return this._compiler.compileModuleAsync(type)
      }).then((ngModuleFactory: NgModuleFactory<any>) => {
        console.log('ngModuleFactory: ', ngModuleFactory);
        if (!_module[toLoad.viewFactoryFunction]) {
          throw new Error(`Module ${toLoad.modulePath} does not export a view via ${toLoad.viewFactoryFunction}`);
        }

        const component = _module[toLoad.viewFactoryFunction]();

        return {
          ngModuleFactory: ngModuleFactory,
          component: component,
          rawModule: _module
        };
      });
  }

  private loadFactory(toLoad: DataToLoad) {
    console.log('loadFactory executed');
    let factoryClassSuffix = FACTORY_CLASS_SUFFIX;
    if (toLoad.ngModuleExport === undefined) {
      toLoad.ngModuleExport = 'default';
      factoryClassSuffix = '';
    }

    let _module: any = null;
    return System.import(this._config.factoryPathPrefix + toLoad.modulePath + this._config.factoryPathSuffix)
      .then((module: any) => {
        _module = module;
        return module[toLoad.ngModuleExport + factoryClassSuffix]
      })
      .then((ngModuleFactory: NgModuleFactory<any>) => {
        if (!ngModuleFactory) {
          throw new Error(`Module ${toLoad.modulePath} does not export ${toLoad.ngModuleExport}`);
        }
        return ngModuleFactory;
      }).then((ngModuleFactory: NgModuleFactory<any>) => {
        if (!_module[toLoad.viewFactoryFunction]) {
          throw new Error(`Module ${toLoad.modulePath} does not export a view via ${toLoad.viewFactoryFunction}`);
        }

        const component = _module[toLoad.viewFactoryFunction]();

        return {
          ngModuleFactory: ngModuleFactory,
          component: component,
          rawModule: _module
        };

      })
  }
}

export interface DataToLoad {
  modulePath: string;
  ngModuleExport: string;
  viewFactoryFunction: string;
};

export interface SystemJsLoadedModule {
  rawModule: any;
  ngModuleFactory: NgModuleFactory<any>;
  component: Type<any>;
};