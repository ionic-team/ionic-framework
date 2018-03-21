import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionSheetPageComponent } from './action-sheet-page.component';
import { ActionSheetRoutingModule } from './action-sheet-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ActionSheetRoutingModule
  ],
  declarations: [ActionSheetPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActionSheetModule { }
