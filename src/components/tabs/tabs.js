import {NgElement, Component, Template, Foreach, Parent} from 'angular2/angular2'
import {NavViewport} from 'ionic2/components'
import {IonicComponent} from 'ionic2/config/component'

@Component({
  selector: 'ion-tabs',
  bind: {
    placement: 'placement'
  },
})
@Template({
  inline: `
    <div class="toolbar tab-bar toolbar-ios toolbar-bottom">
      <div class="tab-bar-content">
        <a class="tab-bar-item tab-active" href="#">
          Tab 1
        </a>
        <a class="tab-bar-item" href="#">
          Tab 2
        </a>
        <a class="tab-bar-item" href="#">
          Tab 3
        </a>
      </div>
    </div>
  `,
  directives: []
})
export class Tabs extends NavViewport {
  constructor(
    element: NgElement
  ) {
    super()
    this.domElement = element.domElement
    this.domElement.classList.add('pane')
    this.config = Tabs.config.invoke(this)
  }
}

new IonicComponent(Tabs, {
  bind: {
    placement: {
      defaults: {
        ios: 'bottom',
        android: 'top',
        base: 'bottom'
      }
    }
  }
})
