import { Component } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonNavLink, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { PageThreeComponent } from './page-three.component';

@Component({
  selector: 'app-page-two',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="goBack()">
            Back
          </ion-button>
        </ion-buttons>
        <ion-title>Page Two</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <h2>Page Two</h2>
      <ion-nav-link router-direction="forward" [component]="component">
        <ion-button>Go to Page Three</ion-button>
      </ion-nav-link>
    </ion-content>
  `,
  standalone: true,
  imports: [IonButton, IonButtons, IonHeader, IonNavLink, IonToolbar, IonTitle, IonContent],
})
export class PageTwoComponent {
  component = PageThreeComponent;

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
