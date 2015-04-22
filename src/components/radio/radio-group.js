import {NgElement, Component, Template} from 'angular2/angular2'
import {IonicComponent} from 'ionic2/config/component'


@Component({
  selector: 'ion-radio-group'
})
@Template({
  inline: `<content></content>`
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
