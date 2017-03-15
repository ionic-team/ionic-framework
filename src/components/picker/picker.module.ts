import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { BackdropModule } from '../backdrop/backdrop.module';

import { PickerCmp } from './picker-component';
import { PickerColumnCmp } from './picker-column';

@NgModule({
  imports: [
    BackdropModule,
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
