import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonToggle, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonToggle, IonContent],
})
export class HomePage {
  constructor() {}
}
