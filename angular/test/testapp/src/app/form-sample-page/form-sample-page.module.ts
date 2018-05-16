import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormSamplePageComponent } from './form-sample-page.component';
import { FormSamplePageRoutingModule } from './form-sample-page-routing.module';

@NgModule({
  imports: [
    FormSamplePageRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [FormSamplePageComponent]
})
export class FormSamplePageModule {}
