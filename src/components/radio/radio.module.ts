import { NgModule, ModuleWithProviders } from '@angular/core';

import { RadioButton } from './radio-button';
import { RadioGroup } from './radio-group';

/** @hidden */
@NgModule({
  declarations: [
    RadioButton,
    RadioGroup
  ],
  exports: [
    RadioButton,
    RadioGroup
  ]
})
export class RadioModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: RadioModule, providers: []
    };
  }
}
