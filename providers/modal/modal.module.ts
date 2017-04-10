import { NgModule, ModuleWithProviders } from '@angular/core';

import { BackdropModule } from '../backdrop/backdrop.module';

import { ModalCmp } from './modal-component';

/** @hidden */
@NgModule({
  imports: [
    BackdropModule
  ],
  declarations: [
    ModalCmp
  ],
  exports: [
    ModalCmp
  ],
  entryComponents: [
    ModalCmp
  ]
})
export class ModalModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalModule, providers: []
    };
  }
}
