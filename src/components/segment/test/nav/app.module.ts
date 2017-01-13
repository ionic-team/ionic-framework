import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, NavController } from '../../../..';


@Component({
  templateUrl: 'main.html',
})
export class SegmentPage {
  signInType: string;

  constructor(public navCtrl: NavController) {
    this.signInType = 'new';
  }

  goToPage2() {
    this.navCtrl.push(SegmentPage2);
  }
}

@Component({
  template: `
    <ion-header>
      <ion-navbar hideBackButton>
        <button ion-button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>
          Second Page
        </ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <h1>Page 2</h1>
    </ion-content>
  `
})
export class SegmentPage2 {}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class E2EApp {
  root = SegmentPage;
}

@NgModule({
  declarations: [
    E2EApp,
    SegmentPage,
    SegmentPage2
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    SegmentPage,
    SegmentPage2
  ]
})
export class AppModule {}
