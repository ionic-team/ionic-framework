import {NgElement, Decorator} from 'angular2/angular2'
import {IonicComponent} from 'ionic2/config/component'

@Decorator({
  selector: 'ion-button, [ion-button],.button',
})
export class Button {
  constructor(
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.config = Button.config.invoke(this)
  }
}
new IonicComponent(Button, {
  propClasses: ['primary', 'secondary', 'danger', 'light', 'stable', 'dark', 'block']
})
