import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertPageComponent } from './alert-page.component';
import { AlertRoutingModule } from './alert-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AlertRoutingModule
  ],
  declarations: [AlertPageComponent]
})
export class AlertModule { }
