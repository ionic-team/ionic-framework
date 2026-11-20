import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonRouterLink,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular';

@Component({
  selector: 'app-back-history-b',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone/back-history"></ion-back-button>
        </ion-buttons>
        <ion-title>Page B</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="go-to-c" routerLink="/standalone/back-history/c">Go to C</ion-button>
      <ion-button id="replace-with-c" (click)="replaceWithC()">Replace with C</ion-button>
      <ion-button id="root-to-c" (click)="rootToC()">Set C as root</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar, RouterModule],
})
export class BackHistoryBComponent {
  private navCtrl = inject(NavController);

  replaceWithC() {
    this.navCtrl.navigateForward('/standalone/back-history/c', { replaceUrl: true });
  }

  rootToC() {
    this.navCtrl.navigateRoot('/standalone/back-history/c');
  }
}
