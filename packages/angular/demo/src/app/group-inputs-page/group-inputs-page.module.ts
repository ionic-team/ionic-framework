import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GroupInputsPageComponent } from './group-inputs-page.component';
import { GroupInputsPageRoutingModule } from './group-inputs-page-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GroupInputsPageRoutingModule,
    SharedModule
  ],
  declarations: [GroupInputsPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GroupInputsPageModule {}
