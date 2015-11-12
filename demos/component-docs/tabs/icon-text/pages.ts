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
class TabIconTextPage {
  constructor() {
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
  constructor() {
    this.tabOne = TabIconTextPage;
    this.tabTwo = TabIconTextPage;
    this.tabThree = TabIconTextPage;
    this.tabFour = TabIconTextPage;
  }
}
