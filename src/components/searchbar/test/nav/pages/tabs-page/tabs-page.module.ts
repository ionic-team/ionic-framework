import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { TabsPage } from './tabs-page';
import { SearchPageModule } from '../search-page/search-page.module';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    SearchPageModule
  ]
})
export class TabsPageModule {}
