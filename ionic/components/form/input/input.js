import {NgElement, Decorator} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'

@Decorator({
  selector: 'ion-input'
})
export class Input {
  constructor(
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    //this.config = Button.config.invoke(this)
    console.log('INPUT');
  }
}
new IonicComponent(Input, {
})
