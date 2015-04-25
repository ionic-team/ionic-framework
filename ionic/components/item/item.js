import {NgElement, Component, View as NgView} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'
import {
  ItemPrimaryOptions, ItemSecondaryOptions
} from 'ionic/components/item/item-options'
import {
  ItemPrimarySwipeButtons, ItemSecondarySwipeButtons
} from 'ionic/components/item/item-swipe-buttons'

@Component({
  selector: 'ion-item,[ion-item]'
})
@NgView({
  template: `
    <content select="ion-primary-options"></content>
    <content select="ion-primary-swipe-buttons"></content>
    <div class="item-content">
      <div class="item-media">
      </div>
      <div class="item-accessory">
        <content select="ion-item-accessory"></content>
      </div>
      <div class="item-label">
        <content></content>
      </div>
    </div>
    <content select="ion-secondary-options"></content>
    <content select="ion-secondary-swipe-buttons"></content>
  `,
  directives: [
    ItemPrimarySwipeButtons,
    // ItemSecondarySwipeButtons,
    // ItemPrimaryOptions,
    // ItemSecondaryOptions
  ]
})
export class Item {
  constructor(
    @NgElement() ele:NgElement
  ) {
    this._isOpen = false
    this._isSlideActive = false
    this._isTransitioning = false
    this._transform = ''

    this.domElement = ele.domElement
    this.swipeButtons = {}
    this.optionButtons = {}
    Item.config.invoke(this)
  }
}

new IonicComponent(Item, {})


function clsSetter(el, name) {
  return (isSet) => el.classList[isSet?'add':'remove'](name)
}

import {dom} from 'ionic/util'

class Slideable {
  constructor(slideElement: Element) {
  }

  // override
  onTransform(str: String) {}
  // override
  onTransitionActive(active: Boolean) {}
  //override
  onSlideActive(active: boolean) {}

  transform(str: String) {
    if (arguments.length && str !== this._transform) {
      this.onTransform()
    }
  }

  isTransitionActive(active: Boolean) {
    if (arguments.length && active !== this._isTransitionActive) {
      this._isTransitionActive = active
      this.onSetTransitionActive(active)
    }
    return this._isTransitioning
  }

  isSlideActive(active: Boolean) {
    if (arguments.length && active !== this._isSlideActive) {
      this._isSlideActive = active
      this.onSetDragActive(active)
    }
    return this._isSlideActive
  }

  isOpen(open: Boolean) {
    if (arguments.length && open !== this._isOpen) {
      this.isTransitionActive(true)
      dom.rafPromise().then(() => {
        this.isOpen = isOpen
        this.onSetIsOpen(open)
      })
    }
  }

}

class ItemSlideGesture {
}
