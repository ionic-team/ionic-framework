import {NgElement, Component, Template} from 'angular2/angular2'
import {IonicComponent} from 'ionic2/config/component'
import {
  ItemPrimaryOptions, ItemSecondaryOptions
} from 'ionic2/components/item/item-options'
import {
  ItemPrimarySwipeButtons, ItemSecondarySwipeButtons
} from 'ionic2/components/item/item-swipe-buttons'

@Component({
  selector: 'ion-item'
})
@Template({
  inline: `
    <content select="ion-primary-options"></content>
    <content select="ion-primary-swipe-buttons"></content>
    <div class="item-content">
      <div class="item-media">
      </div>
      <div class="item-accessory">
        <content select="ion-item-accessory"></content>
      </div>
      <div class="item-title">
        <content></content>
      </div>
    </div>
    <content select="ion-secondary-options"></content>
    <content select="ion-secondary-swipe-buttons"></content>
  `,
  direcetives: [
    ItemPrimarySwipeButtons, 
    ItemSecondarySwipeButtons, 
    ItemPrimaryOptions,
    ItemSecondaryOptions
  ]
})
export class Item {
  constructor(
    @NgElement() ele:NgElement
  ) {
    this.domElement = ele.domElement
    Item.config.invoke(this)
  }
}

new IonicComponent(Item, {})
