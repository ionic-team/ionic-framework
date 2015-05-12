import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Nav} from 'ionic/ionic'
import {SignInPage} from './pages/sign-in'


@Component({
  selector: 'ion-app',
})
@View({
  templateUrl: 'main.html',
  directives: [Nav]
})
class IonicApp {
  constructor() {
    this.initial = SignInPage
  }
}

export function main() {
  bootstrap(IonicApp);
}
