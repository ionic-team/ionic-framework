import { Component } from '@angular/core';
import { IonHeader } from '@ionic/angular/ion-header';
import { IonToolbar, } from '@ionic/angular/ion-toolbar';
import { IonTitle } from '@ionic/angular/ion-title';
import { IonToggle } from '@ionic/angular/ion-toggle';
import { IonContent } from '@ionic/angular/ion-content';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonToggle, IonContent],
})
export class HomePage {
  constructor() {}
}
