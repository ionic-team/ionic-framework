import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { TabsPage } from './tabs-page';
import { PageOneModule } from '../page-one/page-one.module';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    DeepLinkModule.forChild(TabsPage),
    PageOneModule
  ],
  entryComponents: [
    TabsPage,
  ]
})
export class TabsPageModule {}
