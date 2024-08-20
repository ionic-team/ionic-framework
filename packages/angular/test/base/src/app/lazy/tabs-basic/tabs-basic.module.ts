import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsBasicComponent } from './tabs-basic.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [
    TabsBasicComponent
  ]
})
export class TabsBasicPageModule {}
