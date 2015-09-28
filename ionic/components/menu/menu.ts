import {forwardRef, Directive, Host, View, EventEmitter, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/decorators';
import {IonicPlatform} from '../../platform/platform';
import * as gestures from  './menu-gestures';


/**
 * Menu is a side-menu navigation that can be dragged out or toggled to show.
 * Menu supports two display styles currently: overlay, and reveal. Overlay
 * is the tradtional Android drawer style, and Reveal is the traditional iOS
 * style. By default, Menu will adjust to the correct style for the platform.
 */
@IonicComponent({
  selector: 'ion-menu',
  properties: [
    'content',
    'dragThreshold',
    'id'
  ],
  defaultProperties: {
    'side': 'left',
    'type': 'reveal'
  },
  host: {
    'role': 'navigation'
  },
  events: ['opening']
})
@View({
  template: '<ng-content></ng-content><backdrop tappable disable-activated></backdrop>',
  directives: [forwardRef(() => MenuBackdrop)]
})
export class Menu extends Ion {

  constructor(
    app: IonicApp,
    elementRef: ElementRef,
    config: IonicConfig,
    platform: IonicPlatform
  ) {
    super(elementRef, config);
    this.app = app;
    this.platform = platform;

    this.opening = new EventEmitter('opening');
    this.isOpen = false;
    this._disableTime = 0;
  }

  onInit() {
    super.onInit();
    this._cntEle = (this.content instanceof Node) ? this.content : this.content.getNativeElement();

    if (!this._cntEle) {
      return console.error('Menu: must have a [content] element to listen for drag events on. Example:\n\n<ion-menu [content]="content"></ion-menu>\n\n<ion-content #content></ion-content>');
    }

    if (!this.id) {
      // Auto register
      this.id = 'menu';
      this.app.register(this.id, this);
    }

    this._initGesture();
    this._initType(this.type);

    this._cntEle.classList.add('menu-content');
    this._cntEle.classList.add('menu-content-' + this.type);

    let self = this;
    this.onContentClick = function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      self.close();
    };
  }

  _initGesture() {
    switch(this.side) {
      case 'right':
        this._gesture = new gestures.RightMenuGesture(this);
        break;

      case 'left':
        this._gesture = new gestures.LeftMenuGesture(this);
        break;
    }
  }

  _initType(type) {
    type = type && type.trim().toLowerCase() || FALLBACK_MENU_TYPE;

    let menuTypeCls = menuTypes[type];

    if (!menuTypeCls) {
      type = FALLBACK_MENU_TYPE;
      menuTypeCls = menuTypes[type];
    }

    this._type = new menuTypeCls(this);
    this.type = type;
  }

  /**
   * Sets the state of the Menu to open or not.
   * @param {boolean} isOpen  If the Menu is open or not.
   * @return {Promise} TODO
   */
  setOpen(shouldOpen) {
    // _isDisabled is used to prevent unwanted opening/closing after swiping open/close
    // or swiping open the menu while pressing down on the menu-toggle button
    if (shouldOpen === this.isOpen || this._isDisabled()) {
      return Promise.resolve();
    }

    this._before();

    return this._type.setOpen(shouldOpen).then(() => {
      this._after(shouldOpen);
    });
  }

  setProgressStart() {
    // user started swiping the menu open/close
    if (this._isDisabled()) return;

    this._before();

    this._type.setProgressStart(this.isOpen);
  }

  setProgess(value) {
    // user actively dragging the menu
    this._disable();
    this.app.setTransitioning(true);
    this._type.setProgess(value);
  }

  setProgressEnd(shouldComplete) {
    // user has finished dragging the menu
    this._disable();
    this.app.setTransitioning(true);
    this._type.setProgressEnd(shouldComplete).then(isOpen => {
      this._after(isOpen);
    });
  }

  _before() {
    // this places the menu into the correct location before it animates in
    // this css class doesn't actually kick off any animations
    this.getNativeElement().classList.add('show-menu');
    this.getBackdropElement().classList.add('show-backdrop');

    this._disable();
    this.app.setTransitioning(true);
  }

  _after(isOpen) {
    // keep opening/closing the menu disabled for a touch more yet
    this._disable();
    this.app.setTransitioning(false);

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

  _disable() {
    // used to prevent unwanted opening/closing after swiping open/close
    // or swiping open the menu while pressing down on the menu-toggle
    this._disableTime = Date.now() + 20;
  }

  _isDisabled() {
    return this._disableTime > Date.now();
  }

  /**
   * TODO
   * @return {TODO} TODO
   */
  open() {
    return this.setOpen(true);
  }

  /**
   * TODO
   * @return {TODO} TODO
   */
  close() {
    return this.setOpen(false);
  }

  /**
   * TODO
   * @return {TODO} TODO
   */
  toggle() {
    return this.setOpen(!this.isOpen);
  }

  /**
   * TODO
   * @return {Element} The Menu element.
   */
  getMenuElement() {
    return this.getNativeElement();
  }

  /**
   * TODO
   * @return {Element} The Menu's associated content element.
   */
  getContentElement() {
    return this._cntEle;
  }

  /**
   * TODO
   * @return {Element} The Menu's backdrop element.
   */
  getBackdropElement() {
    return this.backdrop.elementRef.nativeElement;
  }

  static register(name, cls) {
    menuTypes[name] = cls;
  }

  onDestroy() {
    this.app.unregister(this.id);
    this._gesture && this._gesture.destroy();
    this._type && this._type.onDestroy();
    this._cntEle = null;
  }

}

let menuTypes = {};
const FALLBACK_MENU_TYPE = 'reveal';


/**
 * TODO
 */
@Directive({
  selector: 'backdrop',
  host: {
    '(click)': 'clicked($event)'
  }
})
class MenuBackdrop {
  /**
   * TODO
   * @param {Menu} menu  TODO
   */
  constructor(@Host() menu: Menu, elementRef: ElementRef) {
    this.menu = menu;
    this.elementRef = elementRef;
    menu.backdrop = this;
  }

  /**
   * TODO
   * @param {TODO} event  TODO
   */
  clicked(ev) {
    console.debug('backdrop clicked')
    ev.preventDefault();
    ev.stopPropagation();
    this.menu.close();
  }
}


