import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { Select } from './select';

/** @hidden */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    Select
  ],
  exports: [
    Select
  ]
})
export class SelectModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SelectModule, providers: []
    };
  }
}
