import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SimpleNavPageComponent } from './simple-nav.component';
import { SimpleNavRoutingModule } from './simple-nav-routing.module';

import { IonicAngularModule, IonicRouterModule } from '@ionic/angular';

@NgModule({
  declarations: [
    SimpleNavPageComponent,
  ],
  imports: [
    CommonModule,
    IonicAngularModule,
    IonicRouterModule,
    SimpleNavRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SimpleNavModule {}
