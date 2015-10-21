import {NavController, NavParams} from 'ionic/ionic';
import {Page, ViewController} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../helpers';

@Page({
  template: 'Hello 1',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
class TabOneCtrl {
  constructor(nav: NavController, view: ViewController) {
    this.nav = nav;
    this.view = view;
  }
}

@Page({
  templateUrl: 'tabs/tabs.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
export class TabsPage {
  constructor(nav: NavController, params: NavParams) {
    this.nav = nav;
  }
}
