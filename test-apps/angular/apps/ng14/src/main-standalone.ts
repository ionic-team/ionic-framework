import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';

import { AppComponentStandalone } from './app/app-standalone.component';
import { AppRoutingModule } from './app/app-routing.module';

import { routes } from './app/app.routes';

export const bootstrapStandalone = () => {
  bootstrapApplication(AppComponentStandalone, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      /**
       * provideRouter is not available in Angular 14, so
       * we fallback to using AppRoutingModule
       */
      importProvidersFrom(AppRoutingModule),
      provideIonicAngular({ keyboardHeight: 12345 })
    ],
  });
}
