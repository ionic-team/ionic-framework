import {Component, Directive, View} from 'angular2/angular2';
import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/forms';

import {IonicApp, Tabs, Tab, NavbarTemplate, Navbar, NavController, Content} from 'ionic/ionic';

import {SinkPage} from '../sink-page';

@Component({
  selector: 'ion-view'
})
@View({
  template: `
    <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Tabs</ion-title></ion-navbar>
    <ion-tabs>

      <ion-tab tab-title="Tab 1" tab-icon="ion-home">

        <ion-content class="padding">
          Tab 1 Content
        </ion-content>

      </ion-tab>

      <ion-tab tab-title="Tab 2" tab-icon="ion-star">

        <ion-content class="padding">
          Tab 2 Content
        </ion-content>

      </ion-tab>

    </ion-tabs>
  `,
  directives: [NavbarTemplate, Navbar, Content, Tabs, Tab]
})
export class TabsPage extends SinkPage {
  constructor(app: IonicApp) {
    super(app);
  }
}
