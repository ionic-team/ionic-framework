import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastPageComponent } from './toast-page.component';
import { ToastRoutingModule } from './toast-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ToastRoutingModule
  ],
  declarations: [ToastPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToastModule { }
