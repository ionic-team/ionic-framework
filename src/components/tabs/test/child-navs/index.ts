import {Component} from '@angular/core';
import {ionicBootstrap, NavController, App, Alert, Modal, ViewController, Tab, Tabs} from '../../../../../src';


//
// Tab 1
//
@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Tab 1
      </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content class="home">
    <ion-nav [root]="root"></ion-nav>
  </ion-content>
    `
})
class Tab1 {
  root = SecondPage;
}

//
// Tab 2
//
@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Tab 2
      </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content class="home">
    <ion-nav [root]="root"></ion-nav>
  </ion-content>
    `
})
class Tab2 {
  root = SecondPage;
}

//
// Tab 3
//
@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Tab 3
      </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content class="home">
    <ion-nav [root]="root"></ion-nav>
  </ion-content>
    `
})
class Tab3 {
  root = SecondPage;
}

@Component({
  template: `
  <ion-content class="home">
    <div>SecondPage Cmp</div>
    <ion-nav [root]="root"></ion-nav>
  </ion-content>
  `
})
class SecondPage{
  root = ThirdPage;
}

@Component({
  template: `
  <ion-content class="home">
    <div>ThirdPage Cmp</div>
    <ion-nav [root]="root"></ion-nav>
  </ion-content>
  `
})
class ThirdPage{
  root = FourthPage;
}

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Fourth Page Comp
      </ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-item *ngFor="let item of items">
        {{item}}
      </ion-item>
    </ion-list>
  </ion-content>
  `
})
class FourthPage{
  private items: string[];

  ionViewWillEnter(){
    let items: string[] = [];
    for ( let i = 0 ; i < 500; i++ ){
      items.push(`Item ${(i + 1)}`);
    }
    this.items = items;
  }
}


@Component({
  template: `
    <ion-tabs #content>
      <ion-tab tabTitle="Tab 1" tabIcon="star" [root]="root1"></ion-tab>
      <ion-tab tabTitle="Tab 2" tabIcon="globe" [root]="root2"></ion-tab>
      <ion-tab tabTitle="Tab 3" tabIcon="stopwatch" [root]="root3"></ion-tab>
    </ion-tabs>
  `
})
class TabsPage {
  root1 = Tab1;
  root2 = Tab2;
  root3 = Tab3;
}

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  root = TabsPage;
}

ionicBootstrap(E2EApp);
