import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

@Component({
  templateUrl: 'page.html',
  styleUrls: ['style.css']
})
export class Page1 {
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController) {}

  presentLoadingIos() {
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'This is the "ios" spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    loading.present();
  }

  presentLoadingDots() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'This is the "dots" spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    loading.present();
  }

  presentLoadingBubbles() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'This is the "bubbles" spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    loading.present();
  }

  presentLoadingCircles() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'This is the "circles" spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    loading.present();
  }

  presentLoadingCrescent() {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'This is the "crescent" spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    loading.present();
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'This is the mode specific spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    loading.present();
  }

  presentLoadingCustom() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>
        <div>This is a custom spinner. It will dismiss after 3 seconds.</div>`,
      duration: 3000
    });

    loading.present();
  }

  presentLoadingText() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'This has no spinner, only text. It will dismiss after 3 seconds.',
      duration: 3000
    });

    loading.present();
  }

  goToPage2() {
    let loading = this.loadingCtrl.create({
      content: 'This will navigate to the next page and then dismiss after 3 seconds.'
    });

    loading.present();

    setTimeout(() => {
      this.navCtrl.push(Page2);
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }
}


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Page 2</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>This is another page!</ion-content>
  `
})
export class Page2 {}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = Page1;
}
