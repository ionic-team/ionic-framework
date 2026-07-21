import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons } from '@ionic/angular/standalone';
import { TestService } from '../test.service';

@Component({
  selector: 'app-modal-custom-injector-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal with Custom Injector</ion-title>
        <ion-buttons slot="end">
          <ion-button id="close-modal" (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p id="service-value">Service Value: {{ serviceValue }}</p>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons]
})
export class ModalCustomInjectorModalComponent implements OnInit {
  private testService = inject(TestService);
  serviceValue = '';
  modal: HTMLIonModalElement | undefined;

  ngOnInit() {
    this.serviceValue = this.testService.getValue();
  }

  dismiss() {
    this.modal?.dismiss();
  }
}
