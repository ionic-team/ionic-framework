import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, NavController } from '../../../../../ionic-angular';


@Component({
  template: `
  <ion-header>
    <ion-navbar><ion-title>Nested 1</ion-title></ion-navbar>
  </ion-header>
  <ion-content padding>
    <button ion-button (click)="push()">Push</button>
    <div f></div>
    <div f></div>
    <div f></div>
    <div f></div>
  </ion-content>
  `
})
export class E2ENested {
  constructor(
    public navCtrl: NavController,
  ) { }

  push() {
    this.navCtrl.push(E2ENested);
  }
}

@Component({
  template: `
  <ion-header>
    <ion-navbar><ion-title>Nested 2</ion-title></ion-navbar>
  </ion-header>
  <ion-content padding>
    <button ion-button (click)="push()">Push</button>
    <div f></div>
    <div f></div>
    <div f></div>
    <div f></div>
  </ion-content>
  `
})
export class E2ENested2 {
  constructor(
    public navCtrl: NavController,
  ) { }

  push() {
    this.navCtrl.push(E2ENested2);
  }
}

@Component({
  template: `
  <ion-header>
    <ion-navbar><ion-title>Nested 3</ion-title></ion-navbar>
  </ion-header>
  <ion-content padding>
    <button ion-button (click)="push()">Push</button>
    <div f></div>
    <div f></div>
    <div f></div>
    <div f></div>
  </ion-content>
  `
})
export class E2ENested3 {
  constructor(
    public navCtrl: NavController,
  ) { }

  push() {
    this.navCtrl.push(E2ENested3);
  }
}


@Component({
  template: `
  <ion-header>
  <ion-navbar><ion-title>Navigation</ion-title></ion-navbar>
  </ion-header>
  <ion-content>
  <ion-list>
    <ion-item>Hola</ion-item>
    <ion-item>Hola</ion-item>
    <ion-item>Hola</ion-item>
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
<ion-split-panel>
  <ion-nav [root]="root"></ion-nav>

  <ion-split-panel when="lg" main >
    <ion-nav [root]="root2"></ion-nav>
    <ion-nav [root]="root3" main ></ion-nav>
  </ion-split-panel>

</ion-split-panel>
  `
})
export class E2EPage {
  root = E2ENested;
  root2 = E2ENested2;
  root3 = E2ENested3;
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
    SidePage,
    E2ENested,
    E2ENested2,
    E2ENested3
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
    SidePage,
    E2ENested,
    E2ENested2,
    E2ENested3
  ]
})
export class AppModule {}

