import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { IonicRouteReuseStrategy } from './ionic-reuse-strategy';
import { IonicRouterOutlet } from './ionic-router-outlet';
import { RouterIntegration } from './router-integration';

@NgModule({
  declarations: [
    IonicRouterOutlet
  ],
  exports: [
    IonicRouterOutlet
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IonicRouterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicRouterModule,
      providers: [
        RouterIntegration,
        {
          provide: RouteReuseStrategy,
          useClass: IonicRouteReuseStrategy
        }
      ]
    };
  }
}
