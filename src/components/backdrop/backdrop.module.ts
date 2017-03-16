import { NgModule, ModuleWithProviders } from '@angular/core';

import { Backdrop } from './backdrop';

/** @hidden */
@NgModule({
  declarations: [
    Backdrop
  ],
  exports: [
    Backdrop
  ]
})
export class BackdropModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: BackdropModule, providers: []
    };
  }
}
