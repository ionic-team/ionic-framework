import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { MustangPage } from './mustang.page';
import { MustangPageRoutingModule } from './mustang-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MustangPageRoutingModule
  ],
  declarations: [
    MustangPage
  ]
})
export class MustangModule {}
