import {NgElement, Component, Template, Parent} from 'angular2/angular2'
import {IonicComponent} from 'ionic2/config/component'


@Component({
  selector: 'ion-alert'
})
@Template({
  inline: `
    <div class="overlay-backdrop"></div>
    <div class="overlay-container">
      <div class="alert-container">
        <div class="alert-header">
          Do you like cookies?
        </div>
        <div class="alert-content">
          Seriously, who does not like cookies.
        </div>
        <div class="alert-actions">
          <button class="button">OK</button>
        </div>
      </div>
    </div>`
})
export class Alert {
  constructor(
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.config = Alert.config.invoke(this)
  }
}

new IonicComponent(Alert, {})
