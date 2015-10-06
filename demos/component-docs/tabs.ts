import {NavController, NavParams} from 'ionic/ionic';
import {IonicView, ViewController, Events} from 'ionic/ionic';
import {MainPage} from 'index';
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
  constructor(nav: NavController, params: NavParams, events: Events) {
    this.nav = nav;
    this.TabOneRoot = TabOneCtrl;
    window.onmessage = (e) => {
      zone.run(() => {
        if (e.data) {
          var data = JSON.parse(e.data);
          var componentTitle = helpers.toTitleCase(data.hash.replace('-', ' '));
          this.nav.setRoot(MainPage, {location: componentTitle});
          events.publish('page:locationChange', { componentName: componentTitle });
        }
      });
    };

  }
}