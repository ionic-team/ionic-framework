import {App, NavParams, NavController, ViewController, MenuController} from '../../../../../ionic/ionic';
import {Page, Config, IonicApp} from '../../../../../ionic/ionic';


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
  constructor(app: IonicApp, menu: MenuController) {
    this.app = app;
    this.menu = menu;
    this.rootPage = Dashboard;
  }

  goToProfile() {
    this.app.getComponent('account-nav').setRoot(Profile).then(() => {
      this.menu.close();
    });
  }

  goToDashboard() {
    this.app.getComponent('account-nav').setRoot(Dashboard).then(() => {
      this.menu.close();
    });
  }

  logOut() {
    this.app.getComponent('root-nav').setRoot(Login, null, { animate: true });
  }
}


@Page({
  template: `
    <ion-navbar *navbar primary>
      <button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>Account Dashboard</ion-title>
    </ion-navbar>
    <ion-content padding>
      <p><button (click)="goToProfile()">Profile</button></p>
      <p><button (click)="logOut()">Logout</button></p>
    </ion-content>
  `
})
export class Dashboard {
  constructor(app: IonicApp, nav: NavController) {
    this.app = app;
    this.nav = nav;
  }
  goToProfile() {
    this.nav.push(Profile);
  }
  logOut() {
    this.app.getComponent('root-nav').setRoot(Login, null, {
      animate: true,
      direction: 'back'
    });
  }
}


@Page({
  template: `
    <ion-navbar *navbar danger>
      <button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>Account Profile</ion-title>
    </ion-navbar>
    <ion-content padding>
      <p><button (click)="goToDashboard()">Dashboard</button></p>
      <p><button (click)="logOut()">Logout</button></p>
    </ion-content>
  `
})
export class Profile {
  constructor(app: IonicApp, nav: NavController) {
    this.app = app;
    this.nav = nav;
  }
  goToDashboard() {
    this.nav.push(Dashboard);
  }
  logOut() {
    this.app.getComponent('root-nav').setRoot(Login, null, {
      animate: true,
      direction: 'back'
    });
  }
}


@App({
  template: `<ion-nav id="root-nav" [root]="rootPage" swipe-back-enabled="false"></ion-nav>`
})
class E2EApp {
  constructor() {
    this.rootPage = Login;
  }
}
