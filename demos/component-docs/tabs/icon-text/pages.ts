import {NavController, NavParams} from 'ionic/ionic';
import {Page, ViewController} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../../helpers';


@Page({
  template: '' +
  '<ion-navbar *navbar hide-back-button class="android-attr">' +
  '<ion-title>Tabs</ion-title>' +
  '</ion-navbar>' +
  '<ion-content>' +
  '</ion-content>',
  directives: [forwardRef(() => helpers.AndroidAttribute)],
})
class TabIconTextCtrl {
  constructor(nav: NavController, view: ViewController) {
    this.nav = nav;
    this.view = view;
  }
}

@Page({
  template:
  '<ion-tabs>' +
  '<ion-tab tab-icon="water" tab-title="Water" [root]="tabOne"></ion-tab>' +
  '<ion-tab tab-icon="leaf" tab-title="Life" [root]="tabTwo"></ion-tab>' +
  '<ion-tab tab-icon="flame" tab-title="Fire" [root]="tabThree"></ion-tab>' +
  '<ion-tab tab-icon="magnet" tab-title="Force" [root]="tabFour"></ion-tab>' +
  '</ion-tabs>',
})
export class IconTextPage {
  constructor(nav: NavController, params: NavParams) {
    this.nav = nav;
    this.tabOne = TabIconTextCtrl;
    this.tabTwo = TabIconTextCtrl;
    this.tabThree = TabIconTextCtrl;
    this.tabFour = TabIconTextCtrl;
  }
}
