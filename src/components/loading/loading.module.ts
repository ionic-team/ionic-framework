import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { BackdropModule } from '../backdrop/backdrop.module';
import { SpinnerModule } from '../spinner/spinner.module';

import { LoadingCmp } from './loading-component';

/** @hidden */
@NgModule({
  imports: [
    BackdropModule,
    CommonModule,
    SpinnerModule
  ],
  declarations: [
    LoadingCmp
  ],
  exports: [
    LoadingCmp
  ],
  entryComponents: [
    LoadingCmp
  ]
})
export class LoadingModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LoadingModule, providers: []
    };
  }
}
