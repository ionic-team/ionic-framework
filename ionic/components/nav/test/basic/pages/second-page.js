import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController} from 'ionic/ionic'
import {ThirdPage} from './third-page'


@Component()
@View({
  templateUrl: 'pages/second-page.html',
  directives: []
})
export class SecondPage {
  constructor(
    nav: NavController
  ) {
    this.nav = nav
  }
  pop() {
    this.nav.pop();
  }
  push() {
    this.nav.push(ThirdPage, { animation: 'none' });
  }
}
