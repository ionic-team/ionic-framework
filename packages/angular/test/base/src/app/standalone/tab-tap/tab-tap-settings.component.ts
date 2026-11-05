import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-tab-tap-settings',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings Tab</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content></ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar],
})
export class TabTapSettingsComponent {}
