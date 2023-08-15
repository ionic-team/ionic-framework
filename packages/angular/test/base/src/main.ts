import { enableProdMode } from '@angular/core';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';

import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { AppComponentStandalone } from './app/app-standalone.component';

import { routes } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

const isLazy = window.location.href.includes('lazy');

if (isLazy) {
  document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
  });
} else {
  bootstrapApplication(AppComponentStandalone, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideRouter(routes),
      provideIonicAngular({ keyboardHeight: 12345 })
    ],
  });
}
