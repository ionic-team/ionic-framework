import {NgElement, Component, View} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'


@Component({
  selector: 'ion-list, [ion-list]'
})
@View({
  template: `<content></content>`
})
export class List {
  constructor(
    ngElement: NgElement
  ) {
    this.domElement = ngElement.domElement;
    this.config = List.config.invoke(this)
  }
}

new IonicComponent(List, {
  propClasses: ['inset']
})
