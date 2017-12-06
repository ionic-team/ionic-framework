import { Component } from '@angular/core';

import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-loading-page',
  template: `
  <ion-app>
  <ion-page class="show-page">
    <ion-header>
      <ion-toolbar>
        <ion-title>Test</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <ion-button (click)="clickMe()">Open Basic Loading</ion-button>
    </ion-content>
  </ion-page>
</ion-app>
  `
})
export class LoadingPageComponent {

  constructor(private loadingController: LoadingController) {

  }

  clickMe() {
    const loading = this.loadingController.create({
      duration: 2000,
      content: 'Ahem. Please wait.'
    });
    loading.present();
  }

}
