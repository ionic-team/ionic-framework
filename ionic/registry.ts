import {onInit, Directive} from 'angular2/angular2';

import {IonicApp} from 'ionic/ionic'


@Directive({
  selector: '[register]',
  properties: [
    'register',
    'registerId: register-id'
  ],
  host: {
    'this.register-id': 'registerId'
  },
  lifecycle: [onInit]
})
export class Register {
  constructor(app: IonicApp) {
    this.app = app;
  }
  onInit() {
    if(!this.register || !this.registerId) {
      return;
    }
    this.app.register(this.registerId, this.register);
  }
}
