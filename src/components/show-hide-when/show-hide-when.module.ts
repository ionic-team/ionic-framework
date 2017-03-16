import { NgModule, ModuleWithProviders } from '@angular/core';

import { ShowWhen } from './show-when';
import { HideWhen } from './hide-when';

/** @hidden */
@NgModule({
  declarations: [
    ShowWhen,
    HideWhen
  ],
  exports: [
    ShowWhen,
    HideWhen
  ]
})
export class ShowHideWhenModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ShowHideWhenModule, providers: []
    };
  }
}
