import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';

import {IonicComponent} from 'ionic/config/component'


@Directive({
  selector: 'ion-input'
})
export class Input {
  constructor() {
    //this.config = Button.config.invoke(this)
    console.log('INPUT');
  }
}
// new IonicComponent(Input, {
// })
