import {EventEmitter, ElementRef, Inject, Parent} from 'angular2/angular2'

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import * as types from 'ionic/components/aside/extensions/types'
import * as gestures from  'ionic/components/aside/extensions/gestures'
import {dom} from 'ionic/util'
import {IonicComponent} from 'ionic/config/component'

/**
 * TODO (?) add docs about how to have a root aside and a nested aside, then hide the root one
 */

@Component({
  selector: 'ion-aside',
  properties: {
    content: 'content',
    side: 'side',
    dragThreshold: 'dragThreshold'
  },
  events: ['opening']
})
@View({
  template: `<content></content>`
})
export class Aside {
  constructor(
    elementRef: ElementRef
  ) {
    this.domElement = elementRef.domElement

    this.opening = new EventEmitter('opening');

    // FIXME(ajoslin): have to wait for setTimeout for bindings to apply.
    setTimeout(() => {
      this.side = this.side || 'left';
      this.type = this.type || 'reveal';

      this.domElement.setAttribute('side', this.side);
      this.domElement.setAttribute('type', this.type);

      console.log('Aisde content', this.content);

      this.config = Aside.config.invoke(this)
      this.gestureDelegate = this.config.getDelegate('gesture');
      this.typeDelegate = this.config.getDelegate('type');
    })

    this.domElement.addEventListener('transitionend', ev => {
      this.setChanging(false)
    })
  }

  getContentElement() {
    return this.content.domElement;
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
      this.domElement.classList[isChanging ? 'add' : 'remove']('changing');
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
}

new IonicComponent(Aside, {
  properties: {
    side: {
      value: 'left'
    },
    type: {
      defaults: {
        ios: 'reveal',
        android: 'overlay',
        core: 'overlay',
      }
    },
    dragThreshold: {},
    content: {},
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
  }
})
