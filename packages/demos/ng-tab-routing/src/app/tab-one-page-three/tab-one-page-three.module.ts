import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabOnePageThree } from './tab-one-page-three';
import { TabOnePageThreeRoutingModule } from './tab-one-page-three-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TabOnePageThreeRoutingModule
  ],
  declarations: [TabOnePageThree],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TabOnePageThreeModule { }
