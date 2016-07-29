import { Component } from '@angular/core';
import { NavController, AlertController, Content } from '../../../../../dist';
import { NavParams, ViewController } from '../../../../../dist';
import { AnotherPage } from './AnotherPage.component';
import { FullPage } from './FullPage.component';
import { FirstPage } from './FirstPage.component';

@Component({
  template: `
    <ion-header>
      <ion-navbar primary>
        <ion-title>Primary Color Page Header</ion-title>
        <ion-buttons end>
          <button>S1g</button>
        </ion-buttons>
      </ion-navbar>
      <ion-toolbar no-border-top>
        <ion-title>I'm a sub header!</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding fullscreen>
      <p><button class="e2eFrom3To2" (click)="nav.pop()">Pop</button></p>
      <p><button (click)="pushAnother()">Push to AnotherPage</button></p>
      <p><button (click)="pushFullPage()">Push to FullPage</button></p>
      <p><button (click)="setRoot()">setRoot(AnotherPage)</button></p>
      <p><button (click)="nav.popToRoot()">Pop to root</button></p>
      <p><button id="insert" (click)="insert()">Insert first page into history before this</button></p>
      <p><button id="remove" (click)="removeSecond()">Remove second page in history</button></p>
      <div class="yellow"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>
      <ion-fixed style="bottom:0">
        <button (click)="presentAlert()">fixed button (alert)</button>
      </ion-fixed>
      <ion-fixed style="pointer-events: none; top:0; bottom:0; right:0; width:50%; background: rgba(0,0,0,0.5);"></ion-fixed>
    </ion-content>

    <ion-footer>
      <ion-toolbar no-border-bottom>
        I'm a sub footer!
      </ion-toolbar>
      <ion-toolbar no-border-top>
        <ion-title>Footer</ion-title>
      </ion-toolbar>
    </ion-footer>
  `
})
export class PrimaryHeaderPage {
  constructor(
    private nav: NavController,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController
  ) {}

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText('Previous');
  }

  pushAnother() {
    this.nav.push(AnotherPage);
  }

  pushFullPage() {
    this.nav.push(FullPage, { id: 8675309, myData: [1, 2, 3, 4] });
  }

  insert() {
    this.nav.insert(2, FirstPage);
  }

  removeSecond() {
    this.nav.remove(1);
  }

  setRoot() {
    this.nav.setRoot(AnotherPage);
  }

  presentAlert() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Hello Alert');
    alert.addButton({ text: 'Dismiss', role: 'cancel', });
    alert.present();
  }
}

