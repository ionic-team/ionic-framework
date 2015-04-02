import {Component, Template, For} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config'
import {NavView} from 'ionic2/components/nav-view/nav-view'
import * as util from 'ionic2/util'

@Component({
  selector: 'ion-nav-viewport',
  bind: {
    initial: 'initial'
  },
})
@Template({
  inline: `
  <section class="nav-view" *for="#item of stack.rawItems()" [item]="item">
  </section>
  `,
  directives: [NavView, For]
})
export class NavViewport {
  constructor(
  ) {
    this.stack = new NavStack();
  }

  set initial(Class) {
    if (!this.initialized) {
      this.initialized = true
      this.push(Class)
    }
  }

  getAnimation(opts) {
    return 'fade'
  }

  /**
   * Push a new view into the history stack.
   *
   * @param view the new view
   * @param shouldAnimate whether to animate
   */
  push(Class, opts = {}) {
    //TODO animation
    return this.stack.push(Class)
  }

  /**
   * Pop a view off the history
   *
   * @param shouldAnimate whether to animate
   */
  pop() {
    // TODO animation
    return this.stack.pop()
  }

  // Animate a new view *in*
  _animateIn(view) {

  }

  // Animate an old view *out*
  _animateOut(view) {
  }

}

class NavStack {
  constructor(navView) {
    // array to communicate with angular for loop. When an element is in this array, it really
    // exists in the DOM.
    this._array = []
  }
  rawItems() {
    return this._array
  }

  push(ComponentClass) {
    const item = new NavStackItem(ComponentClass)
    let last = this._array[this._array.length - 1]

    this._array.push(item)
    return item.setupPromise.then(() => {
      // Once the item is successfully instantiated, add it to our public history
      item.animateIn()
      last && last.animateOut()
    })
  }

  pop() {
    // public registry: instantly remove to make the removal seem 'synchronous' for our data
    const current = this._array[this._array.length - 1]
    const previous = this._array[this._array.length - 2]
    current.animateOut().then(() => {
      util.array.remove(current)
    })
    return previous && previous.animateIn()
  }
}

class NavStackItem {
  constructor(ComponentClass) {
    this.setupPromise = new Promise((resolve) => {
      this.finishSetup = (navView, componentInstance) => {
        this.navView = navView
        this.instance = componentInstance
        resolve()
      }
    })
    this.Class = ComponentClass
  }
  setInstance(instance) {
    this.instance = instance
  }
  setNavView(navView) {
    this.navView = navView
  }

  animateIn() {
    this.navView.domElement.classList.remove('out')
    this.navView.domElement.classList.add('in')
    return new Promise(resolve => {
      this.navView.domElement.addEventListener('transitionend', (ev) => {
        if (ev.target !== this.navView.domElement) {
          return
        }
        resolve()
      })
    })
  }
  animateOut() {
    this.navView.domElement.classList.add('out')
    this.navView.domElement.classList.remove('in')
    return new Promise(resolve => {
      this.navView.domElement.addEventListener('transitionend', (ev) => {
        if (ev.target !== this.navView.domElement) {
          return
        }
        resolve()
      })
    })
  }
}
