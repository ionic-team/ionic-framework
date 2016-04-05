import {App, Page, ActionSheet, Loading, NavController, ViewController, Platform} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  constructor(private nav: NavController, private platform: Platform) {}

  presentLoadingIos() {
    let loading = Loading.create({
      spinner: 'ios',
      duration: 1000
    });

    this.nav.present(loading);
  }

  presentLoadingDots() {
    let loading = Loading.create({
      spinner: 'dots',
      content: 'Loading...',
      duration: 1000
    });

    this.nav.present(loading);
  }

  presentLoadingBubbles() {
    let loading = Loading.create({
      spinner: 'bubbles',
      content: 'Loading...',
      duration: 1000
    });

    this.nav.present(loading);
  }

  presentLoadingCircles() {
    let loading = Loading.create({
      spinner: 'circles',
      content: 'Loading...',
      duration: 1000
    });

    this.nav.present(loading);
  }

  presentLoadingCrescent() {
    let loading = Loading.create({
      spinner: 'crescent',
      content: 'Please wait...',
      duration: 1000
    });

    this.nav.present(loading);
  }

  // Pass the fixed-spinner class so we can turn off
  // spinner animation for the e2e test
  presentLoadingDefault() {
    let loading = Loading.create({
      content: 'Please wait...',
      cssClass: 'fixed-spinner'
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
      duration: 1000
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
      this.nav.push(Page2);
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

  goToPage2() {
    this.nav.push(Page2);
  }

  presentLoadingMultiple() {
    let loading = Loading.create({
      spinner: 'hide',
      content: 'Loading 1 Please Wait...'
    });

    this.nav.present(loading);

    let loading2 = Loading.create({
      spinner: 'hide',
      content: 'Loading 2 Please Wait...'
    });

    setTimeout(() => {
      this.nav.present(loading2);
    }, 1000);

    let loading3 = Loading.create({
      spinner: 'hide',
      content: 'Loading 3 Please Wait...'
    });

    setTimeout(() => {
      this.nav.present(loading3);

      setTimeout(() => {
        loading3.dismiss();
      }, 1000);

      setTimeout(() => {
        loading2.dismiss();
      }, 2000);

      setTimeout(() => {
        loading.dismiss();
      }, 3000);
    }, 2000);

  }

  presentLoadingMultipleNav() {
    let loading = Loading.create({
      spinner: 'hide',
      content: 'Loading 1 Please Wait...',
      dismissOnPageChange: true
    });

    this.nav.present(loading);

    let loading2 = Loading.create({
      spinner: 'hide',
      content: 'Loading 2 Please Wait...',
      dismissOnPageChange: true
    });

    setTimeout(() => {
      this.nav.present(loading2);
    }, 500);

    let loading3 = Loading.create({
      spinner: 'hide',
      content: 'Loading 3 Please Wait...',
      dismissOnPageChange: true
    });

    setTimeout(() => {
      this.nav.present(loading3);

      setTimeout(() => {
        this.nav.push(Page2);
      }, 1000);
    }, 1000);
  }
}

@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Page 2</ion-title>
    </ion-navbar>
    <ion-content padding>Some content</ion-content>
    <ion-toolbar position="bottom">
      <ion-buttons end>
        <button (click)="goToPage3()">
          Navigate
          <ion-icon name="arrow-forward"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  `
})
class Page2 {
  constructor(private nav: NavController, private platform: Platform) {}

  onPageLoaded() {
    setTimeout(() => {
      this.nav.push(Page3);
    }, 1000);
  }

  goToPage3() {
    this.nav.push(Page3);
  }
}

@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Page 3</ion-title>
    </ion-navbar>
    <ion-content padding>Some content</ion-content>
  `
})
class Page3 {
  constructor(private nav: NavController, private platform: Platform) {}
}

@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

document.body.innerHTML += '<link href="styles.css" rel="stylesheet">'
