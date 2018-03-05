import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabThreePageOne } from './tab-three-page-one';
import { TabThreePageOneRoutingModule } from './tab-three-page-one-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TabThreePageOneRoutingModule
  ],
  declarations: [TabThreePageOne],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TabThreePageOneModule { }
