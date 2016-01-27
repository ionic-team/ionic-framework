import {Component, forwardRef, Directive, Host, EventEmitter, ElementRef, NgZone, Input, Output, Renderer} from 'angular2/core';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Platform} from '../../platform/platform';
import {Keyboard} from '../../util/keyboard';
import * as gestures from  './menu-gestures';
import {Gesture} from '../../gestures/gesture';
import {MenuType} from './menu-types';


/**
 * @name Menu
 * @description
 * _For basic Menu usage, see the [Menu section](../../../../components/#menus)
 * of the Component docs._
 *
 * Menu is a side-menu navigation that can be dragged out or toggled to show.
 *
 * @usage
 * In order to use Menu, you must specify a [reference](https://angular.io/docs/ts/latest/guide/user-input.html#local-variables)
 * to the content element that Menu should listen on for drag events, using the `content` property:
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
 * By default, Menus are on the left, but this can be overriden with the `side`
 * property:
 * ```html
 * <ion-menu [content]="mycontent" side="right"></ion-menu>
 * ```
 *
 * Menus can optionally be given an `id` attribute which allows the app to
 * to get ahold of menu references. If no `id` is given then the menu
 * automatically receives an `id` created from the side it is on, such as
 * `leftMenu` or `rightMenu`. When using more than one menu it is always
 * recommended to give each menu a unique `id`. Additionally menuToggle and
 * menuClose directives should be given menu id values of their respective
 * menu.
 *
 * Menu supports two display styles: overlay, and reveal. Overlay
 * is the traditional Android drawer style, and Reveal is the traditional iOS
 * style. By default, Menu will adjust to the correct style for the platform,
 * but this can be overriden using the `type` property:
 * ```html
 * <ion-menu [content]="mycontent" type="overlay"></ion-menu>
 * ```
 *
 * To programatically interact with the menu, you first get the menu component.
 *
 * ```ts
 * @Page({
 * `<ion-menu [content]="mycontent" id="leftMenu"></ion-menu>
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>`
 * )}
 * export class MyClass{
 *  constructor(app: IonicApp){
 *    this.app = app;
 *    this.menu;
 *  }
 *
 *  // Wait until the page is ready
 *  ngAfterViewInit(){
 *    this.menu = this.app.getComponent('leftMenu');
 *  }
 *
 *  // Open the menu programatically
 *  openMenu(){
 *    this.menu.open();
 *  }
 *
 * }
 * ```
 *
 * If you want to use any of the APIs down below, make sure to grabe the menu component by it's ID
 *
 * @demo /docs/v2/demos/menu/
 *
 * @see {@link /docs/v2/components#menus Menu Component Docs}
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 * @see {@link ../../nav/Nav Nav API Docs}
 *
 */
@Component({
  selector: 'ion-menu',
  host: {
    'role': 'navigation',
    '[attr.side]': 'side',
    '[attr.type]': 'type',
    '[attr.swipeEnabled]': 'swipeEnabled'
  },
  template: '<ng-content></ng-content><div tappable disable-activated class="backdrop"></div>',
  directives: [forwardRef(() => MenuBackdrop)]
})
export class Menu extends Ion {
  private _preventTime: number = 0;
  private _cntEle: HTMLElement;
  private _gesture: Gesture;
  private _targetGesture: Gesture;
  private _type: MenuType;

  isOpen: boolean = false;
  isEnabled: boolean = true;
  isSwipeEnabled: boolean = true;
  backdrop: MenuBackdrop;
  onContentClick: EventListener;

  @Input() content: any;
  @Input() id: string;
  @Input() side: string;
  @Input() type: string;
  @Input() swipeEnabled: string;
  @Input() maxEdgeStart;

  @Output() opening: EventEmitter<any> = new EventEmitter();

  constructor(
    private _elementRef: ElementRef,
    private _config: Config,
    private _app: IonicApp,
    private _platform: Platform,
    private _renderer: Renderer,
    private _keyboard: Keyboard,
    private _zone: NgZone
  ) {
    super(_elementRef);
  }

