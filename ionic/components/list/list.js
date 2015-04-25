import {NgElement, Component, Template} from 'angular2/angular2'
import {IonicComponent} from 'ionic2/config/component'


@Component({
  selector: 'ion-list'
})
@Template({
  inline: `<content></content>`
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
