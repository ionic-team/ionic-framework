import {NavController, NavParams} from 'ionic/ionic';
import {Page, ViewController} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../helpers';


@Page({
  template: '' +
  '<ion-navbar *navbar hide-back-button class="android-attr">' +
  '<ion-title>Tabs</ion-title>' +
  '</ion-navbar>' +
  '<ion-content>' +
  '</ion-content>',
  directives: [forwardRef(() => helpers.AndroidAttribute)],
})
class TabIconCtrl {
  constructor(nav: NavController, view: ViewController) {
    this.nav = nav;
    this.view = view;
  }
}

@Page({
  template:
  '<ion-tabs>' +
  '<ion-tab tab-icon="contact" [root]="tabOne"></ion-tab>' +
  '<ion-tab tab-icon="compass" [root]="tabTwo"></ion-tab>' +
  '<ion-tab tab-icon="analytics" [root]="tabThree"></ion-tab>' +
  '<ion-tab tab-icon="settings" [root]="tabFour"></ion-tab>' +
  '</ion-tabs>',
})
export class TabsIconPage {
  constructor(nav: NavController, params: NavParams) {
    this.nav = nav;
    this.tabOne = TabIconCtrl;
    this.tabTwo = TabIconCtrl;
    this.tabThree = TabIconCtrl;
    this.tabFour = TabIconCtrl;
  }
}
