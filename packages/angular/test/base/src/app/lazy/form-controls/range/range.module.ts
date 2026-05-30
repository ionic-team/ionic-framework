import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RangeRoutingModule } from './range-routing.module';
import { RangeComponent } from './range.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RangeRoutingModule
  ],
  declarations: [
    RangeComponent
  ]
})
export class RangeModule { }
