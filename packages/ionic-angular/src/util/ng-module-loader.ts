import { Compiler, Injectable, NgModuleFactory } from '@angular/core';

/**
 * NgModuleFactoryLoader that uses SystemJS to load NgModuleFactory
 */
@Injectable()
export class NgModuleLoader {

  constructor(private _compiler: Compiler) {
  }

  load(modulePath: string, ngModuleExport: string) {
    const offlineMode = this._compiler instanceof Compiler;
    return offlineMode ? loadPrecompiledFactory(modulePath, ngModuleExport) : loadAndCompile(this._compiler, modulePath, ngModuleExport);
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


function loadPrecompiledFactory(modulePath: string, ngModuleExport: string): Promise<NgModuleFactory<any>> {
  return System.import(modulePath)
    .then((rawModule: any) => {
      const ngModuleFactory = rawModule[ngModuleExport];
      if (!ngModuleFactory) {
        throw new Error(`Module ${modulePath} does not export ${ngModuleExport}`);
      }
      return ngModuleFactory;
    });
}
