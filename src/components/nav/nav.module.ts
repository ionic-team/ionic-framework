import { NgModule, ModuleWithProviders } from '@angular/core';

import { Nav } from './nav';
import { NavPop, } from './nav-pop';
import { NavPopAnchor } from './nav-pop-anchor';
import { NavPush } from './nav-push';
import { NavPushAnchor } from './nav-push-anchor';

/** @hidden */
@NgModule({
  declarations: [
    Nav,
    NavPop,
    NavPopAnchor,
    NavPush,
    NavPushAnchor,
  ],
  exports: [
    Nav,
    NavPop,
    NavPopAnchor,
    NavPush,
    NavPushAnchor,
  ]
})
export class NavModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NavModule, providers: []
    };
  }
}
