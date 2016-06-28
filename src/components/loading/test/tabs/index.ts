import { Component} from '@angular/core';
import { ionicBootstrap, LoadingController, NavController } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  constructor(private loadingCtrl: LoadingController, private nav: NavController) {}

  presentLoading() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      duration: 1000
    });

    loading.present();
  }

  presentLoadingNav() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    loading.present();

    setTimeout(() => {
      this.nav.push(Page2);

      setTimeout(() => {
        loading.dismiss();
      }, 1000);
    }, 1000);
  }

}

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Page 2</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>Some content</ion-content>
  `
})
class Page2 {}

@Component({
  template: `
    <ion-tabs>
      <ion-tab tabTitle="Plain List" tabIcon="star" [root]="root1"></ion-tab>
      <ion-tab tabTitle="Schedule" tabIcon="globe" [root]="root2"></ion-tab>
      <ion-tab tabTitle="Stopwatch" tabIcon="stopwatch" [root]="root3"></ion-tab>
    </ion-tabs>
  `
})
export class TabsPage {
  private root1 = E2EPage;
  private root2 = Page2;
  private root3 = E2EPage;
}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = TabsPage;
}

ionicBootstrap(E2EApp);
