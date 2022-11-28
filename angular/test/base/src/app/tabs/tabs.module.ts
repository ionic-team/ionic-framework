import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';
import { TabsComponent } from './tabs.component';
import { TabsTab1Component } from '../tabs-tab1/tabs-tab1.component';
import { TabsTab2Component } from '../tabs-tab2/tabs-tab2.component';
import { TabsTab1NestedComponent } from '../tabs-tab1-nested/tabs-tab1-nested.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsComponent,
    TabsTab1Component,
    TabsTab2Component,
    TabsTab1NestedComponent
  ]
})
export class TabsPageModule {}
