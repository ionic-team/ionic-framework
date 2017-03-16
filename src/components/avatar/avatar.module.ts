import { NgModule, ModuleWithProviders } from '@angular/core';

import { Avatar } from './avatar';

/** @hidden */
@NgModule({
  declarations: [
    Avatar
  ],
  exports: [
    Avatar
  ]
})
export class AvatarModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AvatarModule, providers: []
    };
  }
}
