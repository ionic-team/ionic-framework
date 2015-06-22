import {Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {Optional} from 'angular2/src/di/annotations_impl';
import {Compiler} from 'angular2/angular2';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';

import {ViewController} from '../view/view-controller';
import {NavController} from './nav-controller';

@Directive({
  selector: '[nav-push]',
  hostListeners: {
    '^click': 'onClick($event)'
  },
  properties: [
    'navPush',
    'pushData'
  ],
  hostAttributes: {
    'role': 'link'
  }
})
export class NavPush {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  onClick(event) {
    this.nav.push(this.navPush, this.pushData);
  }
}


@Directive({
  selector: '[nav-pop]',
  hostListeners: {
    '^click': 'onClick($event)'
  },
  hostAttributes: {
    'role': 'link'
  }
})
export class NavPop {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  onClick(event) {
    this.nav.pop();
  }
}
