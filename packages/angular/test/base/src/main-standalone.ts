import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular';

import { AppStandaloneComponent } from './app/app-standalone.component';
import { changeDetectionProviders } from './app/change-detection.providers';

import { routes } from './app/app.routes';

export const bootstrapStandalone = () => {
  bootstrapApplication(AppStandaloneComponent, {
    providers: [
      ...changeDetectionProviders,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideRouter(routes),
      provideIonicAngular({ keyboardHeight: 12345 })
    ],
  });
}
