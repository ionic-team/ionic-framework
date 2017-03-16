import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { BackdropModule } from '../backdrop/backdrop.module';
import { ButtonModule } from '../button/button.module';

import { PickerCmp } from './picker-component';
import { PickerColumnCmp } from './picker-column';

/** @hidden */
@NgModule({
  imports: [
    BackdropModule,
    ButtonModule,
    CommonModule
  ],
  declarations: [
    PickerCmp,
    PickerColumnCmp
  ],
  exports: [
    PickerCmp,
    PickerColumnCmp
  ],
  entryComponents: [
    PickerCmp
  ]
})
export class PickerModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: PickerModule, providers: []
    };
  }
}
