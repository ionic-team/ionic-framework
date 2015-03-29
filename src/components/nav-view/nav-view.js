import {Component, Template, Inject, Parent, NgElement} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config'

@Component({
  selector: 'ion-nav',
  bind: {
  },
  services: []
})
@Template({
  inline: `<content></content>`
})
export class NavView {
  constructor(@NgElement() element: NgElement) {
    console.log('Nav View constructed')

    this._views = []
  }

  /**
   * Push a new view into the history stack.
   *
   * @param view the new view
   * @param shouldAnimate whether to animate
   */
  push(view, shouldAnimate) {
    this.views.push(view)

    if(shouldAnimate) {
      this.animateIn(view)
    }
  }

  /**
   * Pop a view off the history
   *
   * @param shouldAnimate whether to animate
   */
  pop(shouldAnimate) {
    last = stack.pop()

    if(shouldAnimate) {
      this.animateOut(last)
    }

    return last
  }

  get views() {
    return this._views
  }
  /**
   * Set the view stack explicitly.
   */
  set views(v) {
    this._views = v
  }

  // Animate a new view *in*
  _animateIn(view) {
  }

  // Animate an old view *out*
  _animateOut(view) {
  }

}
