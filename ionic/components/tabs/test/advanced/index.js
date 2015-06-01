import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Nav, NavbarTemplate, Navbar, Content} from 'ionic/ionic';
import {SignInPage} from './pages/sign-in';


@Component({
  selector: 'ion-app',
})
@View({
  templateUrl: 'main.html',
  directives: [Nav, NavbarTemplate, Navbar, Content]
})
class IonicApp {
  constructor() {
    this.initial = SignInPage
  }
}

export function main() {
  bootstrap(IonicApp);
}
