import { NgModule, ModuleWithProviders } from '@angular/core';

import { Toggle } from './toggle';

/** @hidden */
@NgModule({
  declarations: [
    Toggle
  ],
  exports: [
    Toggle
  ]
})
export class ToggleModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ToggleModule, providers: []
    };
  }
}
