import {Component, Template, For} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config'
import {NavView} from 'ionic2/components/nav-view/nav-view'
import {array as arrayUtil, dom as domUtil} from 'ionic2/util'

@Component({
  selector: 'ion-nav-viewport',
  bind: {
    initialComponent: 'initialComponent'
  },
})
@Template({
  inline: `
  <section class="nav-view" *for="#item of _ngForLoopArray" [item]="item">
  </section>
  `,
  directives: [NavView, For]
})
export class NavViewport {
  constructor() {
    // stack is our public stack of items. This is synchronous and says an item
    // is removed even if it's still animating out.
    this.stack = []

    // _ngForLoopArray is our loop that actually adds/removes components. It doesn't
    // remove a component until it's done animating out.
    this._ngForLoopArray = []
  }

  set initialComponent(Class) {
    if (!this.initialized) {
      this.initialized = true
      this.push(Class)
    }
  }

  /**
   * Push a new view into the history stack.
   *
   * @param view the new view
   * @param shouldAnimate whether to animate
   */
  // TODO only animate if state hasn't changed
  // TODO make sure the timing is together
  // TODO allow starting an animation in the middle (eg gestures). Leave
  // most of this up to the animation's implementation.
  push(Class, opts = {}) {
    let item = new NavItem(Class, opts)
    this.stack.push(item)
    this._ngForLoopArray.push(item)
    return item.waitForSetup().then(() => {
      let current = this.getPrevious(item)
      current && current.leaveReverse()
      return item.enter()
    })
  }

  /**
   * Pop a view off the history
   *
   * @param shouldAnimate whether to animate
   */
  pop() {
    let current = this.stack.pop()
    let previous = this.stack[this.stack.length - 1]
    previous.enterReverse()
    return current.leave().then(() => {
      // The animation is done, remove it from the dom
      arrayUtil.remove(this._ngForLoopArray, current)
    })
  }

  getPrevious(item) {
    return this.stack[ this.stack.indexOf(item) - 1 ]
  }

  // Animate a new view *in*
  _animateIn(view) {

  }

  // Animate an old view *out*
  _animateOut(view) {
  }

}

class NavItem {
  constructor(ComponentClass) {
    this.Class = ComponentClass
    this._setupPromise = new Promise((resolve) => {
      this._resolveSetupPromise = resolve
    })
  }
  waitForSetup() {
    return this._setupPromise
  }
  finishSetup(navView, componentInstance) {
    this.navView = navView
    this.instance = componentInstance
    this._resolveSetupPromise()
  }
  setAnimation(state) {
    if (!state) {
      this.navView.domElement.removeAttribute('animate')
      this.navView.domElement.classList.remove('start')
    } else {
      this.navView.domElement.setAttribute('animate', state)
    }
  }
  setShown(isShown) {
    this.navView.domElement.classList[isShown?'add':'remove']('shown')
  }
  startAnimation() {
    this.navView.domElement.classList.add('start')
  }
  _animate({ isShown, animation }) {
    this.setAnimation(animation)
    this.setShown(isShown)
    // We have to wait two rafs for the element to show. Yawn.
    return domUtil.rafPromise().then(domUtil.rafPromise).then(() => {
      this.startAnimation()
      return domUtil.transitionEndPromise(this.navView.domElement).then(() => {
        this.setAnimation(null)
      })
    })
  }
  enter() {
    return this._animate({ isShown: true, animation: 'enter' })
  }
  enterReverse() {
    return this._animate({ isShown: true, animation: 'enter-reverse' })
  }
  leave() {
    return this._animate({ isShown: false, animation: 'leave' })
  }
  leaveReverse() {
    return this._animate({ isShown: false, animation: 'leave-reverse' })
  }
}

