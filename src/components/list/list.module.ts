import { NgModule, ModuleWithProviders } from '@angular/core';

import { List } from './list';
import { ListHeader } from './list-header';

@NgModule({
  declarations: [
    List,
    ListHeader
  ],
  exports: [
    List,
    ListHeader
  ]
})
export class ListModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ListModule, providers: []
    };
  }
}
