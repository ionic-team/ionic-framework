import { Component } from '@angular/core';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonNavLink, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { PageTwoComponent } from './page-two.component';

@Component({
  selector: 'app-page-one',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone"></ion-back-button>
        </ion-buttons>
        <ion-title>Page One</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <h1>Page One</h1>
      <ion-nav-link router-direction="forward" [component]="component">
        <ion-button>Go to Page Two</ion-button>
      </ion-nav-link>
    </ion-content>
  `,
  standalone: true,
  imports: [IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonNavLink, IonToolbar, IonTitle],
})
export class PageOneComponent {
  component = PageTwoComponent;
}
