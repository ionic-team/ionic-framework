import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageTwo } from './page-two';
import { PageTwoSectionOne } from './page-two-section-one';
import { PageTwoSectionTwo } from './page-two-section-two';

import { PageTwoRoutingModule } from './page-two-routing.module';

import { IonicRouterModule } from '../../custom/ionic-router.module';

@NgModule({
  imports: [
    CommonModule,
    PageTwoRoutingModule,
    IonicRouterModule
  ],
  declarations: [
    PageTwo,
    PageTwoSectionOne,
    PageTwoSectionTwo
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PageTwoModule { }
