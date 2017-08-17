import { ComponentFactoryResolver, Injector, NgModuleFactory, NgZone, OpaqueToken, Type } from '@angular/core';
import { Config } from '../config/config';
import { DeepLinkConfig } from '../navigation/nav-util';
import { NgModuleLoader } from './ng-module-loader';
export declare const LAZY_LOADED_TOKEN: OpaqueToken;
/**
 * @hidden
 */
export declare class ModuleLoader {
    private _ngModuleLoader;
    private _injector;
    /** @internal */
    _cfrMap: Map<any, ComponentFactoryResolver>;
    _promiseMap: Map<string, Promise<NgModuleFactory<any>>>;
    constructor(_ngModuleLoader: NgModuleLoader, _injector: Injector);
    load(modulePath: string): Promise<LoadedModule>;
    getComponentFactoryResolver(component: Type<any>): ComponentFactoryResolver;
}
/**
 * @hidden
 */
export declare function provideModuleLoader(ngModuleLoader: NgModuleLoader, injector: Injector): ModuleLoader;
export interface LoadedModule {
    componentFactoryResolver: ComponentFactoryResolver;
    component: Type<any>;
}
/**
 * @hidden
 */
export declare function setupPreloadingImplementation(config: Config, deepLinkConfig: DeepLinkConfig, moduleLoader: ModuleLoader): Promise<any>;
/**
 * @hidden
 */
export declare function setupPreloading(config: Config, deepLinkConfig: DeepLinkConfig, moduleLoader: ModuleLoader, ngZone: NgZone): () => void;
