import { NgModule } from '@angular/core';

import { IonBooleanValueAccessorDirective } from './ion-boolean-value-accessor/ion-boolean-value-accessor.directive';
import { IonRadioValueAccessorDirective } from './ion-radio-value-accessor/ion-radio-value-accessor.directive';
import { IonSelectValueAccessorDirective } from './ion-select-value-accessor/ion-select-value-accessor.directive';
import { IonTextValueAccessorDirective } from './ion-text-value-accessor/ion-text-value-accessor.directive';

@NgModule({
  exports: [
    IonBooleanValueAccessorDirective,
    IonRadioValueAccessorDirective,
    IonSelectValueAccessorDirective,
    IonTextValueAccessorDirective
  ],
  declarations: [
    IonBooleanValueAccessorDirective,
    IonRadioValueAccessorDirective,
    IonSelectValueAccessorDirective,
    IonTextValueAccessorDirective
  ]
})
export class SharedModule {}
