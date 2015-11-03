import {NavController, NavParams} from 'ionic/ionic';
import {Page, ViewController} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../helpers';

var TABS_DEMO_TMPL = '' +
'<ion-navbar *navbar hide-back-button class="android-attr">' +
'<ion-title>Tabs</ion-title>' +
'</ion-navbar>' +
'<ion-content>' +
'</ion-content>';

@Page({
  template: TABS_DEMO_TMPL,
  directives: [forwardRef(() => helpers.AndroidAttribute)],
})
class TabOneCtrl {
  constructor(nav: NavController, view: ViewController) {
    this.nav = nav;
    this.view = view;
  }
}

@Page({
  template: TABS_DEMO_TMPL,
  directives: [forwardRef(() => helpers.AndroidAttribute)],
})
class TabTwoCtrl {
  constructor(nav: NavController, view: ViewController) {
    this.nav = nav;
    this.view = view;
  }
}

@Page({
  template: TABS_DEMO_TMPL,
  directives: [forwardRef(() => helpers.AndroidAttribute)],
})
class TabThreeCtrl {
  constructor(nav: NavController, view: ViewController) {
    this.nav = nav;
    this.view = view;
  }
}

@Page({
  template: 
    '<ion-tabs>' +
      '<ion-tab tab-title="Food" tab-icon="pizza" [root]="tabOne"></ion-tab>' +
      '<ion-tab tab-title="Drinks" tab-icon="beer" [root]="tabTwo"></ion-tab>' +
      '<ion-tab tab-title="Hours" tab-icon="clock" [root]="tabThree"></ion-tab>' +
    '</ion-tabs>',
})
export class TabsPage {
  constructor(nav: NavController, params: NavParams) {
    this.nav = nav;
    this.tabOne = TabOneCtrl;
    this.tabTwo = TabTwoCtrl;
    this.tabThree = TabThreeCtrl;
  }
}
