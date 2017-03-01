import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, Input, NgZone, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';

import { Animation } from '../../animations/animation';
import { App } from '../app/app';
import { Backdrop } from '../backdrop/backdrop';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { DomController } from '../../platform/dom-controller';
import { GestureController, GESTURE_GO_BACK_SWIPE, BlockerDelegate } from '../../gestures/gesture-controller';
import { isTrueProperty, assert } from '../../util/util';
import { Keyboard } from '../../platform/keyboard';
import { MenuContentGesture } from  './menu-gestures';
import { Platform } from '../../platform/platform';
import { UIEventManager } from '../../gestures/ui-event-manager';
import { removeArrayItem } from '../../util/util';

/**
 * @name MenuController
 * @description
 * The MenuController is a provider which makes it easy to control a [Menu](../Menu).
 * Its methods can be used to display the menu, enable the menu, toggle the menu, and more.
 * The controller will grab a reference to the menu by the `side`, `id`, or, if neither
 * of these are passed to it, it will grab the first menu it finds.
 *
 *
 * @usage
 *
 * Add a basic menu component to start with. See the [Menu](../Menu) API docs
 * for more information on adding menu components.
 *
 * ```html
 * <ion-menu [content]="mycontent">
 *   <ion-content>
 *     <ion-list>
 *     ...
 *     </ion-list>
 *   </ion-content>
 * </ion-menu>
 *
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * To call the controller methods, inject the `MenuController` provider
 * into the page. Then, create some methods for opening, closing, and
 * toggling the menu.
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { MenuController } from 'ionic-angular';
 *
 * @Component({...})
 * export class MyPage {
 *
 *  constructor(public menuCtrl: MenuController) {
 *
 *  }
 *
 *  openMenu() {
 *    this.menuCtrl.open();
 *  }
 *
 *  closeMenu() {
 *    this.menuCtrl.close();
 *  }
 *
 *  toggleMenu() {
 *    this.menuCtrl.toggle();
 *  }
 *
 * }
 * ```
 *
 * Since only one menu exists, the `MenuController` will grab the
 * correct menu and call the correct method for each.
 *
 *
 * ### Multiple Menus on Different Sides
 *
 * For applications with both a left and right menu, the desired menu can be
 * grabbed by passing the `side` of the menu. If nothing is passed, it will
 * default to the `"left"` menu.
 *
 * ```html
 * <ion-menu side="left" [content]="mycontent">...</ion-menu>
 * <ion-menu side="right" [content]="mycontent">...</ion-menu>
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * ```ts
 *  toggleLeftMenu() {
 *    this.menuCtrl.toggle();
 *  }
 *
 *  toggleRightMenu() {
 *    this.menuCtrl.toggle('right');
 *  }
 * ```
 *
 *
 * ### Multiple Menus on the Same Side
 *
 * An application can have multiple menus on the same side. In order to determine
 * the menu to control, an `id` should be passed. In the example below, the menu
 * with the `authenticated` id will be enabled, and the menu with the `unauthenticated`
 * id will be disabled.
 *
 * ```html
 * <ion-menu id="authenticated" side="left" [content]="mycontent">...</ion-menu>
 * <ion-menu id="unauthenticated" side="left" [content]="mycontent">...</ion-menu>
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * ```ts
 *  enableAuthenticatedMenu() {
 *    this.menuCtrl.enable(true, 'authenticated');
 *    this.menuCtrl.enable(false, 'unauthenticated');
 *  }
 * ```
 *
 * Note: if an app only has one menu, there is no reason to pass an `id`.
 *
 *
 * @demo /docs/v2/demos/src/menu/
 *
 * @see {@link /docs/v2/components#menus Menu Component Docs}
 * @see {@link ../Menu Menu API Docs}
 *
 */
export class MenuController {
  private _menus: Array<Menu> = [];

  /**
   * Programatically open the Menu.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Promise} returns a promise when the menu is fully opened
   */
  open(menuId?: string): Promise<boolean> {
    const menu = this.get(menuId);
    if (menu && !this.isAnimating()) {
      let openedMenu = this.getOpen();
      if (openedMenu && menu !== openedMenu) {
        openedMenu.setOpen(false, false);
      }
      return menu.open();
    }
    return Promise.resolve(false);
  }

