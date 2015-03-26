import {Component, Template, Inject, Parent, NgElement, PropertySetter} from 'angular2/angular2'
import {ComponentConfig} from '../../core/config/config'
import * as types from './extensions/types/types'
import * as gestures from  './extensions/gestures/gestures';

export let AsideConfig = new ComponentConfig()

AsideConfig.property('side')
  .when('left', gestures.LeftAsideGesture)
  .when('right', gestures.RightAsideGesture)
  .when('top', gestures.TopAsideGesture)
  .when('bottom', gestures.BottomAsideGesture)

AsideConfig.property('type')
  .when('overlay', types.AsideOverlayType)
  .when('push', types.AsidePushType)
  .when('reveal', types.AsideRevealType)

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
    @PropertySetter('style.transform') transformSetter: Function,
    /* propertSetter doesn't work for classes right now */
    config: AsideConfig
  ) {
    this.domElement = element.domElement

    // TODO inject constant instead of using domElement.getAttribute
    // TODO let config / platform handle defaults transparently
    let side = this.side = this.domElement.getAttribute('side') || 'left'
    let type = this.type = this.domElement.getAttribute('type') || 'overlay'
    this.delegates = config.invoke(this, { side, type })

    this.domElement.classList.add(side)
    this.domElement.addEventListener('transitionend', ev => {
      this.setChanging(false)
    })
  }

  setTransform(transform) {
    this.delegates.type.setTransform(transform)
  }
  setSliding(isSliding) {
    if (isSliding !== this.isSliding) {
      this.delegates.type.setSliding(isSliding)
    }
  }
  setChanging(isChanging) {
    if (isChanging !== this.isChanging) {
      this.isChanging = isChanging
      this.domElement.classList[isChanging ? 'add' : 'remove']('changing')
    }
  }
  setOpen(isOpen) {
    if (isOpen !== this.isOpen) {
      this.isOpen = isOpen
      this.setChanging(true)
      requestAnimationFrame(() => {
        this.delegates.type.setOpen(isOpen)
      })
    }
  }
}
