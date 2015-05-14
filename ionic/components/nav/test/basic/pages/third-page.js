import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController, Header, ToolbarTitle, Toolbar} from 'ionic/ionic';


@Component()
@View({
  templateUrl: 'pages/third-page.html',
  directives: [Header, ToolbarTitle, Toolbar]
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
