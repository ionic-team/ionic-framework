import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-nav-modal-root-page',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Nav Modal Root Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div id="nav-modal-root-content">Root page rendered inside nav</div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar],
})
export class NavModalRootPageComponent {}
