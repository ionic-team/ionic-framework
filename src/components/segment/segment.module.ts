import { NgModule, ModuleWithProviders } from '@angular/core';

import { Segment } from './segment';
import { SegmentButton } from './segment-button';

/** @hidden */
@NgModule({
  declarations: [
    Segment,
    SegmentButton
  ],
  exports: [
    Segment,
    SegmentButton
  ]
})
export class SegmentModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SegmentModule, providers: []
    };
  }
}
