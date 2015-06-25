import {ElementRef, For, Parent, onInit} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Ancestor, Self} from 'angular2/src/core/annotations_impl/visibility';
import {Type} from 'angular2/src/facade/lang';

import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {Log} from 'ionic/util'

import {ViewController, Nav} from 'ionic/ionic'


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
  constructor() {
  }
  onInit() {
    console.log('Register on init', this.register, this.registerId);
    Registry.register(this.registerId, this.register);
  }
}

class RegistryManager {
  constructor() {
    this.components = {};
  }
  register(key, component) {
    this.components[key] = component;
    console.log('Registered', this.components);
    // TODO(mlynch): We need to track the lifecycle of this component to remove it
  }
  get(key) {
    return this.components[key];
  }
}

var Registry = new RegistryManager();

export {Registry};
