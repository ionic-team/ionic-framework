import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavPageComponent } from './nav.component';
import { NavRoutingModule } from './nav-routing.module';
import { IonicAngularModule } from '@ionic/angular';

import { PageOneComponent } from './pages/page-one';

@NgModule({
  imports: [
    CommonModule,
    NavRoutingModule,
    IonicAngularModule
  ],
  declarations: [
    NavPageComponent,
    PageOneComponent
  ],
  entryComponents: [
    PageOneComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavModule { }
