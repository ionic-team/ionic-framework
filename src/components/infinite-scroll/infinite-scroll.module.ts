import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { InfiniteScroll } from './infinite-scroll';
import { InfiniteScrollContent } from './infinite-scroll-content';

import { SpinnerModule } from '../spinner/spinner.module';

/** @hidden */
@NgModule({
  imports: [
    CommonModule,
    SpinnerModule
  ],
  declarations: [
    InfiniteScroll,
    InfiniteScrollContent
  ],
  exports: [
    InfiniteScroll,
    InfiniteScrollContent
  ]
})
export class InfiniteScrollModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: InfiniteScrollModule, providers: []
    };
  }
}
