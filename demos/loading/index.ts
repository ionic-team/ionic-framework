import { Component, ViewEncapsulation } from '@angular/core';

import { ionicBootstrap, Loading, NavController, Platform } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class Page1 {
  constructor(private nav: NavController, private platform: Platform) {}

  presentLoadingIos() {
    let loading = Loading.create({
      spinner: 'ios',
      content: 'This is the "ios" spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    this.nav.present(loading);
  }

  presentLoadingDots() {
    let loading = Loading.create({
      spinner: 'dots',
      content: 'This is the "dots" spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    this.nav.present(loading);
  }

  presentLoadingBubbles() {
    let loading = Loading.create({
      spinner: 'bubbles',
      content: 'This is the "bubbles" spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    this.nav.present(loading);
  }

  presentLoadingCircles() {
    let loading = Loading.create({
      spinner: 'circles',
      content: 'This is the "circles" spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    this.nav.present(loading);
  }

  presentLoadingCrescent() {
    let loading = Loading.create({
      spinner: 'crescent',
      content: 'This is the "crescent" spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    this.nav.present(loading);
  }

  presentLoadingDefault() {
    let loading = Loading.create({
      content: 'This is the mode specific spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    this.nav.present(loading);
  }

  presentLoadingCustom() {
    let loading = Loading.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>
        <div>This is a custom spinner. It will dismiss after 3 seconds.</div>`,
      duration: 3000
    });

    this.nav.present(loading);
  }

  presentLoadingText() {
    let loading = Loading.create({
      spinner: 'hide',
      content: 'This has no spinner, only text. It will dismiss after 3 seconds.',
      duration: 3000
    });

    this.nav.present(loading);
  }

  goToPage2() {
    let loading = Loading.create({
      content: 'This will navigate to the next page and then dismiss after 3 seconds.'
    });

    this.nav.present(loading);

    setTimeout(() => {
      this.nav.push(Page2);
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }
}

@Component({
  template: `
    <ion-navbar *navbar>
      <ion-title>Page 2</ion-title>
    </ion-navbar>
    <ion-content padding>This is another page!</ion-content>
  `
})
class Page2 {
  constructor(private nav: NavController, private platform: Platform) {}
}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>',
  styleUrls: ['styles.css'],
  encapsulation: ViewEncapsulation.None
})
class ApiDemoApp {
  root = Page1;
}

ionicBootstrap(ApiDemoApp);
