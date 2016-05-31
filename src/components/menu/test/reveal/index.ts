import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Nav} from '../../../../../src';


@Component({templateUrl: 'page1.html'})
class Page1 {}


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  @ViewChild(Nav) nav: Nav;

  rootView = Page1;

  openPage(menu, page) {
    // close the menu when clicking a link from the menu
    menu.close();

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(E2EApp);
