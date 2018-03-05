import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabTwoPageTwo } from './tab-two-page-two';
import { TabTwoPageTwoRoutingModule } from './tab-two-page-two-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TabTwoPageTwoRoutingModule
  ],
  declarations: [TabTwoPageTwo],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TabTwoPageTwoModule { }
