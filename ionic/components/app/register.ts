import {Directive, Self, Type} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from './app';


@Directive({
  selector: '[register]',
  properties: [
    'register',
    'registerId: register-id'
  ],
  host: {
    'this.register-id': 'registerId'
  }
})
export class Register {

  constructor(app: IonicApp) {
    this.app = app;
  }

  onInit() {
    if (this.register && this.registerId) {
      this.app.register(this.registerId, this.register);
    }
  }

}


@Directive({
  selector: '[ref]',
  properties: [
    'ref'
  ],
  host: {
    'this.ref': 'refId'
  }
})
export class Ref {

  constructor(app: IonicApp, @Self() component: any) {
    this.app = app;
    console.log('Register on any', component)
  }

  onInit() {
    /*
    if (this.register && this.registerId) {
      this.app.register(this.registerId, this.register);
    }
    */
  }

}
