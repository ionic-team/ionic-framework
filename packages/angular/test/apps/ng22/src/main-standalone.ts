import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular';

import { AppStandaloneComponent } from './app/app-standalone.component';

import { routes } from './app/app.routes';

export const bootstrapStandalone = () => {
  // Ionic 9 defaults to zoneless change detection. Angular 22 bootstraps zoneless
  // out of the box, so no change-detection provider is registered here.
  bootstrapApplication(AppStandaloneComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideRouter(routes),
      provideIonicAngular({ keyboardHeight: 12345 })
    ],
  });
}
