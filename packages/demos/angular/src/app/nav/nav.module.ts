import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavPageComponent } from './nav.component';
import { NavRoutingModule } from './nav-routing.module';
import { IonicAngularModule } from '@ionic/angular';

import { PageOne } from './pages/page-one';
import { PageTwo } from './pages/page-two';
import { PageThree } from './pages/page-three';

@NgModule({
  imports: [
    CommonModule,
    NavRoutingModule,
    IonicAngularModule
  ],
  declarations: [
    NavPageComponent,
    PageOne,
    PageTwo,
    PageThree
  ],
  entryComponents: [
    PageOne,
    PageTwo,
    PageThree
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavModule { }
