import {Component, Template, Inject, Parent, NgElement} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config'
import * as types from 'ionic2/components/aside/types/types'
import * as gestures from  'ionic2/components/aside/gestures/gestures';

@Component({
  selector: 'ion-aside',
  bind: {
    content: 'content',
    side: 'side',
    dragThreshold: 'dragThreshold'
  },
  services: [AsideConfig]
})
@Template({
  inline: `<content></content>`
})
export class Aside {
  constructor(
    @NgElement() element: NgElement,
    configFactory: AsideConfig
  ) {
    this.domElement = element.domElement
    // TODO inject constant instead of using domElement.getAttribute
    // TODO let config / platform handle defaults transparently
    this.side = this.domElement.getAttribute('side') || 'left'
    this.type = this.domElement.getAttribute('type') || 'overlay'

    this.config = configFactory.create(this);
    this.gestureDelegate = this.config.getDelegate('gesture');
    this.typeDelegate = this.config.getDelegate('type');

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
      requestAnimationFrame(() => {
        this.typeDelegate.setOpen(isOpen)
      })
    }
  }
}

export let AsideConfig = new ComponentConfig(Aside)

AsideConfig.classes('side', 'type')

AsideConfig.delegate('gesture')
  .when({side: 'left'}, gestures.LeftAsideGesture)
  .when({side: 'right'}, gestures.RightAsideGesture)
  .when({side: 'top'}, gestures.TopAsideGesture)
  .when({side: 'bottom'}, gestures.BottomAsideGesture)

AsideConfig.delegate('type')
  .when({type: 'overlay'}, types.AsideTypeOverlay)
  .when({type: 'push'}, types.AsideTypePush)
  .when({type: 'reveal'}, types.AsideTypeReveal)

