import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BooleanValueAccessor } from './control-value-accessors/boolean-value-accessor';
import { RadioValueAccessor } from './control-value-accessors/radio-value-accessor';
import { SelectValueAccessor } from './control-value-accessors/select-value-accessor';
import { TextValueAccessor } from './control-value-accessors/text-value-accessor';

import { IonNavDelegate } from './directives/ion-nav';

import { AlertController } from './providers/alert-controller';

@NgModule({
  declarations: [
    BooleanValueAccessor,
    IonNavDelegate,
    RadioValueAccessor,
    SelectValueAccessor,
    TextValueAccessor
  ],
  exports: [
    BooleanValueAccessor,
    IonNavDelegate,
    RadioValueAccessor,
    SelectValueAccessor,
    TextValueAccessor
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    AlertController
  ]
})
export class IonicAngularModule { }
