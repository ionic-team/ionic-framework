import {Directive} from 'angular2/angular2';

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
