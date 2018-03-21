import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageOne } from './page-one';
import { PageOneRoutingModule } from './page-one-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PageOneRoutingModule
  ],
  declarations: [PageOne],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PageOneModule { }
