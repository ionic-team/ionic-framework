import { Component, VERSION } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonBackButton, IonButtons, IonContent, IonLabel, IonList, IonListHeader, IonHeader, IonItem, IonRouterLink, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [ IonBackButton, IonButtons, IonContent, IonLabel, IonList, IonHeader, IonListHeader, IonItem, IonRouterLink, IonTitle, IonToolbar, RouterModule ]
})
export class HomePageComponent {
  angularVersion = VERSION;

  constructor() {}
}
