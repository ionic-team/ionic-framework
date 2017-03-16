import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { Spinner } from './spinner';

/** @hidden */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    Spinner
  ],
  exports: [
    Spinner
  ]
})
export class SpinnerModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SpinnerModule, providers: []
    };
  }
}
