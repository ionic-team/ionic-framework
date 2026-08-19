import { Component, VERSION } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonRouterLink, IonTitle, IonToolbar } from '@ionic/angular';

/**
 * Only the standalone bootstrap renders this page, so it can't rely on
 * AppModule's IonicModule scope. These imports register the custom elements.
 */
@Component({
  selector: 'app-landing',
  templateUrl: './app-landing.component.html',
  standalone: true,
  imports: [RouterLink, IonRouterLink, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar],
})
export class AppLandingComponent {
  angularVersion = VERSION;

  constructor() {}

}
