import {forwardRef, Component, Host, View, EventEmitter, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import * as types from './extensions/types'
import * as gestures from  './extensions/gestures'
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
      [instance => instance.type == 'push', types.AsideTypePush],
    ]
  },
  events: ['opening']
})
@View({
  template: '<ng-content></ng-content><ion-aside-backdrop></ion-aside-backdrop>',
  directives: [forwardRef(() => AsideBackdrop)]
})
export class Aside extends Ion {

  constructor(app: IonicApp, elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);

    this.app = app;

    // TODO(mlynch): We need to build out the ref system
    app.register('menu', this);

    this.opening = new EventEmitter('opening');

    // TODO: Use Animation Class
    this.getNativeElement().addEventListener('transitionend', ev => {
      this.setChanging(false)
    })
  }

  onDestroy() {
    app.unregister(this);
  }

  onInit() {
    super.onInit();
    this.contentElement = (this.content instanceof Node) ? this.content : this.content.getNativeElement();

    this.gestureDelegate = this.getDelegate('gesture');
    this.typeDelegate = this.getDelegate('type');
  }

  getContentElement() {
    return this.contentElement;
  }

  setOpenAmt(v) {
    this.opening.next(v);
  }

  setDoneTransforming(willOpen) {
    this.typeDelegate.setDoneTransforming(willOpen);
  }

  setTransform(transform) {
    this.typeDelegate.setTransform(transform)
  }

  setSliding(isSliding) {
    if (isSliding !== this.isSliding) {
      this.typeDelegate.setSliding(isSliding)
    }
  }

  setChanging(isChanging) {
    if (isChanging !== this.isChanging) {
      this.isChanging = isChanging
      this.getNativeElement().classList[isChanging ? 'add' : 'remove']('changing');
    }
  }

  setOpen(isOpen) {
    if (isOpen !== this.isOpen) {
      this.isOpen = isOpen
      this.setChanging(true)

      // Set full or closed amount
      this.setOpenAmt(isOpen ? 1 : 0);

      return dom.rafPromise().then(() => {
        this.typeDelegate.setOpen(isOpen)
      })
    }
  }

  open() {
    return this.setOpen(true);
  }

  close() {
    return this.setOpen(false);
  }

  toggle() {
    return this.setOpen(!this.isOpen);
  }

}


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
  constructor(elementRef: ElementRef, config: IonicConfig, @Host() aside: Aside) {
    super(elementRef, config);

    aside.backdrop = this;

    this.aside = aside;

    this.backgroundColor = 'rgba(0,0,0,0)';
  }
  onInit() {
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    this.width = ww + 'px';
    this.height = wh + 'px';
  }
  clicked(event) {
    this.aside.close();
  }
}
