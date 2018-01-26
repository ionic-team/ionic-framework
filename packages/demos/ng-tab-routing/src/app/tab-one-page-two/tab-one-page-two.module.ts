import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabOnePageTwo } from './tab-one-page-two';
import { TabOnePageTwoRoutingModule } from './tab-one-page-two-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TabOnePageTwoRoutingModule
  ],
  declarations: [TabOnePageTwo],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TabOnePageTwoModule { }
