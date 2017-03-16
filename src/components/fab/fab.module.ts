import { NgModule, ModuleWithProviders } from '@angular/core';

import { IconModule } from '../icon/icon.module';

import { FabButton } from './fab';
import { FabContainer } from './fab-container';
import { FabList } from './fab-list';

/** @hidden */
@NgModule({
  imports: [
    IconModule
  ],
  declarations: [
    FabButton,
    FabContainer,
    FabList
  ],
  exports: [
    FabButton,
    FabContainer,
    FabList
  ]
})
export class FabModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: FabModule, providers: []
    };
  }
}
