import {Component, View as NgView, Inject, Parent, NgElement, EventEmitter} from 'angular2/angular2'
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
  }
})
@NgView({
  template: `<content></content>`
})
export class Aside {
  constructor(
    @NgElement() element: NgElement
  ) {
    this.domElement = element.domElement

    // FIXME(ajoslin): have to wait for setTimeout for bindings to apply.
    setTimeout(() => {
      this.config = Aside.config.invoke(this)
      this.gestureDelegate = this.config.getDelegate('gesture');
      this.typeDelegate = this.config.getDelegate('type');
    })

    this.domElement.addEventListener('transitionend', ev => {
      this.setChanging(false)
    })
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
