import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ToastPageComponent } from './toast-page.component';
import { ToastRoutingModule } from './toast-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ToastRoutingModule
  ],
  declarations: [ToastPageComponent]
})
export class ToastModule { }
