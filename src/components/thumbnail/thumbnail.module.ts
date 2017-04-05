import { NgModule, ModuleWithProviders } from '@angular/core';

import { Thumbnail } from './thumbnail';

/** @hidden */
@NgModule({
  declarations: [
    Thumbnail
  ],
  exports: [
    Thumbnail
  ]
})
export class ThumbnailModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ThumbnailModule, providers: []
    };
  }
}
