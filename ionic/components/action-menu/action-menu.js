import {NgElement, Component, View as NgView, Parent} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'
import {Icon} from 'ionic/components/icon/icon'
import {Item} from 'ionic/components/item/item'


@Component({
  selector: 'ion-action-menu'
})
@NgView({
  template: `
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
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.config = ActionMenu.config.invoke(this)
  }
}

new IonicComponent(ActionMenu, {})
