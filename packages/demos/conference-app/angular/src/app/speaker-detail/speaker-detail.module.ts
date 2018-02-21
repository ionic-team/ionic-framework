import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpeakerDetailPage } from './speaker-detail';
import { SpeakerDetailPageRoutingModule } from './speaker-detail-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SpeakerDetailPageRoutingModule
  ],
  declarations: [
    SpeakerDetailPage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SpeakerDetailModule { }
