import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { Range } from './range';
import { RangeKnob } from './range-knob';

/** @hidden */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    Range,
    RangeKnob
  ],
  exports: [
    Range,
    RangeKnob
  ]
})
export class RangeModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: RangeModule, providers: []
    };
  }
}
