import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { TabsPageOne } from './tabs-page-one';

@NgModule({
  declarations: [
    TabsPageOne,
  ],
  imports: [
    DeepLinkModule.forChild(TabsPageOne)
  ],
  entryComponents: [
    TabsPageOne,
  ]
})
export class TabsPageOneModule {}