  /**
   * @private
   */
  ngOnInit() {
    let self = this;
    let content = self.content;
    self._cntEle = (content instanceof Node) ? content : content && content.getNativeElement && content.getNativeElement();

    if (!self._cntEle) {
      return console.error('Menu: must have a [content] element to listen for drag events on. Example:\n\n<ion-menu [content]="content"></ion-menu>\n\n<ion-nav #content></ion-nav>');
    }

    if (self.side !== 'left' && self.side !== 'right') {
      self.side = 'left';
    }
    self._renderer.setElementAttribute(self._elementRef.nativeElement, 'side', self.side);

    if (self.swipeEnabled === 'false') {
      self.isSwipeEnabled = false;
    }

    if (!self.id) {
      // Auto register
      self.id = self.side + 'Menu';
      if (self._app.getComponent(self.id)) {
        // id already exists, make sure this one is unique
        self.id += (++menuIds);
      }
      self._app.register(self.id, self);
    }

    self._initGesture();
    self._initType(self.type);

    self._cntEle.classList.add('menu-content');
    self._cntEle.classList.add('menu-content-' + self.type);

    self.onContentClick = function(ev: UIEvent) {
      if (self.isEnabled) {
        ev.preventDefault();
        ev.stopPropagation();
        self.close();
      }
    };
  }

  /**
   * @private
   */
  _initGesture() {
    this._zone.runOutsideAngular(() => {
      switch(this.side) {
        case 'right':
          this._gesture = new gestures.RightMenuGesture(this);
          break;

        case 'left':
          this._gesture = new gestures.LeftMenuGesture(this);
          break;
      }
      this._targetGesture = new gestures.TargetGesture(this);
    });
  }

