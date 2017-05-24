import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsPageModule {}
