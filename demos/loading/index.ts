import {App, Page, ActionSheet, Loading, NavController, ViewController, Platform} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  constructor(private nav: NavController, private platform: Platform) {}

  presentLoadingIos() {
    let loading = Loading.create({
      spinner: 'ios',
      content: 'This will dismiss after 5 seconds, or you can click the backdrop to dismiss it now.',
      enableBackdropDismiss: true,
      duration: 5000
    });

    this.nav.present(loading);
  }

  presentLoadingDots() {
    let loading = Loading.create({
      spinner: 'dots',
      content: 'This will dismiss after 5 seconds, or you can click the backdrop to dismiss it now.',
      enableBackdropDismiss: true,
      duration: 5000
    });

    this.nav.present(loading);
  }

  presentLoadingBubbles() {
    let loading = Loading.create({
      spinner: 'bubbles',
      content: 'This will dismiss after 5 seconds, or you can click the backdrop to dismiss it now.',
      enableBackdropDismiss: true,
      duration: 5000
    });

    this.nav.present(loading);
  }

  presentLoadingCircles() {
    let loading = Loading.create({
      spinner: 'circles',
      content: 'This will dismiss after 5 seconds, or you can click the backdrop to dismiss it now.',
      enableBackdropDismiss: true,
      duration: 5000
    });

    this.nav.present(loading);
  }

  presentLoadingCrescent() {
    let loading = Loading.create({
      spinner: 'crescent',
      content: 'This will dismiss after 5 seconds, or you can click the backdrop to dismiss it now.',
      enableBackdropDismiss: true,
      duration: 5000
    });

    this.nav.present(loading);
  }

  presentLoadingDefault() {
    let loading = Loading.create({
      content: 'This will dismiss after 5 seconds, or you can click the backdrop to dismiss it now.',
      enableBackdropDismiss: true,
      duration: 5000
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
        <div>This will dismiss after 5 seconds, or you can click the backdrop to dismiss it now.</div>`,
      enableBackdropDismiss: true,
      duration: 5000
    });

    this.nav.present(loading);
  }

  presentLoadingText() {
    let loading = Loading.create({
      spinner: 'hide',
      content: 'This will dismiss after 5 seconds, or you can click the backdrop to dismiss it now.',
      enableBackdropDismiss: true,
      duration: 5000
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
