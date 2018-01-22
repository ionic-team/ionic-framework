import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteReuseStrategy } from './reuse-strategy';

@NgModule({
})
export class IonicRouterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicRouterModule,
      providers: [
        {
          provide: RouteReuseStrategy,
          useClass: IonicRouteReuseStrategy
        }
      ]
    };
  }
}
