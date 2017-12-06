import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingPageComponent } from './loading-page.component';
import { LoadingRoutingModule } from './loading-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LoadingRoutingModule
  ],
  declarations: [LoadingPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoadingModule { }
