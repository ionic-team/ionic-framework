import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { TabsPageComponent } from './tabs.component';
import { TabsRoutingModule } from './tabs-routing.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TabsRoutingModule,
  ],
  declarations: [
    TabsPageComponent,
  ]
})
export class TabsModule {}
