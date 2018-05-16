import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BasicInputsPageComponent } from './basic-inputs-page.component';
import { BasicInputsPageRoutingModule } from './basic-inputs-page-routing.module';

@NgModule({
  imports: [
    BasicInputsPageRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [BasicInputsPageComponent]
})
export class BasicInputsPageModule {}
