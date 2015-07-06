import {Component, Directive, View} from 'angular2/angular2';

import {IonicApp, List, Item, ActionMenu, Modal, ModalRef,
  NavbarTemplate, Navbar, NavController, Content} from 'ionic/ionic';

import {SinkPage} from '../sink-page';

@Component({
  selector: 'ion-view'
})
@View({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Aside</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Aside</h2>
    <p>
      Asides, also known as side menus or "hamburger" menus, are menus that slide
      or swipe in to show menus or information.
    </p>
    <p>
      Try it! Just swipe from the left edge of the screen to the right to expose
      the app menu.
    </p>
    <p>
      <div class="height: 50px; background-color: E05780; width: 5px; margin-left: -15px"></div>
    </p>
    <p>
      <button primary (click)="openMenu()">Open Menu</button>
    </p>
  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content, List, Item]
})
export class AsidePage extends SinkPage {
  constructor(app: IonicApp) {
    super(app);
  }
  openMenu() {

  }
}
