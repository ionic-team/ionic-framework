import {NgElement, Component, Template, Parent, Ancestor} from 'angular2/angular2'
import {Toolbar} from 'ionic2/components/toolbar/toolbar'
import {ComponentConfig} from 'ionic2/config/component-config'

export let ViewConfig = new ComponentConfig('view')

@Component({
  selector: 'ion-view',
  bind: {
    title: 'nav-title'
  },
  services: [ViewConfig]
})
@Template({
  inline: `
    <ion-toolbar [nav-title]="title">
      <content select="ion-nav-title"></content>
      <content select="ion-nav-items[side=primary]"></content>
      <content select="ion-nav-items[side=secondary]"></content>
    </ion-toolbar>
    <div class="pane-container">
      <content></content>
    </div>`,
  directives: [Toolbar]
})
export class View {
  constructor(
    configFactory: ViewConfig,
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.domElement.classList.add('pane')
    this.config = configFactory.create(this)
  }
}
