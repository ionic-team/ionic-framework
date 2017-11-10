import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputsTestPageComponent } from './inputs-test-page.component';

import { InputsRoutingModule } from './inputs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    InputsRoutingModule
  ],
  declarations: [InputsTestPageComponent]
})
export class InputsModule { }
