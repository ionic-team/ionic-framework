import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ChargerPage } from './charger.page';
import { ChargerPageRoutingModule } from './charger-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ChargerPageRoutingModule
  ],
  declarations: [
    ChargerPage
  ]
})
export class ChargerModule {}
