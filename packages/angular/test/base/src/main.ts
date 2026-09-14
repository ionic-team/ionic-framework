import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

/**
 * The bootstrap is picked once, at page load, so a link into /lazy from a page
 * the standalone bootstrap rendered has to be a full page load. IonicModule.forRoot()
 * registers the Ionic elements from an APP_INITIALIZER, and Angular only runs those
 * at bootstrap, never for a lazily loaded child module. Router-navigate into /lazy
 * and ion-app and ion-router-outlet are never defined, so the page stays invisible.
 * Going the other way is fine, the loader has already run.
 */
const isLazy = window.location.href.includes('lazy');

if (isLazy) {
  document.addEventListener('DOMContentLoaded', () => {
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
