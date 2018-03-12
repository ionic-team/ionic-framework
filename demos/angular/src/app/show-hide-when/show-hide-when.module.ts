import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowHideWhenComponent } from './show-hide-when-page.component';
import { ShowHideWhenRoutingModule } from './show-hide-when-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ShowHideWhenRoutingModule
  ],
  declarations: [ShowHideWhenComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShowHideWhenModule { }
