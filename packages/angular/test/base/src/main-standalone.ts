import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';

import { AppStandaloneComponent } from './app/app-standalone.component';

import { routes } from './app/app.routes';

export const bootstrapStandalone = () => {
  bootstrapApplication(AppStandaloneComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideRouter(routes),
      provideIonicAngular({ keyboardHeight: 12345 })
    ],
  });
}
