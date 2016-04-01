import {App, Page, ActionSheet, Loading, NavController, ViewController, Platform} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
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
