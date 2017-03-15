import { NgModule, ModuleWithProviders } from '@angular/core';

import { Chip } from './chip';

@NgModule({
  declarations: [
    Chip
  ],
  exports: [
    Chip
  ]
})
export class ChipModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChipModule, providers: []
    };
  }
}
