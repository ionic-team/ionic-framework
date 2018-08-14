import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { BadgePageComponent } from './badge-page.component';
import { BadgeRoutingModule } from './badge-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BadgeRoutingModule,
    IonicModule
  ],
  declarations: [BadgePageComponent]
})
export class BadgeModule { }
