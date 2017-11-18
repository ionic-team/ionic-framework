import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BasicInputsPageComponent } from './basic-inputs-page.component';

import { SharedModule } from '../shared/shared.module';
import { BasicInputsRoutingModule } from './basic-inputs-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, BasicInputsRoutingModule, SharedModule],
  declarations: [BasicInputsPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BasicInputsModule {}
