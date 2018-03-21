import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonicAngularModule,
} from '@ionic/angular';

import { PageTwo } from './page-two';
import { PageTwoRoutingModule } from './page-two-routing.module';


@NgModule({
  imports: [
    CommonModule,
    PageTwoRoutingModule,
    IonicAngularModule,
  ],
  declarations: [
    PageTwo,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PageTwoModule { }
