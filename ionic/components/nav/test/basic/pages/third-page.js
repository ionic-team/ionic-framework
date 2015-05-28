import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController, NavbarTemplate, Navbar, Content} from 'ionic/ionic';


@Component({selector: 'ion-view'})
@View({
  templateUrl: 'pages/third-page.html',
  directives: [NavbarTemplate, Navbar, Content]
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
