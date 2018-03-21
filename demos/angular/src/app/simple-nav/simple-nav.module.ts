import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SimpleNavPageComponent } from './simple-nav.component';
import { SimpleNavRoutingModule } from './simple-nav-routing.module';

import { IonicAngularModule } from '@ionic/angular';

@NgModule({
  declarations: [
    SimpleNavPageComponent,
  ],
  imports: [
    CommonModule,
    IonicAngularModule,
    SimpleNavRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SimpleNavModule {}
