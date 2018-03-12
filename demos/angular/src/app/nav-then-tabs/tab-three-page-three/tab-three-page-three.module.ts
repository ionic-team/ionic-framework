import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabThreePageThree } from './tab-three-page-three';
import { TabThreePageThreeRoutingModule } from './tab-three-page-three-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TabThreePageThreeRoutingModule
  ],
  declarations: [TabThreePageThree],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TabThreePageThreeModule { }
