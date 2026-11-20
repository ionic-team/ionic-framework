import { Component } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-tab-tap-child',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone/tab-tap/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Child Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div style="height: 3000px"></div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class TabTapChildComponent {}
