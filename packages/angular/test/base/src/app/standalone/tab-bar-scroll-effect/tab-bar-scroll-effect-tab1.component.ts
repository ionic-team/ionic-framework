import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-tab-bar-scroll-effect-tab1',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="go-child" routerLink="/standalone/tab-bar-scroll-effect/tab1/child">Go to Child</ion-button>
      <ion-button id="go-child-effect" routerLink="/standalone/tab-bar-scroll-effect/tab1/child-effect">
        Go to Child with the tab bar effect
      </ion-button>
      <div style="height: 3000px"></div>
    </ion-content>
  `,
  standalone: true,
  imports: [RouterLink, IonButton, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class TabBarScrollEffectTab1Component {}
