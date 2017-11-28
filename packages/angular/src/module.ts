
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IonBooleanValueAccessor } from './directives/ion-boolean-value-accessor';
import { IonNavDelegate } from './directives/ion-nav';
import { IonRadioValueAccessor } from './directives/ion-radio-value-accessor';
import { IonSelectValueAccessor } from './directives/ion-select-value-accessor';
import { IonTextValueAccessor } from './directives/ion-text-value-accessor';

import { AlertController } from './providers/alert-controller';

@NgModule({
  declarations: [
    IonBooleanValueAccessor,
    IonNavDelegate,
    IonRadioValueAccessor,
    IonSelectValueAccessor,
    IonTextValueAccessor
  ],
  exports: [
    IonBooleanValueAccessor,
    IonNavDelegate,
    IonRadioValueAccessor,
    IonSelectValueAccessor,
    IonTextValueAccessor
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
