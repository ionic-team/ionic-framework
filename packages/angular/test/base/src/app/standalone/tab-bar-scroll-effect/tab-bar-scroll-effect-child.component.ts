import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-tab-bar-scroll-effect-child',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone/tab-bar-scroll-effect/tab1"></ion-back-button>
        </ion-buttons>
        <ion-title>Child</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [tabBarScrollEffect]="tabBarScrollEffect">
      <div style="height: 3000px"></div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class TabBarScrollEffectChildComponent {
  tabBarScrollEffect: boolean | undefined = inject(ActivatedRoute).snapshot.data['tabBarScrollEffect'];
}
