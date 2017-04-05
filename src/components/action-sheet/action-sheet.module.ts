import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ButtonModule } from '../button/button.module';
import { BackdropModule } from '../backdrop/backdrop.module';
import { IconModule } from '../icon/icon.module';

import { ActionSheetCmp } from './action-sheet-component';

/** @hidden */
@NgModule({
  imports: [
    BackdropModule,
    ButtonModule,
    CommonModule,
    IconModule
  ],
  declarations: [
    ActionSheetCmp
  ],
  exports: [
    ActionSheetCmp
  ],
  entryComponents: [
    ActionSheetCmp
  ]
})
export class ActionSheetModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ActionSheetModule, providers: []
    };
  }
}
