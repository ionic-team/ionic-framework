import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabTwoPageThree } from './tab-two-page-three';
import { TabTwoPageThreeRoutingModule } from './tab-two-page-three-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TabTwoPageThreeRoutingModule
  ],
  declarations: [TabTwoPageThree],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TabTwoPageThreeModule { }
