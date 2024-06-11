import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Commerce from '@chec/commerce.js';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Add this line
import '@capacitor/core';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));







