import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader } from '@ionic/angular/ion-header';
import { IonToolbar } from '@ionic/angular/ion-toolbar';
import { IonTitle } from '@ionic/angular/ion-title';
import { IonContent } from '@ionic/angular/ion-content';
import { IonButton } from '@ionic/angular/ion-button';

@Component({
  selector: 'app-landing',
  templateUrl: 'landing.page.html',
  styleUrls: ['landing.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, RouterLink],
})
export class LandingPage {
  constructor() {}
}
