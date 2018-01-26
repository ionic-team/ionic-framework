import { Component, NgModule, QueryList, ViewChildren } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, Tab } from '../../../..';


//
// Tab 1
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Heart</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <h2>Tab 1</h2>
    </ion-content>
    `
})
export class Tab1 {}

//
// Tab 2
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Star</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <h2>Tab 2</h2>
    </ion-content>
    `
})
export class Tab2 {}

//
// Tab 3
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Stopwatch</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <h2>Tab 3</h2>
    </ion-content>
    `
})
export class Tab3 {}

//
// Tab 3
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Quesarito</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <h2>Quesarito</h2>
    </ion-content>
    `
})
export class QuesaritoPage {}

@Component({
  template: `
    <ion-menu [content]="content">
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-title>Secret Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <button ion-item menuClose detail-none (click)="openPage('quesarito')">
            Quesarito
          </button>
        </ion-list>
      </ion-content>
    </ion-menu>

    <ion-tabs #content>
      <ion-tab tabTitle="Heart" tabIcon="heart" [root]="root1" #tab1></ion-tab>
      <ion-tab tabTitle="Star" tabIcon="star" [root]="root2"></ion-tab>
      <ion-tab tabTitle="Stopwatch" tabIcon="stopwatch" [root]="root3"></ion-tab>
    </ion-tabs>
  `
})
export class TabsPage {
  root1 = Tab1;
  root2 = Tab2;
  root3 = Tab3;

  @ViewChildren(Tab) tab: QueryList<Tab>;

  ngAfterViewInit() {
    console.log('Tab', this.tab);
    console.log(this.tab.first.setRoot);
  }

  openPage(which: string) {
    let pages: any = {
      'quesarito': QuesaritoPage
    };

    this.tab.first.setRoot(pages[which]);
  }

}

@NgModule({
  declarations: [
    Tab1,
    Tab2,
    Tab3,
    QuesaritoPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(TabsPage)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Tab1,
    Tab2,
    Tab3,
    QuesaritoPage,
    TabsPage
  ]
})
export class AppModule {}
