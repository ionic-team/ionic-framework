import { NgModule, ModuleWithProviders } from '@angular/core';

import { SplitPane } from './split-pane';

/** @hidden */
@NgModule({
  declarations: [
    SplitPane
  ],
  exports: [
    SplitPane
  ]
})
export class SplitPaneModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SplitPaneModule, providers: []
    };
  }
}
