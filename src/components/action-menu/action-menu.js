import {NgElement, Component, Template, Parent} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config'
import {Icon} from 'ionic2/components/icon/icon'
import {Item} from 'ionic2/components/item/item'

export let ActionMenuConfig = new ComponentConfig('action-menu')

@Component({
  selector: 'ion-action-menu',
  services: [ActionMenuConfig]
})
@Template({
  inline: `
    <div class="overlay-backdrop"></div>
    <div class="overlay-container">
      <div class="action-menu-container">

        <div class="list-header">Action Menu List Header</div>
        <div class="list">
          <button ion-item class="item">
            Button 1
          </button>
          <button ion-item class="item">
            Button 2
          </button>
        </div>

        <div class="list-header">Action Menu Label</div>
        <div class="list">
          <button ion-item class="item">Button 1</button>
          <button ion-item class="item">Button 2</button>
        </div>

        <div class="list">
          <button ion-item class="item">Button 1</button>
        </div>

      </div>
    </div>`,
  directives: [Item,Icon]
})
export class ActionMenu {
  constructor(
    configFactory: ActionMenuConfig,
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.config = configFactory.create(this)
  }
}
