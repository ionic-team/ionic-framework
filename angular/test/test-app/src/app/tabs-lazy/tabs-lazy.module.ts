import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsLazyRoutingModule } from './tabs-lazy-routing.module';
import { TabsTab3Component } from './tabs-tab3/tabs-tab3.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [TabsTab3Component],
  imports: [
    CommonModule,
    IonicModule,
    TabsLazyRoutingModule
  ]
})
export class TabsLazyModule { }
