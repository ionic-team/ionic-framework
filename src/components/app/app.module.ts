import { NgModule, ModuleWithProviders } from '@angular/core';

import { IonicApp } from './app-root';

import { NavModule } from '../nav/nav.module';

/** @hidden */
@NgModule({
  imports: [
    NavModule
  ],
  declarations: [
    IonicApp
  ],
  exports: [
    IonicApp
  ],
  entryComponents: [
    IonicApp
  ]
})
export class AppModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule, providers: []
    };
  }
}
