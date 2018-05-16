import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgIfPageComponent } from './ng-if-page.component';
import { NgIfRoutingModule } from './ng-if-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgIfRoutingModule,
    IonicModule
  ],
  declarations: [NgIfPageComponent]
})
export class NgIfModule { }
