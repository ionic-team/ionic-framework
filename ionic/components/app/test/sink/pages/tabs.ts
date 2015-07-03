import {Component, Directive, View} from 'angular2/angular2';
import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/forms';

import {NavbarTemplate, Navbar, NavController, Content} from 'ionic/ionic';


@Component({
  selector: 'ion-view'
})
@View({
  template: `
    <ion-navbar *navbar><ion-title>Tabs</ion-title></ion-navbar>
    <ion-content class="padding"></ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content]
})
export class TabsPage {
  constructor() {
  }
}
