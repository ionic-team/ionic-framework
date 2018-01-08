import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BadgePageComponent } from './badge-page.component';
import { BadgeRoutingModule } from './badge-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BadgeRoutingModule
  ],
  declarations: [BadgePageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BadgeModule { }
