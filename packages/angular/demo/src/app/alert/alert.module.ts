import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertPageComponent } from './alert-page.component';
import { AlertRoutingModule } from './alert-routing.module';

import { AlertController } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    AlertRoutingModule
  ],
  declarations: [AlertPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AlertModule { }
