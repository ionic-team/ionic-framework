import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { CamaroPage } from './camaro.page';
import { CamaroPageRoutingModule } from './camaro-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CamaroPageRoutingModule
  ],
  declarations: [
    CamaroPage
  ]
})
export class CamaroModule {}
