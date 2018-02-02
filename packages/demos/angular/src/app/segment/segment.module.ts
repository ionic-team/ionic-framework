import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SegmentPageComponent } from './segment-page.component';
import { SegmentRoutingModule } from './segment-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SegmentRoutingModule
  ],
  declarations: [SegmentPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SegmentModule { }
