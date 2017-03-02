import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { TabsPage } from './tabs-page';

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
