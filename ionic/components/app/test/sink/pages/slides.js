import {NgFor, DynamicComponentLoader, Injector, DomRenderer, ElementRef} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Slides, Slide, SlidePager, List, Item, ActionMenu, Modal, ModalRef,
  NavbarTemplate, Navbar, NavController, Content} from 'ionic/ionic';

@Component({
  selector: 'ion-view'
})
@View({
  template: `
  <ion-navbar *navbar><ion-title>Sink</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Slides</h2>
    <p>
      Slides have a set of pages that can be swiped between.
    </p>
    <p>
      Slides are perfect for making image slideshows,
      swipe tutorials, or document viewers.
    </p>
    <ion-slides>
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
export class SlidePage {
  constructor() {
  }
}
