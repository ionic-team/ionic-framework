import { NgModule } from '@angular/core';

import { IonBooleanValueAccessorDirective } from './ion-boolean-value-accessor/ion-boolean-value-accessor.directive';
import { IonTextValueAccessorDirective } from './ion-text-value-accessor/ion-text-value-accessor.directive';

@NgModule({
  exports: [IonBooleanValueAccessorDirective, IonTextValueAccessorDirective],
  declarations: [IonBooleanValueAccessorDirective, IonTextValueAccessorDirective]
})
export class SharedModule { }
