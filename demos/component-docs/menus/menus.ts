import {App, IonicApp, Page} from 'ionic/ionic';
import * as helpers from './helpers';

@Page({
  templateUrl: 'menus/menu-home.html'
})
class PageOne{
  constructor() {
  }
}

@Page({
  templateUrl: 'menus/menu-friends.html'
})
class PageTwo{
}

@Page({
  templateUrl: 'menus/menu-events.html'
})
class PageThree{
}

@Page({
  templateUrl: 'menus/menus.html'
})
export class MenusPage {

  constructor(app: IonicApp) {
    this.app = app;
    this.rootPage = PageOne;
    this.pages = [
      { title: 'Home', component: PageOne },
      { title: 'Friends', component: PageTwo },
      { title: 'Events', component: PageThree }
    ];

  }

  openPage(menu, page) {
    // close the menu when clicking a link from the menu
    this.app.getComponent('leftMenu').close();

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('menuNav');
    nav.setRoot(page.component);
  }
}
