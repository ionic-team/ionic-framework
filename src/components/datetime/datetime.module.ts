import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ButtonModule } from '../button/button.module';

import { DateTime } from './datetime';

@NgModule({
  imports: [
    ButtonModule,
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
