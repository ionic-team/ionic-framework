import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionDetailPage } from './session-detail';
import { SessionDetailPageRoutingModule } from './session-detail-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SessionDetailPageRoutingModule
  ],
  declarations: [
    SessionDetailPage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SessionDetailModule { }
