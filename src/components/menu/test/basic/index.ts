import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, MenuController, NavController, Alert, Nav} from '../../../../../src';


@Component({
  templateUrl: 'page1.html'
})
class Page1 {
  constructor(private nav: NavController) {}

  presentAlert() {
    let alert = Alert.create({
      title: "New Friend!",
      message: "Your friend, Obi wan Kenobi, just accepted your friend request!",
      cssClass: 'my-alert',
      buttons: ['Ok']
    });
    this.nav.present(alert);
  }

  goToPage2() {
    this.nav.push(Page2);
  }
}


@Component({templateUrl: 'page3.html'})
class Page3 {}


@Component({templateUrl: 'page2.html'})
class Page2 {
  constructor(private nav: NavController) {}

  page3() {
    this.nav.push(Page3);
  }
}


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  rootPage;
  changeDetectionCount: number = 0;
  pages: Array<{title: string, component: any}>;
  @ViewChild(Nav) nav: Nav;

  constructor(private menu: MenuController) {
    this.rootPage = Page1;

    this.pages = [
      { title: 'Page 1', component: Page1 },
      { title: 'Page 2', component: Page2 },
      { title: 'Page 3', component: Page3 },
    ];
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component).then(() => {
      // wait for the root page to be completely loaded
      // then close the menu
      this.menu.close();
    });
  }

  onDrag(ev) {
    console.log('Menu is being dragged', ev);
  }

  onOpen(ev) {
    console.log('Menu is open', ev);
  }

  onClose(ev) {
    console.log('Menu is closed', ev);
  }

  isChangeDetecting() {
    console.log('Change detection', ++this.changeDetectionCount);
    return true;
  }
}

ionicBootstrap(E2EPage);
