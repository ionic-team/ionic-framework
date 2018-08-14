import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { AlertPageComponent } from './alert-page.component';
import { AlertRoutingModule } from './alert-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AlertRoutingModule
  ],
  declarations: [AlertPageComponent]
})
export class AlertModule { }
