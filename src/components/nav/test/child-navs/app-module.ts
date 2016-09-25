import { NgModule, Component } from '@angular/core';
import { IonicApp, IonicModule, NavController } from '../../../..';

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`,
})
export class E2EApp {
  root = LandingPage;
}

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Landing Page Comp
      </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <button ion-button color="primary" (click)="goToPage()" class="nested-children-test">
      Nested Children Test
    </button>
  </ion-content>
  `
})
export class LandingPage {

  constructor(public navCtrl: NavController) {
  }

  goToPage() {
    this.navCtrl.push(FirstPage);
  }
}

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        First Page Comp
      </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <h3>Sub Header First Page</h3>
    <ion-nav [root]="root"></ion-nav>
  </ion-content>
  `
})
export class FirstPage {
  root = SecondPage;
}

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Second Page Comp
      </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <h3>Sub Header Second Page</h3>
    <ion-nav [root]="root"></ion-nav>
  </ion-content>
  `
})
export class SecondPage {
  root = ThirdPage;
}

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Third Page Comp
      </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <h3>Sub Header Third Page</h3>
    <ion-nav [root]="root"></ion-nav>
  </ion-content>
  `
})
export class ThirdPage {
  root = FourthPage;
}

@Component({
  template: `
  <ion-content>
    <ion-list>
      <ion-item *ngFor="let item of items">
        {{item}}
      </ion-item>
    </ion-list>
  </ion-content>
  `
})
export class FourthPage {
  items: string[];

  ionViewWillEnter() {
    let items: string[] = [];
    for ( let i = 0 ; i < 500; i++ ) {
      items.push(`Item ${(i + 1)}`);
    }
    this.items = items;
  }
}

@NgModule({
  declarations: [
    E2EApp,
    LandingPage,
    FirstPage,
    SecondPage,
    ThirdPage,
    FourthPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    LandingPage,
    FirstPage,
    SecondPage,
    ThirdPage,
    FourthPage
  ]
})
export class AppModule {}
