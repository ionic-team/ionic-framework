import {ElementRef, For, Parent, onInit} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Ancestor, Self} from 'angular2/src/core/annotations_impl/visibility';
import {Type} from 'angular2/src/facade/lang';

import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {Log} from 'ionic/util'

import {IonicApp} from 'ionic/ionic'


@Directive({
  selector: '[register]',
  properties: [
    'register',
    'registerId: register-id'
  ],
  host: {
    '[register-id]': 'registerId'
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
