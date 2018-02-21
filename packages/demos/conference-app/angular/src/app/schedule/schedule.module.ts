import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicAngularModule, IonicRouterModule } from '@ionic/angular';

import { SchedulePage } from './schedule';
import { ScheduleFilterPage } from './schedule-filter';
import { SchedulePageRoutingModule } from './schedule-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicAngularModule.forRoot(),
    IonicRouterModule,
    SchedulePageRoutingModule
  ],
  declarations: [
    SchedulePage,
    ScheduleFilterPage
  ],
  entryComponents: [
    ScheduleFilterPage
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ScheduleModule { }
