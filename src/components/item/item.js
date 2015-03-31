import {NgElement, Component, Template} from 'angular2/angular2'
import {IonicComponent} from 'ionic2/config/component'

@Component({
  selector: 'ion-item'
})
@Template({
  inline: `<div class="item-content">
            <div class="item-media">
            </div>
            <div class="item-title">
              <content></content>
            </div>
            <div class="item-accessory">
            </div>
          </div>`
})
export class Item {
  constructor(@NgElement() ele:NgElement) {
    Item.config.invoke(this)
  }
}

new IonicComponent(Item, {})
