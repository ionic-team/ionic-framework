import {bootstrap, QueryList} from 'angular2/angular2'
import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Nav, NavPush, NavPop, NavParams, Routable, Router, NavController, NavbarTemplate, Navbar, NavPush, Content} from 'ionic/ionic';


@Component({
  selector: 'ion-view',
  lifecycle: [onInit]
})
@View({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>First Page: {{ val }}</ion-title>' +
      '<ion-nav-items primary>' +
        '<button class="button">P1</button>' +
      '</ion-nav-items>' +
      '<ion-nav-items secondary>' +
        '<button class="button">S1</button>' +
        '<button class="button">S2</button>' +
      '</ion-nav-items>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p>First Page: {{ val }}</p>' +
      '<p><button class="button" (click)="push()">Push (Go to 2nd)</button></p>' +
      '<p><button class="button" [push-data]="pushData" [nav-push]="pushPage">Push w/ nav-push (Go to 2nd)</button></p>' +
      '<icon class="ion-ios-arrow-back"></icon>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, NavPush, Content]
})
export default class FirstPage {
  constructor(
    nav: NavController
  ) {

    // TODO: Shouldn't have to do this
    Router.setNavController(nav);

    this.nav = nav;
    this.val = Math.round(Math.random() * 8999) + 1000;


    this.pushPage = SecondPage;
    this.pushData = {
      id: 420
    }
  }

  onInit() {
  }

  viewLoaded() {
    this.router = FirstPage.router.invoke(this);
    console.log('viewLoaded first page');
  }

  viewWillEnter() {
    console.log('viewWillEnter first page');
  }

  viewDidEnter() {
    console.log('viewDidEnter first page');
  }

  viewWillLeave() {
    console.log('viewWillLeave first page');
  }

  viewDidLeave() {
    console.log('viewDidLeave first page');
  }

  viewWillCache() {
    console.log('viewWillCache first page');
  }

  viewDidCache() {
    console.log('viewDidCache first page');
  }

  viewWillUnload() {
    console.log('viewWillUnload first page');
  }

  viewDidUnload() {
    console.log('viewDidUnload first page');
  }

  push() {
    this.nav.push(SecondPage, { id: 8675309, myData: [1,2,3,4] }, { animation: 'ios' });
  }
}

new Routable(FirstPage, {
  url: '/first-page'
})

@Component({selector: 'ion-view'})
@View({
  template: `
    <ion-navbar *navbar><ion-title>Second Page Header</ion-title></ion-navbar>
    <ion-content class="padding">
      <p>
        <button class="button" (click)="pop()">Pop (Go back to 1st)</button>
      </p>
      <p>
        <button class="button" nav-pop>Pop with NavPop (Go back to 1st)</button>
      </p>
      <p>
        <button class="button" (click)="push()">Push (Go to 3rd)</button>
      </p>
      <p>
        Random: {{ val }}
      </p>
      <div class="green"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>
    </ion-content>
  `,
  directives: [NavbarTemplate, NavPop, Navbar, Content]
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


@Component({selector: 'ion-view'})
@View({
  template: `
    <ion-navbar *navbar><ion-title>Third Page Header</ion-title></ion-navbar>
    <ion-content class="padding">
      <p>
        <button class="button" (click)="pop()">Pop (Go back to 2nd)</button>
      </p>
      <div class="yellow"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>
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
