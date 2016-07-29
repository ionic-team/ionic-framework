import { Component } from '@angular/core';
import { NavController, AlertController, Content } from '../../../../../dist';
import { NavParams, ViewController } from '../../../../../dist';
import { FullPage } from './FullPage.component';
import { PrimaryHeaderPage } from './PrimaryHeaderPage.component';
import { FirstPage } from './FirstPage.component';

@Component({
  template: `
    <ion-header>
      <ion-navbar hideBackButton>
        <ion-title>Another Page Header</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>

      <ion-toolbar no-border-top>
        I'm a sub header in the content!
      </ion-toolbar>

      <ion-list>

        <ion-item>
          <ion-label>Text Input</ion-label>
          <ion-textarea></ion-textarea>
        </ion-item>

        <ion-item>Back button hidden w/ <code>ion-navbar hideBackButton</code></ion-item>
        <button ion-item (click)="nav.pop()">Pop</button>
        <button ion-item (click)="pushFullPage()">Push to FullPage</button>
        <button ion-item (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button>
        <button ion-item (click)="pushFirstPage()">Push to FirstPage</button>
        <button ion-item (click)="setRoot()">setRoot(FirstPage)</button>
        <button ion-item (click)="toggleBackButton()">Toggle hideBackButton</button>
        <button ion-item (click)="setBackButtonText()">Set Back Button Text</button>
        <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      </ion-list>

      <ion-toolbar no-border-bottom>
        I'm a sub footer in the content!
      </ion-toolbar>

      <ion-toolbar no-border-bottom no-border-top>
        And I'm a sub footer in the content too!
      </ion-toolbar>

    </ion-content>

    <ion-footer>
      <ion-toolbar>
        Another Page Footer
      </ion-toolbar>
    </ion-footer>
  `
})
export class AnotherPage {
  bbHideToggleVal = false;
  bbCount = 0;

  constructor(
    private nav: NavController,
    private viewCtrl: ViewController
  ) {
    console.log('Page, AnotherPage, constructor', this.viewCtrl.id);
  }

  pushFullPage() {
    this.nav.push(FullPage);
  }

  pushPrimaryHeaderPage() {
    this.nav.push(PrimaryHeaderPage);
  }

  pushFirstPage() {
    this.nav.push(FirstPage);
  }

  setRoot() {
    this.nav.setRoot(FirstPage);
  }

  toggleBackButton() {
    this.bbHideToggleVal = !this.bbHideToggleVal;
    this.viewCtrl.showBackButton(this.bbHideToggleVal);
  }

  setBackButtonText() {
    let backButtonText = 'Messages';

    if (this.bbCount > 0) {
      backButtonText += ` (${this.bbCount})`;
    }

    this.viewCtrl.setBackButtonText(backButtonText);
    ++this.bbCount;
  }

  ionViewWillEnter() {
    console.log('Page, AnotherPage, ionViewWillEnter', this.viewCtrl.id);
  }

  ionViewDidEnter() {
    console.log('Page, AnotherPage, ionViewDidEnter', this.viewCtrl.id);
  }

  ionViewWillLeave() {
    console.log('Page, AnotherPage, ionViewWillLeave', this.viewCtrl.id);
  }

  ionViewDidLeave() {
    console.log('Page, AnotherPage, ionViewDidLeave', this.viewCtrl.id);
  }

  ionViewWillUnload() {
    console.log('Page, AnotherPage, ionViewWillUnload', this.viewCtrl.id);
  }

  ionViewDidUnload() {
    console.log('Page, AnotherPage, ionViewDidUnload', this.viewCtrl.id);
  }

  ngOnDestroy() {
    console.log('Page, AnotherPage, ngOnDestroy', this.viewCtrl.id);
  }
}

