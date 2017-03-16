import { NgModule, ModuleWithProviders } from '@angular/core';

import { Badge } from './badge';

/** @hidden */
@NgModule({
  declarations: [
    Badge
  ],
  exports: [
    Badge
  ]
})
export class BadgeModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: BadgeModule, providers: []
    };
  }
}
