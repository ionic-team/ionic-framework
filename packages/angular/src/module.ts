
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IonNavDelegate } from './directives/ion-nav';
import { AlertController } from './providers/alert-controller';

@NgModule({
  declarations: [
    IonNavDelegate
  ],
  exports: [
    IonNavDelegate
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    AlertController
  ]
})
export class IonicAngularModule {

}