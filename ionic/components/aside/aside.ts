import {View, EventEmitter, ElementRef, onInit} from 'angular2/angular2';

import {Ion} from '../ion';
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
      [instance => instance.side == 'top', gestures.TopAsideGesture],
      [instance => instance.side == 'bottom', gestures.BottomAsideGesture],
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
  template: '<content></content>'
})
export class Aside extends Ion {

  constructor(elementRef: ElementRef, ionicConfig: IonicConfig) {
    super(elementRef, ionicConfig);

    this.opening = new EventEmitter('opening');

    // TODO: Use Animation Class
    this.getNativeElement().addEventListener('transitionend', ev => {
      this.setChanging(false)
    })
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
    console.log('SET OPEN', isOpen);
    console.trace();
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
