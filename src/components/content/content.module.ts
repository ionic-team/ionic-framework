import { NgModule, ModuleWithProviders } from '@angular/core';

import { Content } from './content';

/** @hidden */
@NgModule({
  declarations: [
    Content
  ],
  exports: [
    Content
  ]
})
export class ContentModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ContentModule, providers: []
    };
  }
}
