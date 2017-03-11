import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { TabsPage } from './tabs-page';
import { SearchPageModule } from '../search-page/search-page.module';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    DeepLinkModule.forChild(TabsPage),
    SearchPageModule
  ]
})
export class TabsPageModule {}
