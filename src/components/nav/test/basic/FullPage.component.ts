import { Component } from '@angular/core';
import { NavController, AlertController, Content } from '../../../../../dist';
import { App, IonicModule } from '../../../../../dist';
import { NavParams, ViewController } from '../../../../../dist';
import { FirstPage } from './FirstPage.component';
import { AnotherPage } from './AnotherPage.component';
import { PrimaryHeaderPage } from './PrimaryHeaderPage.component';

@Component({
  template: `
    <ion-content padding>
      <h1>Full page</h1>
      <p>This page does not have a nav bar!</p>
      <p><button (click)="nav.pop()">Pop</button></p>
      <p><button class="e2eFrom2To3" (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button></p>
      <p><button (click)="pushAnother()">Push to AnotherPage</button></p>
      <p><button (click)="pushFirstPage()">Push to FirstPage</button></p>
      <p><button class="e2eFrom2To1" nav-pop>Pop with NavPop (Go back to 1st)</button></p>
      <p><button (click)="setPages()">setPages() (Go to PrimaryHeaderPage, FirstPage 1st in history)</button></p>
      <p><button (click)="presentAlert()">Present Alert</button></p>
    </ion-content>
  `
})
export class FullPage {
  constructor(
    private nav: NavController,
    private app: App,
    private alertCtrl: AlertController,
    private params: NavParams
  ) {}

  setPages() {
    let items = [
      { page: FirstPage },
      { page: PrimaryHeaderPage }
    ];

    this.nav.setPages(items);
  }

  pushPrimaryHeaderPage() {
    this.nav.push(PrimaryHeaderPage);
  }

  pushAnother() {
    this.nav.push(AnotherPage);
  }

  pushFirstPage() {
    this.nav.push(FirstPage);
  }

  presentAlert() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Hello Alert');
    alert.setMessage('Dismiss this alert, then pop one page');
    alert.addButton({
      text: 'Dismiss',
      role: 'cancel',
      handler: () => {
        // overlays are added and removed from the root navigation
        // ensure you using the root navigation, and pop this alert
        // when the alert is done animating out, then pop off the active page
        this.app.getRootNav().pop().then(() => {
          this.app.getRootNav().pop();
        });

        // by default an alert will dismiss itself
        // however, we don't want to use the default
        // but rather fire off our own pop navigation
        // return false so it doesn't pop automatically
        return false;
      }
    });
    alert.present();
  }
}
