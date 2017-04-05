import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, NavController, NavParams } from '../../../..';


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Root</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <button ion-button block (click)="pushPage()">Push Page</button>
    </ion-content>`,
})
export class FirstPage {
  constructor(public navCtrl: NavController) {}

  pushPage() {
    this.navCtrl.push(SecondPage);
  }
}


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Root</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <h1>Second page</h1>
      <button ion-button block (click)="insertPage()">Insert Page</button>
      <button ion-button block (click)="removePage()">Remove Page</button>
      <button ion-button block (click)="removeTwoPages()">Remove Two Pages</button>
      <button ion-button block (click)="testThing()">Test Thing</button>
    </ion-content>
  `
})
export class SecondPage {
  _index: number = 0;

  constructor(public navCtrl: NavController) {}

  insertPage() {
    this.navCtrl.insert(1, InsertPage, {
      index: this._index++
    }).then(() => {
      console.log('INSERTED! Stack:\n', this.navCtrl.getViews());
    });
  }

  removePage() {
    this.navCtrl.remove(1, 1).then(() => {
      console.log('REMOVED! Stack:\n', this.navCtrl.getViews());
    });
  }

  removeTwoPages() {
    this.navCtrl.remove(this.navCtrl.length() - 2, 2).then(() => {
      console.log('REMOVED TWO! Stack:\n', this.navCtrl.getViews());
    });
  }

  testThing() {
    console.log('TEST THING');
    this.navCtrl.push(InsertPage).then(() => {
      console.log('Pushed', this.navCtrl.getViews());
      console.log('Removing', this.navCtrl.getActive().index - 1);
      this.navCtrl.remove(this.navCtrl.getActive().index - 1, 1);
      console.log('REMOVED! Stack:\n', this.navCtrl.getViews());
    });
  }
}


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Inserted Paged {{index}}</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      Inserted Page
    </ion-content>
  `
})
export class InsertPage {
  index: any;
  constructor(params: NavParams) {
    this.index = params.get('index');
  }
}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class AppComponent {
  root = FirstPage;
}

@NgModule({
  declarations: [
    AppComponent,
    FirstPage,
    SecondPage,
    InsertPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    FirstPage,
    SecondPage,
    InsertPage
  ]
})
export class AppModule {}
