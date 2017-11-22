import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BasicInputsPageComponent } from './basic-inputs-page.component';

import { SharedModule } from '../shared/shared.module';
import { BasicInputsPageRoutingModule } from './basic-inputs-page-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, BasicInputsPageRoutingModule, SharedModule],
  declarations: [BasicInputsPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BasicInputsPageModule {}
