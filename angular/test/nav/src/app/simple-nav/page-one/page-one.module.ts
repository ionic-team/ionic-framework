import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageOne } from './page-one';
import { PageOneRoutingModule } from './page-one-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PageOneRoutingModule
  ],
  declarations: [PageOne]
})
export class PageOneModule { }
