import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicAngularModule } from '@ionic/angular';

import { GroupInputsPageComponent } from './group-inputs-page.component';
import { GroupInputsPageRoutingModule } from './group-inputs-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GroupInputsPageRoutingModule,
    IonicAngularModule
  ],
  declarations: [GroupInputsPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GroupInputsPageModule {}
