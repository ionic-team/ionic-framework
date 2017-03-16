import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, NavController, MenuController, SplitPane } from '../../../../../ionic-angular';

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
    <button ion-button (click)="menu1Active()">Enable menu 1</button>
    <button ion-button (click)="menu2Active()">Enable menu 2</button>
    <button ion-button (click)="menu3Active()">Enable menu 3</button>
    <button ion-button (click)="menu4Active()">Enable menu 4 (right)</button>

    <button ion-button (click)="disableAll()">Disable all</button>

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
  ) {
    this.menuCtrl.enable(false, 'menu4');
  }

  push() {
    this.navCtrl.push(E2EPage2);
  }

  menu1Active() {
    this.menuCtrl.enable(false, 'menu4');
    this.menuCtrl.enable(true, 'menu1');
  }
  menu2Active() {
    this.menuCtrl.enable(false, 'menu4');
    this.menuCtrl.enable(true, 'menu2');
  }
  menu3Active() {
    this.menuCtrl.enable(false, 'menu4');
    this.menuCtrl.enable(true, 'menu3');
  }
  menu4Active() {
    this.menuCtrl.enable(false, 'menu1');
    this.menuCtrl.enable(false, 'menu2');
    this.menuCtrl.enable(false, 'menu3');

    this.menuCtrl.enable(true, 'menu4');
  }
  disableAll() {
    this.menuCtrl.enable(false);
  }
}


@Component({
  templateUrl: 'main.html'
})
export class E2EApp {
  root = E2EPage;

  splitPaneChanged(splitPane: SplitPane) {
    console.log('Split pane changed, visible: ', splitPane.isVisible());
  }
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage,
    E2EPage2,
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
  ]
})
export class AppModule {}

