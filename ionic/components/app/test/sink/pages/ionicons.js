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
  <ion-navbar *navbar><ion-title>Ionicons</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Ionicons</h2>
    <p>
      Ionic comes with a totally free (in price and license), icon pack with over 700
      icons for your app.
    </p>
    <p>
      Ionicons is an icon font, and can be used with simple CSS icon classes (recommended), or
      with unicode characters.
    </p>
    <div>
    </div>
  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content, List, Item]
})
export class IconsPage {
  constructor() {
  }
}
