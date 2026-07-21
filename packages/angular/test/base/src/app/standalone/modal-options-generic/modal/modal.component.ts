import { Component, Input } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons } from '@ionic/angular/standalone';

@Component({
  selector: 'app-generic-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Generic Modal</ion-title>
        <ion-buttons slot="end">
          <ion-button id="close-modal" (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p id="greeting">{{ greeting }}</p>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons],
})
export class GenericModalComponent {
  @Input() greeting = '';
  modal: HTMLIonModalElement | undefined;

  dismiss() {
    this.modal?.dismiss();
  }
}
