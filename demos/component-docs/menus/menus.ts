import {App, IonicApp, IonicView, NavController, NavParams} from 'ionic/ionic';
import {IonicView, Events} from 'ionic/ionic';
import * as helpers from 'helpers';

@IonicView({
  templateUrl: 'menus/menu-home.html'
})
class PageOne{
  constructor(nav: NavController, events: Events) {
      this.nav = nav;
      this.events = events;
  }
}

@IonicView({
  templateUrl: 'menus/menu-friends.html'
})
class PageTwo{
}

@IonicView({
  templateUrl: 'menus/menu-events.html'
})
class PageThree{
}

@IonicView({
  templateUrl: 'menus/menus.html'
})
export class MenusPage {

  constructor(app: IonicApp, events: Events, nav: NavController) {
    this.nav = nav;
    this.app = app;
    this.rootView = PageOne;
    this.pages = [
      { title: 'Home', component: PageOne },
      { title: 'Friends', component: PageTwo },
      { title: 'Events', component: PageThree }
    ];

  }

  onViewWillUnload() {
  }

  openPage(menu, page) {
    // close the menu when clicking a link from the menu
    menu.close();

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // let nav = this.app.getComponent('nav');
    this.nav.setRoot(page.component);
  }
}


