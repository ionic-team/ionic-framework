import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicAngularModule } from '@ionic/angular';
import { VirtualScrollPageComponent } from './virtual-scroll-page.component';
import { VirtualScrollRoutingModule } from './virtual-scroll-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicAngularModule,
    VirtualScrollRoutingModule
  ],
  declarations: [VirtualScrollPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VirtualScrollModule { }
