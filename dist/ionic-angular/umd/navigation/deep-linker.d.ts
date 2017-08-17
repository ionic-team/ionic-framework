import { ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { Location } from '@angular/common';
import { App } from '../components/app/app';
import { NavLink, NavSegment } from './nav-util';
import { ModuleLoader } from '../util/module-loader';
import { Tab } from './nav-interfaces';
import { NavigationContainer } from './navigation-container';
import { NavController } from './nav-controller';
import { UrlSerializer } from './url-serializer';
import { ViewController } from './view-controller';
/**
 * @hidden
 */
export declare class DeepLinker {
    _app: App;
    _serializer: UrlSerializer;
    _location: Location;
    _moduleLoader: ModuleLoader;
    _baseCfr: ComponentFactoryResolver;
    /** @internal */
    _history: string[];
    /** @internal */
    _indexAliasUrl: string;
    constructor(_app: App, _serializer: UrlSerializer, _location: Location, _moduleLoader: ModuleLoader, _baseCfr: ComponentFactoryResolver);
    /**
     * @internal
     */
    init(): void;
    /**
     * The browser's location has been updated somehow.
     * @internal
     */
    _urlChange(browserUrl: string): void;
    getCurrentSegments(browserUrl?: string): NavSegment[];
    /**
     * Update the deep linker using the NavController's current active view.
     * @internal
     */
    navChange(direction: string): void;
    getSegmentsFromNav(nav: NavigationContainer): NavSegment[];
    getSegmentFromNav(nav: NavController, component?: any, data?: any): NavSegment;
    getSegmentFromTab(navContainer: NavigationContainer, component?: any, data?: any): NavSegment;
    /**
     * @internal
     */
    _updateLocation(browserUrl: string, direction: string): void;
    getComponentFromName(componentName: string): Promise<any>;
    getNavLinkComponent(link: NavLink): Promise<any>;
    /**
     * @internal
     */
    resolveComponent(component: any): ComponentFactory<any>;
    /**
     * @internal
     */
    createUrl(navContainer: NavigationContainer, nameOrComponent: any, _data?: any, prepareExternalUrl?: boolean): string;
    /**
     * Each NavController will call this method when it initializes for
     * the first time. This allows each NavController to figure out
     * where it lives in the path and load up the correct component.
     * @internal
     */
    getSegmentByNavIdOrName(navId: string, name: string): NavSegment;
    /**
     * @internal
     */
    initViews(segment: NavSegment): Promise<ViewController[]>;
    /**
     * @internal
     */
    _isBackUrl(browserUrl: string): boolean;
    /**
     * @internal
     */
    _isCurrentUrl(browserUrl: string): boolean;
    /**
     * @internal
     */
    _historyPush(browserUrl: string): void;
    /**
     * @internal
     */
    _historyPop(): void;
    /**
     * @internal
     */
    _getTabSelector(tab: Tab): string;
    /**
     * Using the known Path of Segments, walk down all descendents
     * from the root NavController and load each NavController according
     * to each Segment. This is usually called after a browser URL and
     * Path changes and needs to update all NavControllers to match
     * the new browser URL. Because the URL is already known, it will
     * not update the browser's URL when transitions have completed.
     *
     * @internal
     */
    _loadViewForSegment(navContainer: NavigationContainer, segment: NavSegment, done: Function): any;
}
export declare function setupDeepLinker(app: App, serializer: UrlSerializer, location: Location, moduleLoader: ModuleLoader, cfr: ComponentFactoryResolver): DeepLinker;
export declare function normalizeUrl(browserUrl: string): string;
export declare function getNavFromTree(nav: NavigationContainer, id: string): NavigationContainer;
