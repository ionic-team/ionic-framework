import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicAngularModule } from '@ionic/angular';

import { Menu } from './menu';

@NgModule({
  imports: [
    CommonModule,
    IonicAngularModule,
  ],
  declarations: [
    Menu,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MenuModule { }
