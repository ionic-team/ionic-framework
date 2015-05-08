import {NgElement, Decorator} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'

@Decorator({
  selector: 'ion-segment'
})
export class Segment {
  constructor(
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.config = Button.config.invoke(this)
  }
}
new IonicComponent(Segment, {
})
