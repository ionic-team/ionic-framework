import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageThree } from './page-three';
import { PageThreeRoutingModule } from './page-three-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PageThreeRoutingModule
  ],
  declarations: [
    PageThree
  ]
})
export class PageThreeModule { }
