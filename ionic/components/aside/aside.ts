import {forwardRef, Component, Host, View, EventEmitter, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import * as types from './extensions/types'
import * as gestures from  './extensions/gestures'
import * as util from 'ionic/util/util'
import {dom} from 'ionic/util'

/**
 * TODO (?) add docs about how to have a root aside and a nested aside, then hide the root one
 */
@IonicComponent({
  selector: 'ion-aside',
  properties: [
    'content',
    'dragThreshold'
  ],
  defaultProperties: {
    'side': 'left',
    'type': 'reveal'
  },
  delegates: {
    gesture: [
      //[instance => instance.side == 'top', gestures.TopAsideGesture],
      //[instance => instance.side == 'bottom', gestures.BottomAsideGesture],
      [instance => instance.side == 'right', gestures.RightAsideGesture],
      [instance => instance.side == 'left', gestures.LeftAsideGesture],
    ],
    type: [
      [instance => instance.type == 'overlay', types.AsideTypeOverlay],
      [instance => instance.type == 'reveal', types.AsideTypeReveal],
      //[instance => instance.type == 'push', types.AsideTypePush],
    ]
  },
  events: ['opening']
})
@View({
  template: '<ng-content></ng-content><ion-aside-backdrop></ion-aside-backdrop>',
  directives: [forwardRef(() => AsideBackdrop)]
})
export class Aside extends Ion {
  /**
  * TODO
  * @param {IonicApp} app  TODO
  * @param {ElementRef} elementRef  Reference to the element.
  */
  constructor(app: IonicApp, elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);

    this.app = app;

    this.opening = new EventEmitter('opening');

    //this.animation = new Animation(element.querySelector('backdrop'));

    let finishChanging = util.debounce(() => {
      console.log('FINISH');
      this.setChanging(false);
    });

    // TODO: Use Animation Class
    this.getNativeElement().addEventListener('transitionend', ev => {
      //this.setChanging(false)
      clearTimeout(this.setChangeTimeout);
      this.setChangeTimeout = setInterval(finishChanging, 500);
    })
  }

  /**
   * TODO
   */
  onDestroy() {
    app.unregister(this);
  }

  /**
   * TODO
   */
  onInit() {
    super.onInit();
    this.contentElement = (this.content instanceof Node) ? this.content : this.content.getNativeElement();

    this.gestureDelegate = this.getDelegate('gesture');
    this.typeDelegate = this.getDelegate('type');
  }

  /**
   * TODO
   * @return {Element} The Aside's content element.
   */
  getContentElement() {
    return this.contentElement;
  }

  /**
   * TODO
   * @param {TODO} v  TODO
   */
  setOpenAmt(v) {
    this.opening.next(v);
  }

  /**
   * TODO
   * @param {boolean} willOpen  TODO
   */
  setDoneTransforming(willOpen) {
    this.typeDelegate.setDoneTransforming(willOpen);
  }

  /**
   * TODO
   * @param {TODO} transform  TODO
   */
  setTransform(transform) {
    this.typeDelegate.setTransform(transform)
  }

  /**
   * TODO
   * @param {boolean} isSliding  TODO
   */
  setSliding(isSliding) {
    if (isSliding !== this.isSliding) {
      this.typeDelegate.setSliding(isSliding)
    }
  }

  /**
   * TODO
   * @param {boolean} isChanging  TODO
   */
  setChanging(isChanging) {
    console.log('Set changing', isChanging, this.isChanging);

    // Stop any last changing end operations
    clearTimeout(this.setChangeTimeout);

    if (isChanging !== this.isChanging) {
      this.isChanging = isChanging
      this.getNativeElement().classList[isChanging ? 'add' : 'remove']('changing');

    }
  }

  /**
   * Sets the state of the Aside to open or not.
   * @param {boolean} isOpen  If the Aside is open or not.
   * @return {Promise} TODO
   */
  setOpen(isOpen) {
    if (isOpen !== this.isOpen) {
      this.isOpen = isOpen;
      this.setChanging(true);

      // Set full or closed amount
      this.setOpenAmt(isOpen ? 1 : 0);

      return dom.rafPromise().then(() => {
        this.typeDelegate.setOpen(isOpen)
      })
    }
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

}

/**
 * TODO
 */
@Component({
  selector: 'ion-aside-backdrop',
  host: {
    '[style.width]': 'width',
    '[style.height]': 'height',
    '[style.backgroundColor]': 'backgroundColor',
    '(click)': 'clicked($event)'
  }
})
@View({
  template: ''
})
export class AsideBackdrop extends Ion {
  /**
   * TODO
   * @param {ElementReg} elementRef  TODO
   * @param {IonicConfig} config  TODO
   * @param {Aside} aside  TODO
   */
  constructor(elementRef: ElementRef, config: IonicConfig, @Host() aside: Aside) {
    super(elementRef, config);

    aside.backdrop = this;

    this.aside = aside;

    this.backgroundColor = 'rgba(0,0,0,0)';
  }

  /**
   * TODO
   */
  onInit() {
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    this.width = ww + 'px';
    this.height = wh + 'px';
  }

  /**
   * TODO
   * @param {TODO} event  TODO
   */
  clicked(event) {
    this.aside.close();
  }
}
