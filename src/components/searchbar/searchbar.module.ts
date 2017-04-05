import { NgModule, ModuleWithProviders } from '@angular/core';

import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';

import { Searchbar } from './searchbar';

/** @hidden */
@NgModule({
  imports: [
    ButtonModule,
    IconModule
  ],
  declarations: [
    Searchbar
  ],
  exports: [
    Searchbar
  ]
})
export class SearchbarModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SearchbarModule, providers: []
    };
  }
}
