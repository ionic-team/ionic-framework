import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { TabsComponent } from './tabs.component';
import { TabsRoutingModule } from './tabs-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TabsRoutingModule,
  ],
  declarations: [
    TabsComponent,
  ]
})
export class TabsModule {}
