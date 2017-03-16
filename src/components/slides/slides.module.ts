import { NgModule, ModuleWithProviders } from '@angular/core';

import { Slide } from './slide';
import { Slides } from './slides';

/** @hidden */
@NgModule({
  declarations: [
    Slide,
    Slides
  ],
  exports: [
    Slide,
    Slides
  ]
})
export class SlidesModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SlidesModule, providers: []
    };
  }
}