  /**
   * Programatically close the Menu. If no `menuId` is given as the first
   * argument then it'll close any menu which is open. If a `menuId`
   * is given then it'll close that exact menu.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Promise} returns a promise when the menu is fully closed
   */
  close(menuId?: string): Promise<boolean> {
    let menu: Menu;

    if (menuId) {
      // find the menu by its id
      menu = this.get(menuId);

    } else {
      // find the menu that is open
      menu = this.getOpen();
    }

    if (menu) {
      // close the menu
      return menu.close();
    }

    return Promise.resolve(false);
  }


  /**
   * Toggle the menu. If it's closed, it will open, and if opened, it
   * will close.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Promise} returns a promise when the menu has been toggled
   */
  toggle(menuId?: string): Promise<boolean> {
    const menu = this.get(menuId);
    if (menu && !this.isAnimating()) {
      var openedMenu = this.getOpen();
      if (openedMenu && menu !== openedMenu) {
        openedMenu.setOpen(false, false);
      }
      return menu.toggle();
    }
    return Promise.resolve(false);
  }

  /**
   * Used to enable or disable a menu. For example, there could be multiple
   * left menus, but only one of them should be able to be opened at the same
   * time. If there are multiple menus on the same side, then enabling one menu
   * will also automatically disable all the others that are on the same side.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  enable(shouldEnable: boolean, menuId?: string): Menu {
    const menu = this.get(menuId);
    if (menu) {
      return menu.enable(shouldEnable);
    }
  }

  /**
   * Used to enable or disable the ability to swipe open the menu.
   * @param {boolean} shouldEnable  True if it should be swipe-able, false if not.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  swipeEnable(shouldEnable: boolean, menuId?: string): Menu {
    const menu = this.get(menuId);
    if (menu) {
      return menu.swipeEnable(shouldEnable);
    }
  }

  /**
   * @param {string} [menuId] Optionally get the menu by its id, or side.
   * @return {boolean} Returns true if the specified menu is currently open, otherwise false.
   * If the menuId is not specified, it returns true if ANY menu is currenly open.
   */
  isOpen(menuId?: string): boolean {
    if (menuId) {
      var menu = this.get(menuId);
      return menu && menu.isOpen || false;
    } else {
      return !!this.getOpen();
    }
  }

  /**
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {boolean} Returns true if the menu is currently enabled, otherwise false.
   */
  isEnabled(menuId?: string): boolean {
    const menu = this.get(menuId);
    return menu && menu.enabled || false;
  }

  /**
   * Used to get a menu instance. If a `menuId` is not provided then it'll
   * return the first menu found. If a `menuId` is `left` or `right`, then
   * it'll return the enabled menu on that side. Otherwise, if a `menuId` is
   * provided, then it'll try to find the menu using the menu's `id`
   * property. If a menu is not found then it'll return `null`.
   * @param {string} [menuId]  Optionally get the menu by its id, or side.
   * @return {Menu} Returns the instance of the menu if found, otherwise `null`.
   */
  get(menuId?: string): Menu {
    var menu: Menu;

    if (menuId === 'left' || menuId === 'right') {
      // there could be more than one menu on the same side
      // so first try to get the enabled one
      menu = this._menus.find(m => m.side === menuId && m.enabled);
      if (menu) return menu;

      // didn't find a menu side that is enabled
      // so try to get the first menu side found
      return this._menus.find(m => m.side === menuId) || null;

    } else if (menuId) {
      // the menuId was not left or right
      // so try to get the menu by its "id"
      return this._menus.find(m => m.id === menuId) || null;
    }

    // return the first enabled menu
    menu = this._menus.find(m => m.enabled);
    if (menu) {
      return menu;
    }

    // get the first menu in the array, if one exists
    return (this._menus.length ? this._menus[0] : null);
  }

  /**
   * @return {Menu} Returns the instance of the menu already opened, otherwise `null`.
   */
  getOpen(): Menu {
    return this._menus.find(m => m.isOpen);
  }

  /**
   * @return {Array<Menu>}  Returns an array of all menu instances.
   */
  getMenus(): Array<Menu> {
    return this._menus;
  }

  /**
   * @private
   * @return {boolean} if any menu is currently animating
   */
  isAnimating(): boolean {
    return this._menus.some(menu => menu.isAnimating());
  }

