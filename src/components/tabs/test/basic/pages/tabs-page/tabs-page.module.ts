import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { TabsPage } from './tabs-page';
import { TabOneModule } from '../tab-one/tab-one.module';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    DeepLinkModule.forChild(TabsPage),
    TabOneModule
  ]
})
export class TabsPageModule {}
