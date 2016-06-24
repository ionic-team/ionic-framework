import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Nav, Alert} from '../../../../../src';


@Component({templateUrl: 'page1.html'})
class Page1 {}


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  @ViewChild(Nav) nav: Nav;

  rootView = Page1;

  openPage(menu: any, page: any) {
    // close the menu when clicking a link from the menu
    menu.close();

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  showAlert() {
    let alert = Alert.create({
      title: 'Alert example',
      buttons: ['Ok']
    });
    this.nav.present(alert);
  }
}

ionicBootstrap(E2EApp);
