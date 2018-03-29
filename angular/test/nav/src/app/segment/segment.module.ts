import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SegmentPageComponent } from './segment-page.component';
import { SegmentRoutingModule } from './segment-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SegmentRoutingModule,
    IonicModule
  ],
  declarations: [SegmentPageComponent]
})
export class SegmentModule { }
