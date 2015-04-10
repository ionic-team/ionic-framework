import {Component, Parent, Decorator, Template, NgElement} from 'angular2/angular2'
import {NavViewport} from 'ionic2/components/nav-viewport/nav-viewport'
import {View} from 'ionic2/components/view/view'
import {NavView} from 'ionic2/components/nav-pane/nav-pane'
import * as util from 'ionic2/util'

// TODO consider more explicit API, a la tabs

/**
 * SplitViewportDecorator is temporary until the SplitView is able to query
 * its children for viewports.
 */
@Decorator({
  selector: 'ion-nav-viewport[split-viewport]'
})
class SplitViewportDecorator {
  constructor(
    @Parent() splitView: SplitView,
    navViewport: NavViewport
  ) {
    splitView.setNavViewport(navViewport)
  }
}

@Component({
  selector: 'ion-split-view',
  bind: {
    defaultView: 'defaultView',
    navTitle: 'navTitle'
  },
})
@Template({
  inline: `
  <ion-view [nav-title]="navTitle" class="split-view">
    <div class="pane-container">
      <content></content>
    </div>
  </ion-view>
  <ion-nav-viewport split-viewport>
  </ion-nav-viewport>
<style>
ion-split-view {
  width: 100%;
  height: 100%;
  display: flex;
}
ion-split-view > .view.split-view {
  max-width: 300px;
  border-right: 1px solid black;
  z-index: 1;
}
ion-split-view > ion-nav-viewport[split-viewport] {
  flex: 1;
}

</style>
  `,
  directives: [SplitViewportDecorator, NavViewport, View]
})
export class SplitView {
  constructor(
    element: NgElement,
    @Parent() navPane: NavPane
  ) {
    this.domElement = element.domElement
    this.navPane = navPane

    // TODO mq.addEventListener() doesn't work with zone.js
    // let checkScreen = () => {
    //   const mq = window.matchMedia('(min-width: 720px)')
    //   this.setEnabled(mq.matches)
    // }
    // window.addEventListener('resize', checkScreen)
    // checkScreen()
    this.setEnabled(true)
  }

  // Sets the first view to be shown in the viewport to the right of the splitView.
  set defaultView(DefaultClass) {
    this.splitViewport.push(DefaultClass, {sync: true})
  }

  isActive(Class) {
    for (let item of this.splitViewport._stack) {
      if (item.Class === Class) return true
    }
    return false
  }

  setNavViewport(viewport) {
    this.splitViewport = viewport

    this.navPane.__$push = this.navPane.push
    this.navPane.push = (Class, opts) => {
      if (this.isEnabled) {
        opts = opts || {}
        util.defaults(opts, { sync: true })
        if (this.splitViewport.containsClass(Class)) {
          return this.splitViewport.popTo(0)
        } else {
          this.splitViewport.popAll()
          return this.splitViewport.push(Class, opts)
        }
      } else {
        return this.navPane.__$push(Class, opts)
      }
    };

  }

  // TODO set enabled depending on some condition (media query in this case)
  setEnabled(isEnabled) {
    if (isEnabled !== this.isEnabled) {
      if (isEnabled) {
        this.splitViewport
      }
      this.isEnabled = isEnabled
    }
  }
}
