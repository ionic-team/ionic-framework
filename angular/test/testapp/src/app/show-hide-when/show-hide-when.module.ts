import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ShowHideWhenComponent } from './show-hide-when-page.component';
import { ShowHideWhenRoutingModule } from './show-hide-when-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ShowHideWhenRoutingModule
  ],
  declarations: [ShowHideWhenComponent]
})
export class ShowHideWhenModule { }