  /**
   * @private
   */
  register(menu: Menu) {
    this._menus.push(menu);
  }

  /**
   * @private
   */
  unregister(menu: Menu) {
    removeArrayItem(this._menus, menu);
  }

  /**
   * @private
   */
  static registerType(name: string, cls: new(...args: any[]) => MenuType) {
    menuTypes[name] = cls;
  }

  /**
   * @private
   */
  static create(type: string, menuCmp: Menu, plt: Platform) {
    return new menuTypes[type](menuCmp, plt);
  }

}

let menuTypes: { [name: string]: new(...args: any[]) => MenuType } = {};

/**
 * @name Menu
 * @description
 * The Menu component is a navigation drawer that slides in from the side of the current
 * view. By default, it slides in from the left, but the side can be overridden. The menu
 * will be displayed differently based on the mode, however the display type can be changed
 * to any of the available [menu types](#menu-types). The menu element should be a sibling
 * to the app's content element. There can be any number of menus attached to the content.
 * These can be controlled from the templates, or programmatically using the [MenuController](../MenuController).
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
 * See the [MenuController](../MenuController) API docs for all of the methods
 * and usage information.
 *
 *
 * @demo /docs/v2/demos/src/menu/
 *
 * @see {@link /docs/v2/components#menus Menu Component Docs}
 * @see {@link ../MenuController MenuController API Docs}
 * @see {@link ../../nav/Nav Nav API Docs}
 * @see {@link ../../nav/NavController NavController API Docs}
 */
