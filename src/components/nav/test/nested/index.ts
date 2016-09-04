import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, NavController, MenuController } from '../../../../../src';
import { Config, Nav, App } from '../../../../../src';


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Login</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content style="text-align:center;" padding>
      <p><button ion-button (click)="goToAccount()">Login</button></p>
      <p><button ion-button (click)="goBack()">App goBack()</button></p>
    </ion-content>
  `
})
export class Login {
  constructor(public navCtrl: NavController, public app: App) {}

  goToAccount() {
    this.navCtrl.push(Account);
  }

  goBack() {
    this.app.navPop();
  }
}


@Component({
  template: `
    <ion-menu [content]="content">
     <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>Account Menu</ion-title>
      </ion-toolbar>
     </ion-header>
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
         <button ion-item detail-none (click)="goBack()">
           App Go Back
         </button>
       </ion-list>
     </ion-content>
    </ion-menu>

    <ion-nav #accountNav #content [root]="root" swipeBackEnabled="false"></ion-nav>
  `
})
export class Account {
  @ViewChild('accountNav') accountNav: Nav;

  root = Dashboard;

  constructor(public menuCtrl: MenuController, public app: App) {}

  goToProfile() {
    this.accountNav.setRoot(Profile).then(() => {
      this.menuCtrl.close();
    });
  }

  goToDashboard() {
    this.accountNav.setRoot(Dashboard).then(() => {
      this.menuCtrl.close();
    });
  }

  logOut() {
    this.accountNav.setRoot(Login, null, { animate: true }).then(() => {
      this.menuCtrl.close();
    });
  }

  goBack() {
    this.app.navPop();
  }
}


@Component({
  template: `
    <ion-header>
      <ion-navbar color="primary">
        <button ion-button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Account Dashboard</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <p><button ion-button (click)="goToProfile()">Profile</button></p>
      <p><button ion-button (click)="logOut()">Logout</button></p>
      <p><button ion-button (click)="goBack()">App goBack()</button></p>
    </ion-content>
  `
})
export class Dashboard {
  constructor(public navCtrl: NavController, public app: App) {}

  goToProfile() {
    this.navCtrl.push(Profile);
  }

  logOut() {
    this.navCtrl.parent.setRoot(Login, null, {
      animate: true,
      direction: 'back'
    });
  }

  goBack() {
    this.app.navPop();
  }
}


@Component({
  template: `
    <ion-header>
      <ion-navbar color="danger">
        <button ion-button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Account Profile</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <p><button ion-button (click)="goToDashboard()">Dashboard</button></p>
      <p><button ion-button (click)="logOut()">Logout</button></p>
      <p><button ion-button (click)="goBack()">App goBack()</button></p>
    </ion-content>
  `
})
export class Profile {
  constructor(public navCtrl: NavController, public app: App) {}

  goToDashboard() {
    this.navCtrl.push(Dashboard);
  }

  logOut() {
    this.navCtrl.parent.setRoot(Login, null, {
      animate: true,
      direction: 'back'
    });
  }

  goBack() {
    this.app.navPop();
  }
}


@Component({
  template: `<ion-nav [root]="rootPage" swipeBackEnabled="false"></ion-nav>`
})
class E2EApp {
  rootPage = Login;
}

ionicBootstrap(E2EApp);
