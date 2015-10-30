import {App, NavController} from 'ionic/ionic';
import {Page, Config, IonicApp} from 'ionic/ionic';
import {NavParams, NavController, ViewController} from 'ionic/ionic';


@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Login</ion-title>
    </ion-navbar>
    <ion-content style="text-align:center;" padding>
      <button (click)="goToAccount()">Login</button>
    </ion-content>
  `
})
export class Login {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  goToAccount() {
    this.nav.push(Account);
  }
}


 @Page({
  template: `
    <ion-menu [content]="content">
     <ion-toolbar secondary>
       <ion-title>Account Menu</ion-title>
     </ion-toolbar>
     <ion-content>
       <ion-list>
         <button ion-item (click)="goToProfile()">
           Profile
         </button>
         <button ion-item (click)="goToDashboard()">
           Dashboard
         </button>
         <button ion-item detail-none (click)="logOut()">
           Logout
         </button>
       </ion-list>
     </ion-content>
    </ion-menu>

    <ion-nav id="account-nav" [root]="rootPage" #content swipe-back-enabled="false"></ion-nav>
  `
})
export class Account {
  constructor(app: IonicApp) {
    this.app = app;
    this.rootPage = Dashboard;
  }

  goToProfile() {
    this.app.getComponent('account-nav').setRoot(Profile).then(() => {
      this.app.getComponent('menu').close();
    });
  }

  goToDashboard() {
    this.app.getComponent('account-nav').setRoot(Dashboard).then(() => {
      this.app.getComponent('menu').close();
    });
  }

  logOut() {
    this.app.getComponent('root-nav').setRoot(Login);
  }
}


@Page({
  template: `
    <ion-navbar *navbar primary>
      <ion-title>Account Dashboard</ion-title>
    </ion-navbar>
    <ion-content padding>
      Dashboard
    </ion-content>
  `
})
export class Dashboard {}


@Page({
  template: `
    <ion-navbar *navbar danger>
      <ion-title>Account Profile</ion-title>
    </ion-navbar>
    <ion-content padding>
      Profile
    </ion-content>
  `
})
export class Profile {}


@App({
  template: `<ion-nav id="root-nav" [root]="rootPage" swipe-back-enabled="false"></ion-nav>`
})
class E2EApp {
  constructor() {
    this.rootPage = Login;
  }
}
