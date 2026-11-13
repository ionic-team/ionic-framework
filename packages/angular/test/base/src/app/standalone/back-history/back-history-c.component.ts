import { Location } from '@angular/common';
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
  selector: 'app-back-history-c',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone/back-history"></ion-back-button>
        </ion-buttons>
        <ion-title>Page C</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="nav-pop" (click)="pop()">NavController.pop()</ion-button>
      <ion-button id="go-to-d" routerLink="/standalone/back-history/d">Go to D</ion-button>
      <ion-button id="go-to-guarded" routerLink="/standalone/back-history/guarded">Go to guarded page</ion-button>
      <ion-button id="go-to-wrapped" routerLink="/standalone/back-history/wrapped">Go to wrapped page</ion-button>
      <ion-button id="go-to-resolved" routerLink="/standalone/back-history/resolved">Go to resolved page</ion-button>
      <ion-button id="go-to-redirected" routerLink="/standalone/back-history/redirected">Go to a page that redirects to D</ion-button>
      <ion-button id="shallow-url-update" (click)="shallowUrlUpdate()">Update the URL outside the router</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar, RouterModule],
})
export class BackHistoryCComponent {
  private navCtrl = inject(NavController);
  private location = inject(Location);

  pop() {
    this.navCtrl.pop();
  }

  shallowUrlUpdate() {
    this.location.go('/standalone/back-history/c?shallow=1');
  }
}
