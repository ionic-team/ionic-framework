import {App, NavController, Page, IonicApp, Modal} from 'ionic-angular';


@Page({
  template: `
  <ion-toolbar>
    <ion-title>This is a modal</ion-title>
    <button menuToggle>
      <ion-icon name="menu"></ion-icon>
    </button>
    <ion-buttons end>
      <button>
        <ion-icon name="funnel"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
  <ion-content>
    The modal should have status bar padding, too because it is a toolbar.
  </ion-content>

  `
})
class MyModal {

}


@Page({
  templateUrl: 'page1.html'
})
class Page1 {
  page2 = Page2;
  sort: string = 'all';
}


@Page({
  templateUrl: 'page2.html'
})
class Page2 {
  page3 = Page3;

  constructor(private nav: NavController) {

  }

  openModal() {
    let modal = Modal.create(MyModal);
    this.nav.present(modal);
  }
}


@Page({
  templateUrl: 'page3.html'
})
class Page3 {

  constructor(private nav: NavController) {

  }

  goBack() {
    this.nav.pop();
  }
}


@App({
  templateUrl: `./app.html`
})
class E2EApp {
  root = Page1;
}

// Add platform cordova and platform ios so the status bar
// padding will get added for each mode
document.body.classList.add('platform-cordova');
document.body.classList.add('platform-ios');
