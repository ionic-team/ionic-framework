import {NgElement, Component, View as NgView} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'


@Component({
  selector: 'ion-radio-group'
})
@NgView({
  template: `<content></content>`
})
export class RadioGroup {
  constructor(
    element: NgElement
  ) {
    this.domElement = element.domElement
    this.config = RadioGroup.config.invoke(this)

    this.domElement.classList.add('list')
  }
}

new IonicComponent(RadioGroup, {})
