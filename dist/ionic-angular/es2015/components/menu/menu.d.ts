import { ElementRef, EventEmitter, OnDestroy, OnInit, Renderer } from '@angular/core';
import { App } from '../app/app';
import { Backdrop } from '../backdrop/backdrop';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { Side } from '../../util/util';
import { Keyboard } from '../../platform/keyboard';
import { Menu as MenuInterface } from '../app/menu-interface';
import { MenuController } from '../app/menu-controller';
import { Nav } from '../nav/nav';
import { Platform } from '../../platform/platform';
import { RootNode } from '../split-pane/split-pane';
/**
 * @name Menu
 * @description
 * The Menu component is a navigation drawer that slides in from the side of the current
 * view. By default, it slides in from the left, but the side can be overridden. The menu
 * will be displayed differently based on the mode, however the display type can be changed
 * to any of the available [menu types](#menu-types). The menu element should be a sibling
 * to the app's content element. There can be any number of menus attached to the content.
 * These can be controlled from the templates, or programmatically using the [MenuController](../../app/MenuController).
 *
 * @usage
 *
 * ```html
 * <ion-menu [content]="mycontent">
 *   <ion-content>
 *     <ion-list>
 *       <p>some menu content, could be list items</p>
 *     </ion-list>
 *   </ion-content>
 * </ion-menu>
 *
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * To add a menu to an app, the `<ion-menu>` element should be added as a sibling to the `ion-nav` it will belongs
 * to. A [local variable](https://angular.io/docs/ts/latest/guide/user-input.html#local-variables)
 * should be added to the `ion-nav` and passed to the `ion-menu`s `content` property.
 *
 * This tells the menu what it is bound to and what element to watch for gestures.
 * In the below example, `content` is using [property binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#property-binding)
 * because `mycontent` is a reference to the `<ion-nav>` element, and not a string.
 *
 *
 * ### Opening/Closing Menus
 *
 * There are several ways to open or close a menu. The menu can be **toggled** open or closed
 * from the template using the [MenuToggle](../MenuToggle) directive. It can also be
 * **closed** from the template using the [MenuClose](../MenuClose) directive. To display a menu
 * programmatically, inject the [MenuController](../MenuController) provider and call any of the
 * `MenuController` methods.
 *
 *
 * ### Menu Types
 *
 * The menu supports several display types: `overlay`, `reveal` and `push`. By default,
 * it will use the correct type based on the mode, but this can be changed. The default
 * type for both Material Design and Windows mode is `overlay`, and `reveal` is the default
 * type for iOS mode. The menu type can be changed in the app's [config](../../config/Config)
 * via the `menuType` property, or passed in the `type` property on the `<ion-menu>` element.
 * See [usage](#usage) below for examples of changing the menu type.
 *
 *
 * ### Navigation Bar Behavior
 *
 * If a [MenuToggle](../MenuToggle) button is added to the [Navbar](../../navbar/Navbar) of
 * a page, the button will only appear when the page it's in is currently a root page. The
 * root page is the initial page loaded in the app, or a page that has been set as the root
 * using the [setRoot](../../nav/NavController/#setRoot) method on the [NavController](../../nav/NavController).
 *
 * For example, say the application has two pages, `Page1` and `Page2`, and both have a
 * `MenuToggle` button in their navigation bars. Assume the initial page loaded into the app
 * is `Page1`, making it the root page. `Page1` will display the `MenuToggle` button, but once
 * `Page2` is pushed onto the navigation stack, the `MenuToggle` will not be displayed.
 *
 *
 * ### Persistent Menus
 *
 * Persistent menus display the [MenuToggle](../MenuToggle) button in the [Navbar](../../navbar/Navbar)
 * on all pages in the navigation stack. To make a menu persistent set `persistent` to `true` on the
 * `<ion-menu>` element. Note that this will only affect the `MenuToggle` button in the `Navbar` attached
 * to the `Menu` with `persistent` set to true, any other `MenuToggle` buttons will not be affected.
 * ### Menu Side
 *
 * By default, menus slide in from the left, but this can be overridden by passing `right`
 * to the `side` property:
 *
 * ```html
 * <ion-menu side="right" [content]="mycontent">...</ion-menu>
 * ```
 *
 *
 * ### Menu Type
 *
 * The menu type can be changed by passing the value to `type` on the `<ion-menu>`:
 *
 * ```html
 * <ion-menu type="overlay" [content]="mycontent">...</ion-menu>
 * ```
 *
 * It can also be set in the app's config. The below will set the menu type to
 * `push` for all modes, and then set the type to `overlay` for the `ios` mode.
 *
 * ```ts
 * // in NgModules
 *
 * imports: [
 *   IonicModule.forRoot(MyApp,{
 *     menuType: 'push',
 *     platforms: {
 *       ios: {
 *         menuType: 'overlay',
 *       }
 *     }
 *   })
 * ],
 * ```
 *
 *
 * ### Displaying the Menu
 *
 * To toggle a menu from the template, add a button with the `menuToggle`
 * directive anywhere in the page's template:
 *
 * ```html
 * <button ion-button menuToggle>Toggle Menu</button>
 * ```
 *
 * To close a menu, add the `menuClose` button. It can be added anywhere
 * in the content, or even the menu itself. Below it is added to the menu's
 * content:
 *
 * ```html
 * <ion-menu [content]="mycontent">
 *   <ion-content>
 *     <ion-list>
 *       <ion-item menuClose detail-none>Close Menu</ion-item>
 *     </ion-list>
 *   </ion-content>
 * </ion-menu>
 * ```
 *
 * See the [MenuToggle](../MenuToggle) and [MenuClose](../MenuClose) docs
 * for more information on these directives.
 *
 * The menu can also be controlled from the Page by using the `MenuController`.
 * Inject the `MenuController` provider into the page and then call any of its
 * methods. In the below example, the `openMenu` method will open the menu
 * when it is called.
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { MenuController } from 'ionic-angular';
 *
 * @Component({...})
 * export class MyPage {
 *  constructor(public menuCtrl: MenuController) {}
 *
 *  openMenu() {
 *    this.menuCtrl.open();
 *  }
 * }
 * ```
 *
 * See the [MenuController](../../app/MenuController) API docs for all of the methods
 * and usage information.
 *
 *
 * @demo /docs/demos/src/menu/
 *
 * @see {@link /docs/components#menus Menu Component Docs}
 * @see {@link ../../app/MenuController MenuController API Docs}
 * @see {@link ../../nav/Nav Nav API Docs}
 * @see {@link ../../nav/NavController NavController API Docs}
 */
