import {NgElement, Component, Template, Parent} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config'

export let AlertConfig = new ComponentConfig('alert')

@Component({
  selector: 'ion-alert',
  services: [AlertConfig]
})
@Template({
  inline: `
    <div class="pane-backdrop"></div>
    <div class="alert-container">

      <div class="alert-content">
        Do you like cookies?
      </div>

      <div class="alert-actions">
        <button class="button">OK</button>
      </div>

    </div>`
})
export class Alert {
  constructor(
    configFactory: AlertConfig,
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.domElement.classList.add('pane')
    this.domElement.classList.add('pane-overlay')
    this.config = configFactory.create(this)
  }
}
