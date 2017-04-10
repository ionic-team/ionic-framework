import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { DateTime } from './datetime';

/** @hidden */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DateTime
  ],
  exports: [
    DateTime
  ]
})
export class DateTimeModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: DateTimeModule, providers: []
    };
  }
}
