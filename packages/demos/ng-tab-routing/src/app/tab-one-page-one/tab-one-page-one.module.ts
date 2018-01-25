import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabOnePageOne } from './tab-one-page-one';
import { TabOnePageOneRoutingModule } from './tab-one-page-one-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TabOnePageOneRoutingModule
  ],
  declarations: [TabOnePageOne],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TabOnePageOneModule { }
