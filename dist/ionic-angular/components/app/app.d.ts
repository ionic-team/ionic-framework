import { EventEmitter } from '@angular/core';
import { IonicApp } from './app-root';
import { ClickBlock } from './click-block';
import { Config } from '../../config/config';
import { NavOptions } from '../../navigation/nav-util';
import { MenuController } from './menu-controller';
import { NavigationContainer } from '../../navigation/navigation-container';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';
/**
 * @name App
 * @description
 * App is a utility class used in Ionic to get information about various aspects of an app
 */
export declare class App {
    private _config;
    private _plt;
    private _menuCtrl;
    private _disTime;
    private _scrollTime;
    private _title;
    private _titleSrv;
    private _rootNavs;
    private _disableScrollAssist;
    private _didScroll;
    /**
     * @hidden
     */
    _clickBlock: ClickBlock;
    /**
     * @hidden
     */
    _appRoot: IonicApp;
    /**
     * Observable that emits whenever a view loads in the app.
     * @returns {Observable} Returns an observable
     */
    viewDidLoad: EventEmitter<ViewController>;
    /**
     * Observable that emits before any view is entered in the app.
     * @returns {Observable} Returns an observable
     */
    viewWillEnter: EventEmitter<ViewController>;
    /**
     * Observable that emits after any view is entered in the app.
     * @returns {Observable} Returns an observable
     */
    viewDidEnter: EventEmitter<ViewController>;
    /**
     * Observable that emits before any view is exited in the app.
     * @returns {Observable} Returns an observable
     */
    viewWillLeave: EventEmitter<ViewController>;
    /**
     * Observable that emits after any view is exited in the app.
     * @returns {Observable} Returns an observable
     */
    viewDidLeave: EventEmitter<ViewController>;
    /**
     * Observable that emits before any view unloads in the app.
     * @returns {Observable} Returns an observable
     */
    viewWillUnload: EventEmitter<ViewController>;
    constructor(_config: Config, _plt: Platform, _menuCtrl?: MenuController);
    /**
     * Sets the document title.
     * @param {string} val  Value to set the document title to.
     */
    setTitle(val: string): void;
    /**
     * @hidden
     */
    setElementClass(className: string, isAdd: boolean): void;
    /**
     * @hidden
     * Sets if the app is currently enabled or not, meaning if it's
     * available to accept new user commands. For example, this is set to `false`
     * while views transition, a modal slides up, an action-sheet
     * slides up, etc. After the transition completes it is set back to `true`.
     * @param {boolean} isEnabled `true` for enabled, `false` for disabled
     * @param {number} duration  When `isEnabled` is set to `false`, this argument
     * is used to set the maximum number of milliseconds that app will wait until
     * it will automatically enable the app again. It's basically a fallback incase
     * something goes wrong during a transition and the app wasn't re-enabled correctly.
     */
    setEnabled(isEnabled: boolean, duration?: number, minDuration?: number): void;
    /**
     * @hidden
     * Toggles whether an application can be scrolled
     * @param {boolean} disableScroll when set to `false`, the application's
     * scrolling is enabled. When set to `true`, scrolling is disabled.
     */
    _setDisableScroll(disableScroll: boolean): void;
    /**
     * @hidden
     * Boolean if the app is actively enabled or not.
     * @return {boolean}
     */
    isEnabled(): boolean;
    /**
     * @hidden
     */
    setScrolling(): void;
    /**
     * Boolean if the app is actively scrolling or not.
     * @return {boolean} returns true or false
     */
    isScrolling(): boolean;
    /**
     * @return {NavController} Returns the first Active Nav Controller from the list. This method is deprecated
     */
    getActiveNav(): NavControllerBase;
    /**
     * @return {NavController[]} Returns the active NavControllers. Using this method is preferred when we need access to the top-level navigation controller while on the outside views and handlers like `registerBackButtonAction()`
     */
    getActiveNavs(rootNavId?: string): NavControllerBase[];
    getRootNav(): any;
    getRootNavs(): any[];
    /**
     * @return {NavController} Returns the root NavController
     */
    getRootNavById(navId: string): NavigationContainer;
    /**
     * @hidden
     */
    registerRootNav(nav: NavigationContainer): void;
    getActiveNavContainers(): NavigationContainer[];
    /**
     * @hidden
     */
    present(enteringView: ViewController, opts: NavOptions, appPortal?: number): Promise<any>;
    /**
     * @hidden
     */
    goBack(): Promise<any>;
    /**
     * @hidden
     */
    navPop(): Promise<any>;
    /**
     * @hidden
     */
    _enableInputBlurring(): void;
    getNavByIdOrName(id: string): NavigationContainer;
}
export declare function getNavByIdOrName(nav: NavigationContainer, id: string): NavigationContainer;
export declare function findTopNavs(nav: NavigationContainer): NavigationContainer[];
