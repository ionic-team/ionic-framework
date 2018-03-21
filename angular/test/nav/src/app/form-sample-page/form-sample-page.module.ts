import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicAngularModule } from '@ionic/angular';

import { FormSamplePageComponent } from './form-sample-page.component';
import { FormSamplePageRoutingModule } from './form-sample-page-routing.module';

@NgModule({
  imports: [
    FormSamplePageRoutingModule,
    CommonModule,
    FormsModule,
    IonicAngularModule
  ],
  declarations: [FormSamplePageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormSamplePageModule {}
