import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonRouterLink,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { BackHistoryBlockService } from './back-history-block.service';

@Component({
  selector: 'app-back-history-d',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone/back-history"></ion-back-button>
        </ion-buttons>
        <ion-title>Page D</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-checkbox id="block-guards" [checked]="blocker.block" (ionChange)="blocker.block = $event.detail.checked">
        Block guarded pages
      </ion-checkbox>
      <ion-button id="d-go-to-wrapped" routerLink="/standalone/back-history/wrapped">Go to wrapped page</ion-button>
      <ion-button id="d-shallow-url-update" (click)="shallowUrlUpdate()">Update the URL outside the router</ion-button>
      <ion-button id="d-replace-url-with-b" (click)="replaceUrlWithB()">Replace the URL with B outside the router</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [
    IonBackButton,
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonRouterLink,
    IonTitle,
    IonToolbar,
    RouterModule,
  ],
})
export class BackHistoryDComponent {
  blocker = inject(BackHistoryBlockService);
  private location = inject(Location);

  shallowUrlUpdate() {
    this.location.go('/standalone/back-history/d?shallow=1');
  }

  replaceUrlWithB() {
    this.location.replaceState('/standalone/back-history/b');
  }
}
