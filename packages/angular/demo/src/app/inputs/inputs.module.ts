import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputsTestPageComponent } from './inputs-test-page.component';

import { SharedModule } from '../shared/shared.module';
import { InputsRoutingModule } from './inputs-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, InputsRoutingModule, SharedModule],
  declarations: [InputsTestPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InputsModule {}
