import {NgFor, Injector, DomRenderer, ElementRef} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {List, Item, ActionMenu, Modal, ModalRef,
  NavbarTemplate, Navbar, NavController, Content} from 'ionic/ionic';

@Component({
  selector: 'ion-view'
})
@View({
  template: `
  <ion-navbar *navbar><ion-title>Cards</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Navigation</h2>
    <p>
      Navigation makes your app feel like, well, an app!
    </p>
    <p>
      With the navigation features in Ionic, we can navigate to new pages,
      go back in history (including swipe-to-go-back), and control the stack
      of pages the user can navigate between.
    </p>
    <button primary (click)="push()">Push</button>
  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content, List, Item]
})
export class NavPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  push() {
    this.nav.push(NavSecondPage);
  }
}

@Component({selector: 'ion-view'})
@View({
  template: `
  <ion-navbar *navbar><ion-title>Second Page</ion-title></ion-navbar>
  <ion-content padding>
    <button primary (click)="pop()">Pop</button>
  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content]
})
export class NavSecondPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  pop() {
    this.nav.pop();
  }
}
