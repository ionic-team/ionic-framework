import {Component, Directive, View} from 'angular2/angular2';

import {IonicApp, Slides, Slide, SlidePager, List, Item, ActionMenu, Modal, ModalRef,
  NavbarTemplate, Navbar, NavController, Content} from 'ionic/ionic';

import {SinkPage} from '../sink-page';

@Component({
  selector: 'ion-view'
})
@View({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Slides</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Slides</h2>
    <p>
      Slides have a set of pages that can be swiped between.
    </p>
    <p>
      Slides are perfect for making image slideshows,
      swipe tutorials, or document viewers.
    </p>
    <ion-slides style="left: -15px; right: -15px; height: 100px">
      <ion-slide style="background-color: blue">
        <h2>Page 1</h2>
      </ion-slide>
      <ion-slide style="background-color: yellow">
        <h2>Page 2</h2>
      </ion-slide>
      <ion-slide style="background-color: pink">
        <h2>Page 3</h2>
      </ion-slide>
      <ion-slide style="background-color: red">
        <h2>Page 4</h2>
      </ion-slide>
      <ion-slide style="background-color: cyan">
        <h2>Page 5</h2>
      </ion-slide>
      <ion-pager>
      </ion-pager>
    </ion-slides>
  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content, Slides, Slide, SlidePager]
})
export class SlidePage extends SinkPage {
  constructor(app: IonicApp) {
    super(app);
  }
}
