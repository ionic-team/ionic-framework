import {Component} from 'angular2/src/core/annotations_impl/annotations';

import {IonicView, Routable, Router, NavController, NavParams} from 'ionic/ionic';
import {ThirdPage} from './third-page';


@Component({selector: 'ion-view'})
@IonicView({
  template: `
    <ion-navbar *navbar><ion-title>Second Page Header</ion-title></ion-navbar>
    <ion-content class="padding">
      <p>
        <button primary (click)="pop()">Pop (Go back to 1st)</button>
      </p>
      <p>
        <button primary nav-pop>Pop with NavPop (Go back to 1st)</button>
      </p>
      <p>
        <button primary (click)="push()">Push (Go to 3rd)</button>
      </p>
      <p>
        Random: {{ val }}
      </p>
      <div class="green"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>
    </ion-content>
  `
})
export class SecondPage {
  constructor(
    nav: NavController,
    params: NavParams
  ) {
    // TODO: Shouldn't have to do this
    Router.setNavController(nav);

    this.nav = nav;
    this.params = params;
    this.val = Math.round(Math.random() * 8999) + 1000;

    console.log('Second page params:', params);
  }

  pop() {
    this.nav.pop();
  }

  push() {
    this.nav.push(ThirdPage);
  }

  viewLoaded() {
    console.log('viewLoaded second page');
    this.router = SecondPage.router.invoke(this);
  }

  viewWillEnter() {
    console.log('viewWillEnter second page');
  }

  viewDidEnter() {
    console.log('viewDidEnter second page');
  }

  viewWillLeave() {
    console.log('viewWillLeave second page');
  }

  viewDidLeave() {
    console.log('viewDidLeave second page');
  }

  viewWillCache() {
    console.log('viewWillCache second page');
  }

  viewDidCache() {
    console.log('viewDidCache second page');
  }

  viewWillUnload() {
    console.log('viewWillUnload second page');
  }

  viewDidUnload() {
    console.log('viewDidUnload second page');
  }

}

new Routable(SecondPage, {
  url: '/second-page'
})
