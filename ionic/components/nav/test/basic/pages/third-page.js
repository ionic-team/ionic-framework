import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController, HeaderTemplate, Toolbar} from 'ionic/ionic';


@Component()
@View({
  templateUrl: 'pages/third-page.html',
  directives: [HeaderTemplate, Toolbar]
})
export class ThirdPage {
  constructor(
    nav: NavController
  ) {
    this.nav = nav
  }
  pop() {
    this.nav.pop()
  }
}
