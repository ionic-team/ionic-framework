import {NgElement, Component, Template, Foreach, Parent} from 'angular2/angular2';
import {ComponentConfig} from 'ionic2/config/component-config';

export let TabsConfig = new ComponentConfig('tabs');


@Component({
  selector: 'ion-tabs',
  bind: {
    tabBarPlacement: 'tab-bar-placement'
  },
  services: [TabsConfig]
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

    <div class="pane-container">
      <div class="content">
        <content></content>
      </div>
    </div>
  `,
})
export class Tabs {
  constructor(
    configFactory: TabsConfig,
    element: NgElement
  ) {
    this.domElement = element.domElement
    this.domElement.classList.add('pane')
    configFactory.create(this)

    this.tabBarPlacement = this.tabBarPlacement || 'bottom'
  }
}
