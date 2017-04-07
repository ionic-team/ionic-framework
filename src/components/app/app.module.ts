import { NgModule, ModuleWithProviders } from '@angular/core';

import { ClickBlock } from './click-block';
import { IonicApp } from './app-root';
import { OverlayPortal } from './overlay-portal';

/** @hidden */
@NgModule({
  declarations: [
    ClickBlock,
    IonicApp,
    OverlayPortal
  ],
  exports: [
    ClickBlock,
    IonicApp,
    OverlayPortal
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
