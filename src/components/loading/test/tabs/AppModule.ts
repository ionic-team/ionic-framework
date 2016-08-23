import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, LoadingController, NavController } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController) {}

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
      this.navCtrl.push(Page2);

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
export class Page2 {}

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
 root1 = E2EPage;
 root2 = Page2;
 root3 = E2EPage;
}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = TabsPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage,
    TabsPage,
    Page2
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage,
    TabsPage,
    Page2
  ]
})
export class AppModule {}
