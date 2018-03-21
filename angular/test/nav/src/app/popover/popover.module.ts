import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicAngularModule } from '@ionic/angular';

import { PopoverPageComponent } from './popover-page.component';
import { PopoverRoutingModule } from './popover-routing.module';

import { PopoverPageToPresent } from './popover-page-to-present';

@NgModule({
  imports: [
    CommonModule,
    IonicAngularModule.forRoot(),
    PopoverRoutingModule
  ],
  declarations: [
    PopoverPageComponent,
    PopoverPageToPresent
  ],
  providers: [
  ],
  entryComponents: [
    PopoverPageToPresent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PopoverModule { }
