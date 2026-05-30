import { Component, EventEmitter, Output } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dynamic-modal-content',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Dynamic Sheet Content</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p id="dynamic-component-loaded">Dynamic component rendered inside wrapper.</p>
      <ion-button id="dismiss-dynamic-modal" (click)="dismiss.emit()">Close</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class DynamicModalContentComponent {
  @Output() dismiss = new EventEmitter<void>();
}
