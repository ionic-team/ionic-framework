import { ChangeDetectorRef, ComponentRef, ElementRef, NgZone, Renderer } from '@angular/core';
import { Location } from '@angular/common';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { Content } from '../components/content/content';
import { DeepLinker } from '../navigation/deep-linker';
import { DomController } from '../platform/dom-controller';
import { GestureController } from '../gestures/gesture-controller';
import { Haptic } from '../tap-click/haptic';
import { IonicApp } from '../components/app/app-root';
import { Menu } from '../components/menu/menu';
import { NavOptions } from '../navigation/nav-util';
import { NavControllerBase } from '../navigation/nav-controller-base';
import { OverlayPortal } from '../components/app/overlay-portal';
import { Platform } from '../platform/platform';
import { QueryParams } from '../platform/query-params';
import { Tab } from '../components/tabs/tab';
import { Tabs } from '../components/tabs/tabs';
import { TransitionController } from '../transitions/transition-controller';
import { ViewController } from '../navigation/view-controller';
import { ModuleLoader } from './module-loader';
import { NgModuleLoader } from './ng-module-loader';
import { DeepLinkConfig } from '../navigation/nav-util';
import { Ion } from '../components/ion';
import { Item } from '../components/item/item';
import { Form } from './form';
export declare function mockConfig(config?: any, _url?: string, platform?: Platform): Config;
export declare function mockQueryParams(url?: string): QueryParams;
export declare function mockPlatform(): MockPlatform;
export declare class MockPlatform extends Platform {
    private timeoutIds;
    private timeouts;
    private rafIds;
    private timeStamps;
    private rafs;
    constructor();
    timeout(callback: Function, timeout: number): number;
    cancelTimeout(timeoutId: number): void;
    flushTimeouts(done: Function): void;
    flushTimeoutsUntil(timeout: number, done: Function): void;
    raf(callback: {
        (timeStamp?: number): void;
    } | Function): number;
    cancelRaf(rafId: number): void;
    flushRafs(done: Function): void;
}
export declare function mockDomController(platform?: MockPlatform): MockDomController;
export declare class MockDomController extends DomController {
    private mockedPlatform;
    constructor(mockedPlatform: MockPlatform);
    flush(done: any): void;
    flushUntil(timeout: number, done: any): void;
}
export declare function mockApp(config?: Config, platform?: MockPlatform): App;
export declare function mockIonicApp(app: App, config: Config, plt: MockPlatform): IonicApp;
export declare const mockTrasitionController: (config: Config) => TransitionController;
export declare function mockContent(): Content;
export declare function mockZone(): NgZone;
export declare function mockChangeDetectorRef(): ChangeDetectorRef;
export declare function mockGestureController(app?: App): GestureController;
export declare class MockElementRef implements ElementRef {
    nativeElement: any;
    constructor(ele: any);
}
export declare class MockElement {
    children: any[];
    classList: ClassList;
    attributes: {
        [name: string]: any;
    };
    style: {
        [property: string]: any;
    };
    nodeName: string;
    clientWidth: number;
    clientHeight: number;
    clientTop: number;
    clientLeft: number;
    offsetWidth: number;
    offsetHeight: number;
    offsetTop: number;
    offsetLeft: number;
    scrollTop: number;
    scrollHeight: number;
    className: string;
    hasAttribute(name: string): boolean;
    getAttribute(name: string): any;
    setAttribute(name: string, val: any): void;
    addEventListener(_type: string, _listener: Function, _options?: any): void;
    removeEventListener(_type: string, _listener: Function, _options?: any): void;
    removeAttribute(name: string): void;
}
export declare class ClassList {
    classes: string[];
    add(className: string): void;
    remove(className: string): void;
    toggle(className: string): void;
    contains(className: string): boolean;
}
export declare function mockElementRef(): ElementRef;
export declare function mockElementRefEle(ele: any): ElementRef;
export declare class MockRenderer {
    setElementAttribute(renderElement: MockElement, name: string, val: any): void;
    setElementClass(renderElement: MockElement, className: string, isAdd: boolean): void;
    setElementStyle(renderElement: MockElement, styleName: string, styleValue: string): void;
}
export declare function mockRenderer(): Renderer;
export declare function mockLocation(): Location;
export declare function mockView(component?: any, data?: any): ViewController;
export declare function mockViews(nav: NavControllerBase, views: ViewController[]): void;
export declare function mockComponentRef(): ComponentRef<any>;
export declare function mockDeepLinker(linkConfig?: DeepLinkConfig, app?: App): DeepLinker;
export declare function mockNavController(): NavControllerBase;
export declare function mockOverlayPortal(app: App, config: Config, plt: MockPlatform): OverlayPortal;
export declare function mockTab(parentTabs: Tabs, overrideLoad?: boolean): Tab;
export declare function mockForm(): Form;
export declare function mockIon(): Ion;
export declare function mockItem(): Item;
export declare function mockTabs(app?: App): Tabs;
export declare function mockMenu(platform?: MockPlatform): Menu;
export declare function mockDeepLinkConfig(links?: any[]): DeepLinkConfig;
export declare function mockHaptic(): Haptic;
export declare class MockView {
}
export declare class MockView1 {
}
export declare class MockView2 {
}
export declare class MockView3 {
}
export declare class MockView4 {
}
export declare class MockView5 {
}
export declare function noop(): any;
export declare function mockModuleLoader(ngModuleLoader?: NgModuleLoader): ModuleLoader;
export declare function mockNgModuleLoader(): NgModuleLoader;
export declare function mockOverlay(): {
    present: (_opts?: NavOptions) => Promise<void>;
    dismiss: (_data?: any, _role?: string, _navOptions?: NavOptions) => Promise<void>;
    onDidDismiss: (_callback: Function) => void;
    onWillDismiss: (_callback: Function) => void;
};
