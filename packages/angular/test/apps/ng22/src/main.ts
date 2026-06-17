import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const isLazy = window.location.href.includes('lazy');

if (isLazy) {
  document.addEventListener('DOMContentLoaded', () => {
    // Ionic 9 defaults to zoneless change detection. Angular 22 bootstraps
    // zoneless out of the box, so no change-detection provider is registered.
    platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
  });
} else {
  /**
   * Importing standalone and lazy modules in the same
   * file creates side effects where manually generated components
   * such as ion-modal do not get bootstrapped correctly. Using
   * a dynamic import avoids this.
   */
  import('./main-standalone').then((module) => { module.bootstrapStandalone() });
}
