import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { HomePageComponent } from './home-page.component';
import { HomePageRoutingModule } from './home-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HomePageRoutingModule,
    IonicModule
  ],
  declarations: [HomePageComponent]
})
export class HomePageModule { }
