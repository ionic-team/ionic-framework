import {NgElement, Component, View as NgView} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'


@Component({
  selector: 'ion-radio'
})
@NgView({
  template: `
    <div class="item-content">

      <div class="item-title">
        <content></content>
      </div>

      <div class="item-media media-radio">
        <icon class="radio-off"></icon>
        <icon class="ion-ios-checkmark-empty radio-on"></icon>
      </div>

    </div>
  `
})
export class RadioButton {
  constructor(
    element: NgElement
  ) {
    this.domElement = element.domElement
    this.config = RadioButton.config.invoke(this)

    this.domElement.classList.add('item')
    this.domElement.setAttribute('aria-checked', true)
  }
}

new IonicComponent(RadioButton, {})
