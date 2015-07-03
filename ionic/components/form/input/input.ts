import {Component, Directive} from 'angular2/angular2';


@Directive({
  selector: 'ion-input'
})
export class Input {
  constructor() {
    //this.config = Button.config.invoke(this)
    console.log('INPUT');
  }
}
