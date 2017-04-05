import { NgModule, ModuleWithProviders } from '@angular/core';

import { Checkbox } from './checkbox';

/** @hidden */
@NgModule({
  declarations: [
    Checkbox
  ],
  exports: [
    Checkbox
  ]
})
export class CheckboxModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CheckboxModule, providers: []
    };
  }
}
