import {NgElement, Component, View, Parent} from 'angular2/angular2'
import {ComponentConfig} from 'ionic/config/component-config'

export let ActionMenuConfig = new ComponentConfig('action-menu')

@Component({
  selector: 'ion-action-menu',
  injectables: [ActionMenuConfig]
})
@View({
  template: `
    <div class="overlay-backdrop"></div>
    <div class="overlay-container">
      <div class="action-menu-container">

        <div class="action-menu-group">
          <div class="action-menu-label">Action Menu Label</div>
          <button class="button action-menu-button">Button 1</button>
          <button class="button action-menu-button">Button 2</button>
        </div>

        <div class="action-menu-group">
          <div class="action-menu-label">Action Menu Label</div>
          <button class="button action-menu-button">Button 1</button>
          <button class="button action-menu-button">Button 2</button>
        </div>

        <div class="action-menu-group">
          <button class="button action-menu-button">Button 1</button>
        </div>
      </div>
    </div>`
})
export class ActionMenu {
  constructor(
    configFactory: ActionMenuConfig,
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.domElement.classList.add('pane')
    this.domElement.classList.add('pane-overlay')
    this.config = configFactory.create(this)
  }
}
