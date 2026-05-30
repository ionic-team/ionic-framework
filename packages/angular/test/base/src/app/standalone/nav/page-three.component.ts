import { Component } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-page-one',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goBack()">
            Back
          </ion-button>
        </ion-buttons>
        <ion-title>Page Three</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h1>Page Three</h1>
    </ion-content>
  `,
  standalone: true,
  imports: [IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class PageThreeComponent {
  // TODO: This is a workaround to have a working back button.
  // For some reason the back button is not working in this test,
  // possibly because the nav is nested in a router-outlet.
  async goBack() {
    const nav = document.querySelector('ion-nav');
    if (nav) {
      const canGoBack = await nav.canGoBack();
      if (canGoBack) {
        await nav.pop();
      }
    }
  }
}
