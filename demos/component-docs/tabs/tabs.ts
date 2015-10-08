import {NavController, NavParams} from 'ionic/ionic';
import {IonicView, ViewController} from 'ionic/ionic';
import * as helpers from 'helpers';

@IonicView({
  template: 'Hello 1',
})
class TabOneCtrl {
  constructor(nav: NavController, view: ViewController) {
    this.nav = nav;
    this.view = view;
  }
}

@IonicView({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  constructor(nav: NavController, params: NavParams) {
    this.nav = nav;
  }
}