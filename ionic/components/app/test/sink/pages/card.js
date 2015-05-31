import {NgFor, DynamicComponentLoader, Injector, DomRenderer, ElementRef} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {List, Item, ActionMenu, Modal, ModalRef,
  NavbarTemplate, Navbar, NavController, Button, Content} from 'ionic/ionic';

@Component({
  selector: 'ion-view'
})
@View({
  template: `
  <ion-navbar *navbar><ion-title>Cards</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Cards</h2>
    <p>
      Cards are an emerging UI concept where a bit of content is displayed
      like it would be on an index card or a piece of paper.
    </p>
    <p>
      Cards are great for displaying contextual informaion in a small amount of space,
      like a Tweet, today's weather report, and a photo.
    </p>
    <div class="card">

      <div class="item card-header">
        <div class="item-content">
          <div class="item-label">
            Card Header
          </div>
        </div>
      </div>

      <div class="item">
          <div class="item-media">
            <img src="http://i.imgur.com/7BEPcGo.jpg">
          </div>
      </div>

      <div class="item card-footer">
        <div class="item-content">
          <div class="item-label">
            Card Footer
          </div>
        </div>
      </div>

    </div>
  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content, List, Item]
})
export class CardPage {
  constructor() {
  }
}
