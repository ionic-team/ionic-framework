import { NgModule, ModuleWithProviders } from '@angular/core';

import { BackdropModule } from '../backdrop/backdrop.module';

import { PopoverCmp } from './popover-component';

@NgModule({
  imports: [
    BackdropModule
  ],
  declarations: [
    PopoverCmp
  ],
  exports: [
    PopoverCmp
  ],
  entryComponents: [
    PopoverCmp
  ]
})
export class PopoverModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: PopoverModule, providers: []
    };
  }
}
