import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';

import { App } from '../app/app';
import { Backdrop } from '../backdrop/backdrop';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { DomController } from '../../platform/dom-controller';
import { BlockerDelegate, GESTURE_GO_BACK_SWIPE, GestureController,  } from '../../gestures/gesture-controller';
import { Side, assert, isRightSide, isTrueProperty } from '../../util/util';
import { Keyboard } from '../../platform/keyboard';
import { MenuContentGesture } from  './menu-gestures';
import { Menu as MenuInterface } from '../app/menu-interface';
import { MenuController } from '../app/menu-controller';
import { MenuType } from './menu-types';
import { Nav } from '../nav/nav';
import { Platform } from '../../platform/platform';
import { UIEventManager } from '../../gestures/ui-event-manager';
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
  providers: [{provide: RootNode, useExisting: forwardRef(() => Menu) }]
})
export class Menu implements RootNode, MenuInterface, OnInit, OnDestroy {

  private _cntEle: HTMLElement;
  private _gesture: MenuContentGesture;
  private _type: MenuType;
  private _isEnabled: boolean;
  private _isSwipeEnabled: boolean = true;
  private _isAnimating: boolean = false;
  private _isPersistent: boolean = false;
  private _init: boolean = false;
  private _events: UIEventManager;
  private _gestureBlocker: BlockerDelegate;
  private _isPane: boolean = false;
  private _side: Side;

  /**
   * @hidden
   */
  isOpen: boolean = false;

  /**
   * @hidden
   */
  isRightSide: boolean = false;

  /**
   * @hidden
   */
  @ViewChild(Backdrop) backdrop: Backdrop;

  /**
   * @hidden
   */
  @ContentChild(Content) menuContent: Content;

  /**
   * @hidden
   */
  @ContentChild(Nav) menuNav: Nav;

  /**
   * @input {any} A reference to the content element the menu should use.
   */
  @Input() content: any;

