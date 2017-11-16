import { NgModule } from '@angular/core';

import { IonCheckboxValueAccessorDirective } from './ion-checkbox-value-accessor.directive';
import { IonInputValueAccessorDirective } from './ion-input-value-accessor.directive';

@NgModule({
  exports: [IonCheckboxValueAccessorDirective, IonInputValueAccessorDirective],
  declarations: [IonCheckboxValueAccessorDirective, IonInputValueAccessorDirective]
})
export class SharedModule { }
