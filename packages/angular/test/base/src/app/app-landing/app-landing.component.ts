import { Component, VERSION } from '@angular/core';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular';

/**
 * A fresh load of this page always runs the standalone bootstrap, and a back
 * navigation from /lazy lands here under the lazy one, so it can't rely on
 * AppModule's IonicModule scope. These imports register the custom elements.
 */
@Component({
  selector: 'app-landing',
  templateUrl: './app-landing.component.html',
  standalone: true,
  imports: [IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar],
})
export class AppLandingComponent {
  angularVersion = VERSION;

  constructor() {}

}
