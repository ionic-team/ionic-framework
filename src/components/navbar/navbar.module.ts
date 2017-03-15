import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { Navbar } from './navbar';

import { IconModule } from '../icon/icon.module';

@NgModule({
  imports: [
    CommonModule,
    IconModule
  ],
  declarations: [
    Navbar
  ],
  exports: [
    Navbar
  ]
})
export class NavbarModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NavbarModule, providers: []
    };
  }
}
