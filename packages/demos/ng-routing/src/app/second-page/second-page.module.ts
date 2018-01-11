import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecondPageComponent } from './second-page.component';
import { SecondPageRoutingModule } from './second-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SecondPageRoutingModule
  ],
  declarations: [SecondPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SecondPageModule { }
