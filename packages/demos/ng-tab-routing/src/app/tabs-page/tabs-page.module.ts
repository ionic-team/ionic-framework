import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonicAngularModule,
  IonicRouterModule
} from '@ionic/angular';

import { TabsPage } from './tabs-page';

import { TabsPageRoutingModule } from './tabs-page-routing.module';

import { TabOnePageOneModule } from '../tab-one-page-one/tab-one-page-one.module';
import { TabOnePageTwoModule } from '../tab-one-page-two/tab-one-page-two.module';
import { TabOnePageThreeModule } from '../tab-one-page-three/tab-one-page-three.module';

import { TabTwoPageOneModule } from '../tab-two-page-one/tab-two-page-one.module';
import { TabTwoPageTwoModule } from '../tab-two-page-two/tab-two-page-two.module';
import { TabTwoPageThreeModule } from '../tab-two-page-three/tab-two-page-three.module';

import { TabThreePageOneModule } from '../tab-three-page-one/tab-three-page-one.module';
import { TabThreePageTwoModule } from '../tab-three-page-two/tab-three-page-two.module';
import { TabThreePageThreeModule } from '../tab-three-page-three/tab-three-page-three.module';

@NgModule({
  imports: [
    CommonModule,
    TabsPageRoutingModule,
    IonicAngularModule,
    IonicRouterModule,
    TabOnePageOneModule,
    TabOnePageTwoModule,
    TabOnePageThreeModule,


    TabTwoPageOneModule,
    TabTwoPageTwoModule,
    TabTwoPageThreeModule,


    TabThreePageOneModule,
    TabThreePageTwoModule,
    TabThreePageThreeModule
  ],
  declarations: [
    TabsPage,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TabsPageModule { }
