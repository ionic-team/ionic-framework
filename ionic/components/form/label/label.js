import {NgElement, Decorator} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'

@Decorator({
  selector: 'ion-label'
})
export class Label {
  constructor(
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
  }
}
new IonicComponent(Label, {
})
