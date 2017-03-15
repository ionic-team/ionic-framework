import { NgModule, ModuleWithProviders } from '@angular/core';

import { Label } from './label';

@NgModule({
  declarations: [
    Label
  ],
  exports: [
    Label
  ]
})
export class LabelModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LabelModule, providers: []
    };
  }
}
