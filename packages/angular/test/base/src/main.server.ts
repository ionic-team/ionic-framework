import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

import { AppServerModule } from './app/app.server.module';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { renderModule } from '@angular/platform-server';

// Add a default export
export default AppServerModule;
