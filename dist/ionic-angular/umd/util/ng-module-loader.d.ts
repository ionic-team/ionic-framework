import { Compiler, NgModuleFactory } from '@angular/core';
/**
 * NgModuleFactoryLoader that uses SystemJS to load NgModuleFactory
 */
export declare class NgModuleLoader {
    private _compiler;
    constructor(_compiler: Compiler);
    load(modulePath: string, ngModuleExport: string): Promise<NgModuleFactory<any>>;
}