  /**
   * @input {string} An id for the menu.
   */
  @Input() id: string;

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
    const isEnabled = isTrueProperty(val);
    this.enable(isEnabled);
  }

  /**
   * @input {string} Which side of the view the menu should be placed. Default `"left"`.
   */
  @Input()
  get side(): Side {
    return this._side;
  }

  set side(val: Side) {
    this.isRightSide = isRightSide(val, this._plt.isRTL);
    if (this.isRightSide) {
      this._side = 'right';
    } else {
      this._side = 'left';
    }
  }

  /**
   * @input {boolean} If true, swiping the menu is enabled. Default `true`.
   */
  @Input()
  get swipeEnabled(): boolean {
    return this._isSwipeEnabled;
  }

  set swipeEnabled(val: boolean) {
    const isEnabled = isTrueProperty(val);
    this.swipeEnable(isEnabled);
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
   * @hidden
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
    private _gestureCtrl: GestureController,
    private _domCtrl: DomController,
    private _app: App,
  ) {
    this._events = new UIEventManager(_plt);
    this._gestureBlocker = _gestureCtrl.createBlocker({
      disable: [GESTURE_GO_BACK_SWIPE]
    });
    this.side = 'start';
  }

  /**
   * @hidden
   */
  ngOnInit() {
    this._init = true;

    let content = this.content;
    this._cntEle = (content instanceof Node) ? content : content && content.getNativeElement && content.getNativeElement();

    // requires content element
    if (!this._cntEle) {
      return console.error('Menu: must have a [content] element to listen for drag events on. Example:\n\n<ion-menu [content]="content"></ion-menu>\n\n<ion-nav #content></ion-nav>');
    }

    this.setElementAttribute('side', this._side);

    // normalize the "type"
    if (!this.type) {
      this.type = this._config.get('menuType');
    }
    this.setElementAttribute('type', this.type);

    // add the gestures
    this._gesture = new MenuContentGesture(this._plt, this, this._gestureCtrl, this._domCtrl);

    // add menu's content classes
    this._cntEle.classList.add('menu-content');
    this._cntEle.classList.add('menu-content-' + this.type);

    let isEnabled = this._isEnabled;
    if (isEnabled === true || typeof isEnabled === 'undefined') {
      // check if more than one menu is on the same side
      isEnabled = !this._menuCtrl.getMenus().some(m => {
        return m.side === this.side && m.enabled;
      });
    }
    // register this menu with the app's menu controller
    this._menuCtrl._register(this);

    // mask it as enabled / disabled
    this.enable(isEnabled);
  }

  /**
   * @hidden
   */
  onBackdropClick(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this._menuCtrl.close();
  }

  /**
   * @hidden
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
   * @hidden
   */
  setOpen(shouldOpen: boolean, animated: boolean = true): Promise<boolean> {
    // If the menu is disabled or it is currenly being animated, let's do nothing
    if ((shouldOpen === this.isOpen) || !this._canOpen() || this._isAnimating) {
      return Promise.resolve(this.isOpen);
    }
    return new Promise(resolve => {
      this._before();
      this._getType().setOpen(shouldOpen, animated, () => {
        this._after(shouldOpen);
        resolve(this.isOpen);
      });
    });
  }

  _forceClosing() {
    assert(this.isOpen, 'menu cannot be closed');
    this._isAnimating = true;
    this._getType().setOpen(false, false, () => {
      this._after(false);
    });
  }

  /**
   * @hidden
   */
  canSwipe(): boolean {
    return this._isSwipeEnabled &&
      !this._isAnimating &&
      this._canOpen() &&
      this._app.isEnabled();
  }

  /**
   * @hidden
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
    const isRightSide = this.isRightSide;
    const isRTL = this._plt.isRTL;
    const opening = !this.isOpen;
    const shouldComplete = (opening)
    ? (isRightSide !== isRTL) ? shouldCompleteLeft : shouldCompleteRight
    : (isRightSide !== isRTL) ? shouldCompleteRight : shouldCompleteLeft;

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
    this.resize();
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

    this._events.unlistenAll();
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
   * @hidden
   */
  open(): Promise<boolean> {
    return this.setOpen(true);
  }

  /**
   * @hidden
   */
  close(): Promise<boolean> {
    return this.setOpen(false);
  }

  /**
   * @hidden
   */
  resize() {
    const content: Content | Nav = this.menuContent
      ? this.menuContent
      : this.menuNav;
    content && content.resize();
  }

  /**
   * @hidden
   */
  toggle(): Promise<boolean> {
    return this.setOpen(!this.isOpen);
  }

  _canOpen(): boolean {
    return this._isEnabled && !this._isPane;
  }

  /**
   * @hidden
   */
  _updateState() {
    const canOpen = this._canOpen();

    // Close menu inmediately
    if (!canOpen && this.isOpen) {
      assert(this._init, 'menu must be initialized');
      // close if this menu is open, and should not be enabled
      this._forceClosing();
    }

    if (this._isEnabled && this._menuCtrl) {
      this._menuCtrl._setActiveMenu(this);
    }

    if (!this._init) {
      return;
    }

    const gesture = this._gesture;
    // only listen/unlisten if the menu has initialized
    if (canOpen && this._isSwipeEnabled && !gesture.isListening) {
      // should listen, but is not currently listening
      console.debug('menu, gesture listen', this.side);
      gesture.listen();

    } else if (gesture.isListening && (!canOpen || !this._isSwipeEnabled)) {
      // should not listen, but is currently listening
      console.debug('menu, gesture unlisten', this.side);
      gesture.unlisten();
    }

    if (this.isOpen || (this._isPane && this._isEnabled)) {
      this.resize();
    }
    assert(!this._isAnimating, 'can not be animating');
  }

  /**
   * @hidden
   */
  enable(shouldEnable: boolean): Menu {
    this._isEnabled = shouldEnable;
    this.setElementClass('menu-enabled', shouldEnable);
    this._updateState();
    return this;
  }

  /**
   * @internal
   */
  initPane(): boolean {
    return false;
  }

  /**
   * @internal
   */
  paneChanged(isPane: boolean) {
    this._isPane = isPane;
    this._updateState();
  }

  /**
   * @hidden
   */
  swipeEnable(shouldEnable: boolean): Menu {
    this._isSwipeEnabled = shouldEnable;
    this._updateState();
    return this;
  }

  /**
   * @hidden
   */
  getNativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /**
   * @hidden
   */
  getMenuElement(): HTMLElement {
    return <HTMLElement>this.getNativeElement().querySelector('.menu-inner');
  }

  /**
   * @hidden
   */
  getContentElement(): HTMLElement {
    return this._cntEle;
  }

  /**
   * @hidden
   */
  getBackdropElement(): HTMLElement {
    return this.backdrop.getNativeElement();
  }

  /**
   * @hidden
   */
  width(): number {
    return this.getMenuElement().offsetWidth;
  }

  /**
   * @hidden
   */
  getMenuController(): MenuController {
    return this._menuCtrl;
  }

  /**
   * @hidden
   */
  setElementClass(className: string, add: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
  }

  /**
   * @hidden
   */
  setElementAttribute(attributeName: string, value: string) {
    this._renderer.setElementAttribute(this._elementRef.nativeElement, attributeName, value);
  }

  /**
   * @hidden
   */
  getElementRef(): ElementRef {
    return this._elementRef;
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    this._menuCtrl._unregister(this);
    this._events.destroy();
    this._gesture && this._gesture.destroy();
    this._type && this._type.destroy();

    this._gesture = null;
    this._type = null;
    this._cntEle = null;
  }

}
