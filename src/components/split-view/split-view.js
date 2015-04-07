import {Component, Parent, Decorator, Template, NgElement} from 'angular2/angular2'
import {NavViewport} from 'ionic2/components/nav-viewport/nav-viewport'
import {View} from 'ionic2/components/view/view'
import {NavView} from 'ionic2/components/nav-view/nav-view'

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
    viewTitle: 'viewTitle'
  }
})
@Template({
  inline: `
  <ion-view [view-title]="viewTitle">
    <div class="split-pane-container">
      <content></content>
    </div>
  </ion-view>
  <ion-nav-viewport split-viewport>
  </ion-nav-viewport>
  `,
  directives: [SplitViewportDecorator, NavViewport, View]
})
export class SplitView {
  constructor(
    element: NgElement,
    @Parent() navView: NavView
  ) {
    this.domElement = element.domElement
    this.navView = navView
  }

  set defaultView(def) {
    this.splitViewport.push(def)
  }

  setNavViewport(viewport) {
    this.splitViewport = viewport

    this.navView.push = function(Class, opts) {
      opts = opts || {}
      util.defaults(opts, { sync: true })
      if (this.splitViewport._stack.indexOf(Class) !== -1) {
        this.splitViewport.popTo(0)
      } else {
        while (this.splitViewport._stack.length) {
          this.splitViewport.pop({sync: true})
        }
        this.splitViewport.push(Class, opts)
      }
    }

  }

  // TODO set enabled depending on some condition (media query in this case)
  setEnabled(isEnabled) {
    this.isSplitView = isEnabled
    if (isEnabled) {
    }
  }
}
