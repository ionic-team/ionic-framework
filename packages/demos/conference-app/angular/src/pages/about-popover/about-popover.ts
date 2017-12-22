import { Component } from '@angular/core';

import { PublicNav } from '@ionic/core';
import { App } from '@ionic/angular';


@Component({
  template: `
    <ion-list>
      <button ion-item (click)="close('http://ionicframework.com/docs/v2/getting-started')">Learn Ionic</button>
      <button ion-item (click)="close('http://ionicframework.com/docs/v2')">Documentation</button>
      <button ion-item (click)="close('http://showcase.ionicframework.com')">Showcase</button>
      <button ion-item (click)="close('https://github.com/ionic-team/ionic')">GitHub Repo</button>
      <button ion-item (click)="support()">Support</button>
    </ion-list>
  `
})
export class PopoverPage {

  constructor(public app: App) { }

  support() {
    (this.app.getRootNavs()[0] as PublicNav).push('SupportPage');
    // this.viewCtrl.dismiss();
  }

  close(url: string) {
    window.open(url, '_blank');
    // this.viewCtrl.dismiss();
  }
}
