import {forwardRef, Directive, Host, View, EventEmitter, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import * as gestures from  './extensions/gestures';


/**
 * Aside is a side-menu navigation that can be dragged out or toggled to show. Aside supports two
 * display styles currently: overlay, and reveal. Overlay is the tradtional Android drawer style, and Reveal
 * is the traditional iOS style. By default, Aside will adjust to the correct style for the platform.
 */
@IonicComponent({
  selector: 'ion-aside',
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
  template: '<ng-content></ng-content><backdrop tappable></backdrop>',
  directives: [forwardRef(() => AsideBackdrop)]
})
export class Aside extends Ion {

  constructor(app: IonicApp, elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);

    this.app = app;
    this.opening = new EventEmitter('opening');
    this.isOpen = false;
    this._disableTime = 0;
  }

  onInit() {
    super.onInit();
    this.contentElement = (this.content instanceof Node) ? this.content : this.content.getNativeElement();

    if (!this.contentElement) {
      return console.error('Aside: must have a [content] element to listen for drag events on. Example:\n\n<ion-aside [content]="content"></ion-aside>\n\n<ion-content #content></ion-content>');
    }

    if (!this.id) {
      // Auto register
      this.app.register('menu', this);
    }

    this._initGesture();
    this._initType(this.type);

    this.contentElement.classList.add('aside-content');
    this.contentElement.classList.add('aside-content-' + this.type);

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
        this._gesture = new gestures.RightAsideGesture(this);
        break;

      case 'left':
        this._gesture = new gestures.LeftAsideGesture(this);
        break;
    }
  }

  _initType(type) {
    type = type && type.trim().toLowerCase() || FALLBACK_ASIDE_TYPE;

    let asideTypeCls = asideTypes[type];

    if (!asideTypeCls) {
      type = FALLBACK_ASIDE_TYPE;
      asideTypeCls = asideTypes[type];
    }

    this._type = new asideTypeCls(this);
    this.type = type;
  }

  /**
   * Sets the state of the Aside to open or not.
   * @param {boolean} isOpen  If the Aside is open or not.
   * @return {Promise} TODO
   */
  setOpen(shouldOpen) {
    // _isDisabled is used to prevent unwanted opening/closing after swiping open/close
    // or swiping open the menu while pressing down on the aside-toggle button
    if (shouldOpen === this.isOpen || this._isDisabled()) {
      return Promise.resolve();
    }

    this._before();

    return this._type.setOpen(shouldOpen).then(() => {
      this._after(shouldOpen);
    });
  }

  setProgressStart() {
    // user started swiping the aside open/close
    if (this._isDisabled()) return;

    this._before();

    this._type.setProgressStart(this.isOpen);
  }

  setProgess(value) {
    // user actively dragging the menu
    this._disable();
    this._type.setProgess(value);
  }

  setProgressFinish(shouldComplete) {
    // user has finished dragging the menu
    this._disable();
    this._type.setProgressFinish(shouldComplete).then(isOpen => {
      this._after(isOpen);
    });
  }

  _before() {
    // this places the aside into the correct location before it animates in
    // this css class doesn't actually kick off any animations
    this.getNativeElement().classList.add('show-aside');
    this.getBackdropElement().classList.add('show-backdrop');

    this._disable();
    this.app.setTransitioning(true);
  }

  _after(isOpen) {
    this._disable();
    this.isOpen = isOpen;

    this.contentElement.classList[isOpen ? 'add' : 'remove']('aside-content-open');

    this.contentElement.removeEventListener('click', this.onContentClick);
    if (isOpen) {
      this.contentElement.addEventListener('click', this.onContentClick);

    } else {
      this.getNativeElement().classList.remove('show-aside');
      this.getBackdropElement().classList.remove('show-backdrop');
    }

    this.app.setTransitioning(false);
  }

  _disable() {
    // used to prevent unwanted opening/closing after swiping open/close
    // or swiping open the menu while pressing down on the aside-toggle
    this._disableTime = Date.now();
  }

  _isDisabled() {
    return this._disableTime + 300 > Date.now();
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
   * @return {Element} The Aside element.
   */
  getAsideElement() {
    return this.getNativeElement();
  }

  /**
   * TODO
   * @return {Element} The Aside's associated content element.
   */
  getContentElement() {
    return this.contentElement;
  }

  /**
   * TODO
   * @return {Element} The Aside's associated content element.
   */
  getBackdropElement() {
    return this.backdrop.elementRef.nativeElement;
  }

  static register(name, cls) {
    asideTypes[name] = cls;
  }

  onDestroy() {
    this.app.unregister(this);
    this._type && this._type.onDestroy();
    this.contentElement = null;
  }

}

let asideTypes = {};
const FALLBACK_ASIDE_TYPE = 'reveal';


/**
 * TODO
 */
@Directive({
  selector: 'backdrop',
  host: {
    '(click)': 'clicked($event)'
  }
})
class AsideBackdrop {
  /**
   * TODO
   * @param {Aside} aside  TODO
   */
  constructor(@Host() aside: Aside, elementRef: ElementRef) {
    this.aside = aside;
    this.elementRef = elementRef;
    aside.backdrop = this;
  }

  /**
   * TODO
   * @param {TODO} event  TODO
   */
  clicked(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.aside.close();
  }
}


