import { Component } from '@angular/core';
import { ionicBootstrap, NavController } from '../../../../../src';

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`,
})
class E2EApp {
  root = LandingPage;
}

ionicBootstrap(E2EApp);

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
    <button primary (click)="goToPage()" class="nested-children-test">
      Nested Children Test
    </button>
  </ion-content>
  `
})
class LandingPage {

  constructor(private nav: NavController) {
  }

  goToPage() {
    this.nav.push(FirstPage);
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
class FirstPage {
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
class SecondPage {
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
class ThirdPage {
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
class FourthPage {
  private items: string[];

  ionViewWillEnter() {
    let items: string[] = [];
    for ( let i = 0 ; i < 500; i++ ) {
      items.push(`Item ${(i + 1)}`);
    }
    this.items = items;
  }
}
