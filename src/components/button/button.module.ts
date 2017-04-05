import { NgModule, ModuleWithProviders } from '@angular/core';

import { Button } from './button';

/** @hidden */
@NgModule({
  declarations: [
    Button
  ],
  exports: [
    Button
  ]
})
export class ButtonModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ButtonModule, providers: []
    };
  }
}
