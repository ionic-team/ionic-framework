import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, MenuController, NavController, AlertController, Nav, Refresher } from '../../../../../src';


@Component({
  templateUrl: 'page1.html'
})
class Page1 {
  constructor(private nav: NavController, private alertCtrl: AlertController) {}

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'New Friend!',
      message: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
      cssClass: 'my-alert',
      buttons: ['Ok']
    });
    alert.present();
  }

  goToPage1() {
    this.nav.push(Page1);
  }

  doRefresh(refresher: Refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  rootPage: any;
  changeDetectionCount: number = 0;
  pages: Array<{title: string, component: any}>;
  @ViewChild(Nav) nav: Nav;

  constructor(private menu: MenuController) {
    this.rootPage = Page1;

    this.pages = [
      { title: 'Page 1', component: Page1 },
      { title: 'Page 2', component: Page1 },
      { title: 'Page 3', component: Page1 },
    ];
  }

  openPage(page: any) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component).then(() => {
      // wait for the root page to be completely loaded
      // then close the menu
      this.menu.close();
    });
  }
}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
class E2EApp {
  rootPage = E2EPage;
}

ionicBootstrap(E2EApp);
