import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentPageComponent } from './content-page.component';
import { ContentRoutingModule } from './content-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule
  ],
  declarations: [ContentPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContentModule { }
