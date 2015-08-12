import {IonicView, NavController} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-title>Navigation</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Navigation</h2>
    <p>
      Navigation makes your app feel like, well, an app!
    </p>
    <p>
      With the navigation features in Ionic, we can navigate to new pages,
      go back in history (including swipe-to-go-back), and control the stack
      of pages the user can navigate between.
    </p>
    <button (click)="push()">Push</button>
  </ion-content>
  `
})
export class NavPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  push() {
    this.nav.push(NavSecondPage);
  }
}


@IonicView({
  template: `
    <ion-navbar *navbar><ion-title>Second Page</ion-title></ion-navbar>
    <ion-content class="padding">
      <button (click)="nav.pop()">Pop</button>
    </ion-content>
  `
})
export class NavSecondPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
