import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-tab-tap-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Home Tab</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="go-child" routerLink="/standalone/tab-tap/home/child">Go to Child</ion-button>
      <div style="height: 3000px"></div>
    </ion-content>
  `,
  standalone: true,
  imports: [RouterLink, IonButton, IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar],
})
export class TabTapHomeComponent {}
