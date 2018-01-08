import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardPageComponent } from './card-page.component';
import { CardRoutingModule } from './card-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CardRoutingModule
  ],
  declarations: [CardPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardModule { }
