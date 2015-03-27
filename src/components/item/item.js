import {NgElement, Component, Template} from 'angular2/angular2'

@Component({
  selector: 'ion-item'
})
@Template({
  inline: `<div class="item-content">
            <div class="item-media">
              Icon
            </div>
            <div class="item-title">
              Item Title
            </div>
            <div class="item-accessory">
              Right
            </div>
          </div>`
})
export class Item {
  constructor(@NgElement() ele:NgElement) {
    ele.domElement.classList.add('item')
  }
}
