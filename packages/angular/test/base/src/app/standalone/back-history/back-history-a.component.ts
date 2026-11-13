import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar, NavController } from '@ionic/angular';

@Component({
  selector: 'app-back-history-a',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Page A</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="go-to-b" routerLink="/standalone/back-history/b">Go to B</ion-button>
      <ion-button id="go-to-b-skip-location" (click)="goToBSkipLocation()">Go to B without changing the URL</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar, RouterModule],
})
export class BackHistoryAComponent {
  private navCtrl = inject(NavController);

  goToBSkipLocation() {
    this.navCtrl.navigateForward('/standalone/back-history/b', { skipLocationChange: true });
  }
}
