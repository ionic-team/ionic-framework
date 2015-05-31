import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController, NavbarTemplate, Navbar, Content} from 'ionic/ionic';
import {TabsPage} from './tabs';


@Component({selector: 'ion-view'})
@View({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Sign In</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button class="button" (click)="push()">Go to tabs</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, Content]
})
export class SignInPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(TabsPage);
  }
}
