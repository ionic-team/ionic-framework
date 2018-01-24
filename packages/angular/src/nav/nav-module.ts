import { ModuleWithProviders, NgModule } from '@angular/core';
import { ChildrenOutletContexts, } from '@angular/router';

import { IonicAngularModule } from '../module';

import { PushPopOutletContexts } from './router/push-pop-outlet-contexts';
import { IonNav  } from './ion-nav';

@NgModule({
  declarations: [
    IonNav
  ],
  imports: [
    IonicAngularModule
  ],
  exports: [
    IonNav
  ]
})
export class IonicRouterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicRouterModule,
      providers: [
        {
          provide: ChildrenOutletContexts,
          useClass: PushPopOutletContexts
        }
      ]
    };
  }
}