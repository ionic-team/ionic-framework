import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';

import { Backdrop } from '../backdrop/backdrop';
import { Config } from '../../config/config';
import { isTrueProperty } from '../../util/util';
import { Keyboard } from '../../util/keyboard';
import { MenuContentGesture } from  './menu-gestures';
import { MenuController } from './menu-controller';
import { MenuType } from './menu-types';
import { Platform } from '../../platform/platform';
import { GestureController } from '../../gestures/gesture-controller';


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
 *
 *
 * @usage
 *
 * To add a menu to an application, the `<ion-menu>` element should be added as a sibling to
 * the content it belongs to. A [local variable](https://angular.io/docs/ts/latest/guide/user-input.html#local-variables)
 * should be added to the content element and passed to the menu element in the `content` property.
 * This tells the menu which content it is attached to, so it knows which element to watch for
 * gestures. In the below example, `content` is using [property binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#property-binding)
 * because `mycontent` is a reference to the `<ion-nav>` element, and not a string.
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
 * import { ionicBootstrap } from 'ionic-angular';
 *
 * ionicBootstrap(MyApp, customProviders, {
 *   menuType: 'push',
 *   platforms: {
 *     ios: {
 *       menuType: 'overlay',
 *     }
 *   }
 * });
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
 *       <button ion-button menuClose ion-item detail-none>Close Menu</button>
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
    '<ion-backdrop (click)="bdClick($event)" disableScroll="false"></ion-backdrop>',
  host: {
    'role': 'navigation'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Menu {
  private _cntEle: HTMLElement;
  private _cntGesture: MenuContentGesture;
  private _type: MenuType;
  private _resizeUnreg: Function;
  private _isEnabled: boolean = true;
  private _isSwipeEnabled: boolean = true;
  private _isAnimating: boolean = false;
  private _isPers: boolean = false;
  private _init: boolean = false;


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
  onContentClick: EventListener;

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
   * @input {boolean} Whether or not the menu should be enabled. Default `true`.
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
   * @input {boolean} Whether or not swiping the menu should be enabled. Default `true`.
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
   * @input {string} Whether or not the menu should persist on child pages. Default `false`.
   */
  @Input()
  get persistent(): boolean {
    return this._isPers;
  }

  set persistent(val: boolean) {
    this._isPers = isTrueProperty(val);
  }

  /**
   * @private
   */
  @Input() maxEdgeStart: number;

  /**
   * @output {event} When the menu is being dragged open.
   */
  @Output() ionDrag: EventEmitter<number> = new EventEmitter<number>();

  /**
   * @output {event} When the menu has been opened.
   */
  @Output() ionOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * @output {event} When the menu has been closed.
   */
  @Output() ionClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** @private */
  _menuCtrl: MenuController;

  constructor(
    _menuCtrl: MenuController,
    private _elementRef: ElementRef,
    private _config: Config,
    private _platform: Platform,
    private _renderer: Renderer,
    private _keyboard: Keyboard,
    private _zone: NgZone,
    public gestureCtrl: GestureController
  ) {
    this._menuCtrl = _menuCtrl;
  }

  /**
   * @private
   */
  ngOnInit() {
    let self = this;
    self._init = true;

    let content = self.content;
    self._cntEle = (content instanceof Node) ? content : content && content.getNativeElement && content.getNativeElement();

    // requires content element
    if (!self._cntEle) {
      return console.error('Menu: must have a [content] element to listen for drag events on. Example:\n\n<ion-menu [content]="content"></ion-menu>\n\n<ion-nav #content></ion-nav>');
    }

    // normalize the "side"
    if (self.side !== 'left' && self.side !== 'right') {
      self.side = 'left';
    }
    self._renderer.setElementAttribute(self._elementRef.nativeElement, 'side', self.side);

    // normalize the "type"
    if (!self.type) {
      self.type = self._config.get('menuType');
    }
    self._renderer.setElementAttribute(self._elementRef.nativeElement, 'type', self.type);

    // add the gestures
    self._cntGesture = new MenuContentGesture(self, document.body);

    // register listeners if this menu is enabled
    // check if more than one menu is on the same side
    let hasEnabledSameSideMenu = self._menuCtrl.getMenus().some(m => {
      return m.side === self.side && m.enabled;
    });
    if (hasEnabledSameSideMenu) {
      // auto-disable if another menu on the same side is already enabled
      self._isEnabled = false;
    }
    self._setListeners();

    // create a reusable click handler on this instance, but don't assign yet
    self.onContentClick = function(ev: UIEvent) {
      if (self._isEnabled) {
        ev.preventDefault();
        ev.stopPropagation();
        self.close();
      }
    };

    self._cntEle.classList.add('menu-content');
    self._cntEle.classList.add('menu-content-' + self.type);

    // register this menu with the app's menu controller
    self._menuCtrl.register(self);
  }

  /**
   * @private
   */
  bdClick(ev: Event) {
    console.debug('backdrop clicked');
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

    // only listen/unlisten if the menu has initialized
    if (this._isEnabled && this._isSwipeEnabled && !this._cntGesture.isListening) {
      // should listen, but is not currently listening
      console.debug('menu, gesture listen', this.side);
      this._cntGesture.listen();

    } else if (this._cntGesture.isListening && (!this._isEnabled || !this._isSwipeEnabled)) {
      // should not listen, but is currently listening
      console.debug('menu, gesture unlisten', this.side);
      this._cntGesture.unlisten();
    }
  }

  /**
   * @private
   */
  private _getType(): MenuType {
    if (!this._type) {
      this._type = MenuController.create(this.type, this, this._platform);

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
    // _isPrevented is used to prevent unwanted opening/closing after swiping open/close
    // or swiping open the menu while pressing down on the MenuToggle button
    if ((shouldOpen && this.isOpen) || !this._isEnabled || this._isAnimating) {
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
    return this._isEnabled && this._isSwipeEnabled && !this._isAnimating;
  }

  /**
   * @private
   */
  swipeStart() {
    // user started swiping the menu open/close
    if (this.canSwipe()) {
      this._before();
      this._getType().setProgressStart(this.isOpen);
    }
  }

  /**
   * @private
   */
  swipeProgress(stepValue: number) {
    // user actively dragging the menu
    if (!this._isAnimating) {
      return;
    }
    this._getType().setProgessStep(stepValue);
    this.ionDrag.emit(stepValue);
  }

  /**
   * @private
   */
  swipeEnd(shouldCompleteLeft: boolean, shouldCompleteRight: boolean, stepValue: number) {
    if (!this._isAnimating) {
      return;
    }
    // user has finished dragging the menu
    let opening = !this.isOpen;
    let shouldComplete = false;
    if (opening) {
      shouldComplete = (this.side === 'right') ? shouldCompleteLeft : shouldCompleteRight;
    } else {
      shouldComplete = (this.side === 'right') ? shouldCompleteRight : shouldCompleteLeft;
    }

    this._getType().setProgressEnd(shouldComplete, stepValue, (isOpen: boolean) => {
      console.debug('menu, swipeEnd', this.side);
      this._after(isOpen);
    });
  }

  private _before() {
    // this places the menu into the correct location before it animates in
    // this css class doesn't actually kick off any animations
    this.getNativeElement().classList.add('show-menu');
    this.getBackdropElement().classList.add('show-backdrop');
    this._keyboard.close();
    this._isAnimating = true;
  }

  private _after(isOpen: boolean) {
    // keep opening/closing the menu disabled for a touch more yet
    // only add listeners/css if it's enabled and isOpen
    // and only remove listeners/css if it's not open
    // emit opened/closed events
    this.isOpen = isOpen;
    this._isAnimating = false;

    (<any>this._cntEle.classList)[isOpen ? 'add' : 'remove']('menu-content-open');

    this._cntEle.removeEventListener('click', this.onContentClick);

    if (isOpen) {
      this._cntEle.addEventListener('click', this.onContentClick);
      this.ionOpen.emit(true);

    } else {
      this.getNativeElement().classList.remove('show-menu');
      this.getBackdropElement().classList.remove('show-backdrop');
      this.ionClose.emit(true);
    }
  }

  /**
   * @private
   */
  open() {
    return this.setOpen(true);
  }

  /**
   * @private
   */
  close() {
    return this.setOpen(false);
  }

  /**
   * @private
   */
  toggle() {
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
  ngOnDestroy() {
    this._menuCtrl.unregister(this);
    this._cntGesture && this._cntGesture.destroy();
    this._type && this._type.destroy();
    this._resizeUnreg && this._resizeUnreg();

    this._cntGesture = null;
    this._type = null;
    this._cntEle = null;
    this._resizeUnreg = null;
  }

}
