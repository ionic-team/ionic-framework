import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';

import {Router, Routable, NavController} from 'ionic/ionic';


@Component({selector: 'ion-view'})
@IonicView({
  template: `
    <ion-navbar *navbar><ion-title>Third Page Header</ion-title></ion-navbar>
    <ion-content class="padding">
      <p>
        <button primary (click)="pop()">Pop (Go back to 2nd)</button>
      </p>
      <div class="yellow"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>
    </ion-content>
  `
})
export class ThirdPage {
  constructor(
    nav: NavController
  ) {
    this.nav = nav

    // TODO: Shouldn't have to do this
    Router.setNavController(nav);
  }

  pop() {
    this.nav.pop()
  }

  viewLoaded() {
    this.router = ThirdPage.router.invoke(this);
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


new Routable(ThirdPage, {
  url: '/third-page'
})
