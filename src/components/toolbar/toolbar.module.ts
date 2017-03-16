import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { Footer } from './toolbar-footer';
import { Header } from './toolbar-header';
import { Toolbar } from './toolbar';
import { ToolbarItem } from './toolbar-item';
import { ToolbarTitle } from './toolbar-title';

/** @hidden */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    Footer,
    Header,
    Toolbar,
    ToolbarItem,
    ToolbarTitle
  ],
  exports: [
    Footer,
    Header,
    Toolbar,
    ToolbarItem,
    ToolbarTitle
  ]
})
export class ToolbarModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ToolbarModule, providers: []
    };
  }
}
