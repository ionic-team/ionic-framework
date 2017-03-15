import { NgModule, ModuleWithProviders } from '@angular/core';

import { Checkbox } from './checkbox';

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
