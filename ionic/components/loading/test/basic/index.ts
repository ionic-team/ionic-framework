import {App, Page, ActionSheet, Loading, NavController, ViewController, Platform} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  constructor(private nav: NavController, private platform: Platform) {}

  showLoadingIos() {
    let loading = Loading.create({
      icon: 'ios',
      enableBackdropDismiss: true
    });

    this.nav.present(loading);
  }

  showLoadingDots() {
    let loading = Loading.create({
      icon: 'dots',
      content: 'Loading...',
      enableBackdropDismiss: true
    });

    this.nav.present(loading);
  }

  showLoadingBubbles() {
    let loading = Loading.create({
      icon: 'bubbles',
      content: 'Loading...',
      enableBackdropDismiss: true
    });

    this.nav.present(loading);
  }

  showLoadingCircles() {
    let loading = Loading.create({
      icon: 'circles',
      content: 'Loading...',
      enableBackdropDismiss: true
    });

    this.nav.present(loading);
  }

  showLoadingCrescent() {
    let loading = Loading.create({
      icon: 'crescent',
      content: 'Please wait...',
      enableBackdropDismiss: true,
      duration: 1500
    });

    this.nav.present(loading);
  }

  showLoadingDefault() {
    let loading = Loading.create({
      icon: 'platform',
      content: 'Please wait...',
      enableBackdropDismiss: true,
    });

    this.nav.present(loading);
  }

  showLoadingCustom() {
    let loading = Loading.create({
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>`,
      enableBackdropDismiss: true
    });

    this.nav.present(loading);
  }

  showLoadingText() {
    let loading = Loading.create({
      content: 'Loading Please Wait...',
      enableBackdropDismiss: true
    });

    this.nav.present(loading);
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
