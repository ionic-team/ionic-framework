import {App, Page, ActionSheet, Loading, NavController, ViewController, Platform} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  constructor(private nav: NavController, private platform: Platform) {}

  presentLoadingIos() {
    let loading = Loading.create({
      spinner: 'ios',
      duration: 2000
    });

    this.nav.present(loading);
  }

  presentLoadingDots() {
    let loading = Loading.create({
      spinner: 'dots',
      content: 'Loading...',
      duration: 2000
    });

    this.nav.present(loading);
  }

  presentLoadingBubbles() {
    let loading = Loading.create({
      spinner: 'bubbles',
      content: 'Loading...',
      duration: 2000
    });

    this.nav.present(loading);
  }

  presentLoadingCircles() {
    let loading = Loading.create({
      spinner: 'circles',
      content: 'Loading...',
      duration: 2000
    });

    this.nav.present(loading);
  }

  presentLoadingCrescent() {
    let loading = Loading.create({
      spinner: 'crescent',
      content: 'Please wait...',
      duration: 1500
    });

    this.nav.present(loading);
  }

  presentLoadingDefault() {
    let loading = Loading.create({
      content: 'Please wait...',
    });

    this.nav.present(loading);

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

  presentLoadingCustom() {
    let loading = Loading.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>`,
      duration: 2000
    });

    this.nav.present(loading);
  }

  presentLoadingText() {
    let loading = Loading.create({
      spinner: 'hide',
      content: 'Loading Please Wait...'
    });

    this.nav.present(loading);

    setTimeout(() => {
      this.goToPage2();
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

  goToPage2() {
    this.nav.push(Page2);
  }
}

@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Page 2</ion-title>
    </ion-navbar>
    <ion-content padding>Some content</ion-content>
  `
})
class Page2 {
  constructor(private nav: NavController, private platform: Platform) {}
}

@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

document.body.innerHTML += '<link href="styles.css" rel="stylesheet">'
