import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/forms';

import {IonicApp, IonicView, NavController} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Featured</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
    '</ion-content>'
})
class FeaturedTabPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}

@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Top</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
    '</ion-content>'
})
class TopTabPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}

@IonicView({
  template: `
    <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Tabs</ion-title></ion-navbar>

    <ion-tabs id="tabs">
      <ion-tab tab-title="Featured" tab-icon="ion-ios-star" [root]="featuredTab"></ion-tab>
      <ion-tab tab-title="Top Charts" tab-icon="ion-ios-list-outline" [root]="topTab"></ion-tab>
      <ion-tab tab-title="Search" tab-icon="ion-ios-search">
        <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Search</ion-title></ion-navbar>
      </ion-tab>
      <ion-tab tab-title="Updates" tab-icon="ion-ios-download-outline">
        <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Updates</ion-title></ion-navbar>
      </ion-tab>
    </ion-tabs>
  `
})
export class TabsPage extends SinkPage {
  constructor(app: IonicApp) {
    super(app);
    this.featuredTab = FeaturedTabPage;
    this.topTab = TopTabPage;
  }
}
