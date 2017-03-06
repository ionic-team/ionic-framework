import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { TabsPage } from './tabs';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    DeepLinkModule.forChild(TabsPage)
  ],
  entryComponents: [
    TabsPage,
  ]
})
export class TabsPageModule {}
