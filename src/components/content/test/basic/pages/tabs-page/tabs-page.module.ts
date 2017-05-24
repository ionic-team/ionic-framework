import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { TabsPage } from './tabs-page';
import { PageOneModule } from '../page-one/page-one.module';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    PageOneModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsPageModule {}
