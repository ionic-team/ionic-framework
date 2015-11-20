import {NavController, NavParams} from 'ionic/ionic';
import {Page, ViewController, Platform} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../../helpers';


@Page({
  template: '' +
  '<ion-navbar *navbar hide-back-button [attr.royal]="isAndroid ? \'\' : null">' +
    '<ion-title>Tabs</ion-title>' +
  '</ion-navbar>' +
  '<ion-content>' +
  '</ion-content>',
  directives: [forwardRef(() => helpers.AndroidAttribute)],
})
class TabIconTextPage {
  constructor(platform: Platform) {
    this.platform = platform;
    this.isAndroid = platform.is('android');
  }
  onInit() {
    document.getElementById('md-tabs-icon-text').style.display = "block";
    document.getElementById('md-only').style.display = "none";
  }
  onDestroy() {
    document.getElementById('md-tabs-icon-text').style.display = "none";
    document.getElementById('md-only').style.display = "block";
  }
}

@Page({
  template:
  '<ion-tabs class="tabs-icon-text">' +
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
