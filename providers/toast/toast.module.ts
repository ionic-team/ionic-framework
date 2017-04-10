import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { BackdropModule } from '../backdrop/backdrop.module';
import { ButtonModule } from '../button/button.module';

import { ToastCmp } from './toast-component';

/** @hidden */
@NgModule({
  imports: [
    BackdropModule,
    ButtonModule,
    CommonModule
  ],
  declarations: [
    ToastCmp
  ],
  exports: [
    ToastCmp
  ],
  entryComponents: [
    ToastCmp
  ]
})
export class ToastModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ToastModule, providers: []
    };
  }
}
