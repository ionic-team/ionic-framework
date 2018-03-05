import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { NavThenTabsPageComponent } from './nav-then-tabs.component';
import { NavThenTabsRoutingModule } from './nav-then-tabs-routing.module';

import { IonicAngularModule, IonicRouterModule } from '@ionic/angular';

@NgModule({
  declarations: [
    NavThenTabsPageComponent,
  ],
  imports: [
    CommonModule,
    IonicAngularModule,
    IonicRouterModule,
    NavThenTabsRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavThenTabsModule {}
