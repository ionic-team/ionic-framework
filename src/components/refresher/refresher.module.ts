import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';

import { Refresher } from './refresher';
import { RefresherContent } from './refresher-content';

/** @hidden */
@NgModule({
  imports: [
    CommonModule,
    IconModule,
    SpinnerModule
  ],
  declarations: [
    Refresher,
    RefresherContent
  ],
  exports: [
    Refresher,
    RefresherContent
  ]
})
export class RefresherModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: RefresherModule, providers: []
    };
  }
}
