import {NgFor, DynamicComponentLoader, Injector, DomRenderer, ElementRef} from 'angular2/angular2';
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
  <ion-navbar *navbar><ion-title>Lists</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Lists</h2>
    <p>
      Lists display data as rows in a table.
    </p>
    <p>
      Lists are great for displaying sets of things like contacts,
      songs, and documents.
    </p>

    <ion-list inset>
      <div class="list-header">
        List Header
      </div>
      <ion-item>
        <input control="email" type="email" placeholder="Your email">
      </ion-item>
      <div class="item">
        <div class="item-content">
          <div class="item-title">
            Item
          </div>
        </div>
      </div>
      <ion-item>Item</ion-item>
      <div class="list-footer">
        List Footer
      </div>
    </ion-list>
  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content, List, Item]
})
export class ListPage {
  constructor() {
  }
}
