import {NavController, NavParams} from 'ionic/ionic';
import {Page, ViewController, Platform} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import * as helpers from '../../helpers';


@Page({
  template: '' +
  '<ion-navbar *navbar hideBackButton [attr.royal]="isAndroid ? \'\' : null">' +
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
  onPageWillEnter() {
    console.log('enter');
    document.getElementById('md-tabs-icon-text').style.display = "block";
    document.getElementById('md-only').style.display = "none";
  }
}

@Page({
  template:
  '<ion-tabs class="tabs-icon-text">' +
    '<ion-tab tabIcon="water" tabTitle="Water" [root]="tabOne"></ion-tab>' +
    '<ion-tab tabIcon="leaf" tabTitle="Life" [root]="tabTwo"></ion-tab>' +
    '<ion-tab tabIcon="flame" tabTitle="Fire" [root]="tabThree"></ion-tab>' +
    '<ion-tab tabIcon="magnet" tabTitle="Force" [root]="tabFour"></ion-tab>' +
  '</ion-tabs>',
})
export class IconTextPage {
  constructor() {
    this.tabOne = TabIconTextPage;
    this.tabTwo = TabIconTextPage;
    this.tabThree = TabIconTextPage;
    this.tabFour = TabIconTextPage;
  }

  onPageWillLeave() {
    document.getElementById('md-tabs-icon-text').style.display = "none";
    document.getElementById('md-only').style.display = "block";
  }

}
