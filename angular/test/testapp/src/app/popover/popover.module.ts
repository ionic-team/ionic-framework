import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PopoverPageComponent } from './popover-page.component';
import { PopoverRoutingModule } from './popover-routing.module';

import { PopoverPageToPresent } from './popover-page-to-present';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
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
  ]
})
export class PopoverModule { }
