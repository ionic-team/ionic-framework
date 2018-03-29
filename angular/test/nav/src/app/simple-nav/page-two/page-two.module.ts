import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { PageTwo } from './page-two';
import { PageTwoRoutingModule } from './page-two-routing.module';


@NgModule({
  imports: [
    CommonModule,
    PageTwoRoutingModule,
    IonicModule,
  ],
  declarations: [
    PageTwo,
  ]
})
export class PageTwoModule { }
