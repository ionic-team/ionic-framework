import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ButtonModule } from '../button/button.module';
import { BackdropModule } from '../backdrop/backdrop.module';

import { AlertCmp } from './alert-component';

/** @hidden */
@NgModule({
  imports: [
    BackdropModule,
    ButtonModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    AlertCmp
  ],
  exports: [
    AlertCmp
  ],
  entryComponents: [
    AlertCmp
  ]
})
export class AlertModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AlertModule, providers: []
    };
  }
}
