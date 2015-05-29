import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController, NavbarTemplate, Navbar, Content} from 'ionic/ionic';
import {SecondPage} from './second-page';


@Component({selector: 'ion-view'})
@View({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>First Page</ion-title>' +
      '<ion-nav-item primary>' +
        '<button class="button">P1</button>' +
      '</ion-nav-item>' +
      '<ion-nav-item secondary>' +
        '<button class="button">S1</button>' +
        '<button class="button">S2</button>' +
      '</ion-nav-item>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p>First Page: {{ val }}</p>' +
      '<p><button class="button" (click)="push()">Push (Go to 2nd)</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, Content]
})
export class FirstPage {
  constructor(
    nav: NavController
  ) {
    this.nav = nav;
    this.val = Math.round(Math.random() * 8999) + 1000;
  }

  push() {
    this.nav.push(SecondPage, { id: 8675309, myData: [1,2,3,4] }, { animation: 'ios' });
  }
}
