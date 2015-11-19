import {NavController, NavParams} from 'ionic/ionic';
import {Page, ViewController, Platform} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../../helpers';


@Page({
  template: '' +
  '<ion-navbar *navbar hide-back-button [attr.danger]="isAndroid ? \'\' : null">' +
  '<ion-title>Tabs</ion-title>' +
  '</ion-navbar>' +
  '<ion-content>' +
  '</ion-content>',
  directives: [forwardRef(() => helpers.AndroidAttribute)],
})
class TabIconPage {
  constructor(platform: Platform) {
    this.platform = platform;
    this.isAndroid = platform.is('android');
  }
}

@Page({
  template:
  '<ion-tabs class="tabs-icon">' +
  '<ion-tab tab-icon="contact" [root]="tabOne"></ion-tab>' +
  '<ion-tab tab-icon="compass" [root]="tabTwo"></ion-tab>' +
  '<ion-tab tab-icon="analytics" [root]="tabThree"></ion-tab>' +
  '<ion-tab tab-icon="settings" [root]="tabFour"></ion-tab>' +
  '</ion-tabs>',
})
export class IconPage {
  constructor() {
    this.tabOne = TabIconPage;
    this.tabTwo = TabIconPage;
    this.tabThree = TabIconPage;
    this.tabFour = TabIconPage;
  }
}
