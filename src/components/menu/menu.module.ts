import { NgModule, ModuleWithProviders } from '@angular/core';

import { BackdropModule } from '../backdrop/backdrop.module';

import { Menu } from './menu';
import { MenuClose } from './menu-close';
import { MenuToggle } from './menu-toggle';

/** @hidden */
@NgModule({
  imports: [
    BackdropModule
  ],
  declarations: [
    Menu,
    MenuClose,
    MenuToggle
  ],
  exports: [
    Menu,
    MenuClose,
    MenuToggle
  ]
})
export class MenuModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: MenuModule, providers: []
    };
  }
}
