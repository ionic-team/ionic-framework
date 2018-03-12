import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabTwoPageOne } from './tab-two-page-one';
import { TabTwoPageOneRoutingModule } from './tab-two-page-one-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TabTwoPageOneRoutingModule
  ],
  declarations: [TabTwoPageOne],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TabTwoPageOneModule { }
