import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ButtonPageComponent } from './button-page.component';
import { ButtonRoutingModule } from './button-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ButtonRoutingModule,
    IonicModule
  ],
  declarations: [ButtonPageComponent]
})
export class ButtonModule { }
