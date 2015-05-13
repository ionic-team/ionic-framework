import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController} from 'ionic/ionic'
import {SecondPage} from './second-page'


@Component()
@View({
  templateUrl: 'pages/first-page.html'
})
export class FirstPage {
  constructor(
    //nav: NavController
  ) {
    //this.nav = nav;
  }

  push() {
    this.nav.push(SecondPage);
  }
}
