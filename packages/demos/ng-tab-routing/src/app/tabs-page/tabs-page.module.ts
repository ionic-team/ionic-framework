import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonicAngularModule,
  IonicRouterModule
} from '@ionic/angular';

import { TabsPage } from './tabs-page';

import { TabsPageRoutingModule } from './tabs-page-routing.module';

import { TabOnePageOneModule } from '../tab-one-page-one/tab-one-page-one.module';
import { TabTwoPageOneModule } from '../tab-two-page-one/tab-two-page-one.module';
import { TabThreePageOneModule } from '../tab-three-page-one/tab-three-page-one.module';

@NgModule({
  imports: [
    CommonModule,
    TabsPageRoutingModule,
    IonicAngularModule,
    IonicRouterModule,
    TabOnePageOneModule,
    TabTwoPageOneModule,
    TabThreePageOneModule
  ],
  declarations: [
    TabsPage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TabsPageModule { }