  /**
   * @private
   */
  _initType(type) {
    type = type && type.trim().toLowerCase();
    if (!type) {
      type = this._config.get('menuType');
    }
    this.type = type;
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'menuType', type);
  }

  /**
   * @private
   */
  _getType() {
    if (!this._type) {
      this._type = new menuTypes[this.type](this);

      if (this._config.get('animate') === false) {
        this._type.open.duration(33);
        this._type.close.duration(33);
      }
    }
    return this._type;
  }

  /**
   * Sets the state of the Menu to open or not.
   * @param {boolean} isOpen  If the Menu is open or not.
   * @return {Promise} returns a promise once set
   */
  setOpen(shouldOpen) {
    // _isPrevented is used to prevent unwanted opening/closing after swiping open/close
    // or swiping open the menu while pressing down on the menuToggle button
    if (shouldOpen === this.isOpen || this._isPrevented()) {
      return Promise.resolve();
    }

    this._before();

    return this._getType().setOpen(shouldOpen).then(() => {
      this._after(shouldOpen);
    });
  }

  /**
   * @private
   */
  setProgressStart() {
    // user started swiping the menu open/close
    if (this._isPrevented() || !this.isEnabled || !this.isSwipeEnabled) return;

    this._before();

    this._getType().setProgressStart(this.isOpen);
  }

  /**
   * @private
   */
  setProgess(value) {
    // user actively dragging the menu
    if (this.isEnabled && this.isSwipeEnabled) {
      this._prevent();
      this._getType().setProgess(value);
      this.opening.next(value);
    }
  }

  /**
   * @private
   */
  setProgressEnd(shouldComplete) {
    // user has finished dragging the menu
    if (this.isEnabled && this.isSwipeEnabled) {
      this._prevent();
      this._getType().setProgressEnd(shouldComplete).then(isOpen => {
        this._after(isOpen);
      });
    }
  }

  /**
   * @private
   */
  _before() {
    // this places the menu into the correct location before it animates in
    // this css class doesn't actually kick off any animations
    if (this.isEnabled) {
      this.getNativeElement().classList.add('show-menu');
      this.getBackdropElement().classList.add('show-backdrop');

      this._prevent();
      this._keyboard.close();
    }
  }

  /**
   * @private
   */
  _after(isOpen) {
    // keep opening/closing the menu disabled for a touch more yet
    // only add listeners/css if it's enabled and isOpen
    // and only remove listeners/css if it's not open
    if ((this.isEnabled && isOpen) || !isOpen) {
      this._prevent();

      this.isOpen = isOpen;

      this._cntEle.classList[isOpen ? 'add' : 'remove']('menu-content-open');

      this._cntEle.removeEventListener('click', this.onContentClick);

      if (isOpen) {
        this._cntEle.addEventListener('click', this.onContentClick);

      } else {
        this.getNativeElement().classList.remove('show-menu');
        this.getBackdropElement().classList.remove('show-backdrop');
      }
    }
  }

  /**
   * @private
   */
  _prevent() {
    // used to prevent unwanted opening/closing after swiping open/close
    // or swiping open the menu while pressing down on the menuToggle
    this._preventTime = Date.now() + 20;
  }

  /**
   * @private
   */
  _isPrevented() {
    return this._preventTime > Date.now();
  }

  /**
   * Progamatically open the Menu
   * @return {Promise} returns a promise when the menu is fully opened
   */
  open() {
    return this.setOpen(true);
  }

  /**
   * Progamatically close the Menu
   * @return {Promise} returns a promise when the menu is fully closed
   */
  close() {
    return this.setOpen(false);
  }

  /**
   * Toggle the menu. If it's closed, it will open, and if opened, it will close
   * @return {Promise} returns a promise when the menu has been toggled
   */
  toggle() {
    return this.setOpen(!this.isOpen);
  }

  /**
   * Used to enable or disable a menu. For example, there could be multiple
   * left menus, but only one of them should be able to be dragged open.
   * @param {boolean} shouldEnable  True if it should be enabled, false if not.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  enable(shouldEnable) {
    this.isEnabled = shouldEnable;
    if (!shouldEnable) {
      this.close();
    }
    return this;
  }

  /**
   * Used to enable or disable the ability to swipe open the menu.
   * @param {boolean} shouldEnable  True if it should be swipe-able, false if not.
   * @return {Menu}  Returns the instance of the menu, which is useful for chaining.
   */
  swipeEnable(shouldEnable) {
    this.isSwipeEnabled = shouldEnable;
    return this;
  }

  /**
   * @private
   */
  getMenuElement() {
    return this.getNativeElement();
  }

  /**
   * @private
   */
  getContentElement() {
    return this._cntEle;
  }

  /**
   * @private
   */
  getBackdropElement() {
    return this.backdrop.elementRef.nativeElement;
  }

  /**
   * @private
   */
  static register(name: string, cls: new(...args: any[]) => MenuType) {
    menuTypes[name] = cls;
  }
  //static register(name:string , cls: typeof MenuType) {

  /**
   * @private
   */
  ngOnDestroy() {
    this._app.unregister(this.id);
    this._gesture && this._gesture.destroy();
    this._targetGesture && this._targetGesture.destroy();
    this._type && this._type.ngOnDestroy();
    this._cntEle = null;
  }

  static getById(app, menuId) {
    let menu = null;

    if (menuId) {
      menu = app.getComponent(menuId);
      if (!menu) {
        console.error('Menu with id "' + menuId + '" cannot be found for menuToggle');
        return;
      }

    } else {
      menu = app.getComponent('leftMenu');
      if (!menu) {
        menu = app.getComponent('rightMenu');
      }
      if (!menu) {
        console.error('Menu with id "leftMenu" or "rightMenu" cannot be found for menuToggle');
        return;
      }
    }

    return menu;
  }

}

let menuTypes:{ [name: string]: new(...args: any[]) => MenuType } = {};
let menuIds:number = 0;


/**
 * @private
 */
@Directive({
  selector: '.backdrop',
  host: {
    '(click)': 'clicked($event)'
  }
})
export class MenuBackdrop {

  constructor(@Host() private menu: Menu, public elementRef: ElementRef) {
    menu.backdrop = this;
  }

  /**
   * @private
   */
  clicked(ev) {
    console.debug('backdrop clicked')
    ev.preventDefault();
    ev.stopPropagation();
    this.menu.close();
  }
}
