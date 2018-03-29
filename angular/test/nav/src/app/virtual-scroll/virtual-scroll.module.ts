import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { VirtualScrollPageComponent } from './virtual-scroll-page.component';
import { VirtualScrollRoutingModule } from './virtual-scroll-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    VirtualScrollRoutingModule
  ],
  declarations: [VirtualScrollPageComponent]
})
export class VirtualScrollModule { }
