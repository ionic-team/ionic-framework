import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController, NavbarTemplate, Navbar, Content} from 'ionic/ionic';


@Component({selector: 'ion-view'})
@View({
  template: `
    <ion-navbar *navbar><ion-title>Third Page Header</ion-title></ion-navbar>

    <ion-content class="padding">

      <p>
        <button class="button" (click)="pop()">Pop (Go back to 2nd)</button>
      </p>

      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>

    </ion-content>
  `,
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

  viewLoaded() {
    console.log('viewLoaded third page');
  }

  viewWillEnter() {
    console.log('viewWillEnter third page');
  }

  viewDidEnter() {
    console.log('viewDidEnter third page');
  }

  viewWillLeave() {
    console.log('viewWillLeave third page');
  }

  viewDidLeave() {
    console.log('viewDidLeave third page');
  }

  viewWillCache() {
    console.log('viewWillCache third page');
  }

  viewDidCache() {
    console.log('viewDidCache third page');
  }

  viewWillUnload() {
    console.log('viewWillUnload third page');
  }

  viewDidUnload() {
    console.log('viewDidUnload third page');
  }

}
