import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, NavController, MenuController } from '../../../../../ionic-angular';


@Component({
  template: `
  <ion-header>
  <ion-navbar><ion-title>Navigation</ion-title></ion-navbar>
  </ion-header>
  <ion-content>
  <ion-list>
    <ion-item>Hola 1</ion-item>
    <ion-item>Hola 2</ion-item>
    <ion-item>Hola 3</ion-item>
    <button ion-item (click)="push()">Push</button>
    <ion-item>Hola</ion-item>
    <ion-item>Hola</ion-item>
    <ion-item>Hola</ion-item>

  </ion-list>
  </ion-content>
  `
})
export class SidePage {
  constructor(public navCtrl: NavController) { }
  push() {
    this.navCtrl.push(SidePage);
  }
}

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <button ion-button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>Page 2</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content padding>
    <h1>Page 2</h1>
  </ion-content>
  `
})
export class E2EPage2 {}


@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <button ion-button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>Navigation</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content padding>
    <h1>Page 1</h1>
    <button ion-button (click)="push()">Push</button>
    <button ion-button (click)="menu()">Open Menu</button>
    <div f></div>
    <div f></div>
    <div f></div>
    <div f></div>

  </ion-content>
  `
})
export class E2EPage {
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
  ) { }

  push() {
    this.navCtrl.push(E2EPage2);
  }

  menu() {
    this.menuCtrl.open();
  }
}


@Component({
  templateUrl: 'main.html'
})
export class E2EApp {
  root = E2EPage;
  root2 = SidePage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage,
    E2EPage2,
    SidePage,
  ],
  imports: [
    IonicModule.forRoot(E2EApp, {
      swipeBackEnabled: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage,
    E2EPage2,
    SidePage,
  ]
})
export class AppModule {}

