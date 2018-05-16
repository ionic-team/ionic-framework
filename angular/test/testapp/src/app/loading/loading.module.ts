import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { LoadingPageComponent } from './loading-page.component';
import { LoadingRoutingModule } from './loading-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LoadingRoutingModule
  ],
  declarations: [LoadingPageComponent]
})
export class LoadingModule { }
