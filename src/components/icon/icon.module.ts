import { NgModule, ModuleWithProviders } from '@angular/core';

import { Icon } from './icon';

/** @hidden */
@NgModule({
  declarations: [
    Icon
  ],
  exports: [
    Icon
  ]
})
export class IconModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: IconModule, providers: []
    };
  }
}
