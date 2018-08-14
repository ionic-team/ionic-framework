import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GroupInputsPageComponent } from './group-inputs-page.component';
import { GroupInputsPageRoutingModule } from './group-inputs-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GroupInputsPageRoutingModule,
    IonicModule
  ],
  declarations: [GroupInputsPageComponent]
})
export class GroupInputsPageModule {}
