import {Directive, Self, Type} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from './app';


/**
 * TODO
 */
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
  /**
   * TODO
   * @param {Object} app  TODO
   */
  constructor(app: IonicApp) {
    this.app = app;
  }

  /**
   * TODO
   */
  onInit() {
    if (this.register && this.registerId) {
      this.app.register(this.registerId, this.register);
    }
  }

}

/**
 * TODO
 */
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

  /**
   * TODO
   * @param {TODO} app  TODO
   * @param {TODO} component  TODO
   */
  constructor(app: IonicApp, @Self() component: any) {
    this.app = app;
    console.log('Register on any', component)
  }

  /**
   * TODO
   */
  onInit() {
    /*
    if (this.register && this.registerId) {
      this.app.register(this.registerId, this.register);
    }
    */
  }

}
