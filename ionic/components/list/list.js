import {NgElement, Component, View as NgView} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'


@Component({
  selector: 'ion-list'
})
@NgView({
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

new IonicComponent(List, {})
