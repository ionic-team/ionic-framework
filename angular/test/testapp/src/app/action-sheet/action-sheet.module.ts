import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ActionSheetPageComponent } from './action-sheet-page.component';
import { ActionSheetRoutingModule } from './action-sheet-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ActionSheetRoutingModule
  ],
  declarations: [ActionSheetPageComponent]
})
export class ActionSheetModule { }