export declare class Menu implements RootNode, MenuInterface, OnInit, OnDestroy {
    _menuCtrl: MenuController;
    private _elementRef;
    private _config;
    private _plt;
    private _renderer;
    private _keyboard;
    private _gestureCtrl;
    private _domCtrl;
    private _app;
    private _cntEle;
    private _gesture;
    private _type;
    private _isEnabled;
    private _isSwipeEnabled;
    private _isAnimating;
    private _isPersistent;
    private _init;
    private _events;
    private _gestureBlocker;
    private _isPane;
    private _side;
    /**
     * @hidden
     */
    isOpen: boolean;
    /**
     * @hidden
     */
    isRightSide: boolean;
    /**
     * @hidden
     */
    backdrop: Backdrop;
    /**
     * @hidden
     */
    menuContent: Content;
    /**
     * @hidden
     */
    menuNav: Nav;
    /**
     * @input {any} A reference to the content element the menu should use.
     */
    content: any;
    /**
     * @input {string} An id for the menu.
     */
    id: string;
    /**
     * @input {string} The display type of the menu. Default varies based on the mode,
     * see the `menuType` in the [config](../../config/Config). Available options:
     * `"overlay"`, `"reveal"`, `"push"`.
     */
    type: string;
    /**
     * @input {boolean} If true, the menu is enabled. Default `true`.
     */
    enabled: boolean;
    /**
     * @input {string} Which side of the view the menu should be placed. Default `"left"`.
     */
    side: Side;
    /**
     * @input {boolean} If true, swiping the menu is enabled. Default `true`.
     */
    swipeEnabled: boolean;
    /**
     * @input {boolean} If true, the menu will persist on child pages.
     */
    persistent: boolean;
    /**
     * @hidden
     */
    maxEdgeStart: number;
    /**
     * @output {event} Emitted when the menu is being dragged open.
     */
    ionDrag: EventEmitter<number>;
    /**
     * @output {event} Emitted when the menu has been opened.
     */
    ionOpen: EventEmitter<boolean>;
    /**
     * @output {event} Emitted when the menu has been closed.
     */
    ionClose: EventEmitter<boolean>;
    constructor(_menuCtrl: MenuController, _elementRef: ElementRef, _config: Config, _plt: Platform, _renderer: Renderer, _keyboard: Keyboard, _gestureCtrl: GestureController, _domCtrl: DomController, _app: App);
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    onBackdropClick(ev: UIEvent): void;
    /**
     * @hidden
     */
    private _getType();
    /**
     * @hidden
     */
    setOpen(shouldOpen: boolean, animated?: boolean): Promise<boolean>;
    _forceClosing(): void;
    /**
     * @hidden
     */
    canSwipe(): boolean;
    /**
     * @hidden
     */
    isAnimating(): boolean;
    _swipeBeforeStart(): void;
    _swipeStart(): void;
    _swipeProgress(stepValue: number): void;
    _swipeEnd(shouldCompleteLeft: boolean, shouldCompleteRight: boolean, stepValue: number, velocity: number): void;
    private _before();
    private _after(isOpen);
    /**
     * @hidden
     */
    open(): Promise<boolean>;
    /**
     * @hidden
     */
    close(): Promise<boolean>;
    /**
     * @hidden
     */
    resize(): void;
    /**
     * @hidden
     */
    toggle(): Promise<boolean>;
    _canOpen(): boolean;
    /**
     * @hidden
     */
    _updateState(): void;
    /**
     * @hidden
     */
    enable(shouldEnable: boolean): Menu;
    /**
     * @internal
     */
    initPane(): boolean;
    /**
     * @internal
     */
    paneChanged(isPane: boolean): void;
    /**
     * @hidden
     */
    swipeEnable(shouldEnable: boolean): Menu;
    /**
     * @hidden
     */
    getNativeElement(): HTMLElement;
    /**
     * @hidden
     */
    getMenuElement(): HTMLElement;
    /**
     * @hidden
     */
    getContentElement(): HTMLElement;
    /**
     * @hidden
     */
    getBackdropElement(): HTMLElement;
    /**
     * @hidden
     */
    width(): number;
    /**
     * @hidden
     */
    getMenuController(): MenuController;
    /**
     * @hidden
     */
    setElementClass(className: string, add: boolean): void;
    /**
     * @hidden
     */
    setElementAttribute(attributeName: string, value: string): void;
    /**
     * @hidden
     */
    getElementRef(): ElementRef;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
}
