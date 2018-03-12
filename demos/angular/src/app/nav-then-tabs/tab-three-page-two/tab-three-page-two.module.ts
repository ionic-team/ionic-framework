import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabThreePageTwo } from './tab-three-page-two';
import { TabThreePageTwoRoutingModule } from './tab-three-page-two-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TabThreePageTwoRoutingModule
  ],
  declarations: [TabThreePageTwo],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TabThreePageTwoModule { }
