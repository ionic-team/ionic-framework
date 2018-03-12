import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonicAngularModule,
  IonicRouterModule
} from '@ionic/angular';

import { PageTwo } from './page-two';
import { PageTwoRoutingModule } from './page-two-routing.module';


@NgModule({
  imports: [
    CommonModule,
    PageTwoRoutingModule,
    IonicAngularModule,
    IonicRouterModule
  ],
  declarations: [
    PageTwo,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PageTwoModule { }
