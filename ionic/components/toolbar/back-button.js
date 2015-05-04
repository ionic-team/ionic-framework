import {NgElement, Component, View} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'

@Component({
  selector: '.back-button',
})
@View({
  template: `
    <icon [class-name]="'back-button-icon ' + icon"></icon>
    <span class="back-button-text">
      <span class="back-default">{{ text }}</span>
      <span class="back-title"></span>
    </span>`
})
export class BackButton {
  constructor(
    @NgElement() ngEle:NgElement
  ) {
    this.domElement = ngEle.domElement

    setTimeout(() => {
      this.config = BackButton.config.invoke(this)
    })
  }
}

new IonicComponent(BackButton, {
  properties: {
    icon: {
      defaults: {
        ios: 'ion-ios-arrow-back',
        android: 'ion-android-arrow-back',
        core: 'ion-chevron-left'
      }
    },
    text: {
      defaults: {
        ios: 'Back',
        android: '',
        core: ''
      }
    }
  }
})
