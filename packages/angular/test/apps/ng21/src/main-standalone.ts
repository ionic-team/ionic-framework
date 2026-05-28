import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';

import { AppStandaloneComponent } from './app/app-standalone.component';

import { routes } from './app/app.routes';

export const bootstrapStandalone = () => {
  // Angular 21 defaults bootstrapApplication to zoneless `NoopNgZone`, which
  // breaks Ionic's NgZone-based async lifecycle change detection. Registering
  // provideZoneChangeDetection() explicitly opts back into zone-based CD.
  bootstrapApplication(AppStandaloneComponent, {
    providers: [
      provideZoneChangeDetection(),
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideRouter(routes),
      provideIonicAngular({ keyboardHeight: 12345 })
    ],
  });
}
