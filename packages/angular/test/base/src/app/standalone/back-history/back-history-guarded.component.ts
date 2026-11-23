import { Component } from '@angular/core';
import { IonBackButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-back-history-guarded',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone/back-history"></ion-back-button>
        </ion-buttons>
        <ion-title>Guarded Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-checkbox id="block-leave" [checked]="blockLeave" (ionChange)="blockLeave = $event.detail.checked">
        Block leaving
      </ion-checkbox>
    </ion-content>
  `,
  standalone: true,
  imports: [IonBackButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class BackHistoryGuardedComponent {
  /**
   * Read by the route's canDeactivate guard.
   */
  blockLeave = false;
}