@Component({
  selector: 'ion-menu',
  template:
    '<div class="menu-inner"><ng-content></ng-content></div>' +
    '<ion-backdrop></ion-backdrop>',
  host: {
    'role': 'navigation'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Menu {

  private _cntEle: HTMLElement;
  private _gesture: MenuContentGesture;
  private _type: MenuType;
  private _isEnabled: boolean = true;
  private _isSwipeEnabled: boolean = true;
  private _isAnimating: boolean = false;
  private _isPersistent: boolean = false;
  private _init: boolean = false;
  private _events: UIEventManager;
  private _gestureBlocker: BlockerDelegate;

  /**
   * @private
   */
  isOpen: boolean = false;

  /**
   * @private
   */
  @ViewChild(Backdrop) backdrop: Backdrop;

  /**
   * @private
   */
  @ContentChild(Content) menuContent: Content;

  /**
   * @input {any} A reference to the content element the menu should use.
   */
  @Input() content: any;

  /**
   * @input {string} An id for the menu.
   */
  @Input() id: string;

  /**
   * @input {string} Which side of the view the menu should be placed. Default `"left"`.
   */
  @Input() side: string;

  /**
   * @input {string} The display type of the menu. Default varies based on the mode,
   * see the `menuType` in the [config](../../config/Config). Available options:
   * `"overlay"`, `"reveal"`, `"push"`.
   */
  @Input() type: string;

  /**
   * @input {boolean} If true, the menu is enabled. Default `true`.
   */
  @Input()
  get enabled(): boolean {
    return this._isEnabled;
  }

  set enabled(val: boolean) {
    this._isEnabled = isTrueProperty(val);
    this._setListeners();
  }

  /**
   * @input {boolean} If true, swiping the menu is enabled. Default `true`.
   */
  @Input()
  get swipeEnabled(): boolean {
    return this._isSwipeEnabled;
  }

  set swipeEnabled(val: boolean) {
    this._isSwipeEnabled = isTrueProperty(val);
    this._setListeners();
  }

  /**
   * @input {boolean} If true, the menu will persist on child pages.
   */
  @Input()
  get persistent(): boolean {
    return this._isPersistent;
  }

  set persistent(val: boolean) {
    this._isPersistent = isTrueProperty(val);
  }

  /**
   * @private
   */
  @Input() maxEdgeStart: number;

  /**
   * @output {event} Emitted when the menu is being dragged open.
   */
  @Output() ionDrag: EventEmitter<number> = new EventEmitter<number>();

  /**
   * @output {event} Emitted when the menu has been opened.
   */
  @Output() ionOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @output {event} Emitted when the menu has been closed.
   */
  @Output() ionClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public _menuCtrl: MenuController,
    private _elementRef: ElementRef,
    private _config: Config,
    private _plt: Platform,
    private _renderer: Renderer,
    private _keyboard: Keyboard,
    private _zone: NgZone,
    private _gestureCtrl: GestureController,
    private _domCtrl: DomController,
    private _app: App,
  ) {
    this._events = new UIEventManager(_plt);
    this._gestureBlocker = _gestureCtrl.createBlocker({
      disable: [GESTURE_GO_BACK_SWIPE]
    });
  }

  /**
   * @private
   */
  ngOnInit() {
    this._init = true;

    let content = this.content;
    this._cntEle = (content instanceof Node) ? content : content && content.getNativeElement && content.getNativeElement();

    // requires content element
    if (!this._cntEle) {
      return console.error('Menu: must have a [content] element to listen for drag events on. Example:\n\n<ion-menu [content]="content"></ion-menu>\n\n<ion-nav #content></ion-nav>');
    }

    // normalize the "side"
    if (this.side !== 'left' && this.side !== 'right') {
      this.side = 'left';
    }
    this.setElementAttribute('side', this.side);

    // normalize the "type"
    if (!this.type) {
      this.type = this._config.get('menuType');
    }
    this.setElementAttribute('type', this.type);

    // add the gestures
    this._gesture = new MenuContentGesture(this._plt, this, this._gestureCtrl, this._domCtrl);

    // register listeners if this menu is enabled
    // check if more than one menu is on the same side
    let hasEnabledSameSideMenu = this._menuCtrl.getMenus().some(m => {
      return m.side === this.side && m.enabled;
    });
    if (hasEnabledSameSideMenu) {
      // auto-disable if another menu on the same side is already enabled
      this._isEnabled = false;
    }
    this._setListeners();

    this._cntEle.classList.add('menu-content');
    this._cntEle.classList.add('menu-content-' + this.type);

    // register this menu with the app's menu controller
    this._menuCtrl.register(this);
  }

  /**
   * @private
   */
  onBackdropClick(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this._menuCtrl.close();
  }

  /**
   * @private
   */
  private _setListeners() {
    if (!this._init) {
      return;
    }
    const gesture = this._gesture;
    // only listen/unlisten if the menu has initialized
    if (this._isEnabled && this._isSwipeEnabled && !gesture.isListening) {
      // should listen, but is not currently listening
      console.debug('menu, gesture listen', this.side);
      gesture.listen();

    } else if (gesture.isListening && (!this._isEnabled || !this._isSwipeEnabled)) {
      // should not listen, but is currently listening
      console.debug('menu, gesture unlisten', this.side);
      gesture.unlisten();
    }
  }

  /**
   * @private
   */
  private _getType(): MenuType {
    if (!this._type) {
      this._type = MenuController.create(this.type, this, this._plt);

      if (this._config.get('animate') === false) {
        this._type.ani.duration(0);
      }
    }
    return this._type;
  }

  /**
   * @private
   */
  setOpen(shouldOpen: boolean, animated: boolean = true): Promise<boolean> {
    // If the menu is disabled or it is currenly being animated, let's do nothing
    if ((shouldOpen === this.isOpen) || !this._isEnabled || this._isAnimating) {
      return Promise.resolve(this.isOpen);
    }

    this._before();

    return new Promise(resolve => {
      this._getType().setOpen(shouldOpen, animated, () => {
        this._after(shouldOpen);
        resolve(this.isOpen);
      });
    });
  }

  /**
   * @private
   */
  canSwipe(): boolean {
    return this._isEnabled &&
      this._isSwipeEnabled &&
      !this._isAnimating &&
      this._app.isEnabled();
  }

  /**
   * @private
   */
  isAnimating(): boolean {
    return this._isAnimating;
  }

  _swipeBeforeStart() {
    if (!this.canSwipe()) {
      assert(false, 'canSwipe() has to be true');
      return;
    }
    this._before();
  }

  _swipeStart() {
    if (!this._isAnimating) {
      assert(false, '_isAnimating has to be true');
      return;
    }

    this._getType().setProgressStart(this.isOpen);
  }

  _swipeProgress(stepValue: number) {
    if (!this._isAnimating) {
      assert(false, '_isAnimating has to be true');
      return;
    }

    this._getType().setProgessStep(stepValue);
    const ionDrag = this.ionDrag;
    if (ionDrag.observers.length > 0) {
      ionDrag.emit(stepValue);
    }
  }

  _swipeEnd(shouldCompleteLeft: boolean, shouldCompleteRight: boolean, stepValue: number, velocity: number) {
    if (!this._isAnimating) {
      assert(false, '_isAnimating has to be true');
      return;
    }

    // user has finished dragging the menu
    const opening = !this.isOpen;
    let shouldComplete = false;
    if (opening) {
      shouldComplete = (this.side === 'right') ? shouldCompleteLeft : shouldCompleteRight;
    } else {
      shouldComplete = (this.side === 'right') ? shouldCompleteRight : shouldCompleteLeft;
    }

    this._getType().setProgressEnd(shouldComplete, stepValue, velocity, (isOpen: boolean) => {
      console.debug('menu, swipeEnd', this.side);
      this._after(isOpen);
    });
  }

  private _before() {
    assert(!this._isAnimating, '_before() should not be called while animating');

    // this places the menu into the correct location before it animates in
    // this css class doesn't actually kick off any animations
    this.setElementClass('show-menu', true);
    this.backdrop.setElementClass('show-backdrop', true);
    this.menuContent && this.menuContent.resize();
    this._keyboard.close();
    this._isAnimating = true;
  }

  private _after(isOpen: boolean) {
    assert(this._isAnimating, '_before() should be called while animating');

    this._app.setEnabled(false, 100);
    // keep opening/closing the menu disabled for a touch more yet
    // only add listeners/css if it's enabled and isOpen
    // and only remove listeners/css if it's not open
    // emit opened/closed events
    this.isOpen = isOpen;
    this._isAnimating = false;

    this._events.destroy();
    if (isOpen) {
      // Disable swipe to go back gesture
      this._gestureBlocker.block();

      this._cntEle.classList.add('menu-content-open');
      let callback = this.onBackdropClick.bind(this);
      this._events.listen(this._cntEle, 'click', callback, { capture: true });
      this._events.listen(this.backdrop.getNativeElement(), 'click', callback, { capture: true });

      this.ionOpen.emit(true);

    } else {
      // Enable swipe to go back gesture
      this._gestureBlocker.unblock();

      this._cntEle.classList.remove('menu-content-open');
      this.setElementClass('show-menu', false);
      this.backdrop.setElementClass('show-menu', false);

      this.ionClose.emit(true);
    }
  }

  /**
   * @private
   */
  open(): Promise<boolean> {
    return this.setOpen(true);
  }

  /**
   * @private
   */
  close(): Promise<boolean> {
    return this.setOpen(false);
  }

  /**
   * @private
   */
  toggle(): Promise<boolean> {
    return this.setOpen(!this.isOpen);
  }

  /**
   * @private
   */
  enable(shouldEnable: boolean): Menu {
    this.enabled = shouldEnable;
    if (!shouldEnable && this.isOpen) {
      // close if this menu is open, and should not be enabled
      this.close();
    }

    if (shouldEnable) {
      // if this menu should be enabled
      // then find all the other menus on this same side
      // and automatically disable other same side menus
      this._menuCtrl.getMenus()
        .filter(m => m.side === this.side && m !== this)
        .map(m => m.enabled = false);
    }

    // TODO
    // what happens if menu is disabled while swipping?

    return this;
  }

  /**
   * @private
   */
  swipeEnable(shouldEnable: boolean): Menu {
    this.swipeEnabled = shouldEnable;
    // TODO
    // what happens if menu swipe is disabled while swipping?
    return this;
  }

  /**
   * @private
   */
  getNativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /**
   * @private
   */
  getMenuElement(): HTMLElement {
    return <HTMLElement>this.getNativeElement().querySelector('.menu-inner');
  }

  /**
   * @private
   */
  getContentElement(): HTMLElement {
    return this._cntEle;
  }

  /**
   * @private
   */
  getBackdropElement(): HTMLElement {
    return this.backdrop.getNativeElement();
  }

  /**
   * @private
   */
  width(): number {
    return this.getMenuElement().offsetWidth;
  }

  /**
   * @private
   */
  getMenuController(): MenuController {
    return this._menuCtrl;
  }

  /**
   * @private
   */
  setElementClass(className: string, add: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
  }

  /**
   * @private
   */
  setElementAttribute(attributeName: string, value: string) {
    this._renderer.setElementAttribute(this._elementRef.nativeElement, attributeName, value);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._menuCtrl.unregister(this);
    this._events.destroy();
    this._gesture && this._gesture.destroy();
    this._type && this._type.destroy();

    this._gesture = null;
    this._type = null;
    this._cntEle = null;
  }

}

/**
 * @private
 * Menu Type
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
export class MenuType {
  ani: Animation;
  isOpening: boolean;

  constructor(plt: Platform) {
    this.ani = new Animation(plt);
    this.ani
      .easing('cubic-bezier(0.0, 0.0, 0.2, 1)')
      .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)')
      .duration(280);
  }

  setOpen(shouldOpen: boolean, animated: boolean, done: Function) {
    let ani = this.ani
      .onFinish(done, true)
      .reverse(!shouldOpen);

    if (animated) {
      ani.play();
    } else {
      ani.play({ duration: 0 });
    }
  }

  setProgressStart(isOpen: boolean) {
    this.isOpening = !isOpen;

    // the cloned animation should not use an easing curve during seek
    this.ani
        .reverse(isOpen)
        .progressStart();
  }

  setProgessStep(stepValue: number) {
    // adjust progress value depending if it opening or closing
    this.ani.progressStep(stepValue);
  }

  setProgressEnd(shouldComplete: boolean, currentStepValue: number, velocity: number, done: Function) {
    let isOpen = (this.isOpening && shouldComplete);
    if (!this.isOpening && !shouldComplete) {
      isOpen = true;
    }

    this.ani.onFinish(() => {
      this.isOpening = false;
      done(isOpen);
    }, true);

    let factor = 1 - Math.min(Math.abs(velocity) / 4, 0.7);
    let dur = this.ani.getDuration() * factor;

    this.ani.progressEnd(shouldComplete, currentStepValue, dur);
  }

  destroy() {
    this.ani && this.ani.destroy();
  }

}

/**
 * @private
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
class MenuRevealType extends MenuType {
  constructor(menu: Menu, plt: Platform) {
    super(plt);

    let openedX = (menu.width() * (menu.side === 'right' ? -1 : 1)) + 'px';
    let contentOpen = new Animation(plt, menu.getContentElement());
    contentOpen.fromTo('translateX', '0px', openedX);
    this.ani.add(contentOpen);
  }
}

/**
 * @private
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
class MenuPushType extends MenuType {
  constructor(menu: Menu, plt: Platform) {
    super(plt);

    let contentOpenedX: string, menuClosedX: string, menuOpenedX: string;

    if (menu.side === 'right') {
      // right side
      contentOpenedX = -menu.width() + 'px';
      menuClosedX = menu.width() + 'px';
      menuOpenedX = '0px';

    } else {
      contentOpenedX = menu.width() + 'px';
      menuOpenedX = '0px';
      menuClosedX = -menu.width() + 'px';
    }

    let menuAni = new Animation(plt, menu.getMenuElement());
    menuAni.fromTo('translateX', menuClosedX, menuOpenedX);
    this.ani.add(menuAni);

    let contentApi = new Animation(plt, menu.getContentElement());
    contentApi.fromTo('translateX', '0px', contentOpenedX);
    this.ani.add(contentApi);
  }
}

/**
 * @private
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
class MenuOverlayType extends MenuType {
  constructor(menu: Menu, plt: Platform) {
    super(plt);

    let closedX: string, openedX: string;
    if (menu.side === 'right') {
      // right side
      closedX = 8 + menu.width() + 'px';
      openedX = '0px';

    } else {
      // left side
      closedX = -(8 + menu.width()) + 'px';
      openedX = '0px';
    }

    let menuAni = new Animation(plt, menu.getMenuElement());
    menuAni.fromTo('translateX', closedX, openedX);
    this.ani.add(menuAni);

    let backdropApi = new Animation(plt, menu.getBackdropElement());
    backdropApi.fromTo('opacity', 0.01, 0.35);
    this.ani.add(backdropApi);
  }
}

MenuController.registerType('reveal', MenuRevealType);
MenuController.registerType('push', MenuPushType);
MenuController.registerType('overlay', MenuOverlayType);
