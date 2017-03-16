import { NgModule, ModuleWithProviders } from '@angular/core';

import { VirtualFooter } from './virtual-footer';
import { VirtualHeader } from './virtual-header';
import { VirtualItem } from './virtual-item';
import { VirtualScroll } from './virtual-scroll';

/** @hidden */
@NgModule({
  declarations: [
    VirtualFooter,
    VirtualHeader,
    VirtualItem,
    VirtualScroll
  ],
  exports: [
    VirtualFooter,
    VirtualHeader,
    VirtualItem,
    VirtualScroll
  ]
})
export class VirtualScrollModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: VirtualScrollModule, providers: []
    };
  }
}
