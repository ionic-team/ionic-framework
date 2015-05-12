import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';

import {IonicComponent} from 'ionic/config/component'


@Directive({
  selector: 'ion-label'
})
export class Label {
  constructor() {
  }
}
// new IonicComponent(Label, {
// })
