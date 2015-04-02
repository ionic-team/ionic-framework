import {Component, Template, For, NgElement} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config'
import {NavView} from 'ionic2/components/nav-view/nav-view'
import {array as arrayUtil, dom as domUtil, isFunction} from 'ionic2/util'

@Component({
  selector: 'ion-nav-viewport',
  bind: {
    initial: 'initial'
  },
})
@Template({
  inline: `
  <section class="nav-view" *for="#item of getRawNavStack()" [item]="item">
  </section>
  `,
  directives: [NavView, For]
})
export class NavViewport {
  constructor(
    element: NgElement
  ) {
    this.domElement = element.domElement
    this.domElement.classList.add('nav-viewport')
    // stack is our sane stack of items. This is synchronous and says an item
    // is removed even if it's still animating out.
    this._stack = []

    // _ngForLoopArray is actually adds/removes components from the dom. It won't 
    // remove a component until it's done animating out.
    this._ngForLoopArray = []
  }

  getRawNavStack() {
    return this._ngForLoopArray
  }

  set initial(Class) {
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
  // TODO don't push same component twice if one is already pushing
  // TODO only animate if state hasn't changed
  // TODO make sure the timing is together
  // TODO allow starting an animation in the middle (eg gestures). Leave
  // most of this up to the animation's implementation.
  push(Class: Function, { sync = this._stack.length === 0 } = {}) {
    let pushedItem = new NavItem(Class)
    this._stack.push(pushedItem)
    this._ngForLoopArray.push(pushedItem)

    return pushedItem.waitForSetup().then(() => {
      let current = this.getPrevious(pushedItem)
      if (sync) {
        current && current.leaveSync()
        pushedItem.enterSync()
      } else {
        current && current.leaveReverse()
        return pushedItem.enter()
      }
    })
  }

  /**
   * Pop a view off the history
   *
   * @param shouldAnimate whether to animate
   */
  pop({ sync = false } = {}) {
    let current = this._stack.pop()
    let previous = this._stack[this._stack.length - 1]
    if (sync) {
      previous && previous.enterSync()
      return Promise.resolve(remove())
    } else {
      previous && previous.enterReverse()
      return current.leave().then(remove)
    }
    function remove() {
      arrayUtil.remove(this._ngForLoopArray, current)
    }
  }

  getPrevious(item) {
    return this._stack[ this._stack.indexOf(item) - 1 ]
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
  enterSync() {
    this.setAnimation(null)
    return this.setShown(true)
  }
  leaveSync() {
    this.setAnimation(null)
    return this.setShown(false)
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

