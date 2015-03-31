import {NgElement, Component, Template} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config'

export let BackButtonConfig = new ComponentConfig('back-button')

@Component({
  selector: '.back-button',
  services: [BackButtonConfig]
})
@Template({
  inline: `
    <icon class="back-button-icon ion-ios-arrow-back"></icon>
    <div class="back-button-text">
      <div class="back-default">Back</div>
      <div class="back-title"></div>
    </div>`
})
export class BackButton {
  constructor(@NgElement() ngEle:NgElement, configFactory: BackButtonConfig) {
    this.domElement = ngEle.domElement
    this.config = configFactory.create(this);


  }

}

