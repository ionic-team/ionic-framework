import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';


@Directive({
  selector: 'ion-input'
})
export class Input {
  constructor() {
    //this.config = Button.config.invoke(this)
    console.log('INPUT');
  }
}
