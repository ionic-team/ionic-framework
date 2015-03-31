import {NgElement, Component, Template} from 'angular2/angular2'
import {IonicComponent} from 'ionic2/config/component'

@Component({
  selector: '.back-button',
})
@Template({
  inline: `
    <icon [class-name]="'back-button-icon ' + icon"></icon>
    <div class="back-button-text">
      <div class="back-default"></div>
      <div class="back-title"></div>
    </div>`
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
  bind: {
    icon: {
      defaults: {
        ios: 'ion-ios-arrow-back',
        android: 'ion-android-arrow-back',
        base: 'ion-chevron-left'
      }
    }
  }
})
