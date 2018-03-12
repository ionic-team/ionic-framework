import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { NestedNavPageComponent } from './nested-nav.component';
import { NestedNavRoutingModule } from './nested-nav-routing.module';

import { IonicAngularModule, IonicRouterModule } from '@ionic/angular';

@NgModule({
  declarations: [
    NestedNavPageComponent,
  ],
  imports: [
    CommonModule,
    IonicAngularModule,
    IonicRouterModule,
    NestedNavRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NestedNavModule {}
