import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { TabsPage } from './tabs-page';
import { TabOneModule } from '../tab-one/tab-one.module';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    TabOneModule
  ]
})
export class TabsPageModule {}
