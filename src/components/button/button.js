import {NgElement, Decorator} from 'angular2/angular2'
import {IonicComponent} from 'ionic2/config/component'

@Decorator({
  selector: '.button',
})
export class Button {
  constructor(
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.config = Button.config.invoke(this)
  }
}
new IonicComponent(Button, {})
